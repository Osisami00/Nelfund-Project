"""
documents.py
Document loading and processing utilities
"""
import os
from typing import List, Any
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    CSVLoader,
    UnstructuredMarkdownLoader
)
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from config import config


def load_documents(file_paths: List[str]) -> List[Any]:
    """
    Load documents from various file types.
    Returns a list of Document objects.
    """
    documents = []
    
    for file_path in file_paths:
        if not os.path.exists(file_path):
            print(f"⚠️ Warning: File not found - {file_path}")
            continue
            
        try:
            if file_path.endswith('.pdf'):
                loader = PyPDFLoader(file_path)
                print(f"📄 Loading PDF: {file_path}")
            elif file_path.endswith('.txt'):
                loader = TextLoader(file_path)
                print(f"📝 Loading text: {file_path}")
            elif file_path.endswith('.csv'):
                loader = CSVLoader(file_path)
                print(f"📊 Loading CSV: {file_path}")
            elif file_path.endswith('.md'):
                loader = UnstructuredMarkdownLoader(file_path)
                print(f"📋 Loading markdown: {file_path}")
            else:
                print(f"❓ Unsupported format: {file_path}")
                continue
                
            docs = loader.load()
            documents.extend(docs)
            print(f"   → Loaded {len(docs)} pages/sections")
            
        except Exception as e:
            print(f"❌ Error loading {file_path}: {e}")
    
    return documents


def create_sample_documents() -> List[Document]:
    """Create sample documents for demonstration"""
    return [
        Document(
            page_content="""NELFUND (Student Loans Act 2023) provides interest-free loans to Nigerian students.
            Eligibility Criteria:
            1. Admission into a public Nigerian university, polytechnic, or college of education
            2. Family income below ₦500,000 per annum
            3. Guarantor required (civil servant level 12 or above)
            4. No age limit""",
            metadata={"source": "eligibility_guidelines.pdf", "page": 1}
        ),
        Document(
            page_content="""Application Process:
            1. Register on NELFUND portal with JAMB registration number
            2. Submit required documents (admission letter, income statement, guarantor form)
            3. Wait for verification (4-6 weeks)
            4. Receive disbursement directly to institution""",
            metadata={"source": "application_procedure.pdf", "page": 2}
        )
    ]


def split_documents(documents: List[Document]) -> List[Document]:
    """Split documents into chunks"""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=config.CHUNK_SIZE,
        chunk_overlap=config.CHUNK_OVERLAP
    )
    
    splits = text_splitter.split_documents(documents)
    print(f"✅ Created {len(splits)} document chunks")
    
    return splits