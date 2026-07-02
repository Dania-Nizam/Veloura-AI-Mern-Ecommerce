import os
from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# 🎯 Wapas Async Motor Client par switch karein (Taake user_agent ke await operations crash na hon)
from motor.motor_asyncio import AsyncIOMotorClient 

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

# 🎯 Environment variable explicit call aur Motor database setup
MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/ecommerce")
mongo = AsyncIOMotorClient(MONGO_URI)
db = mongo["ecommerce"]

class ChatRequest(BaseModel):
    message: str
    user_id: str
    role: Optional[str] = "customer"

@app.post("/chat")
async def chat(req: ChatRequest):
    # Dono agents async database operations handle karte hain, isliye 'db' async hona zaroori hai
    if req.role == "admin":
        reply = await admin_agent(req.message, db, req.user_id)
    else:
        reply = await user_agent(req.message, db, req.user_id)

    # 🎯 Frontend structure key format fix (Aapke UI response parsing ke mutabiq)
    return {"reply": reply}