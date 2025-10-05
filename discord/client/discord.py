import discord
import os
from discord import app_commands
from loguru import logger
from dotenv import load_dotenv

from .commands.submit import submit
from .commands.admin import setup as adminsetup
from .commands.template import setup as templatesetup

load_dotenv()

class DiscordClient(discord.Client):
    
    def __init__(self, debug: bool = False):
        super().__init__(intents=discord.Intents.all())
        self.debug = debug
        self.tree: app_commands.CommandTree = app_commands.CommandTree(self)
        self.guild_current = None
        logger.info("DiscordClient initialized.")
    
    async def set_guild_current(self):
        return self.get_guild(int(os.getenv("GUILD_ID")))
    
    async def start_tasks(self):
        logger.info("Starting background tasks...")
        ...
    
    async def init_event_hooks(self):
        logger.info("Loading @event hooks...")
        ...
    
    async def init_commands(self):
        logger.info("Loading Commands...")
        self.tree.add_command(submit, guild=self.guild_current)
        adminsetup(self)
        templatesetup(self)
        synced = await self.tree.sync(guild=self.guild_current)
        logger.info(synced)
        
    async def setup_hook(self) -> None:
        logger.info("Setting up client...")
        self.guild_current = await self.set_guild_current()
        await self.init_event_hooks()
        await self.start_tasks()
        
    
    async def on_ready(self):
        logger.info(f"Logged in as {self.user} (ID: {self.user.id})")
        await self.init_commands()