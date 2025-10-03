import discord
from loguru import logger
from discord import ui, ButtonStyle, TextStyle, app_commands
from datetime import datetime, UTC
from ..modules.models.bingo import Stew, Extermination
from ..modules.database.mongoclient import team_collection


tc = team_collection()


STAFF_ROLE_IDS = [965399119021617162, 965402001066299424]

class SubmissionView(ui.View):
    def __init__(self, team_name: str, tile_index: int, submitter: discord.Member, channel_id: int):
        super().__init__(timeout=None)
        self.team_name = team_name
        self.tile_index = tile_index
        self.submitter = submitter
        self.channel_id = channel_id
        self.question_channel = None
        
    def check_staff(self, interaction: discord.Interaction) -> bool:
        """Check if user has staff role"""
        return any(role.id in STAFF_ROLE_IDS for role in interaction.user.roles)
    

    @ui.button(label="Accept", style=ButtonStyle.success, custom_id="accept")
    async def accept_button(self, interaction: discord.Interaction, button: ui.Button):
        try:
            logger.info(f"Accept button clicked by {interaction.user.id} for team {self.team_name}, tile {self.tile_index}")
            
            if not self.check_staff(interaction):
                logger.warning(f"Non-staff user {interaction.user.id} tried to accept submission")
                await interaction.response.send_message("❌ You don't have permission to use this!", ephemeral=True)
                return
            
            if self.question_channel:
                logger.warning(f"Accept attempted while question channel is open")
                await interaction.response.send_message("❌ Close the question channel first!", ephemeral=True)
                return
            
            await interaction.response.defer()
            logger.info("Interaction deferred successfully")
            
            # Get team
            team = await tc.find_one({"name": self.team_name})
            if not team:
                logger.error(f"Team '{self.team_name}' not found in database")
                await interaction.followup.send("❌ Team not found!", ephemeral=True)
                return
            
            logger.info(f"Team '{self.team_name}' found with {len(team.get('players', []))} players")
            
            # Find player
            player_data = None
            for p in team.get("players", []):
                if p["discordId"] == self.submitter.id:
                    player_data = p
                    break
            
            if not player_data:
                logger.error(f"Player {self.submitter.id} not found on team {self.team_name}")
                logger.debug(f"Team players: {[p['discordId'] for p in team.get('players', [])]}")
                await interaction.followup.send("❌ Player not found on team!", ephemeral=True)
                return
            
            logger.info(f"Player found: {player_data}")
            
            # Find tile
            tile_found = False
            for i, tile in enumerate(team["board"]["tiles"]):
                if tile["index"] == self.tile_index:
                    tile_found = True
                    logger.info(f"Tile {self.tile_index} found at array index {i}")
                    
                    current_obtained = tile["data"].get("obtained", 0)
                    required = tile["data"]["required"]
                    new_obtained = current_obtained + 1
                    
                    logger.info(f"Tile progress: {current_obtained}/{required} -> {new_obtained}/{required}")
                    
                    # Check if exterminated
                    effect = tile.get("data", {}).get("effect")
                    if effect and effect.get("exterminated"):
                        logger.warning(f"Tile {self.tile_index} is exterminated")
                        await interaction.followup.send("❌ This tile has been exterminated!", ephemeral=True)
                        return
                    
                    # Check if already complete
                    if current_obtained >= required:
                        logger.warning(f"Tile {self.tile_index} is already complete")
                        await interaction.followup.send("⚠️ This tile is already complete!", ephemeral=True)
                        return
                    
                    is_completing = new_obtained >= required
                    logger.info(f"Is completing tile: {is_completing}")
                    
                    # Update tile
                    update_dict = {
                        f"board.tiles.{i}.data.obtained": new_obtained,
                        "board.updated": datetime.timestamp(datetime.now(UTC))
                    }
                    
                    # Add player to completedBy if completing
                    if is_completing:
                        completed_by = tile.get("completedBy") or []
                        if not any(p["discordId"] == self.submitter.id for p in completed_by):
                            completed_by.append(player_data)
                            update_dict[f"board.tiles.{i}.completedBy"] = completed_by
                            logger.info(f"Added player to completedBy list")
                    
                    # Award 10 points for tile progress
                    points_gained = 10
                    
                    logger.info(f"Attempting database update with: {update_dict}")
                    
                    result = await tc.update_one(
                        {"name": self.team_name},
                        {
                            "$set": update_dict,
                            "$inc": {"score": points_gained}
                        }
                    )
                    
                    logger.info(f"Database update result: matched={result.matched_count}, modified={result.modified_count}")
                    
                    if result.modified_count == 0:
                        logger.error("Database update failed - no documents modified")
                        await interaction.followup.send("❌ Failed to update tile!", ephemeral=True)
                        return
                    
                    # Update embed
                    embed = interaction.message.embeds[0]
                    embed.color = discord.Color.green()
                    embed.add_field(
                        name="✅ Accepted",
                        value=f"By: {interaction.user.mention}\n"
                              f"Progress: {new_obtained}/{required}\n"
                              f"Points: +{points_gained}",
                        inline=False
                    )
                    
                    # Disable all buttons
                    for item in self.children:
                        item.disabled = True
                    
                    await interaction.message.edit(embed=embed, view=self)
                    logger.info("Embed updated successfully")
                    
                    # Get the submission channel
                    channel = interaction.guild.get_channel(self.channel_id)
                    if not channel:
                        logger.error(f"Channel {self.channel_id} not found")
                        return
                    
                    logger.info(f"Sending notification to channel {channel.id}")
                    
                    # Check for bingo if tile completed
                    if is_completing:
                        logger.info("Checking for bingos...")
                        try:
                            # Re-fetch team for bingo check to get updated data
                            updated_team = await tc.find_one({"name": self.team_name})
                            bingo_result = await self.check_bingos(updated_team, channel)
                            
                            if bingo_result:
                                logger.info(f"Bingo detected! Points: {bingo_result['points']}")
                                points_gained += bingo_result["points"]
                                await channel.send(
                                    f"🎉 **{self.team_name}** completed tile **{self.tile_index}**!\n"
                                    f"{bingo_result['message']}"
                                )
                            else:
                                logger.info("No new bingos")
                                await channel.send(
                                    f"✅ **{self.team_name}** completed tile **{self.tile_index}**!\n"
                                    f"Progress: {new_obtained}/{required} (+{points_gained} points)"
                                )
                        except Exception as e:
                            logger.error(f"Error checking bingos: {e}", exc_info=True)
                            await channel.send(
                                f"✅ **{self.team_name}** completed tile **{self.tile_index}**!\n"
                                f"Progress: {new_obtained}/{required} (+{points_gained} points)\n"
                                f"⚠️ Error checking for bingos - please verify manually"
                            )
                    else:
                        await channel.send(
                            f"✅ **{self.team_name}** - Tile **{self.tile_index}** accepted!\n"
                            f"Progress: {new_obtained}/{required} (+{points_gained} points)"
                        )
                    
                    logger.info("Accept button completed successfully")
                    break
            
            if not tile_found:
                logger.error(f"Tile {self.tile_index} not found on team {self.team_name}")
                logger.debug(f"Available tiles: {[t['index'] for t in team['board']['tiles']]}")
                await interaction.followup.send("❌ Tile not found!", ephemeral=True)
                
        except Exception as e:
            logger.error(f"Unexpected error in accept_button: {e}", exc_info=True)
            try:
                await interaction.followup.send(
                    f"❌ An unexpected error occurred: {str(e)}\nCheck logs for details.",
                    ephemeral=True
                )
            except:
                logger.error("Failed to send error message to user")
    
    async def check_bingos(self, team: dict, notification_channel: discord.TextChannel) -> dict | None:
        """Check for new bingos and award rewards"""
        tiles = team["board"]["tiles"]
        board_size = 7
        
        # Create grid
        grid = [[False for _ in range(board_size)] for _ in range(board_size)]
        for tile in tiles:
            x = tile["data"]["coordX"]
            y = tile["data"]["coordY"]
            obtained = tile["data"].get("obtained", 0)
            required = tile["data"]["required"]
            grid[x][y] = obtained >= required
        
        current_active = team["board"].get("activeBonus", {"row": [], "column": [], "diagonal": []})
        new_bingos = []
        
        # Check rows
        for i in range(board_size):
            if all(grid[i]) and i not in current_active.get("row", []):
                new_bingos.append(("row", i))
                current_active.setdefault("row", []).append(i)
        
        # Check columns
        for j in range(board_size):
            if all(grid[i][j] for i in range(board_size)) and j not in current_active.get("column", []):
                new_bingos.append(("column", j))
                current_active.setdefault("column", []).append(j)
        
        # Check diagonals
        if all(grid[i][i] for i in range(board_size)) and 0 not in current_active.get("diagonal", []):
            new_bingos.append(("diagonal", 0))
            current_active.setdefault("diagonal", []).append(0)
        
        if all(grid[i][board_size - 1 - i] for i in range(board_size)) and 1 not in current_active.get("diagonal", []):
            new_bingos.append(("diagonal", 1))
            current_active.setdefault("diagonal", []).append(1)
        
        if not new_bingos:
            return None
        
        # Calculate points
        bingo_reward = 70
        bonus_reward = 35
        points = 0
        
        # Calculate intersections for bonus
        intersection_bonus_applied = set()
        
        for bingo_type, index in new_bingos:
            points += bingo_reward
            
            # Check for intersections
            for other_type, other_index in new_bingos:
                if bingo_type == other_type:
                    continue
                
                # Create a unique key for this intersection
                key = tuple(sorted([(bingo_type, index), (other_type, other_index)]))
                
                if key not in intersection_bonus_applied:
                    points += bonus_reward
                    intersection_bonus_applied.add(key)
        
        # Grant stew for each bingo
        stews = [Stew() for _ in range(len(new_bingos))]
        stew_dicts = [stew.model_dump() for stew in stews]
        
        # Grant extermination for each bingo
        exterminations = [Extermination() for _ in range(len(new_bingos))]
        ext_dicts = [ext.model_dump() for ext in exterminations]
        
        # Update database
        await tc.update_one(
            {"name": self.team_name},
            {
                "$set": {"board.activeBonus": current_active},
                "$inc": {
                    "board.bingoCount": len(new_bingos),
                    "score": points
                },
                "$push": {
                    "inventory.stews": {"$each": stew_dicts},
                    "inventory.extermination": {"$each": ext_dicts}
                }
            }
        )
        
        # Build message
        bingo_descriptions = []
        for bingo_type, index in new_bingos:
            if bingo_type == "diagonal":
                desc = "Diagonal \\" if index == 0 else "Diagonal /"
            else:
                desc = f"{bingo_type.capitalize()} {index}"
            bingo_descriptions.append(desc)
        
        message = (
            f"🎊 **BINGO!** Completed {len(new_bingos)} line(s): {', '.join(bingo_descriptions)}\n"
            f"💰 Points: +{points}\n"
            f"🥘 Stews granted: {len(new_bingos)}\n"
            f"💀 Exterminations granted: {len(new_bingos)}\n\n"
            f"⚠️ **Roll your stews as soon as possible!**"
        )
        
        return {"points": points, "message": message}
    
    @ui.button(label="Reject", style=ButtonStyle.danger, custom_id="reject")
    async def reject_button(self, interaction: discord.Interaction, button: ui.Button):
        if not self.check_staff(interaction):
            await interaction.response.send_message("❌ You don't have permission to use this!", ephemeral=True)
            return
        
        if self.question_channel:
            await interaction.response.send_message("❌ Close the question channel first!", ephemeral=True)
            return
        
        # Show modal for rejection reason
        modal = RejectModal(self)
        await interaction.response.send_modal(modal)
    
    @ui.button(label="Question", style=ButtonStyle.primary, custom_id="question")
    async def question_button(self, interaction: discord.Interaction, button: ui.Button):
        if not self.check_staff(interaction):
            await interaction.response.send_message("❌ You don't have permission to use this!", ephemeral=True)
            return
        
        if self.question_channel:
            await interaction.response.send_message("❌ Question channel already exists!", ephemeral=True)
            return
        
        await interaction.response.defer(ephemeral=True)
        
        # Create question channel in same category
        category = interaction.channel.category
        channel_name = f"question-tile-{self.tile_index}"
        
        # Create channel with permissions
        overwrites = {
            interaction.guild.default_role: discord.PermissionOverwrite(read_messages=False),
            self.submitter: discord.PermissionOverwrite(read_messages=True, send_messages=True),
            interaction.guild.me: discord.PermissionOverwrite(read_messages=True, send_messages=True)
        }
        
        # Add staff roles
        for role_id in STAFF_ROLE_IDS:
            role = interaction.guild.get_role(role_id)
            if role:
                overwrites[role] = discord.PermissionOverwrite(read_messages=True, send_messages=True)
        
        question_channel = await interaction.guild.create_text_channel(
            name=channel_name,
            category=category,
            overwrites=overwrites
        )
        
        self.question_channel = question_channel
        
        # Send message in question channel
        close_view = CloseQuestionView(self, interaction.message)
        await question_channel.send(
            f"❓ Question about **{self.team_name}** - Tile **{self.tile_index}**\n"
            f"Submitter: {self.submitter.mention}\n"
            f"Staff: {interaction.user.mention}\n\n"
            f"Use the button below to close this channel when resolved.",
            view=close_view
        )
        
        # Update embed
        embed = interaction.message.embeds[0]
        embed.add_field(
            name="❓ Question Opened",
            value=f"By: {interaction.user.mention}\n"
                  f"Channel: {question_channel.mention}",
            inline=False
        )
        await interaction.message.edit(embed=embed)
        
        await interaction.followup.send(
            f"✅ Created question channel: {question_channel.mention}",
            ephemeral=True
        )


