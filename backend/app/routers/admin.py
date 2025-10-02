from fastapi import APIRouter, Request, HTTPException, status, Depends
from typing import List

from loguru import logger

from ..models.bingo import Team, AuthCookie
from ..database.mongoclient import team_collection

from .auth import get_current_session 

router = APIRouter(prefix="/admin")


tc = team_collection()


# --- Dependency for authenticated admin user ---
async def get_authenticated_admin(current_session: AuthCookie = Depends(get_current_session)) -> AuthCookie:
    """
    Dependency that ensures the current user is authenticated as an administrator.
    Returns the AuthCookie model if admin, otherwise raises 403.
    """
    if not current_session:
        logger.warning("Attempted admin access without active session.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required.")
    
    if current_session.adminPhrase is None:
        logger.warning(f"Session {current_session.sessionId} is authenticated but does not have adminPhrase set.")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied: Admin privileges required.")
    
    return current_session


@router.get("", response_model=List[Team])
async def fetch_all_teams(admin_session: AuthCookie = Depends(get_authenticated_admin)):
    """
    Retrieves a list of all teams in the database.
    Requires authentication as an administrator.
    """
    logger.info(f"Admin session {admin_session.sessionId} fetching all teams.")

    all_team_docs = []
    try:
        cursor = tc.find({})
        async for doc in cursor:
            all_team_docs.append(doc)
    except Exception as e:
        logger.error(f"Error fetching all teams from database: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve teams.")
    
    teams_list: List[Team] = []
    for doc in all_team_docs:
        try:
            teams_list.append(Team.model_validate(doc))
        except Exception as e:
            logger.error(f"Malformed team document found in database (ID: {doc.get('_id')}): {e}. Skipping.")
            continue
        
    return teams_list