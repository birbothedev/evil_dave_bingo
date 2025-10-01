from ..modules.database.mongoclient import auth_collection, team_collection, news_collection, extra_collection
from ..modules.models.bingo import Team, Tile, TileData, TileEffect, Player, Extermination, Inventory, Mission, Board, NewsPost, PyObjectId
from .groups.admin import Admin

import discord
from discord import app_commands



group = Admin()


@group.command()
async def create_team(interaction: discord.Interaction, name: str, phrase: str):
    