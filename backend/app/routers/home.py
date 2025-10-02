from fastapi import APIRouter, Request, HTTPException, status, Depends

from loguru import logger

from ..models.bingo import Frontpage, Team
from ..database.mongoclient import team_collection


router = APIRouter(prefix="/home")
tc = team_collection()



async def get_all_teams():
    cursor = tc.find({})
    all_teams: list[Team] = []
    
    async for team in cursor:
        team["phrase"] = "Thurgo Is Displeased"
        all_teams.append(Team.model_validate(team))

    return Frontpage(teams=all_teams)


@router.get("", response_model=Frontpage)
async def index(teams: Frontpage = Depends(get_all_teams)):
    """
    Retrieves a list of all teams to be used for the frontpage of EvilDaveBingo.com
    """
    return teams