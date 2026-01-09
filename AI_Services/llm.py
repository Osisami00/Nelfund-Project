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

MISSION: Help Nigerian students understand and access student loans through NELFUND.

RETRIEVAL DECISION RULES:

ALWAYS RETRIEVE DOCUMENTS FOR:
1. Eligibility questions: "Am I eligible?", "Who can apply?", "Income requirements"
2. Application process: "How do I apply?", "What documents?", "Application steps"
3. Repayment questions: "When to repay?", "Interest rate?", "Repayment period"
4. Policy details: "What courses are covered?", "Which institutions?", "Loan limits"
5. Specific requirements: "Do I need a guarantor?", "What if I fail a course?"

ANSWER DIRECTLY FOR:
1. Greetings: "Hello", "Hi", "Good morning"
2. Capabilities: "What can you do?", "How do you work?"
3. Simple follow-ups: If answer is already in conversation context
4. General encouragement: "Thank you", "You're helpful"

RESPONSE GUIDELINES:
- ALWAYS cite sources when using retrieved information
- Be empathetic - students are anxious about their education
- Provide clear step-by-step guidance when possible
- If unsure, say so and suggest official channels
- Use Nigerian context (mention Naira amounts, Nigerian institutions)

IMPORTANT: When user asks about eligibility, always ask follow-up questions:
1. "Have you been admitted to a public institution?"
2. "What is your family's annual income?"
3. "Do you have a potential guarantor?"

Start by introducing yourself and asking how you can help.
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
        print("⚠️ Using Gemini requires GOOGLE_API_KEY environment variable")
        print("   Get your API key from: https://makersuite.google.com/app/apikey")
        return None


def extract_content_from_ai_message(message) -> str:
    """Extract content from AI message, handling different formats"""
    if isinstance(message.content, str):
        return message.content
    elif isinstance(message.content, list):
        content_parts = []
        for item in message.content:
            if hasattr(item, 'text'):
                content_parts.append(item.text)
            elif isinstance(item, dict) and 'text' in item:
                content_parts.append(item['text'])
            elif isinstance(item, str):
                content_parts.append(item)
        return " ".join(content_parts)
    elif hasattr(message, 'content'):
        return str(message.content)
    else:
        return "I couldn't generate a response. Please try again."