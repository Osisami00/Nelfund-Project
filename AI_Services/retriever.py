# """
# retriever.py
# Document retrieval functionality
# """
# from typing import List, Dict
# from langchain_core.tools import tool
# from config import config


# class NelfundRetriever:
#     """Retriever for NELFUND documents"""
    
#     def __init__(self, vectorstore):
#         self.vectorstore = vectorstore
#         self.retriever = vectorstore.as_retriever(
#             search_type="mmr",
#             search_kwargs={
#                 "k": config.RETRIEVAL_K,
#                 "fetch_k": config.RETRIEVAL_FETCH_K,
#                 "lambda_mult": 0.7
#             }
#         )
    
#     def search(self, query: str) -> List[Dict]:
#         """Search for relevant documents"""
#         docs = self.retriever.invoke(query)
        
#         results = []
#         for i, doc in enumerate(docs):
#             results.append({
#                 "id": i + 1,
#                 "content": doc.page_content,
#                 "source": doc.metadata.get("source", "Unknown"),
#                 "page": doc.metadata.get("page", "N/A")
#             })
        
#         return results


# # Global retriever instance
# _nelfund_retriever = None


# def set_retriever(retriever: NelfundRetriever):
#     """Set the global retriever instance"""
#     global _nelfund_retriever
#     _nelfund_retriever = retriever


# @tool
# def retrieve_nelfund_info(query: str) -> str:
#     """
#     Search NELFUND policy documents for specific information.
    
#     USE THIS TOOL WHEN:
#     - User asks about eligibility criteria
#     - User asks about application process
#     - User asks about repayment terms
#     - User asks about required documents
#     - User asks about covered institutions
#     - User asks specific policy questions
    
#     DO NOT USE WHEN:
#     - User says hello or goodbye
#     - User asks about your capabilities
#     - Simple yes/no questions already in context
    
#     Returns formatted document excerpts with citations.
#     """
#     global _nelfund_retriever
    
#     if _nelfund_retriever is None:
#         return "⚠️ Document database not initialized. Please restart the system."
    
#     results = _nelfund_retriever.search(query)
    
#     if not results:
#         return "🔍 No relevant documents found. Please try rephrasing your question."
    
#     # Format results with citations
#     formatted_results = []
#     for result in results:
#         citation = f"[Source: {result['source']}, Page: {result['page']}]"
#         formatted_results.append(
#             f"📄 Document {result['id']}:\n{result['content']}\n{citation}\n"
#         )
    
#     return "\n" + "─" * 50 + "\n".join(formatted_results) + "\n" + "─" * 50


"""
retriever.py
Document retrieval functionality
"""
from typing import List, Dict
from langchain_core.tools import tool
from config import config


class NelfundRetriever:
    """Retriever for NELFUND documents"""
    
    def __init__(self, vectorstore):
        self.vectorstore = vectorstore
        self.retriever = vectorstore.as_retriever(
            search_type="mmr",
            search_kwargs={
                "k": config.RETRIEVAL_K,
                "fetch_k": config.RETRIEVAL_FETCH_K,
                "lambda_mult": 0.7
            }
        )
    
    def search(self, query: str) -> List[Dict]:
        """Search for relevant documents"""
        docs = self.retriever.invoke(query)
        
        results = []
        for i, doc in enumerate(docs):
            results.append({
                "id": i + 1,
                "content": doc.page_content,
                "source": doc.metadata.get("source", "Unknown"),
                "page": doc.metadata.get("page", "N/A")
            })
        
        return results


# Global retriever instance
_nelfund_retriever = None


def set_retriever(retriever: NelfundRetriever):
    """Set the global retriever instance"""
    global _nelfund_retriever
    _nelfund_retriever = retriever


@tool
def retrieve_nelfund_info(query: str) -> str:
    """
    Search NELFUND policy documents for specific information.
    
    USE THIS TOOL WHEN:
    - User asks about eligibility criteria
    - User asks about application process
    - User asks about repayment terms
    - User asks about required documents
    - User asks about covered institutions
    - User asks specific policy questions
    
    DO NOT USE WHEN:
    - User says hello or goodbye
    - User asks about your capabilities
    - Simple yes/no questions already in context
    
    Returns formatted document excerpts without citations (citations are handled separately).
    """
    global _nelfund_retriever
    
    if _nelfund_retriever is None:
        return "⚠️ Document database not initialized. Please restart the system."
    
    results = _nelfund_retriever.search(query)
    
    if not results:
        return "🔍 No relevant documents found. Please try rephrasing your question."
    
    # Format results WITHOUT citations (sources will be in the sources array)
    formatted_results = []
    for result in results:
        formatted_results.append(
            f"📄 Document {result['id']}:\n{result['content']}\n"
        )
    
    return "\n" + "─" * 50 + "\n".join(formatted_results) + "\n" + "─" * 50