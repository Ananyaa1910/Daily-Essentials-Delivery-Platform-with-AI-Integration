from app.prompts.grocery_prompt import build_grocery_prompt
from app.services.inventory_service import InventoryService
from app.services.gemini_service import GeminiService
from app.utils.parser import ResponseParser


class RecommendationService:

    @staticmethod
    async def recommend(query: str):

        products = await InventoryService.get_products()

        inventory = []

        for p in products:

            if p.get("stock", 0) <= 0:
                continue

            if not p.get("inStock", True):
                continue

            inventory.append({
                "id": str(p["_id"]),
                "name": p["name"],
                "category": p.get("category"),
                "offerPrice": p.get("offerPrice"),
                "price": p.get("price"),
                "description": p.get("description", [])
            })

        prompt = build_grocery_prompt(
            query,
            inventory
        )

        gemini_result = await GeminiService.generate(prompt)

        recommendations = ResponseParser.parse(
            gemini_result,
            inventory
        )

        return recommendations