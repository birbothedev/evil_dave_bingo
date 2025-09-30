import os

from dotenv import load_dotenv
from loguru import logger
from fastapi import FastAPI
from .routers.admin import router as adr
from .routers.auth import router as ahr
from .routers.team import router as ter


load_dotenv()
app = FastAPI(debug=os.getenv("BACKEND_DEBUG", False))
app.include_router(adr)
app.include_router(ahr)
app.include_router(ter)


@app.route("/", ["GET"])
async def root():
    return {"message": "Hello!"}