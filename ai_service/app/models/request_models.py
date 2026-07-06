from pydantic import BaseModel
from typing import Optional

class AIRequest(BaseModel):
    query: str
    user_id: Optional[str] = "guest"