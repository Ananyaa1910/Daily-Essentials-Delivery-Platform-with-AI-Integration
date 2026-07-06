from typing import List, Optional

from pydantic import BaseModel


class AIRequest(BaseModel):
    query: Optional[str] = None
    text: Optional[str] = None
    user_id: Optional[str] = "guest"


class RecommendationItem(BaseModel):
    product_id: str
    name: str
    quantity: int
    reason: str


class AIResponse(BaseModel):
    recommended_items: List[RecommendationItem]