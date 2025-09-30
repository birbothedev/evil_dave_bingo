from fastapi import APIRouter, Request, HTTPException, status, Depends
from typing import List, Optional

from loguru import logger

from ..models.bingo import NewsPost, AuthCookie
from ..database.mongoclient import news_collection

from .admin import get_authenticated_admin


router = APIRouter(prefix="/news")


nc = news_collection()


@router.get("/", response_model=List[NewsPost])
async def get_all_news_posts():
    """
    Retrieves a list of all news posts, ordered by timestamp (newest first).
    Publicly accessible.
    """
    logger.debug("Fetching all news posts.")
    
    all_news_docs = []
    try:
        cursor = nc.find({}).sort("timestamp", -1)
        async for doc in cursor:
            all_news_docs.append(doc)
    except Exception as e:
        logger.error(f"Error fetching all news posts from database: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve news posts.")
    

    news_list: List[NewsPost] = []
    for doc in all_news_docs:
        try:
            news_list.append(NewsPost.model_validate(doc))
        except Exception as e:
            logger.error(f"Malformed news document found in database (ID: {doc.get('_id')}): {e}. Skipping.")

    return news_list


@router.post("/", response_model=NewsPost, status_code=status.HTTP_201_CREATED)
async def create_news_post(
    new_post_data: NewsPost,
    admin_session: AuthCookie = Depends(get_authenticated_admin)
):
    """
    Creates a new news post.
    Requires authentication as an administrator.
    """
    logger.info(f"Admin session {admin_session.sessionId} creating new news post.")

    new_post_data.postedBy = "Event Staff"

    post_data_for_db = new_post_data.model_dump(by_alias=True, exclude_none=True)
    
    if "_id" in post_data_for_db and post_data_for_db["_id"] is None:
        del post_data_for_db["_id"]

    try:
        result = await nc.insert_one(post_data_for_db)
        
        created_post_doc = await nc.find_one({"_id": result.inserted_id})

        if created_post_doc:
            return NewsPost.model_validate(created_post_doc)
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve newly created news post."
            )

    except Exception as e:
        logger.error(f"Error creating news post: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))