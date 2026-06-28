from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from typing import Optional
import os

from user_agent import user_agent
from admin_agent import admin_agent

load_dotenv()

app = FastAPI(title="Ecommerce AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mongo = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = mongo["ecommerce"]


class ChatRequest(BaseModel):
    message: str
    user_id: str
    role: Optional[str] = "customer"


@app.post("/chat")
async def chat(req: ChatRequest):

    if req.role == "admin":
        reply = await admin_agent(req.message, db, req.user_id)
    else:
        reply = await user_agent(req.message, db, req.user_id)

    return {"response": reply}