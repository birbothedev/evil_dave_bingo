import os

from dotenv import load_dotenv
from loguru import logger
from fastapi import FastAPI
from .routers.admin import router as admin
from .routers.auth import router as auth
from .routers.team import router as team
from .routers.newsfeed import router as newsfeed


load_dotenv()
app = FastAPI(debug=os.getenv("BACKEND_DEBUG", False))
app.include_router(admin)
app.include_router(auth)
app.include_router(team)
app.include_router(newsfeed)


@app.route("/", ["GET"])
async def root():
    return {"message": "Hello!"}