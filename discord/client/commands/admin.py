from ..modules.database.mongoclient import team_collection, news_collection
from ..modules.models.bingo import Team, Tile, TileData, TileEffect, Player, Extermination, Inventory, Mission, Board, NewsPost, PyObjectId
from .groups.admin import Admin

import discord
from discord import app_commands
from datetime import datetime, UTC, timedelta



group = Admin()
tc = team_collection()
nc = news_collection()

@group.command()
async def create_team(
    interaction: discord.Interaction, 
    name: str, 
    phrase: str
):
    """Create a new team"""
    await interaction.response.defer()
    
    existing = await tc.find_one({"name": name})
    if existing:
        await interaction.followup.send(f"❌ Team '{name}' already exists!")
        return
    
    new_team = Team(
        name=name, 
        phrase=phrase,
        board=Board(missions=[], tiles=[]),
        inventory=Inventory(extermination=[]),
        players=[]
    )
    
    await tc.insert_one(new_team.model_dump(by_alias=True, exclude={"id"}))
    
    await interaction.followup.send(f"✅ Team **{name}** created successfully!")


@group.command()
async def add_player(
    interaction: discord.Interaction, 
    team_name: str,
    user: discord.Member, 
    rsn: str, 
    captain: bool = False
):
    """Add a player to a team"""
    await interaction.response.defer()
    
    team_doc = await tc.find_one({"name": team_name})
    if not team_doc:
        await interaction.followup.send(f"❌ Team '{team_name}' not found!")
        return
    
    if team_doc.get("players"):
        for player in team_doc["players"]:
            if player["discordId"] == user.id:
                await interaction.followup.send(
                    f"❌ {user.mention} is already on **{team_name}**!"
                )
                return
    
    new_player = Player(discordId=user.id, rsn=rsn, captain=captain)
    
    result = await tc.update_one(
        {"name": team_name},
        {"$push": {"players": new_player.model_dump()}}
    )
    
    if result.modified_count > 0:
        captain_text = " as **captain**" if captain else ""
        await interaction.followup.send(
            f"✅ Added {user.mention} ({rsn}) to **{team_name}**{captain_text}!"
        )
    else:
        await interaction.followup.send("❌ Failed to add player!")


