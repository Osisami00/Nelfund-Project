"""
main.py
NELFUND STUDENT LOAN NAVIGATOR - AGENTIC RAG SYSTEM
Main entry point

Author: AI Engineer
Date: 2024
"""
import uvicorn
from config import config
from vectorstore import create_vector_store
from retriever import NelfundRetriever, set_retriever
from llm import initialize_llm
from agent import create_agent
from api import create_app


# Global app instance for uvicorn
app = None


def initialize():
    """Initialize all components and return the FastAPI app"""
    global app
    
    print("=" * 60)
    print("📚 NELFUND STUDENT LOAN NAVIGATOR")
    print("=" * 60)
    print("✅ Starting initialization...")
    
    try:
        # 1. Create vector store
        print("\n[1/4] Creating vector store...")
        vectorstore = create_vector_store()
        
        # 2. Initialize retriever
        print("\n[2/4] Initializing retriever...")
        nelfund_retriever = NelfundRetriever(vectorstore)
        set_retriever(nelfund_retriever)
        print("✅ Retriever initialized")
        
        # 3. Initialize LLM
        print("\n[3/4] Initializing LLM...")
        llm = initialize_llm()
        
        if llm is None:
            print("\n❌ FATAL: LLM initialization failed")
            print("Please ensure GOOGLE_API_KEY is set in your .env file")
            return None
        
        # 4. Create agent
        print("\n[4/4] Creating agent...")
        agent = create_agent(llm)
        
        if agent is None:
            print("\n❌ FATAL: Agent creation failed")
            return None
        
        print("\n🎉 NELFUND Assistant is ready to help students!")
        
        # Print configuration summary
        print("\n📊 Configuration Summary:")
        print(f"   - Chat Model: Google Gemini {config.GEMINI_MODEL}")
        print(f"   - Embeddings: Sentence Transformer ({config.SENTENCE_TRANSFORMER_MODEL})")
        print(f"   - Vector Store: {config.VECTOR_STORE_PATH}")
        print(f"   - Document Sources: {len(config.DOCUMENT_PATHS)} files")
        
        # Create FastAPI app
        print("\n🖥️  Creating FastAPI application...")
        app = create_app(agent, nelfund_retriever, llm)
        
        # Print endpoints
        print("\n📚 Available endpoints:")
        print("  • GET  /              - Health check")
        print("  • POST /chat          - Chat with NELFUND assistant")
        print("  • GET  /sessions/{id} - Get conversation history")
        print("  • POST /reset/{id}    - Reset session")
        print("  • GET  /status        - System status")
        print("  • POST /reload-embeddings - Update document embeddings")
        print("  • POST /debug-gemini  - Debug Gemini response format")
        
        print("\n🔑 Environment Setup:")
        print(f"   ✅ GOOGLE_API_KEY: {'Set' if config.GOOGLE_API_KEY else 'NOT SET'}")
        if not config.GOOGLE_API_KEY:
            print("   ⚠️  Get your API key from: https://makersuite.google.com/app/apikey")
        
        print("\n💡 Cost Optimization:")
        print("   ✅ Embeddings use local Sentence Transformers - NO API COST!")
        print("   💰 Only chat requests use Gemini API")
        
        print("\n" + "=" * 60)
        
        return app
        
    except Exception as e:
        print(f"\n❌ Initialization failed: {e}")
        import traceback
        traceback.print_exc()
        return None


# Initialize the app at module level
app = initialize()


if __name__ == "__main__":
    if app is None:
        print("\n❌ Application failed to initialize. Exiting.")
        exit(1)
    
    print("\n🚀 Starting server on http://localhost:8000")
    print("📖 API documentation: http://localhost:8000/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)

