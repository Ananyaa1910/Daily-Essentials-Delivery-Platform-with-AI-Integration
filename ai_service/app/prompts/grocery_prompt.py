import json


def build_prompt(query, inventory):

    inventory_json = json.dumps(inventory, indent=2)

    return f"""
You are a grocery shopping assistant.

User Query:
{query}

Available Products:
{inventory_json}

Choose ONLY products from the inventory.

Return ONLY JSON.

Example:

{{
    "recommended_items":[
        {{
            "product_id":"...",
            "name":"...",
            "quantity":2,
            "reason":"Rich in vitamin C"
        }}
    ]
}}
"""