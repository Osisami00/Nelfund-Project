"""
vectorscore.py
Vector store management using Sentence Transformers
"""
from langchain_chroma import Chroma
# from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings
from config import config
from documents import load_documents, create_sample_documents, split_documents


def create_embeddings():
    """Create Sentence Transformer embeddings"""
    print(f"🔍 Loading Sentence Transformer: {config.SENTENCE_TRANSFORMER_MODEL}")
    
    try:
        embeddings = HuggingFaceEmbeddings(
            model_name=config.SENTENCE_TRANSFORMER_MODEL,
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )
        print("✅ Sentence Transformer embeddings loaded successfully")
        
        # Test the embeddings
        test_text = "NELFUND student loan eligibility"
        test_embedding = embeddings.embed_query(test_text)
        print(f"   Embedding dimension: {len(test_embedding)}")
        
        return embeddings
        
    except Exception as e:
        print(f"❌ Failed to load Sentence Transformer: {e}")
        print("⚠️ Using default embeddings as fallback")
        return HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )


def create_vector_store():
    """
    Create and populate the vector database.
    This should be run once during initialization.
    """
    print("\n🔧 Setting up vector database...")
    
    # Load documents
    documents = load_documents(config.DOCUMENT_PATHS)
    
    if not documents:
        print("⚠️ No documents loaded. Creating sample data...")
        documents = create_sample_documents()
    
    # Split documents
    splits = split_documents(documents)
    
    # Create embeddings
    embeddings = create_embeddings()
    
    # Create vector store
    print("💾 Creating vector store...")
    vectorstore = Chroma.from_documents(
        documents=splits,
        embedding=embeddings,
        persist_directory=config.VECTOR_STORE_PATH
    )
    
    print(f"✅ Vector store created at {config.VECTOR_STORE_PATH}")
    print(f"   Total documents: {len(splits)}")
    print(f"   Embedding model: {config.SENTENCE_TRANSFORMER_MODEL}")
    
    return vectorstore