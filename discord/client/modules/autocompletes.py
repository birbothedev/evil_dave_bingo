from discord import app_commands
import discord
from .database.mongoclient import team_collection

tc = team_collection()


async def team_name_autocomplete(
    interaction: discord.Interaction,
    current: str
) -> list[app_commands.Choice[str]]:
    """Autocomplete for team names"""
    teams = await tc.find({}).to_list(length=25)
    return [
        app_commands.Choice(name=team["name"], value=team["name"])
        for team in teams 
        if current.lower() in team["name"].lower()
    ][:25]


async def effect_type_autocomplete(
    interaction: discord.Interaction,
    current: str
) -> list[app_commands.Choice[str]]:
    """Autocomplete for tile effect types"""
    effects = [
        "protected",
        "exterminated", 
        "reclaimed",
        "slayer_negative",
        "slayer_positive",
        "previous_protection"
    ]
    return [
        app_commands.Choice(name=effect, value=effect)
        for effect in effects if current.lower() in effect.lower()
    ]


async def player_rsn_autocomplete(
    interaction: discord.Interaction,
    current: str
) -> list[app_commands.Choice[str]]:
    """Autocomplete for player RSNs across all teams"""
    teams = await tc.find({"players": {"$exists": True}}).to_list(length=100)
    
    rsns = set()
    for team in teams:
        if team.get("players"):
            for player in team["players"]:
                rsns.add(player["rsn"])
    
    return [
        app_commands.Choice(name=rsn, value=rsn)
        for rsn in sorted(rsns) 
        if current.lower() in rsn.lower()
    ][:25]