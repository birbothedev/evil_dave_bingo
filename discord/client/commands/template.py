from ..modules.database.mongoclient import team_collection
from ..modules.models.bingo import Team, Tile, TileData, TileEffect, Player, Extermination, Inventory, Mission, Board, NewsPost, Stew, StewEffect, TileExtraItems
from .groups.template import Template
from pydantic import ValidationError
import discord
from loguru import logger


tc = team_collection()
group = Template()



@group.command()
async def add_tile_extra(
    interaction: discord.Interaction,
    tile_index: int,
    item_name: str,
    required: int,
    obtained: int = 0,
    set_id: int | None = None
):
    """
    Add an extra item requirement to a tile in the template
    
    Args:
        tile_index: Index of the tile to add extra item to
        item_name: Name of the extra item
        required: Amount required
        obtained: Starting amount (default 0)
        set_id: Optional set ID for the item
    """
    await interaction.response.defer()
    
    # Validate using Pydantic model
    try:
        extra_item = TileExtraItems(
            name=item_name,
            required=required,
            obtained=obtained,
            set_id=set_id
        )
    except ValidationError as e:
        error_msgs = "\n".join([f"• {err['msg']}" for err in e.errors()])
        await interaction.followup.send(f"❌ **Validation Error:**\n{error_msgs}")
        return
    
    # Get template
    template = await tc.find_one({"name": "template"})
    if not template:
        await interaction.followup.send("❌ Template team not found!")
        return
    
    if "board" not in template or "tiles" not in template["board"]:
        await interaction.followup.send("❌ Template has no tiles!")
        return
    
    # Find the tile
    tile_idx = None
    for i, tile in enumerate(template["board"]["tiles"]):
        if tile["index"] == tile_index:
            tile_idx = i
            break
    
    if tile_idx is None:
        await interaction.followup.send(
            f"❌ Tile with index {tile_index} not found!"
        )
        return
    
    # Convert to dict for MongoDB
    extra_item_dict = extra_item.model_dump()
    
    # Check if tileExtra already exists
    current_tile = template["board"]["tiles"][tile_idx]
    if "tileExtra" not in current_tile["data"] or \
       current_tile["data"]["tileExtra"] is None:
        # Initialize tileExtra list
        result = await tc.update_one(
            {"name": "template"},
            {
                "$set": {
                    f"board.tiles.{tile_idx}.data.tileExtra": [extra_item_dict]
                }
            }
        )
    else:
        # Append to existing list
        result = await tc.update_one(
            {"name": "template"},
            {
                "$push": {
                    f"board.tiles.{tile_idx}.data.tileExtra": extra_item_dict
                }
            }
        )
    
    if result.modified_count > 0:
        response = f"✅ **Extra Item Added**\n"
        response += f"**Tile:** {tile_index}\n"
        response += f"**Item:** {item_name}\n"
        response += f"**Required:** {required}\n"
        response += f"**Obtained:** {obtained}\n"
        if set_id is not None:
            response += f"**Set ID:** {set_id}\n"
        
        await interaction.followup.send(response)
    else:
        await interaction.followup.send("❌ Failed to add extra item!")


@group.command()
async def remove_tile_extra(
    interaction: discord.Interaction,
    tile_index: int,
    item_name: str
):
    """
    Remove an extra item from a tile in the template
    
    Args:
        tile_index: Index of the tile
        item_name: Name of the extra item to remove
    """
    await interaction.response.defer()
    
    # Get template
    template = await tc.find_one({"name": "template"})
    if not template:
        await interaction.followup.send("❌ Template team not found!")
        return
    
    if "board" not in template or "tiles" not in template["board"]:
        await interaction.followup.send("❌ Template has no tiles!")
        return
    
    # Find the tile
    tile_idx = None
    for i, tile in enumerate(template["board"]["tiles"]):
        if tile["index"] == tile_index:
            tile_idx = i
            break
    
    if tile_idx is None:
        await interaction.followup.send(
            f"❌ Tile with index {tile_index} not found!"
        )
        return
    
    # Remove the item
    result = await tc.update_one(
        {"name": "template"},
        {
            "$pull": {
                f"board.tiles.{tile_idx}.data.tileExtra": {"name": item_name}
            }
        }
    )
    
    if result.modified_count > 0:
        await interaction.followup.send(
            f"✅ Removed extra item **{item_name}** from tile **{tile_index}**"
        )
    else:
        await interaction.followup.send(
            f"❌ Item **{item_name}** not found on tile **{tile_index}**"
        )


@group.command()
async def list_tile_extras(
    interaction: discord.Interaction,
    tile_index: int
):
    """
    List all extra items for a tile in the template
    
    Args:
        tile_index: Index of the tile to view
    """
    await interaction.response.defer()
    
    # Get template
    template = await tc.find_one({"name": "template"})
    if not template:
        await interaction.followup.send("❌ Template team not found!")
        return
    
    if "board" not in template or "tiles" not in template["board"]:
        await interaction.followup.send("❌ Template has no tiles!")
        return
    
    # Find the tile
    tile = None
    for t in template["board"]["tiles"]:
        if t["index"] == tile_index:
            tile = t
            break
    
    if tile is None:
        await interaction.followup.send(
            f"❌ Tile with index {tile_index} not found!"
        )
        return
    
    # Check for extra items
    extra_items = tile["data"].get("tileExtra", [])
    
    if not extra_items:
        await interaction.followup.send(
            f"📋 Tile **{tile_index}** has no extra items"
        )
        return
    
    # Validate extra items using Pydantic
    try:
        validated_items = [TileExtraItems(**item) for item in extra_items]
    except ValidationError as e:
        await interaction.followup.send(
            f"⚠️ Warning: Some items have invalid data\n{e}"
        )
        return
    
    response = f"📋 **Extra Items for Tile {tile_index}**\n\n"
    for item in validated_items:
        response += f"**{item.name}**\n"
        response += f"  Required: {item.required}\n"
        response += f"  Obtained: {item.obtained}\n"
        if item.set_id is not None:
            response += f"  Set ID: {item.set_id}\n"
        response += "\n"
    
    await interaction.followup.send(response)

@group.command()
async def fix_indices(interaction: discord.Interaction):
    """
    Fix tile indices and coordinates by matching descriptors to template
    """
    await interaction.response.defer()
    
    logger.info(f"Tile index fix initiated by {interaction.user}")
    
    # Get template
    template = await tc.find_one({"name": "template"})
    if not template:
        await interaction.followup.send("❌ Template team not found!")
        return
    
    if "board" not in template or "tiles" not in template["board"]:
        await interaction.followup.send("❌ Template has no tiles!")
        return
    
    # Map template tiles by descriptor
    template_by_descriptor = {
        tile["data"]["descriptor"]: tile 
        for tile in template["board"]["tiles"]
    }
    
    logger.info(f"Template has {len(template_by_descriptor)} unique descriptors")
    
    # Get all teams except template
    teams = await tc.find({"name": {"$ne": "template"}}).to_list(None)
    
    if not teams:
        await interaction.followup.send("❌ No teams found!")
        return
    
    logger.info(f"Found {len(teams)} teams to process")
    
    teams_fixed = 0
    tiles_fixed = 0
    tiles_removed = 0
    
    for team in teams:
        if "board" not in team or "tiles" not in team["board"]:
            continue
        
        logger.debug(f"Processing team: {team['name']}")
        
        tiles = team["board"]["tiles"]
        fixed_tiles = []
        seen_descriptors = set()
        team_tiles_fixed = 0
        team_dupes_removed = 0
        
        for tile in tiles:
            descriptor = tile["data"]["descriptor"]
            
            # Check if we've already processed this descriptor
            if descriptor in seen_descriptors:
                team_dupes_removed += 1
                logger.debug(
                    f"  [{team['name']}] Removing duplicate: {descriptor[:50]}..."
                )
                continue
            
            # Find this tile in template by descriptor
            if descriptor in template_by_descriptor:
                template_tile = template_by_descriptor[descriptor]
                
                # Check if index/coords need fixing
                needs_fix = (
                    tile["index"] != template_tile["index"] or
                    tile["data"]["coordX"] != template_tile["data"]["coordX"] or
                    tile["data"]["coordY"] != template_tile["data"]["coordY"]
                )
                
                if needs_fix:
                    old_index = tile["index"]
                    old_coords = (tile["data"]["coordX"], tile["data"]["coordY"])
                    new_index = template_tile["index"]
                    new_coords = (
                        template_tile["data"]["coordX"],
                        template_tile["data"]["coordY"]
                    )
                    
                    logger.info(
                        f"  [{team['name']}] Fixing tile: "
                        f"index {old_index}->{new_index}, "
                        f"coords {old_coords}->{new_coords} | "
                        f"{descriptor[:50]}..."
                    )
                    
                    # Create fixed tile preserving progress
                    fixed_tile = {
                        "index": new_index,
                        "completedBy": tile.get("completedBy"),
                        "data": {
                            "coordX": new_coords[0],
                            "coordY": new_coords[1],
                            "descriptor": descriptor,
                            "obtained": tile["data"].get("obtained", 0),
                            "required": template_tile["data"]["required"],
                            "effect": template_tile["data"].get("effect"),
                        }
                    }
                    
                    # Copy tileExtra if it exists in template
                    if "tileExtra" in template_tile["data"]:
                        fixed_tile["data"]["tileExtra"] = \
                            template_tile["data"]["tileExtra"]
                    
                    fixed_tiles.append(fixed_tile)
                    team_tiles_fixed += 1
                else:
                    # Tile is already correct
                    fixed_tiles.append(tile)
                
                seen_descriptors.add(descriptor)
            else:
                logger.warning(
                    f"  [{team['name']}] Tile not in template: "
                    f"{descriptor[:50]}..."
                )
                # Keep tile as-is if not in template
                if descriptor not in seen_descriptors:
                    fixed_tiles.append(tile)
                    seen_descriptors.add(descriptor)
        
        # Check for missing tiles from template
        missing_count = 0
        for template_descriptor, template_tile in template_by_descriptor.items():
            if template_descriptor not in seen_descriptors:
                # Add missing tile with no progress
                new_tile = {
                    "index": template_tile["index"],
                    "completedBy": None,
                    "data": template_tile["data"].copy()
                }
                new_tile["data"]["obtained"] = 0
                
                # Reset tileExtra obtained
                if "tileExtra" in new_tile["data"] and \
                   new_tile["data"]["tileExtra"]:
                    for extra_item in new_tile["data"]["tileExtra"]:
                        extra_item["obtained"] = 0
                
                fixed_tiles.append(new_tile)
                missing_count += 1
                logger.info(
                    f"  [{team['name']}] Adding missing tile: "
                    f"{template_descriptor[:50]}..."
                )
        
        # Sort tiles by index
        fixed_tiles.sort(key=lambda t: t["index"])
        
        # Update team
        if team_tiles_fixed > 0 or team_dupes_removed > 0 or missing_count > 0:
            result = await tc.update_one(
                {"name": team["name"]},
                {"$set": {"board.tiles": fixed_tiles}}
            )
            
            if result.modified_count > 0:
                teams_fixed += 1
                tiles_fixed += team_tiles_fixed
                tiles_removed += team_dupes_removed
                
                logger.success(
                    f"Fixed {team['name']}: "
                    f"{team_tiles_fixed} tiles corrected, "
                    f"{team_dupes_removed} duplicates removed, "
                    f"{missing_count} tiles added "
                    f"({len(tiles)} -> {len(fixed_tiles)} total)"
                )
    
    logger.success(
        f"Index fix complete - Teams: {teams_fixed}, "
        f"Tiles fixed: {tiles_fixed}, Duplicates removed: {tiles_removed}"
    )
    
    response = f"✅ **Tile Indices Fixed**\n"
    response += f"**Teams fixed:** {teams_fixed}\n"
    response += f"**Tiles corrected:** {tiles_fixed}\n"
    response += f"**Duplicates removed:** {tiles_removed}\n"
    
    if teams_fixed == 0:
        response += "\n✨ All tiles already have correct indices!"
    
    await interaction.followup.send(response)


@group.command()
async def create_template(interaction: discord.Interaction):
    await interaction.response.defer()
    existing = await tc.find_one({"name": "template"})
    if existing:
        await interaction.followup.send("❌ Template already exists!")
        return
    
    template = Team(
        name="template",
        phrase="template-board",
        score=0,
        players=[],
        board=Board(missions=[], tiles=[]),
        inventory=Inventory(extermination=[])
    )
    try:
        await tc.insert_one(template.model_dump(by_alias=True, exclude={"id"}))
        await interaction.followup.send("✅ Template team created!")
    except Exception as e:
        print(e)

