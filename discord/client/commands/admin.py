from ..modules.database.mongoclient import auth_collection, team_collection, news_collection, extra_collection
from ..modules.models.bingo import Team, Tile, TileData, TileEffect, Player, Extermination, Inventory, Mission, Board, NewsPost, PyObjectId
from .groups.admin import Admin

import discord
from discord import app_commands



group = Admin()
tc = team_collection()

@group.command()
async def create_team(interaction: discord.Interaction, name: str, phrase: str):
    new_team = Team(name=name, phrase=phrase)
    await tc.insert_one(new_team.model_dump_json())

@group.command()
async def add_player(interaction: discord.Interaction, team: str, user: discord.Member, rsn: str, captain: bool = False):
    new_player = Player(discordId=user.id, rsn=rsn, captain=captain)
    team_doc = tc.find_one({"name": team})
    if not team_doc:
        await interaction.response.send_message("Invalid team provided.")
    
    await tc.insert_one(new_player.model_dump_json())
    await interaction.response.send_message("Sucessfully inserted new player.")

@group.command()
async def add_tile(interaction: discord.Interaction, X: int, Y: int, descriptor: str, required: int):
    tile_data = TileData(coordX=X, coordY=Y, descriptor=descriptor, required=required)
    new_tile = Tile(index=0, data=tile_data)
    await tc.update_one({"name": "template"}, {})