from fastapi import APIRouter
# pyrefly: ignore [missing-import]
from app.controllers.ai_controller import recommend_products

router = APIRouter()

router.post("/recommend")(recommend_products)