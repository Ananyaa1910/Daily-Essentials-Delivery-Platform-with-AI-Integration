import httpx
import os

BACKEND_URL = os.getenv(
    "MERN_BACKEND_URL",
    "http://localhost:4000"
)


class CatalogService:

    @staticmethod
    async def get_products():

        async with httpx.AsyncClient() as client:

            response = await client.get(
                f"{BACKEND_URL}/api/product/list"
            )

            data = response.json()

            return data.get("products", [])