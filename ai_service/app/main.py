from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import APP_NAME
from app.services.inventory_service import InventoryService
from app.services.gemini_service import GeminiService

from app.routes.ai_routes import router

app = FastAPI(title=APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    router,
    prefix="/api/ai",
    tags=["AI"]
)


@app.get("/")
def home():
    return {"message": "AI Service Running"}


@app.get("/test-products")
async def test_products():

    products = await InventoryService.get_products()

    return {
        "count": len(products),
        "products": products[:2]
    }


@app.get("/test-gemini")
async def test_gemini():

    prompt = """
Return exactly:

{
  "message":"Hello"
}
"""

    result = await GeminiService.generate(prompt)

    return result