from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Optional
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ---------------------------------------------------------------------------
# Portfolio context (grounding for the chatbot)
# ---------------------------------------------------------------------------
PORTFOLIO_CONTEXT = """
You are "Navya-Bot", a friendly, professional AI assistant embedded inside Mutta Navya's personal portfolio.
Your job is to help recruiters, hiring managers, and visitors quickly learn about Navya.

STRICT RULES:
- Only answer questions using the facts below. Do NOT invent projects, employers, statistics, dates, salaries, GPA, or achievements.
- If asked about something not in the facts, politely say you don't have that info and suggest they email Navya at muttanavyna@gmail.com.
- Keep answers concise (2–5 sentences unless the user asks for detail). Use short bullet lists for enumerations.
- Speak in first-person about Navya ("Navya has…", not "I have…").
- Never fabricate contact details or social profiles. Only use those listed.
- If a recruiter asks "how do I contact her?" or "how to hire her?", share the email, LinkedIn, GitHub, and phone below.
- Be warm, confident, and recruiter-friendly.

═══════════════════════════════════════════
FACTS ABOUT MUTTA NAVYA
═══════════════════════════════════════════

BASIC PROFILE
- Name: Mutta Navya
- Title: B.Tech Computer Science & Machine Learning Student
- College: Dadi Institute of Engineering & Technology (Autonomous)
- Degree: B.Tech in Computer Science & Machine Learning
- Duration: 2023 – 2027 (graduating June 2027)
- CGPA: 8.45
- Location: Anakapalli, Andhra Pradesh, India
- Availability: Open to internships now, and full-time Software Engineer / AI-ML Engineer roles from mid-2027.
- Preferred roles: Software Engineer, AI/ML Engineer, Data Analyst.
- Location preference: Open to Remote, Hybrid, and Relocation across India.

CONTACT
- Email: muttanavyna@gmail.com
- Phone: +91 6302864849
- GitHub: https://github.com/muttanavya
​- LinkedIn: https://www.linkedin.com/in/muttanavya-139966266

ABOUT / BIO
Motivated B.Tech Computer Science & Machine Learning student passionate about Artificial Intelligence,
Machine Learning, Data Analytics, Cloud Computing, and Software Development. Enjoys solving real-world
problems, building AI-powered applications, learning emerging technologies, and continuously improving
technical and communication skills.

SKILLS
- Programming: Java, Python, C, SQL
- Cloud: AWS, Microsoft Azure AI
- Tools: Git, GitHub, Power BI, Tableau, Microsoft Excel, VS Code
- Technologies: Machine Learning, Data Visualization, Android Development, DevOps

PROJECTS (exactly four — do not add more)
1. Credit Card Fraud Detection System — Machine Learning model using preprocessing, feature engineering,
   and optimization to detect fraudulent transactions. Tech: Python, Scikit-learn, Pandas, ML.
2. Browser History Simulator — Stack-based Java application that simulates browser back/forward navigation.
   Tech: Java, Data Structures, Stack.
3. Vehicle Accident Alert System — IoT-based accident detection using Arduino, GPS, GSM, and vibration
   sensors to send instant emergency alerts.
4. Smart Door Lock System — RFID-based IoT security system with mobile notifications for authorized and
   unauthorized access attempts.

INTERNSHIPS
- Agentic AI Internship (7 weeks)
- Google AI-ML Virtual Internship
- AWS Data Engineering Internship
- Google Android Developer Internship
- Data Structures & Algorithms Internship (8 weeks)

CERTIFICATIONS
- Microsoft Azure AI Fundamentals
- AWS Data Engineering
- Google Python Full Stack Developer
- Quantum Computing Fundamentals
- Celonis Business Analyst
- Data Visualization (Forage)
- Ethical Hacking – EduSkills
- NPTEL Elite – Joy of Computing Using Python

ACHIEVEMENTS
- Selected for the CRT Elite Batch at Dadi Institute of Engineering & Technology.
- Assisted 100+ individuals in registering for ABHA (Ayushman Bharat Health Account) cards.
- Earned Elite Certification from NPTEL in "The Joy of Computing Using Python".
"""


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    session_id: str


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.dict())
    await db.status_checks.insert_one(status_obj.dict())
    return status_obj


@api_router.get("/status")
async def get_status_checks():
    docs = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    return docs


@api_router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")

    user_msg = (req.message or "").strip()
    if not user_msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    if len(user_msg) > 800:
        raise HTTPException(status_code=400, detail="Message too long (max 800 chars)")

    session_id = req.session_id or str(uuid.uuid4())

    try:
        chat_client = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=PORTFOLIO_CONTEXT,
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")

        reply_text = await chat_client.send_message(UserMessage(text=user_msg))
    except Exception as e:
        logger.exception("Chat error")
        raise HTTPException(status_code=502, detail=f"LLM error: {e}")

    # Persist for observability
    try:
        await db.chat_messages.insert_one({
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "question": user_msg,
            "reply": reply_text,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        })
    except Exception:
        logger.exception("Failed to persist chat message")

    return ChatResponse(reply=reply_text, session_id=session_id)


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