@group.command()
async def remove_player(
    interaction: discord.Interaction,
    team_name: str,
    user: discord.Member
):
    """Remove a player from a team"""
    await interaction.response.defer()
    
    result = await tc.update_one(
        {"name": team_name},
        {"$pull": {"players": {"discordId": user.id}}}
    )
    
    if result.modified_count > 0:
        await interaction.followup.send(
            f"✅ Removed {user.mention} from **{team_name}**!"
        )
    else:
        await interaction.followup.send(
            f"❌ {user.mention} is not on **{team_name}** or team doesn't exist!"
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
async def add_effect(
    interaction: discord.Interaction,
    team_name: str,
    index: int,
    effect_type: str,
    applied_by: str | None = None
):
    """
    Apply an effect to a tile on a team's board
    
    Args:
        team_name: Name of the team
        index: Tile index (0-48 for 7x7 board)
        effect_type: protected, exterminated, reclaimed, slayer_negative, slayer_positive
        applied_by: Name of who/what applied the effect
    """
    await interaction.response.defer()

    effect_map = {
        "protected": "protected",
        "exterminated": "exterminated",
        "reclaimed": "reclaimed",
        "slayer_negative": "slayerNegative",
        "slayer_positive": "slayerPositive",
        "previous_protection": "previousProtection"
    }
    
    if effect_type not in effect_map:
        await interaction.followup.send(
            f"❌ Invalid effect type! Valid types: {', '.join(effect_map.keys())}"
        )
        return
    

    team = await tc.find_one({"name": team_name})
    
    if not team:
        await interaction.followup.send(f"❌ Team '{team_name}' not found!")
        return
    
    if "board" not in team or "tiles" not in team["board"]:
        await interaction.followup.send(f"❌ Team '{team_name}' has no board!")
        return
    
    tile_found = False
    for i, tile in enumerate(team["board"]["tiles"]):
        if tile["index"] == index:
            tile_found = True
            
            effect = TileEffect(
                **{effect_map[effect_type]: True},
                appliedBy=applied_by
            )
            
            result = await tc.update_one(
                {"name": team_name},
                {"$set": {f"board.tiles.{i}.data.effect": effect.model_dump()}}
            )
            
            if result.modified_count > 0:
                await interaction.followup.send(
                    f"✅ Applied **{effect_type}** effect to tile {index} on **{team_name}**\n"
                    f"Applied by: {applied_by or 'None'}"
                )
            else:
                await interaction.followup.send("❌ Failed to apply effect!")
            break
    
    if not tile_found:
        await interaction.followup.send(
            f"❌ Tile with index {index} not found on **{team_name}**!"
        )


@group.command()
async def remove_effect(
    interaction: discord.Interaction, 
    team_name: str,
    index: int
):
    """Remove all effects from a tile"""
    await interaction.response.defer()
    
    team = await tc.find_one({"name": team_name})
    
    if not team:
        await interaction.followup.send(f"❌ Team '{team_name}' not found!")
        return
    
    if "board" not in team or "tiles" not in team["board"]:
        await interaction.followup.send(f"❌ Team '{team_name}' has no board!")
        return
    
    for i, tile in enumerate(team["board"]["tiles"]):
        if tile["index"] == index:
            result = await tc.update_one(
                {"name": team_name},
                {"$set": {f"board.tiles.{i}.data.effect": None}}
            )
            
            if result.modified_count > 0:
                await interaction.followup.send(
                    f"✅ Removed effects from tile {index} on **{team_name}**"
                )
            else:
                await interaction.followup.send("❌ Failed to remove effect!")
            return
    
    await interaction.followup.send(
        f"❌ Tile with index {index} not found on **{team_name}**!"
    )

@group.command()
async def grant_extermination(
    interaction: discord.Interaction,
    team_name: str,
    hours: int = 24
):
    """
    Grant an extermination to a team
    
    Args:
        team_name: Name of the team
        hours: Hours until expiration (default 24)
    """
    await interaction.response.defer()
    
    team = await tc.find_one({"name": team_name})
    if not team:
        await interaction.followup.send(f"❌ Team '{team_name}' not found!")
        return
    
    extermination = Extermination(
        useBefore=datetime.timestamp(datetime.now(UTC) + timedelta(hours=hours))
    )
    
    result = await tc.update_one(
        {"name": team_name},
        {"$push": {"inventory.extermination": extermination.model_dump()}}
    )
    
    if result.modified_count > 0:
        expires_at = datetime.fromtimestamp(extermination.useBefore, UTC)
        await interaction.followup.send(
            f"✅ Granted extermination to **{team_name}**!\n"
            f"Expires: <t:{int(extermination.useBefore)}:R> "
            f"(<t:{int(extermination.useBefore)}:F>)"
        )
    else:
        await interaction.followup.send("❌ Failed to grant extermination!")

@group.command()
async def remove_extermination(
    interaction: discord.Interaction,
    team_name: str,
    index: int
):
    """
    Remove an extermination from a team
    
    Args:
        team_name: Name of the team
        index: Index of the extermination to remove
    """
    await interaction.response.defer()
    
    team = await tc.find_one({"name": team_name})
    if not team:
        await interaction.followup.send(f"❌ Team '{team_name}' not found!")
        return
    
    if "inventory" not in team or "extermination" not in team["inventory"]:
        await interaction.followup.send(
            f"❌ **{team_name}** has no exterminations!"
        )
        return
    
    exterminations = team["inventory"]["extermination"]
    if index >= len(exterminations):
        await interaction.followup.send(
            f"❌ Invalid index! **{team_name}** has {len(exterminations)} extermination(s)."
        )
        return
    
    exterminations.pop(index)
    
    result = await tc.update_one(
        {"name": team_name},
        {"$set": {"inventory.extermination": exterminations}}
    )
    
    if result.modified_count > 0:
        await interaction.followup.send(
            f"✅ Removed extermination #{index} from **{team_name}**!"
        )
    else:
        await interaction.followup.send("❌ Failed to remove extermination!")

@group.command()

async def grant_protection(
    interaction: discord.Interaction,
    team_name: str,
    amount: int = 1
):
    """
    Grant protection(s) to a team
    
    Args:
        team_name: Name of the team
        amount: Number of protections to grant (default 1)
    """
    await interaction.response.defer()
    
    team = await tc.find_one({"name": team_name})
    if not team:
        await interaction.followup.send(f"❌ Team '{team_name}' not found!")
        return
    
    result = await tc.update_one(
        {"name": team_name},
        {"$inc": {"inventory.protection": amount}}
    )
    
    if result.modified_count > 0:
        new_total = team.get("inventory", {}).get("protection", 0) + amount
        await interaction.followup.send(
            f"✅ Granted **{amount}** protection(s) to **{team_name}**!\n"
            f"New total: **{new_total}** protection(s)"
        )
    else:
        await interaction.followup.send("❌ Failed to grant protection!")


@group.command()

async def grant_reclaim(
    interaction: discord.Interaction,
    team_name: str,
    amount: int = 1
):
    """
    Grant reclaim(s) to a team
    
    Args:
        team_name: Name of the team
        amount: Number of reclaims to grant (default 1)
    """
    await interaction.response.defer()
    
    team = await tc.find_one({"name": team_name})
    if not team:
        await interaction.followup.send(f"❌ Team '{team_name}' not found!")
        return
    
    result = await tc.update_one(
        {"name": team_name},
        {"$inc": {"inventory.reclaim": amount}}
    )
    
    if result.modified_count > 0:
        new_total = team.get("inventory", {}).get("reclaim", 0) + amount
        await interaction.followup.send(
            f"✅ Granted **{amount}** reclaim(s) to **{team_name}**!\n"
            f"New total: **{new_total}** reclaim(s)"
        )
    else:
        await interaction.followup.send("❌ Failed to grant reclaim!")


@group.command()

async def use_protection(
    interaction: discord.Interaction,
    team_name: str,
    tile_index: int,
    applied_by: str | None = None
):
    """
    Use a protection on a tile
    
    Args:
        team_name: Name of the team
        tile_index: Index of the tile to protect (0-48)
        applied_by: Who applied the protection
    """
    await interaction.response.defer()
    
    team = await tc.find_one({"name": team_name})
    if not team:
        await interaction.followup.send(f"❌ Team '{team_name}' not found!")
        return
    
    protections = team.get("inventory", {}).get("protection", 0)
    if protections <= 0:
        await interaction.followup.send(
            f"❌ **{team_name}** has no protections available!"
        )
        return
    
    if "board" not in team or "tiles" not in team["board"]:
        await interaction.followup.send(f"❌ **{team_name}** has no board!")
        return
    
    tile_found = False
    for i, tile in enumerate(team["board"]["tiles"]):
        if tile["index"] == tile_index:
            tile_found = True
            
            current_effect = tile.get("data", {}).get("effect")
            if current_effect and current_effect.get("protected"):
                await interaction.followup.send(
                    f"⚠️ Tile {tile_index} is already protected!"
                )
                return
        
            effect = TileEffect(
                protected=True,
                previousProtection=current_effect.get("protected", False) if current_effect else False,
                appliedBy=applied_by or team_name
            )
            
            result = await tc.update_one(
                {"name": team_name},
                {
                    "$set": {f"board.tiles.{i}.data.effect": effect.model_dump()},
                    "$inc": {"inventory.protection": -1}
                }
            )
            
            if result.modified_count > 0:
                await interaction.followup.send(
                    f"✅ Protected tile **{tile_index}** for **{team_name}**!\n"
                    f"Applied by: {applied_by or team_name}\n"
                    f"Remaining protections: **{protections - 1}**"
                )
            else:
                await interaction.followup.send("❌ Failed to apply protection!")
            break
    
    if not tile_found:
        await interaction.followup.send(
            f"❌ Tile {tile_index} not found on **{team_name}**!"
        )


@group.command()

async def use_reclaim(
    interaction: discord.Interaction,
    team_name: str,
    tile_index: int,
    applied_by: str | None = None
):
    """
    Use a reclaim on a tile
    
    Args:
        team_name: Name of the team
        tile_index: Index of the tile to reclaim (0-48)
        applied_by: Who applied the reclaim
    """
    await interaction.response.defer()
    
    team = await tc.find_one({"name": team_name})
    if not team:
        await interaction.followup.send(f"❌ Team '{team_name}' not found!")
        return
    
    reclaims = team.get("inventory", {}).get("reclaim", 0)
    if reclaims <= 0:
        await interaction.followup.send(
            f"❌ **{team_name}** has no reclaims available!"
        )
        return
    
    if "board" not in team or "tiles" not in team["board"]:
        await interaction.followup.send(f"❌ **{team_name}** has no board!")
        return
    
    tile_found = False
    for i, tile in enumerate(team["board"]["tiles"]):
        if tile["index"] == tile_index:
            tile_found = True
            
            current_effect = tile.get("data", {}).get("effect")
            if current_effect and current_effect.get("reclaimed"):
                await interaction.followup.send(
                    f"⚠️ Tile {tile_index} is already reclaimed!"
                )
                return
            
            effect = TileEffect(
                reclaimed=True,
                previousProtection=current_effect.get("protected", False) if current_effect else False,
                appliedBy=applied_by or team_name
            )
            
            result = await tc.update_one(
                {"name": team_name},
                {
                    "$set": {f"board.tiles.{i}.data.effect": effect.model_dump()},
                    "$inc": {"inventory.reclaim": -1}
                }
            )
            
            if result.modified_count > 0:
                await interaction.followup.send(
                    f"✅ Reclaimed tile **{tile_index}** for **{team_name}**!\n"
                    f"Applied by: {applied_by or team_name}\n"
                    f"Remaining reclaims: **{reclaims - 1}**"
                )
            else:
                await interaction.followup.send("❌ Failed to apply reclaim!")
            break
    
    if not tile_found:
        await interaction.followup.send(
            f"❌ Tile {tile_index} not found on **{team_name}**!"
        )


@group.command()
async def view_inventory(
    interaction: discord.Interaction,
    team_name: str
):
    """View a team's inventory"""
    await interaction.response.defer()
    
    team = await tc.find_one({"name": team_name})
    if not team:
        await interaction.followup.send(f"❌ Team '{team_name}' not found!")
        return
    
    inventory = team.get("inventory", {})
    protections = inventory.get("protection", 0)
    reclaims = inventory.get("reclaim", 0)
    exterminations = inventory.get("extermination", [])
    
    active_exts = sum(1 for ext in exterminations if ext.get("active", False) and not ext.get("used", False))
    
    await interaction.followup.send(
        f"**{team_name}** - Inventory:\n"
        f"🛡️ Protections: **{protections}**\n"
        f"♻️ Reclaims: **{reclaims}**\n"
        f"💀 Exterminations: **{active_exts}** active / **{len(exterminations)}** total"
    )

@group.command()
async def grant_mission_all(
    interaction: discord.Interaction,
    mission_id: int,
    mission_title: str,
    descriptor: str,
    hours_to_complete: int,
    point_reward: int | None = None,
    reward: str | None = None
):
    """
    Grant a mission to ALL teams (excluding template)
    
    Args:
        mission_id: Unique ID for the mission
        mission_title: Title of the mission
        descriptor: Description of what needs to be done
        hours_to_complete: Hours until mission expires
        point_reward: Points awarded for completion
        reward: Text description of any additional rewards
    """
    await interaction.response.defer()
    
    complete_before = datetime.timestamp(
        datetime.now(UTC) + timedelta(hours=hours_to_complete)
    )
    
    mission = Mission(
        missionId=mission_id,
        missionTitle=mission_title,
        descriptor=descriptor,
        reward=reward,
        pointReward=point_reward,
        completeBefore=complete_before
    )
    
    result = await tc.update_many(
        {"name": {"$ne": "template"}},
        {"$push": {"board.missions": mission.model_dump()}}
    )
    
    if result.modified_count > 0:
        await interaction.followup.send(
            f"✅ Granted mission **{mission_title}** to **{result.modified_count}** team(s)!\n"
            f"Mission ID: {mission_id}\n"
            f"Points: {point_reward or 'None'}\n"
            f"Expires: <t:{int(complete_before)}:R> (<t:{int(complete_before)}:F>)"
        )
    else:
        await interaction.followup.send("❌ No teams found (or all teams are template)!")

@group.command()
async def complete_mission(
    interaction: discord.Interaction,
    team_name: str,
    mission_id: int,
    completed_by: discord.Member | None = None
):
    """
    Mark a mission as completed
    
    Args:
        team_name: Name of the team
        mission_id: ID of the mission to complete
        completed_by: Player who completed it (optional)
    """
    await interaction.response.defer()
    
    team = await tc.find_one({"name": team_name})
    if not team:
        await interaction.followup.send(f"❌ Team '{team_name}' not found!")
        return
    
    if "board" not in team or "missions" not in team["board"]:
        await interaction.followup.send(f"❌ **{team_name}** has no missions!")
        return
    
    mission_found = False
    for i, mission in enumerate(team["board"]["missions"]):
        if mission["missionId"] == mission_id:
            mission_found = True
            
            if mission.get("completed"):
                await interaction.followup.send(
                    f"⚠️ Mission **{mission['missionTitle']}** is already completed!"
                )
                return
            
            completed_by_list = None
            if completed_by:
                player_data = None
                for player in team.get("players", []):
                    if player["discordId"] == completed_by.id:
                        player_data = player
                        break
                
                if player_data:
                    completed_by_list = [player_data]
            
            point_reward = mission.get("pointReward", 0) or 0
            
            update_query = {
                "$set": {
                    f"board.missions.{i}.completed": True,
                    f"board.missions.{i}.completedBy": completed_by_list
                }
            }
            
            if point_reward > 0:
                update_query["$inc"] = {
                    "score": point_reward,
                    "board.missionBonus": point_reward
                }
            
            result = await tc.update_one({"name": team_name}, update_query)
            
            if result.modified_count > 0:
                completion_text = f" by {completed_by.mention}" if completed_by else ""
                points_text = f"\n+**{point_reward}** points!" if point_reward > 0 else ""
                
                await interaction.followup.send(
                    f"✅ Completed mission **{mission['missionTitle']}** "
                    f"for **{team_name}**{completion_text}!{points_text}"
                )
            else:
                await interaction.followup.send("❌ Failed to complete mission!")
            break
    
    if not mission_found:
        await interaction.followup.send(
            f"❌ Mission with ID {mission_id} not found on **{team_name}**!"
        )

@group.command()
async def add_mission_credit(
    interaction: discord.Interaction,
    team_name: str,
    mission_id: int,
    player: discord.Member
):
    """
    Add a player to mission completion credits
    
    Args:
        team_name: Name of the team
        mission_id: ID of the mission
        player: Player to add credit to
    """
    await interaction.response.defer()
    
    team = await tc.find_one({"name": team_name})
    if not team:
        await interaction.followup.send(f"❌ Team '{team_name}' not found!")
        return
    
    if "board" not in team or "missions" not in team["board"]:
        await interaction.followup.send(f"❌ **{team_name}** has no missions!")
        return
    
    player_data = None
    for p in team.get("players", []):
        if p["discordId"] == player.id:
            player_data = p
            break
    
    if not player_data:
        await interaction.followup.send(
            f"❌ {player.mention} is not on **{team_name}**!"
        )
        return
    
    mission_found = False
    for i, mission in enumerate(team["board"]["missions"]):
        if mission["missionId"] == mission_id:
            mission_found = True
            
            if not mission.get("completed"):
                await interaction.followup.send(
                    f"⚠️ Mission **{mission['missionTitle']}** hasn't been completed yet!"
                )
                return
            
            completed_by = mission.get("completedBy", [])
            for credited_player in completed_by:
                if credited_player["discordId"] == player.id:
                    await interaction.followup.send(
                        f"⚠️ {player.mention} is already credited for this mission!"
                    )
                    return
            
            result = await tc.update_one(
                {"name": team_name},
                {"$push": {f"board.missions.{i}.completedBy": player_data}}
            )
            
            if result.modified_count > 0:
                await interaction.followup.send(
                    f"✅ Added {player.mention} to completion credits for "
                    f"**{mission['missionTitle']}** on **{team_name}**!"
                )
            else:
                await interaction.followup.send("❌ Failed to add credit!")
            break
    
    if not mission_found:
        await interaction.followup.send(
            f"❌ Mission with ID {mission_id} not found on **{team_name}**!"
        )

@group.command()
async def remove_mission_all(
    interaction: discord.Interaction,
    mission_id: int
):
    """
    Remove a mission from ALL teams
    
    Args:
        mission_id: ID of the mission to remove
    """
    await interaction.response.defer()
    
    result = await tc.update_many(
        {},
        {"$pull": {"board.missions": {"missionId": mission_id}}}
    )
    
    if result.modified_count > 0:
        await interaction.followup.send(
            f"✅ Removed mission ID {mission_id} from **{result.modified_count}** team(s)!"
        )
    else:
        await interaction.followup.send(
            f"❌ Mission {mission_id} not found on any teams!"
        )

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
    
    await tc.insert_one(template.model_dump(by_alias=True, exclude={"id"}))
    await interaction.followup.send("✅ Template team created!")

@group.command()
async def create_news(
    interaction: discord.Interaction,
    content: str,
    posted_by: str | None = None
):
    """
    Create a news post
    
    Args:
        content: Content of the news post
        posted_by: Who posted it (defaults to command user)
    """
    await interaction.response.defer()
    
    if posted_by is None:
        posted_by = interaction.user.name
    
    news_post = NewsPost(
        content=content,
        postedBy=posted_by
    )
    
    result = await nc.insert_one(
        news_post.model_dump(by_alias=True, exclude={"id"})
    )
    
    if result.inserted_id:
        await interaction.followup.send(
            f"✅ News post created!\n"
            f"**Post ID:** `{news_post.postId}`\n"
            f"**Posted by:** {posted_by}\n"
            f"**Content:** {content[:100]}{'...' if len(content) > 100 else ''}"
        )
    else:
        await interaction.followup.send("❌ Failed to create news post!")


@group.command()
async def delete_news(
    interaction: discord.Interaction,
    post_id: str
):
    """
    Delete a news post
    
    Args:
        post_id: The UUID of the post to delete
    """
    await interaction.response.defer()
    
    post = await nc.find_one({"postId": post_id})
    if not post:
        await interaction.followup.send(
            f"❌ News post with ID `{post_id}` not found!"
        )
        return
    
    result = await nc.delete_one({"postId": post_id})
    
    if result.deleted_count > 0:
        await interaction.followup.send(
            f"✅ Deleted news post!\n"
            f"**Post ID:** `{post_id}`\n"
            f"**Was posted by:** {post['postedBy']}\n"
            f"**Content:** {post['content'][:100]}{'...' if len(post['content']) > 100 else ''}"
        )
    else:
        await interaction.followup.send("❌ Failed to delete news post!")


@group.command()
async def list_news(
    interaction: discord.Interaction,
    limit: int = 5
):
    """
    List recent news posts
    
    Args:
        limit: Number of posts to show (default 5)
    """
    await interaction.response.defer()
    
    posts = await nc.find().sort("timestamp", -1).limit(limit).to_list(limit)
    
    if not posts:
        await interaction.followup.send("📰 No news posts found!")
        return
    
    response = f"📰 **Recent News Posts** (showing {len(posts)}):\n\n"
    
    for post in posts:
        timestamp = int(post["timestamp"])
        content_preview = post["content"][:80]
        if len(post["content"]) > 80:
            content_preview += "..."
        
        response += (
            f"**ID:** `{post['postId']}`\n"
            f"**By:** {post['postedBy']} • <t:{timestamp}:R>\n"
            f"{content_preview}\n\n"
        )
    
    await interaction.followup.send(response)


def setup(client: discord.Client):
    client.tree.add_command(group, guild=client.guild_current)