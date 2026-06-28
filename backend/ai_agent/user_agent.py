import os
from dotenv import load_dotenv

from agents import (
    Agent,
    Runner,
    OpenAIChatCompletionsModel,
    AsyncOpenAI,
    RunConfig,
)

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = AsyncOpenAI(
    api_key=api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

model = OpenAIChatCompletionsModel(
    model="gemini-2.5-flash",
    openai_client=client
)

config = RunConfig(
    model=model,
    tracing_disabled=True
)

# =====================
# SIMPLE TOOLS (NO SDK TOOL BINDING)
# =====================

async def list_products(db):
    products = await db.products.find().to_list(100)
    return "\n".join([f"{p['name']} - ${p['price']}" for p in products])


async def add_to_cart(db, user_id, product_name):
    from bson import ObjectId
    
    try:
        user_oid = ObjectId(user_id) if isinstance(user_id, str) and len(user_id) == 24 else user_id
    except Exception:
        user_oid = user_id

    clean_name = product_name.split("$")[0].strip()

    product = await db.products.find_one({
        "name": {"$regex": clean_name, "$options": "i"}
    })

    if not product:
        return "Product not found"

    product_oid = product["_id"]

    cart_exists = await db.carts.find_one({"userId": user_oid})

    if cart_exists:
        item_exists = False
        for item in cart_exists.get("items", []):
            item_prod_id = item.get("productId")
            if str(item_prod_id) == str(product_oid):
                item_exists = True
                break
        
        if item_exists:
            return "⚠️ Already in cart"

        await db.carts.update_one(
            {"userId": user_oid},
            {"$push": {
                "items": {
                    "productId": product_oid, 
                    "name": product.get("name"),
                    "price": float(product.get("price") or 0),
                    "image": product.get("image"),
                    "qty": 1,
                    "quantity": 1
                }
            }}
        )
    else:
        await db.carts.insert_one({
            "userId": user_oid,
            "user_id": user_oid, 
            "items": [{
                "productId": product_oid, 
                "name": product.get("name"),
                "price": float(product.get("price") or 0),
                "image": product.get("image"),
                "qty": 1,
                "quantity": 1
            }]
        })

    return f"🛒 Added {product['name']}"


async def remove_from_cart(db, user_id, name):
    from bson import ObjectId
    try:
        user_oid = ObjectId(user_id) if isinstance(user_id, str) and len(user_id) == 24 else user_id
    except Exception:
        user_oid = user_id

    clean_name = name.split("$")[0].strip()

    product = await db.products.find_one({
        "name": {"$regex": clean_name, "$options": "i"}
    })

    if not product:
        return f"Product '{clean_name}' not found"

    product_oid = product["_id"]

    result = await db.carts.update_one(
        {"userId": user_oid},
        {
            "$pull": {
                "items": {
                    "productId": {"$in": [product_oid, str(product_oid)]}
                }
            }
        }
    )

    if result.modified_count > 0:
        return f"Removed {product['name']} from your cart"
    else:
        return f"Could not find {product['name']} inside your live cart database"


async def view_cart(db, user_id):
    from bson import ObjectId
    try:
        user_oid = ObjectId(user_id) if isinstance(user_id, str) and len(user_id) == 24 else user_id
    except Exception:
        user_oid = user_id

    cart = await db.carts.find_one({"userId": user_oid})

    if not cart or not cart.get("items") or len(cart["items"]) == 0:
        return "Cart empty"

    cart_lines = []
    
    for item in cart["items"]:
        if item.get("name"):
            price = item.get("price", 0)
            cart_lines.append(f"- {item['name']} (${price})")
            continue
            
        prod_id = item.get("productId")
        try:
            prod_oid = ObjectId(prod_id) if isinstance(prod_id, str) and len(prod_id) == 24 else prod_id
        except Exception:
            prod_oid = prod_id

        product_details = await db.products.find_one({"_id": prod_oid})
        
        if product_details:
            cart_lines.append(f"- {product_details['name']} (${product_details.get('price', 0)})")
        else:
            cart_lines.append(f"- Product ID ({prod_id})")

    return "\n".join(cart_lines)


async def add_to_wishlist(db, user_id, product_name):
    from bson import ObjectId
    try:
        user_oid = ObjectId(user_id) if isinstance(user_id, str) and len(user_id) == 24 else user_id
    except Exception:
        user_oid = user_id

    clean_name = product_name.split("$")[0].strip()

    product = await db.products.find_one({"name": {"$regex": clean_name, "$options": "i"}})
    if not product:
        return "Product not found"

    product_oid = product["_id"]

    wishlist_exists = await db.wishlists.find_one({"userId": user_oid})

    wishlist_item = {
        "productId": product_oid,
        "product": product_oid,
        "name": product.get("name"),
        "price": float(product.get("price") or 0),
        "image": product.get("image") or ""
    }

    if wishlist_exists:
        if any(str(item.get("productId") or item.get("product")) == str(product_oid) for item in wishlist_exists.get("items", [])):
            return "❤️ Already in wishlist"
        
        await db.wishlists.update_one(
            {"userId": user_oid},
            {"$push": {"items": wishlist_item}}
        )
    else:
        await db.wishlists.insert_one({
            "userId": user_oid,
            "user_id": user_oid,
            "items": [wishlist_item]
        })

    return f"❤️ Added {product['name']} to wishlist"    

# =====================
# AGENT (NO TOOL SYSTEM)
# =====================
agent = Agent(
    name="Veloura Agent",
    instructions="""
You are an ecommerce assistant.

If user asks:
- products → say "SHOW_PRODUCTS"
- add to cart → say "ADD:<product>"
- remove → say "REMOVE:<product>"
- cart → say "VIEW_CART"
- add to wishlist → say "ADD_WISHLIST:<product>"

You MUST match these string patterns strictly when executing user actions. Do not say anything else.
""",
)


# =====================
# USER AGENT WRAPPER
# =====================
async def user_agent(msg: str, db, user_id: str):

    result = await Runner.run(
        agent,
        input=msg,
        run_config=config
    )

    output = result.final_output

    # =====================
    # MANUAL TOOL HANDLING
    # =====================

    # ✨ FIXED PRIORITY: Checked wishlist action string first to prevent overlapping prefixes trigger conflicts
    if "ADD_WISHLIST:" in output:
        name = output.split("ADD_WISHLIST:")[1].strip()
        return await add_to_wishlist(db, user_id, name)

    if "SHOW_PRODUCTS" in output:
        return await list_products(db)

    if "ADD:" in output:
        name = output.split("ADD:")[1].strip()
        return await add_to_cart(db, user_id, name)

    if "REMOVE:" in output:
        name = output.split("REMOVE:")[1].strip()
        return await remove_from_cart(db, user_id, name)

    if "VIEW_CART" in output:
        return await view_cart(db, user_id)

    return output