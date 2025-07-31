import discord
from loguru import logger



class DiscordClient(discord.Client):
    
    def __init__(self, debug: bool = False):
        self.debug = debug
        super().__init__(intents=discord.Intents.all())
        logger.info("DiscordClient initialized.")
        
    async def start_tasks(self):
        logger.info("Starting background tasks...")
        ...
    
    async def init_event_hooks(self):
        logger.info("Loading @event hooks...")
        ...
    
    async def setup_hook(self) -> None:
        logger.info("Setting up client...")
        await self.init_event_hooks()
        await self.start_tasks()
    
    async def on_ready(self):
        logger.info(f"Logged in as {self.user} (ID: {self.user.id})")