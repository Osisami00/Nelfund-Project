"""
llm.py
LLM initialization and configuration
"""
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage
from config import config


# System prompt for NELFUND specialist
SYSTEM_PROMPT = SystemMessage(content="""You are NELFI - the NELFUND Student Loan Navigator AI.

MISSION:
Help Nigerian students understand and access student loans through NELFUND.

CRITICAL TOOL USAGE RULES:

DO NOT USE RETRIEVAL FOR:
- Greetings: "Hello", "Hi", "Good morning", "Hey"
- Farewells: "Goodbye", "Bye", "Thanks bye"
- Gratitude: "Thank you", "Thanks", "I appreciate it"
- Capabilities: "What can you do?", "How do you work?"
- Small talk: "How are you?", "What's up?"
- Acknowledgements: "Okay", "Alright", "I see"

ALWAYS USE RETRIEVAL FOR:
- Eligibility: "Am I eligible?", "Who can apply?", "Income requirements"
- Application: "How do I apply?", "Documents needed", "Application steps"
- Repayment: "When to repay?", "Interest rate?", "Repayment period"
- Policy: "Courses covered?", "Institutions", "Loan limits"
- Requirements: "Guarantor?", "What if I fail?", "Income proof?"
- Timelines: "Processing time?", "Disbursement date?"

RESPONSE GUIDELINES:
- ALWAYS cite sources when using retrieved documents
- Be empathetic — students are anxious about education
- Give step-by-step guidance where possible
- Use Nigerian context (₦ amounts, Nigerian institutions)
- If unsure, say so and suggest official channels

FOLLOW-UP STRATEGY FOR ELIGIBILITY:
After answering, ask:
1. Have you been admitted to a public institution?
2. What is your family’s annual income?
3. Do you have a potential guarantor?

Remember:
Greetings & small talk → NO retrieval  
Policy & eligibility questions → ALWAYS retrieve
""")


def initialize_llm():
    """Initialize Gemini LLM"""
    try:
        genai.configure(api_key=config.GOOGLE_API_KEY)

        llm = ChatGoogleGenerativeAI(
            model=config.GEMINI_MODEL,
            temperature=0.3,
            google_api_key=config.GOOGLE_API_KEY,
            convert_system_message_to_human=True,
            max_output_tokens=2048,
            top_p=0.95,
            top_k=40
        )

        print(f"✅ Gemini LLM initialized successfully with model: {config.GEMINI_MODEL}")
        return llm

    except Exception as e:
        print(f"❌ Failed to initialize Gemini LLM: {e}")
        print("⚠️ GOOGLE_API_KEY is required")
        return None


def extract_content_from_ai_message(message) -> str:
    """Extract content from AIMessage safely"""
    if isinstance(message.content, str):
        return message.content

    if isinstance(message.content, list):
        parts = []
        for item in message.content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict) and "text" in item:
                parts.append(item["text"])
            elif hasattr(item, "text"):
                parts.append(item.text)
        return " ".join(parts)

    return str(message.content)
