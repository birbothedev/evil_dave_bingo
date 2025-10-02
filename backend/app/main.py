import os

from dotenv import load_dotenv
from loguru import logger
from fastapi import FastAPI, Request, status
from .routers.admin import router as admin
from .routers.auth import router as auth
from .routers.team import router as team
from .routers.newsfeed import router as newsfeed
from .routers.home import router as home


load_dotenv()
app = FastAPI(debug=os.getenv("BACKEND_DEBUG", False))
app.include_router(home)
app.include_router(admin)
app.include_router(auth)
app.include_router(team)
app.include_router(newsfeed)


@app.get("/", status_code=status.HTTP_200_OK)
async def root(request: Request):
    logger.debug(f"Root endpoint accessed by client: {request.client.host}")
    return {"message": "Hello from Bingo Backend!"}