class RejectModal(ui.Modal, title="Reject Submission"):
    reason = ui.TextInput(
        label="Rejection Reason",
        style=TextStyle.paragraph,
        placeholder="Explain why this submission is being rejected...",
        required=True,
        max_length=1000
    )
    
    def __init__(self, view: SubmissionView):
        super().__init__()
        self.view = view
    
    async def on_submit(self, interaction: discord.Interaction):
        await interaction.response.defer()
        
        # Update embed
        embed = interaction.message.embeds[0]
        embed.color = discord.Color.red()
        embed.add_field(
            name="❌ Rejected",
            value=f"By: {interaction.user.mention}\n"
                  f"Reason: {self.reason.value}",
            inline=False
        )
        
        # Disable all buttons
        for item in self.view.children:
            item.disabled = True
        
        await interaction.message.edit(embed=embed, view=self.view)
        
        # Notify submitter
        channel = interaction.guild.get_channel(self.view.channel_id)
        await channel.send(
            f"❌ **{self.view.team_name}** - Tile **{self.view.tile_index}** submission rejected\n"
            f"Submitter: {self.view.submitter.mention}\n"
            f"Reason: {self.reason.value}"
        )


class CloseQuestionView(ui.View):
    def __init__(self, submission_view: SubmissionView, original_message: discord.Message):
        super().__init__(timeout=None)
        self.submission_view = submission_view
        self.original_message = original_message
    
    @ui.button(label="Close Question Channel", style=ButtonStyle.danger, custom_id="close_question")
    async def close_button(self, interaction: discord.Interaction, button: ui.Button):
        if not any(role.id in STAFF_ROLE_IDS for role in interaction.user.roles):
            await interaction.response.send_message("❌ You don't have permission to use this!", ephemeral=True)
            return
        
        await interaction.response.defer()
        
        # Clear question channel reference
        self.submission_view.question_channel = None
        
        # Update original embed
        embed = self.original_message.embeds[0]
        for i, field in enumerate(embed.fields):
            if field.name == "❓ Question Opened":
                embed.set_field_at(
                    i,
                    name="✅ Question Resolved",
                    value=f"{field.value}\nClosed by: {interaction.user.mention}",
                    inline=False
                )
                break
        
        await self.original_message.edit(embed=embed)
        
        # Delete the question channel
        await interaction.channel.delete()


