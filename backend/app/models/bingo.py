from pydantic import BaseModel, Field, GetCoreSchemaHandler
from pydantic_core import core_schema
from datetime import datetime, UTC, timedelta
from typing import Any
from uuid import uuid4
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def validate(cls, v, info):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.with_info_plain_validator_function(
                cls.validate
            ),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

class TileEffect(BaseModel):
    protected: bool = False
    exterminated: bool = False
    reclaimed: bool = False
    slayerNegative: bool = False
    slayerPositive: bool = False
    previousProtection: bool = False
    armorTile: bool = False
    weaponTile: bool = False
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
    effect: TileEffect | None = None

class Tile(BaseModel):
    index: int
    completedBy: list[Player] | None = None
    data: TileData

class Extermination(BaseModel):
    active: bool = True
    used: bool = False
    useBefore: float = Field(
        default_factory=lambda: datetime.timestamp(
            datetime.now(UTC) + timedelta(hours=24)
        )
    )

class StewEffect(BaseModel):
    positive: bool = False
    negative: bool = False
    thieving: bool = False
    magic: bool = False
    smithing: bool = False
    defense: bool = False
    slayer: bool = False
    declaredTile: int | None = None
    slayerPositive: int = -150
    slayerNegative: int = 100

class Stew(BaseModel):
    used: bool = False
    effect: StewEffect | None = None
    unlockedAt: float = Field(
        default_factory=lambda: datetime.timestamp(datetime.now(UTC))
    )
    
class Inventory(BaseModel):
    protection: int = 0
    reclaim: int = 0
    extermination: list[Extermination]
    stews: list[Stew] | None = None

class Pickpocket(BaseModel):
    team: str
    change: int
    timestamp: float = Field(default_factory=lambda: datetime.timestamp(datetime.now(UTC)))

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
    updated: float = Field(
        default_factory=lambda: datetime.timestamp(datetime.now(UTC))
    )
    bingoReward: int = 70
    bonusReward: int = 35
    bingoCount: int = 0
    activeBonus: dict[str, list] = {"row": [], "column": [], "diagonal": []}
    missionBonus: int = 0
    missions: list[Mission]
    tiles: list[Tile]

class Team(BaseModel):
    id: PyObjectId | None = Field(alias="_id", default=None)
    name: str
    phrase: str
    score: int = 0
    pickpockets: list[Pickpocket] | None = None
    players: list[Player] | None = None
    board: Board | None = None
    inventory: Inventory | None = None
    lastExtermination: float | None = None

class Frontpage(BaseModel):
    teams: list[Team]

class AuthCookie(BaseModel):
    id: PyObjectId | None = Field(alias="_id", default=None)
    sessionId: str = Field(default_factory=lambda: str(uuid4()))
    teamPhrase: str | None = None
    adminPhrase: str | None = None

class NewsPost(BaseModel):
    id: PyObjectId | None = Field(alias="_id", default=None)
    postId: str = Field(default_factory=lambda: str(uuid4()))
    content: str
    postedBy: str
    timestamp: float = Field(default_factory=lambda: datetime.timestamp(datetime.now(UTC)))
