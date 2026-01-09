"""
config.py
Configuration settings for NELFUND Student Loan Navigator
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration"""
    
    # Document paths
    DOCUMENT_PATHS = [
        "data/FAQ-GENERAL-STAKEHOLDERS-AND-MEDIA.pdf",
        "data/FAQ-INSTITUTIONS.pdf",
        "data/FAQ-PARENT-AND-GUARDIANS.pdf",
        "data/FAQ-STUDENTS.pdf",
        "data/Journal_2_25-pages-2.pdf",
        "data/NELFUND_FAQ.pdf",
        "data/NELFUND.pdf",
        "data/PUBLIC+GUIDELINES+FOR+APPLICANTS+FUND+UNDER+THE+STUDENTS+LOANS+ACT+2024.pdf",
        "data/Students-Loans-Access-to-Higher-Education-Act-2023.pdf"
    ]
    
    # Vector store
    VECTOR_STORE_PATH = "./nelfund_vectorstore"
    
    # API Keys
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    
    # Model Configuration
    GEMINI_MODEL = "gemini-3-flash-preview"
    SENTENCE_TRANSFORMER_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
    
    # Text splitting
    CHUNK_SIZE = 1500
    CHUNK_OVERLAP = 200
    
    # Retrieval
    RETRIEVAL_K = 5
    RETRIEVAL_FETCH_K = 10


config = Config()