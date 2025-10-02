import os
import uuid

from fastapi import APIRouter, Response, Request, HTTPException, Depends
from dotenv import load_dotenv
from loguru import logger
from typing import Optional, Dict

from ..models.bingo import Team, AuthCookie
from ..database.mongoclient import auth_collection, team_collection

load_dotenv()
router = APIRouter(prefix="/authenticate")
ADMIN_PHRASE = os.getenv("ADMIN_PHRASE").lower()
ac = auth_collection()
tc = team_collection()

async def get_current_session(request: Request) -> Optional[AuthCookie]:
    session_id = request.cookies.get("sessionId")
    if not session_id:
        return None
    
    session_doc = await ac.find_one({"sessionId": session_id})
    
    if session_doc:
        try:
            return AuthCookie.model_validate(session_doc)
        except Exception as e:
            logger.error(f"Malformed session data for ID {session_id}: {e}. Deleting session.")
            await ac.delete_one({"sessionId" : session_id})
            return None
    
    logger.debug(f"No active server-side session found for ID {session_id}.")
    return None

async def validate_phrase(phrase: str) -> Dict[str, Optional[str]]:
    """
    Validates a phrase against admin phrase or team phrases.
    Returns the phrases if found, or None.
    """
    found_admin_phrase: Optional[str] = None
    found_team_phrase: Optional[str] = None


    if ADMIN_PHRASE and phrase == ADMIN_PHRASE:
        found_admin_phrase = phrase
    
    team_doc = await tc.find_one({"phrase": phrase})
    if team_doc:
        found_team_phrase = team_doc.get("phrase")

    if not found_admin_phrase and not found_team_phrase:
        raise HTTPException(status_code=401, detail="Invalid authentication phrase.")
    
    return {"adminPhrase": found_admin_phrase, "teamPhrase": found_team_phrase}
    


@router.post("/{phrase}")
async def authenticate(phrase: str, request: Request, response: Response):
    """
    Authenticates a user based on a team phrase or admin phrase.
    Creates or updates a server-side session in MongoDB and sets a sessionId cookie.
    """
    phrase_lower = phrase.lower()


    auth_result = await validate_phrase(phrase_lower)

    current_session = await get_current_session(request)
    if current_session:
        session_model = current_session
    else:
        session_model = AuthCookie()

    if auth_result["adminPhrase"] is not None:
        session_model.adminPhrase = auth_result["adminPhrase"]
    
    if auth_result["teamPhrase"] is not None:
        session_model.teamPhrase = auth_result["teamPhrase"]

    session_data_for_db = session_model.model_dump(by_alias=True, exclude_none=True)
    
    if "_id" in session_data_for_db and session_data_for_db["_id"] is None:
        del session_data_for_db["_id"]

    await ac.update_one(
        {"sessionId": session_model.sessionId},
        {"$set": session_data_for_db},
        upsert=True
    )

    cookie_params = dict(httponly=True, secure=True, samesite=None)
    response.set_cookie("sessionId", session_model.sessionId, **cookie_params)

    return {
        "message": "Authenticated",
        "sessionId": session_model.sessionId,
        "teamPhrase": session_model.teamPhrase,
        "adminPhrase": session_model.adminPhrase,
    }


@router.post("/logout")
async def logout(response: Response, current_session: Optional[AuthCookie] = Depends(get_current_session)):
    """
    Clears the sessionId cookie and deletes the server-side session from MongoDB.
    """
    if current_session and current_session.sessionId:
        await ac.delete_one({"sessionId": current_session.sessionId})
        logger.info(f"Session {current_session.sessionId} deleted from DB on logout.")
    else:
        logger.debug("Logout called, but no active session to delete.")
    
    response.delete_cookie("sessionId")
    return {"message": "Logged out successfully"}