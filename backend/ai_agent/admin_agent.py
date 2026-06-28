import os
import re
from dotenv import load_dotenv
from openai import APITimeoutError

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
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    timeout=60.0
)

model = OpenAIChatCompletionsModel(
    model="gemini-2.5-flash",
    openai_client=client
)

config = RunConfig(
    model=model,
    tracing_disabled=True
)

admin_agent_core = Agent(
    name="Veloura Admin Agent",
    instructions="""
You are an ecommerce ADMIN command parser.

Convert admin requests into these commands only:

ANALYTICS
VIEW_PRODUCTS
INVENTORY
VIEW_USERS

ADD_PRODUCT:<name>,<price>,<stock>
DELETE_PRODUCT:<id>
DELETE_USER:<id>
DELETE_ORDER:<id>
UPDATE_ORDER:<id>:<status>

If user sends greetings like:
hi, hello, hey, thanks

Return:
UNKNOWN

Return ONLY one command.
No explanations.
"""
)


async def admin_agent(msg: str, db, user_id: str):

    msg_lower = msg.lower().strip()

    # =========================
    # DIRECT COMMANDS (NO AI)
    # =========================

    if msg_lower in ["hi", "hello", "hey"]:
        return "👋 Hello Admin"

    if msg_lower in ["products", "view products", "show products"]:
        output = "VIEW_PRODUCTS"

    elif msg_lower in ["users", "view users", "show users"]:
        output = "VIEW_USERS"

    elif msg_lower in ["inventory", "stock"]:
        output = "INVENTORY"

    elif msg_lower in ["analytics", "sales", "report"]:
        output = "ANALYTICS"

    else:

        try:
            result = await Runner.run(
                admin_agent_core,
                input=msg,
                run_config=config
            )

            output = result.final_output.strip()

            print("USER:", msg)
            print("AGENT OUTPUT:", output)

        except APITimeoutError:
            return "⚠️ Gemini API Timeout. Please try again."

        except Exception as e:
            print("ADMIN AGENT ERROR:", str(e))
            return f"⚠️ Error: {str(e)}"

    # =========================
    # UNKNOWN
    # =========================

    if output == "UNKNOWN":
        return "Please enter a valid admin command."

    # =========================
    # ANALYTICS
    # =========================

    if output == "ANALYTICS":

        pipeline = [
            {"$unwind": "$orderItems"},
            {"$group": {
                "_id": "$orderItems.name",
                "totalQty": {"$sum": "$orderItems.qty"},
                "totalRevenue": {
                    "$sum": {
                        "$multiply": [
                            "$orderItems.price",
                            "$orderItems.qty"
                        ]
                    }
                }
            }},
            {"$sort": {"totalQty": -1}},
            {"$limit": 5}
        ]

        top_sales = await db.orders.aggregate(
            pipeline
        ).to_list(5)

        revenue_data = await db.orders.aggregate([
            {
                "$group": {
                    "_id": None,
                    "total": {"$sum": "$totalPrice"}
                }
            }
        ]).to_list(1)

        total_revenue = (
            revenue_data[0]["total"]
            if revenue_data else 0
        )

        if not top_sales:
            return "📊 No analytics data found."

        res = (
            f"📊 ADMIN ANALYTICS\n"
            f"💰 Total Revenue: ${total_revenue}\n\n"
            f"Top Products:\n"
        )

        for i, item in enumerate(top_sales):
            res += (
                f"{i+1}. {item['_id']} | "
                f"Qty: {item['totalQty']} | "
                f"Revenue: ${item['totalRevenue']}\n"
            )

        return res

    # =========================
    # VIEW PRODUCTS
    # =========================

    if output == "VIEW_PRODUCTS":

        products = await db.products.find().to_list(50)

        if not products:
            return "No products found"

        return "\n".join([
            f"• {p['name']} | "
            f"${p['price']} | "
            f"Stock: {p['countInStock']}"
            for p in products
        ])

    # =========================
    # INVENTORY
    # =========================

    if output == "INVENTORY":

        total = await db.products.count_documents({})

        low_stock = await db.products.find(
            {"countInStock": {"$lt": 5}}
        ).to_list(20)

        res = (
            f"📦 Total Products: {total}\n"
            f"Low Stock Products: {len(low_stock)}\n\n"
        )

        for p in low_stock:
            res += (
                f"- {p['name']} "
                f"({p['countInStock']} left)\n"
            )

        return res

    # =========================
    # VIEW USERS
    # =========================

    if output == "VIEW_USERS":

        users = await db.users.find(
            {},
            {"password": 0}
        ).to_list(50)

        if not users:
            return "No users found"

        return "\n".join([
            f"👤 {u.get('name')} | "
            f"{u.get('email')}"
            for u in users
        ])

    # =========================
    # ADD PRODUCT
    # =========================

    if output.startswith("ADD_PRODUCT:"):

        try:
            data = output.split(
                "ADD_PRODUCT:"
            )[1].split(",")

            name = data[0].strip()

            price = int(
                re.sub(r"\D", "", data[1])
            )

            stock = int(
                re.sub(r"\D", "", data[2])
            )

            await db.products.insert_one({
                "name": name,
                "price": price,
                "countInStock": stock,
                "brand": "Veloura",
                "category": "Admin Added",
                "image": "/images/sample.jpg"
            })

            return f"✅ Product Added: {name}"

        except Exception:
            return "Invalid add product format"

    # =========================
    # DELETE PRODUCT
    # =========================

    if output.startswith("DELETE_PRODUCT:"):

        pid = output.split(
            "DELETE_PRODUCT:"
        )[1].strip()

        res = await db.products.delete_one(
            {"_id": pid}
        )

        return (
            "🗑️ Product Deleted"
            if res.deleted_count
            else "Product not found"
        )

    # =========================
    # DELETE USER
    # =========================

    if output.startswith("DELETE_USER:"):

        uid = output.split(
            "DELETE_USER:"
        )[1].strip()

        res = await db.users.delete_one(
            {"_id": uid}
        )

        return (
            "🗑️ User Deleted"
            if res.deleted_count
            else "User not found"
        )

    # =========================
    # DELETE ORDER
    # =========================

    if output.startswith("DELETE_ORDER:"):

        oid = output.split(
            "DELETE_ORDER:"
        )[1].strip()

        res = await db.orders.delete_one(
            {"_id": oid}
        )

        return (
            "🗑️ Order Deleted"
            if res.deleted_count
            else "Order not found"
        )

    # =========================
    # UPDATE ORDER
    # =========================

    if output.startswith("UPDATE_ORDER:"):

        try:

            parts = output.split(
                "UPDATE_ORDER:"
            )[1].split(":")

            oid = parts[0].strip()
            status = parts[1].strip()

            await db.orders.update_one(
                {"_id": oid},
                {"$set": {"status": status}}
            )

            return f"🔄 Order updated to {status}"

        except Exception:
            return "Invalid update format"

    return output