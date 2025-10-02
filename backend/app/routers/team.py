from fastapi import APIRouter, Request, HTTPException, status, Depends
from typing import Optional, Dict, Any

from loguru import logger

from ..models.bingo import Team, AuthCookie
from ..database.mongoclient import team_collection

from .auth import get_current_session 

router = APIRouter(prefix="/teams")


tc = team_collection()

async def get_authenticated_team(current_session: AuthCookie = Depends(get_current_session)) -> Team:
    """
    Dependency that ensures the current user is authenticated as a team member,
    and returns their Team Pydantic model.
    """
    if not current_session:
        logger.warning("Attempted team access without active session.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required.")

    if current_session.teamPhrase is None:
        logger.warning(f"Session {current_session.sessionId} is authenticated but not as a team member.")
        raise HTTPException(status_code=status.HTTP_403_UNAUTHORIZED, detail="Access denied: Not authenticated as a team member.")
    

    team_doc = await tc.find_one({"phrase": current_session.teamPhrase})
    
    if not team_doc:
        logger.error(f"Team '{current_session.teamPhrase}' found in session, but not in DB. Session invalid. Deleting.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Associated team not found or invalid session.")
    
    try:
        return Team.model_validate(team_doc)
    except Exception as e:
        logger.error(f"Malformed team data for phrase '{current_session.teamPhrase}' in DB: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Server error: Malformed team data.")


@router.get("", response_model=Team)
async def get_team_details(current_team: Team = Depends(get_authenticated_team)):
    """
    Retrieves the details for the team that the authenticated user belongs to.
    Requires authentication as a team member.
    """
    return current_team