@group.command()
async def swap_columns(
    interaction: discord.Interaction,
    column_a: int,
    column_b: int,
    include_template: bool = False
):
    """
    Swap two columns on all team boards
    
    Args:
        column_a: First column to swap (0-6)
        column_b: Second column to swap (0-6)
        include_template: Whether to include the template team (default False)
    """
    await interaction.response.defer()
    
    logger.info(
        f"Column swap initiated by {interaction.user} - "
        f"Swapping columns {column_a} ↔️ {column_b}, "
        f"include_template={include_template}"
    )
    
    # Validate column numbers
    if not (0 <= column_a <= 6 and 0 <= column_b <= 6):
        logger.warning(
            f"Invalid column numbers: {column_a}, {column_b} "
            f"(must be 0-6)"
        )
        await interaction.followup.send(
            "❌ Column numbers must be between 0 and 6!"
        )
        return
    
    if column_a == column_b:
        logger.warning(f"Attempted to swap column {column_a} with itself")
        await interaction.followup.send("❌ Cannot swap a column with itself!")
        return
    
    # Get all teams
    query = {} if include_template else {"name": {"$ne": "template"}}
    teams = await tc.find(query).to_list(None)
    
    if not teams:
        logger.warning("No teams found for column swap")
        await interaction.followup.send("❌ No teams found!")
        return
    
    logger.info(f"Found {len(teams)} teams to process")
    
    teams_updated = 0
    tiles_swapped = 0
    
    for team in teams:
        if "board" not in team or "tiles" not in team["board"]:
            logger.debug(f"Skipping team {team['name']} - no board/tiles")
            continue
        
        logger.debug(f"Processing team: {team['name']}")
        
        tiles = team["board"]["tiles"]
        updates = []
        
        for i, tile in enumerate(tiles):
            coord_x = tile["data"]["coordX"]
            coord_y = tile["data"]["coordY"]
            old_index = tile["index"]
            
            # Check if this tile is in one of the columns to swap
            if coord_y == column_a or coord_y == column_b:
                # Determine new coordY
                new_coord_y = column_b if coord_y == column_a else column_a
                
                # Calculate new index
                new_index = (coord_x * 7) + new_coord_y
                
                logger.debug(
                    f"  [{team['name']}] Tile swap: "
                    f"({coord_x}, {coord_y}) -> ({coord_x}, {new_coord_y}) | "
                    f"Index {old_index} -> {new_index}"
                )
                
                # Store the update
                updates.append({
                    "array_index": i,
                    "old_coords": (coord_x, coord_y),
                    "new_coords": (coord_x, new_coord_y),
                    "old_index": old_index,
                    "new_index": new_index
                })
                
                tiles_swapped += 1
        
        # Apply all updates for this team
        if updates:
            update_operations = {}
            for update in updates:
                i = update["array_index"]
                update_operations[
                    f"board.tiles.{i}.data.coordY"
                ] = update["new_coords"][1]
                update_operations[f"board.tiles.{i}.index"] = update["new_index"]
            
            logger.info(
                f"Updating team {team['name']}: {len(updates)} tiles affected"
            )
            
            result = await tc.update_one(
                {"name": team["name"]},
                {"$set": update_operations}
            )
            
            if result.modified_count > 0:
                teams_updated += 1
                logger.success(
                    f"Successfully updated {team['name']} - "
                    f"{len(updates)} tiles swapped"
                )
            else:
                logger.error(
                    f"Failed to update {team['name']} despite having updates"
                )
        else:
            logger.debug(f"No tiles to update for team {team['name']}")
    
    logger.success(
        f"Column swap complete - Teams: {teams_updated}, "
        f"Tiles: {tiles_swapped}"
    )
    
    await interaction.followup.send(
        f"✅ Swapped columns **{column_a}** ↔️ **{column_b}**\n"
        f"**Teams updated:** {teams_updated}\n"
        f"**Tiles swapped:** {tiles_swapped}\n"
        f"**Template included:** {'Yes' if include_template else 'No'}"
    )


@group.command()
async def create_team(
    interaction: discord.Interaction, 
    name: str, 
    phrase: str
):
    """Create a new team based on the template"""
    await interaction.response.defer()
    
    existing = await tc.find_one({"name": name})
    if existing:
        await interaction.followup.send(f"❌ Team '{name}' already exists!")
        return
    
    template = await tc.find_one({"name": "template"})
    if not template:
        await interaction.followup.send("❌ Template team not found! Create it first with `/admin create_template`")
        return
    
    template_board = template.get("board")
    if not template_board or not template_board.get("tiles"):
        await interaction.followup.send("❌ Template has no tiles! Add tiles to the template first.")
        return
    
    new_tiles = []
    for tile in template_board["tiles"]:
        new_tile = Tile(
            index=tile["index"],
            completedBy=None,
            data=TileData(
                coordX=tile["data"]["coordX"],
                coordY=tile["data"]["coordY"],
                descriptor=tile["data"]["descriptor"],
                obtained=0,
                required=tile["data"]["required"],
                effect=None
            )
        )
        new_tiles.append(new_tile)
    

    new_team = Team(
        name=name, 
        phrase=phrase,
        score=0,
        board=Board(
            missions=[],
            tiles=new_tiles,
            bingoCount=0,
            activeBonus={"row": [], "column": [], "diagonal": []},
            missionBonus=0
        ),
        inventory=Inventory(
            protection=0,
            reclaim=0,
            extermination=[],
            stews=[]
        ),
        players=[],
        pickpockets=[]
    )
    
    await tc.insert_one(new_team.model_dump(by_alias=True, exclude={"id"}))
    
    await interaction.followup.send(
        f"✅ Team **{name}** created successfully!\n"
        f"📋 Copied **{len(new_tiles)}** tiles from template"
    )


