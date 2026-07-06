import json

from fastapi import HTTPException

from app.models.request_models import AIRequest
from app.models.response_models import RecommendationResponse

from app.services.catalog_service import CatalogService
from app.services.gemini_service import GeminiService

from app.prompts.grocery_prompt import build_prompt


async def recommend_products(request: AIRequest):

    products = await CatalogService.get_products()

    inventory = []

    for p in products:

        if p.get("stock", 0) > 0 and p.get("inStock", True):

            inventory.append({

                "id": str(p["_id"]),
                "name": p["name"],
                "offerPrice": p["offerPrice"],
                "category": p["category"],
                "description": p.get("description", ""),
                "weight": p.get("weight", "")

            })

    prompt = build_prompt(request.query, inventory)

    try:

        result = await GeminiService.generate(prompt)

        

        return RecommendationResponse(**result)

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )