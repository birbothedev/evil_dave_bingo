import asyncio
import os

from dotenv import load_dotenv
from loguru import logger

from client.discord import DiscordClient



async def main():
    logger.info("Starting Discord client...")
    client = DiscordClient(debug=os.getenv("DISCORD_DEBUG", False))
    await client.start(token=os.getenv("DISCORD_TOKEN"))

if __name__ == "__main__":
    load_dotenv()
    asyncio.run(main())