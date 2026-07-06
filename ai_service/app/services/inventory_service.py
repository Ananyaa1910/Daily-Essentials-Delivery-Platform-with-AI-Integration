import httpx
import logging

from app.config import MERN_BACKEND_URL, REQUEST_TIMEOUT

logger = logging.getLogger(__name__)


class InventoryService:

    @staticmethod
    async def get_products():
        """
        Fetch all products from the MERN backend.
        """

        try:
            async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:

                response = await client.get(
                    f"{MERN_BACKEND_URL}/api/product/list"
                )

            response.raise_for_status()

            data = response.json()

            if not data.get("success"):
                logger.warning("Backend returned success=False")
                return []

            return data.get("products", [])

        except Exception as e:
            logger.exception("Unable to fetch products")
            raise Exception(f"Inventory Service Error: {e}")