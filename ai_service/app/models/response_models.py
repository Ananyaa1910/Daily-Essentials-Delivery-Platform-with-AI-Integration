from pydantic import BaseModel
from typing import List

class Recommendation(BaseModel):
    product_id: str
    name: str
    quantity: int
    reason: str

class RecommendationResponse(BaseModel):
    recommended_items: List[Recommendation]