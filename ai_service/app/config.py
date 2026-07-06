import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Gemini Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# MERN Backend
MERN_BACKEND_URL = os.getenv(
    "MERN_BACKEND_URL",
    "http://localhost:4000"
)

# FastAPI Settings
APP_NAME = "DailyNest AI Service"

REQUEST_TIMEOUT = 20