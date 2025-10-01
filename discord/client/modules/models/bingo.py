from pydantic import BaseModel, Field, GetCoreSchemaHandler
from pydantic_core import core_schema
from datetime import datetime, UTC, timedelta
from typing import Dict, Optional, Any
from uuid import uuid4
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.with_info_plain_validator_function(cls.validate),
            serialization=core_schema.to_string_ser_schema(),
        )

class TileEffect(BaseModel):
    protected: bool = False
    exterminated: bool = False
    reclaimed: bool = False
    slayerNegative: bool = False
    slayerPositive: bool = False
    previousProtection: bool = False
    appliedBy: str | None = None

class Player(BaseModel):
    discordId: int
    rsn: str
    captain: bool = False

class TileData(BaseModel):
    coordX: int
    coordY: int
    descriptor: str
    obtained: int = 0
    required: int
    effect: TileEffect

class Tile(BaseModel):
    tileId: str
    index: int
    completedBy: list[Player] | None = None
    data: TileData

class Extermination(BaseModel):
    active: bool = True
    used: bool = False
    useBefore: float = Field(default_factory=lambda: datetime.timestamp(datetime.now(UTC) + timedelta(hours=24)))

class Inventory(BaseModel):
    protection: int = 0
    reclaim: int = 0
    extermination: list[Extermination]

class Mission(BaseModel):
    missionId: int
    missionTitle: str
    descriptor: str
    reward: str | None = None
    pointReward: int | None = None
    completeBefore: float
    completed: bool = False
    completedBy: list[Player] | None = None

class Board(BaseModel):
    updated: float = Field(default_factory=lambda: datetime.timestamp(datetime.now(UTC)))
    bingoReward: int = 70
    bonusReward: int = 35
    bingoCount: int = 0
    activeBonus: dict[str, list] = {"row": [], "column": [], "diagonal": []}
    missionBonus: int = 0
    missions: list[Mission]
    tiles: list[Tile]

class Team(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    phrase: str
    score: int = 0
    players: list[Player]
    board: Board
    inventory: Inventory
    lastExtermination: float | None = None
    
class Frontpage(BaseModel):
    teams: list[Team]

class AuthCookie(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    sessionId: str = Field(default_factory=lambda: str(uuid4()))
    teamPhrase: Optional[str] = None
    adminPhrase: Optional[str] = None

class NewsPost(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    postId: str = Field(default_factory=lambda: str(uuid4()))
    content: str
    postedBy: str
    timestamp: float = Field(default_factory=lambda: datetime.timestamp(datetime.now(UTC)))