@app_commands.command()
async def submit(
    interaction: discord.Interaction,
    tile_index: int,
    screenshot: discord.Attachment
):
    """
    Submit a tile completion for verification
    
    Args:
        tile_index: Index of the tile (0-48)
        screenshot: Screenshot proof
    """
    await interaction.response.defer(ephemeral=True)
    
    # Find user's team
    team = await tc.find_one({"players.discordId": interaction.user.id})
    if not team:
        await interaction.followup.send(
            "❌ You're not on a team! Contact an admin.",
            ephemeral=True
        )
        return
    
    team_name = team["name"]
    
    # Find the tile
    tile_data = None
    for tile in team["board"]["tiles"]:
        if tile["index"] == tile_index:
            tile_data = tile
            break
    
    if not tile_data:
        await interaction.followup.send(
            f"❌ Tile {tile_index} not found on your team's board!",
            ephemeral=True
        )
        return
    
    # Check if tile is exterminated
    effect = tile_data.get("data", {}).get("effect")
    if effect and effect.get("exterminated"):
        await interaction.followup.send(
            f"❌ Tile {tile_index} has been exterminated!",
            ephemeral=True
        )
        return
    
    # Check if already complete
    obtained = tile_data["data"].get("obtained", 0)
    required = tile_data["data"]["required"]
    if obtained >= required:
        await interaction.followup.send(
            f"⚠️ Tile {tile_index} is already complete!",
            ephemeral=True
        )
        return
    
    # Create embed
    embed = discord.Embed(
        title=f"Tile {tile_index}: {tile_data['data']['descriptor']}",
        description=f"**Team:** {team_name}\n"
                   f"**Submitter:** {interaction.user.mention}\n"
                   f"**Progress:** {obtained}/{required}",
        color=discord.Color.blue(),
        timestamp=datetime.now(UTC)
    )
    embed.set_image(url=screenshot.url)
    embed.set_footer(text=f"Tile Index: {tile_index}")
    
    # Create view with buttons
    view = SubmissionView(team_name, tile_index, interaction.user, interaction.channel_id)
    
    # Send in current channel
    await interaction.channel.send(embed=embed, view=view)
    
    await interaction.followup.send(
        f"✅ Submission sent for verification!",
        ephemeral=True
    )