@group.command()
async def add_tile(
    interaction: discord.Interaction, 
    x: int, 
    y: int, 
    descriptor: str, 
    required: int
):
    await interaction.response.defer()
    
    index = (x * 7) + y
    
    tile_data = TileData(coordX=x, coordY=y, descriptor=descriptor, required=required)
    new_tile = Tile(index=index, data=tile_data)

    template = await tc.find_one({"name": "template"})
    
    if not template:
        await interaction.followup.send("❌ Template team not found!")
        return
    
    if "board" not in template or not template["board"]:
        await interaction.followup.send("❌ Template board not initialized!")
        return
    
    result = await tc.update_one(
        {"name": "template"},
        {"$push": {"board.tiles": new_tile.model_dump(by_alias=True)}}
    )
    
    if result.modified_count > 0:
        await interaction.followup.send(
            f"✅ Added tile at ({x}, {y}) - Index {index}\n"
            f"**Descriptor:** {descriptor}\n"
            f"**Required:** {required}"
        )
    else:
        await interaction.followup.send("❌ Failed to add tile!")
    
@group.command()
async def sync_from_template(
    interaction: discord.Interaction,
    preserve_progress: bool = True
):
    """
    Sync all teams with template: add missing tiles and update all fields
    
    Args:
        preserve_progress: Keep obtained/completedBy (default True)
    """
    await interaction.response.defer()
    
    logger.info(
        f"Template sync initiated by {interaction.user} - "
        f"preserve_progress={preserve_progress}"
    )
    
    # Get template
    template = await tc.find_one({"name": "template"})
    if not template:
        logger.warning("Template team not found")
        await interaction.followup.send("❌ Template team not found!")
        return
    
    if "board" not in template or "tiles" not in template["board"]:
        logger.warning("Template has no board/tiles")
        await interaction.followup.send("❌ Template has no tiles!")
        return
    
    template_tiles = {
        tile["index"]: tile for tile in template["board"]["tiles"]
    }
    
    logger.info(f"Template has {len(template_tiles)} tiles")
    
    # Get all teams except template
    teams = await tc.find({"name": {"$ne": "template"}}).to_list(None)
    
    if not teams:
        logger.warning("No teams found to sync")
        await interaction.followup.send("❌ No teams found to sync!")
        return
    
    logger.info(f"Found {len(teams)} teams to sync")
    
    teams_updated = 0
    tiles_added = 0
    tiles_synced = 0
    coords_updated = 0
    sync_details = []
    
    # Fields to preserve if preserve_progress is True
    preserve_fields = {"obtained", "completedBy"} if preserve_progress else set()
    
    for team in teams:
        if "board" not in team or "tiles" not in team["board"]:
            logger.debug(f"Skipping team {team['name']} - no board/tiles")
            continue
        
        logger.debug(f"Processing team: {team['name']}")
        
        updates = {}
        new_tiles = []
        team_changes = []
        
        # Map existing tiles by index for quick lookup
        existing_tiles = {
            tile["index"]: (i, tile) 
            for i, tile in enumerate(team["board"]["tiles"])
        }
        
        # Process all template tiles
        for template_index, template_tile in template_tiles.items():
            if template_index in existing_tiles:
                # Tile exists - sync fields
                tile_idx, current_tile = existing_tiles[template_index]
                
                # Track coordinate changes
                coord_changed = False
                old_coords = (
                    current_tile["data"]["coordX"],
                    current_tile["data"]["coordY"]
                )
                new_coords = (
                    template_tile["data"]["coordX"],
                    template_tile["data"]["coordY"]
                )
                
                # Sync all data fields from template
                for field, template_value in template_tile["data"].items():
                    if field in preserve_fields:
                        continue  # Skip progress fields
                    
                    current_value = current_tile["data"].get(field)
                    if current_value != template_value:
                        updates[
                            f"board.tiles.{tile_idx}.data.{field}"
                        ] = template_value
                        
                        # Track coordinate changes
                        if field in ("coordX", "coordY"):
                            coord_changed = True
                        
                        # Track change for reporting
                        if len(team_changes) < 5:
                            value_preview = (
                                f"{current_value}" 
                                if len(str(current_value)) <= 30 
                                else f"{str(current_value)[:27]}..."
                            )
                            team_changes.append(
                                f"Tile {template_index}.{field}: "
                                f"{value_preview} → ..."
                            )
                        
                        tiles_synced += 1
                
                # If coordinates changed, recalculate and update index
                if coord_changed:
                    new_index = (new_coords[0] * 7) + new_coords[1]
                    if new_index != template_index:
                        updates[f"board.tiles.{tile_idx}.index"] = new_index
                        coords_updated += 1
                        
                        logger.info(
                            f"  [{team['name']}] Tile coordinates changed: "
                            f"{old_coords} -> {new_coords} | "
                            f"Index {template_index} -> {new_index}"
                        )
                        
                        team_changes.append(
                            f"Tile moved: {old_coords} → {new_coords} "
                            f"(index {template_index} → {new_index})"
                        )
            else:
                # Tile doesn't exist - add it
                new_tile = {
                    "index": template_tile["index"],
                    "completedBy": None,
                    "data": template_tile["data"].copy()
                }
                
                # Reset progress fields
                if "obtained" in new_tile["data"]:
                    new_tile["data"]["obtained"] = 0
                
                # Reset tileExtra obtained if it exists
                if "tileExtra" in new_tile["data"] and \
                   new_tile["data"]["tileExtra"]:
                    for extra_item in new_tile["data"]["tileExtra"]:
                        extra_item["obtained"] = 0
                
                new_tiles.append(new_tile)
                tiles_added += 1
                
                logger.debug(
                    f"  [{team['name']}] Adding new tile: "
                    f"index={new_tile['index']}, "
                    f"coords=({new_tile['data']['coordX']}, "
                    f"{new_tile['data']['coordY']})"
                )
        
        # Apply updates
        has_changes = bool(updates or new_tiles)
        
        if updates:
            result = await tc.update_one(
                {"name": team["name"]},
                {"$set": updates}
            )
            
            if result.modified_count > 0:
                logger.success(
                    f"Applied {len(updates)} field updates to {team['name']}"
                )
        
        if new_tiles:
            result = await tc.update_one(
                {"name": team["name"]},
                {"$push": {"board.tiles": {"$each": new_tiles}}}
            )
            
            if result.modified_count > 0:
                logger.success(
                    f"Added {len(new_tiles)} new tiles to {team['name']}"
                )
        
        if has_changes:
            teams_updated += 1
            if team_changes:
                sync_details.append({
                    "team": team["name"],
                    "changes": team_changes,
                    "added": len(new_tiles)
                })
    
    logger.success(
        f"Template sync complete - Teams: {teams_updated}/{len(teams)}, "
        f"Tiles added: {tiles_added}, Tiles synced: {tiles_synced}, "
        f"Coordinates updated: {coords_updated}"
    )
    
    # Build response
    response = f"✅ **Template Sync Complete**\n"
    response += f"**Teams updated:** {teams_updated}/{len(teams)}\n"
    response += f"**Tiles added:** {tiles_added}\n"
    response += f"**Tiles synced:** {tiles_synced}\n"
    response += f"**Coordinates updated:** {coords_updated}\n"
    response += f"**Progress preserved:** {'Yes' if preserve_progress else 'No'}\n"
    
    if sync_details:
        response += f"\n**Sample changes:**\n"
        for detail in sync_details[:5]:
            response += f"\n**{detail['team']}:**\n"
            if detail['added'] > 0:
                response += f"• Added {detail['added']} new tile(s)\n"
            for change in detail['changes'][:3]:
                response += f"• {change}\n"
        
        if len(sync_details) > 5:
            response += f"\n*...and {len(sync_details) - 5} more teams*"
    else:
        response += "\n✨ All teams already in sync with template!"
    
    await interaction.followup.send(response)   
    
    
    
def setup(client: discord.Client):
    client.tree.add_command(group, guild=client.guild_current)
