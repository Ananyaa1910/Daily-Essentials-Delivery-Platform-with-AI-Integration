from app.models.schemas import RecommendationItem


class ResponseParser:

    @staticmethod
    def parse(gemini_response: dict, inventory: list):
        """
        Validate Gemini response against inventory.
        """

        valid_items = []

        inventory_map = {
            str(item["id"]): item
            for item in inventory
        }

        recommendations = gemini_response.get("recommended_items", [])

        for item in recommendations:

            product_id = str(item.get("product_id"))

            if product_id not in inventory_map:
                continue

            product = inventory_map[product_id]

            valid_items.append(
                RecommendationItem(
                    product_id=product_id,
                    name=product["name"],
                    quantity=max(1, int(item.get("quantity", 1))),
                    reason=item.get(
                        "reason",
                        "Recommended for your needs."
                    )
                )
            )

        return valid_items