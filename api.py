# """
# api.py
# FastAPI endpoints
# """
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from datetime import datetime
# from langchain_core.messages import HumanMessage, AIMessage
# from models import ChatRequest, ChatResponse
# from config import config
# from llm import extract_content_from_ai_message


# # Session storage
# sessions = {}


# def create_app(agent, nelfund_retriever, llm):
#     """Create and configure FastAPI application"""
    
#     app = FastAPI(
#         title="NELFUND Student Loan Navigator API",
#         description="Intelligent AI Assistant for Nigerian Student Loan Guidance",
#         version="1.0.0"
#     )
    
#     # CORS middleware
#     app.add_middleware(
#         CORSMiddleware,
#         allow_origins=["*"],
#         allow_credentials=True,
#         allow_methods=["*"],
#         allow_headers=["*"],
#     )
    
#     @app.get("/")
#     async def root():
#         """Health check endpoint"""
#         return {
#             "service": "NELFUND Student Loan Navigator",
#             "status": "operational" if agent else "initializing",
#             "version": "1.0.0",
#             "endpoints": ["/chat", "/sessions", "/reset"],
#             "ai_provider": "Google Gemini AI (Chat) + Sentence Transformers (Embeddings)",
#             "embedding_model": config.SENTENCE_TRANSFORMER_MODEL
#         }
    
#     @app.post("/chat", response_model=ChatResponse)
#     async def chat(request: ChatRequest):
#         """Main chat endpoint"""
#         if agent is None:
#             raise HTTPException(status_code=503, detail="Service initializing")
        
#         try:
#             # Get or create session
#             if request.session_id not in sessions:
#                 sessions[request.session_id] = {
#                     "created_at": datetime.now(),
#                     "messages": []
#                 }
            
#             # Invoke agent
#             result = agent.invoke(
#                 {"messages": [HumanMessage(content=request.message)]},
#                 config={"configurable": {"thread_id": request.session_id}}
#             )
            
#             # Extract response
#             final_response = None
#             used_retrieval = False
#             sources = []
            
#             for message in result["messages"]:
#                 if isinstance(message, AIMessage):
#                     if hasattr(message, 'tool_calls') and message.tool_calls:
#                         used_retrieval = True
                    
#                     final_response = extract_content_from_ai_message(message)
            
#             if not final_response:
#                 final_response = "I apologize, I couldn't generate a response. Please try rephrasing your question."
            
#             # Update session history
#             sessions[request.session_id]["messages"].append({
#                 "role": "user",
#                 "content": request.message,
#                 "timestamp": datetime.now()
#             })
            
#             sessions[request.session_id]["messages"].append({
#                 "role": "assistant",
#                 "content": final_response,
#                 "timestamp": datetime.now()
#             })
            
#             return ChatResponse(
#                 response=final_response,
#                 session_id=request.session_id,
#                 used_retrieval=used_retrieval,
#                 sources=sources
#             )
            
#         except Exception as e:
#             print(f"❌ Error in chat endpoint: {e}")
#             import traceback
#             traceback.print_exc()
#             raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
#     @app.get("/sessions/{session_id}")
#     async def get_session(session_id: str):
#         """Get conversation history for a session"""
#         if session_id not in sessions:
#             raise HTTPException(status_code=404, detail="Session not found")
        
#         return {
#             "session_id": session_id,
#             "created_at": sessions[session_id]["created_at"],
#             "messages": sessions[session_id]["messages"],
#             "message_count": len(sessions[session_id]["messages"])
#         }
    
#     @app.post("/reset/{session_id}")
#     async def reset_session(session_id: str):
#         """Reset a conversation session"""
#         if session_id in sessions:
#             sessions[session_id]["messages"] = []
#         return {"status": "session reset", "session_id": session_id}
    
#     @app.get("/status")
#     async def system_status():
#         """System status and statistics"""
#         return {
#             "status": "operational" if agent else "error",
#             "sessions_active": len(sessions),
#             "total_messages": sum(len(s["messages"]) for s in sessions.values()),
#             "vector_store": "loaded" if nelfund_retriever else "not_loaded",
#             "agent": "ready" if agent else "not_ready",
#             "ai_provider": "Google Gemini AI (Chat)",
#             "embedding_model": config.SENTENCE_TRANSFORMER_MODEL,
#             "cost_saving": "Yes - Sentence Transformers used for embeddings (no API calls)"
#         }
    
#     @app.post("/reload-embeddings")
#     async def reload_embeddings():
#         """Reload the vector store with updated documents"""
#         try:
#             from vectorstore import create_vector_store
#             from retriever import NelfundRetriever, set_retriever
            
#             vectorstore = create_vector_store()
#             new_retriever = NelfundRetriever(vectorstore)
#             set_retriever(new_retriever)
            
#             return {"status": "success", "message": "Embeddings reloaded successfully"}
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=str(e))
    
#     @app.post("/debug-gemini")
#     async def debug_gemini(message: str):
#         """Debug endpoint to see Gemini response format"""
#         if llm is None:
#             raise HTTPException(status_code=503, detail="LLM not initialized")
        
#         try:
#             from langchain_core.messages import SystemMessage, HumanMessage
            
#             test_messages = [
#                 SystemMessage(content="You are a helpful assistant."),
#                 HumanMessage(content=message)
#             ]
            
#             response = llm.invoke(test_messages)
            
#             return {
#                 "raw_response": str(response),
#                 "response_type": type(response).__name__,
#                 "content_type": type(response.content).__name__,
#                 "content_value": response.content,
#                 "has_tool_calls": hasattr(response, 'tool_calls'),
#                 "tool_calls": getattr(response, 'tool_calls', None),
#                 "extracted_content": extract_content_from_ai_message(response)
#             }
#         except Exception as e:
#             return {"error": str(e)}
    
#     return app



# """
# api.py
# FastAPI endpoints
# """
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from datetime import datetime
# from langchain_core.messages import HumanMessage, AIMessage
# from models import ChatRequest, ChatResponse
# from config import config
# from llm import extract_content_from_ai_message


# # Session storage
# sessions = {}


# def create_app(agent, nelfund_retriever, llm):
#     """Create and configure FastAPI application"""
    
#     app = FastAPI(
#         title="NELFUND Student Loan Navigator API",
#         description="Intelligent AI Assistant for Nigerian Student Loan Guidance",
#         version="1.0.0"
#     )
    
#     # CORS middleware
#     app.add_middleware(
#         CORSMiddleware,
#         allow_origins=["*"],
#         allow_credentials=True,
#         allow_methods=["*"],
#         allow_headers=["*"],
#     )
    
#     @app.get("/")
#     async def root():
#         """Health check endpoint"""
#         return {
#             "service": "NELFUND Student Loan Navigator",
#             "status": "operational" if agent else "initializing",
#             "version": "1.0.0",
#             "endpoints": ["/chat", "/sessions", "/reset"],
#             "ai_provider": "Google Gemini AI (Chat) + Sentence Transformers (Embeddings)",
#             "embedding_model": config.SENTENCE_TRANSFORMER_MODEL
#         }
    
#     @app.post("/chat", response_model=ChatResponse)
#     async def chat(request: ChatRequest):
#         """Main chat endpoint"""
#         if agent is None:
#             raise HTTPException(status_code=503, detail="Service initializing")
        
#         try:
#             # Get or create session
#             if request.phone_number not in sessions:
#                 sessions[request.phone_number] = {
#                     "created_at": datetime.now(),
#                     "messages": []
#                 }
            
#             # Invoke agent
#             result = agent.invoke(
#                 {"messages": [HumanMessage(content=request.message)]},
#                 config={"configurable": {"thread_id": request.phone_number}}
#             )
            
#             # Extract response and sources
#             final_response = None
#             used_retrieval = False
#             sources = []
            
#             for message in result["messages"]:
#                 if isinstance(message, AIMessage):
#                     if hasattr(message, 'tool_calls') and message.tool_calls:
#                         used_retrieval = True
#                         # Extract sources from tool calls
#                         for tool_call in message.tool_calls:
#                             if 'args' in tool_call and 'query' in tool_call['args']:
#                                 # Retrieve the actual documents to extract sources
#                                 retrieved_docs = nelfund_retriever.search(tool_call['args']['query'])
#                                 for doc in retrieved_docs:
#                                     source_entry = {
#                                         "source": doc.get("source", "Unknown"),
#                                         "page": doc.get("page", "N/A"),
#                                         "content_preview": doc.get("content", "")[:200] + "..."
#                                     }
#                                     if source_entry not in sources:
#                                         sources.append(source_entry)
                    
#                     final_response = extract_content_from_ai_message(message)
            
#             if not final_response:
#                 final_response = "I apologize, I couldn't generate a response. Please try rephrasing your question."
            
#             # Fix escape sequences - ensure proper sentence endings
#             final_response = final_response.replace("\\n", "\n").replace("\\'", "'").replace('\\"', '"')
            
#             # Update session history
#             sessions[request.phone_number]["messages"].append({
#                 "role": "user",
#                 "content": request.message,
#                 "timestamp": datetime.now()
#             })
            
#             sessions[request.phone_number]["messages"].append({
#                 "role": "assistant",
#                 "content": final_response,
#                 "timestamp": datetime.now()
#             })
            
#             return ChatResponse(
#                 response=final_response,
#                 phone_number=request.phone_number,
#                 used_retrieval=used_retrieval,
#                 sources=sources
#             )
            
#         except Exception as e:
#             print(f"❌ Error in chat endpoint: {e}")
#             import traceback
#             traceback.print_exc()
#             raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
#     @app.get("/sessions/{phone_number}")
#     async def get_session(phone_number: str):
#         """Get conversation history for a session"""
#         if phone_number not in sessions:
#             raise HTTPException(status_code=404, detail="Session not found")
        
#         return {
#             "phone_number": phone_number,
#             "created_at": sessions[phone_number]["created_at"],
#             "messages": sessions[phone_number]["messages"],
#             "message_count": len(sessions[phone_number]["messages"])
#         }
    
#     @app.post("/reset/{phone_number}")
#     async def reset_session(phone_number: str):
#         """Reset a conversation session"""
#         if phone_number in sessions:
#             sessions[phone_number]["messages"] = []
#         return {"status": "session reset", "phone_number": phone_number}
    
#     @app.get("/status")
#     async def system_status():
#         """System status and statistics"""
#         return {
#             "status": "operational" if agent else "error",
#             "sessions_active": len(sessions),
#             "total_messages": sum(len(s["messages"]) for s in sessions.values()),
#             "vector_store": "loaded" if nelfund_retriever else "not_loaded",
#             "agent": "ready" if agent else "not_ready",
#             "ai_provider": "Google Gemini AI (Chat)",
#             "embedding_model": config.SENTENCE_TRANSFORMER_MODEL,
#             "cost_saving": "Yes - Sentence Transformers used for embeddings (no API calls)"
#         }
    
#     @app.post("/reload-embeddings")
#     async def reload_embeddings():
#         """Reload the vector store with updated documents"""
#         try:
#             from vectorstore import create_vector_store
#             from retriever import NelfundRetriever, set_retriever
            
#             vectorstore = create_vector_store()
#             new_retriever = NelfundRetriever(vectorstore)
#             set_retriever(new_retriever)
            
#             return {"status": "success", "message": "Embeddings reloaded successfully"}
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=str(e))
    
#     @app.post("/debug-gemini")
#     async def debug_gemini(message: str):
#         """Debug endpoint to see Gemini response format"""
#         if llm is None:
#             raise HTTPException(status_code=503, detail="LLM not initialized")
        
#         try:
#             from langchain_core.messages import SystemMessage, HumanMessage
            
#             test_messages = [
#                 SystemMessage(content="You are a helpful assistant."),
#                 HumanMessage(content=message)
#             ]
            
#             response = llm.invoke(test_messages)
            
#             return {
#                 "raw_response": str(response),
#                 "response_type": type(response).__name__,
#                 "content_type": type(response.content).__name__,
#                 "content_value": response.content,
#                 "has_tool_calls": hasattr(response, 'tool_calls'),
#                 "tool_calls": getattr(response, 'tool_calls', None),
#                 "extracted_content": extract_content_from_ai_message(response)
#             }
#         except Exception as e:
#             return {"error": str(e)}
    
#     return app


"""
api.py
FastAPI endpoints
"""
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from langchain_core.messages import HumanMessage, AIMessage
from models import ChatRequest, ChatResponse
from config import config
from llm import extract_content_from_ai_message
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from langchain_core.messages import HumanMessage, AIMessage
from models import (
    SignupRequest, SignupResponse,
    ChatRequest, ChatResponse,
    ChatHistoryRequest, ChatHistoryResponse
)
from config import config
from llm import extract_content_from_ai_message
from database import db

# Session storage
sessions = {}


def create_app(agent, nelfund_retriever, llm):
    """Create and configure FastAPI application"""
    
    app = FastAPI(
        title="NELFUND Student Loan Navigator API",
        description="Intelligent AI Assistant for Nigerian Student Loan Guidance",
        version="1.0.0"
    )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    @app.get("/")
    async def root():
        """Health check endpoint"""
        return {
            "service": "NELFUND Student Loan Navigator",
            "status": "operational" if agent else "initializing",
            "version": "1.0.0",
            "endpoints": ["/chat", "/sessions", "/reset"],
            "ai_provider": "Google Gemini AI (Chat) + Sentence Transformers (Embeddings)",
            "embedding_model": config.SENTENCE_TRANSFORMER_MODEL
        }
    @app.on_event("startup")
    async def startup_event():
        """Initialize database on startup"""
        db.create_tables()
        print("✅ Database initialized")
    
    @app.get("/")
    async def root():
        """Health check"""
        return {
            "service": "NELFUND AI Assistant",
            "status": "operational" if agent else "initializing",
            "endpoints": [
                "POST /signup - Sign up with phone and name",
                "POST /chat - Send chat message",
                "GET /history/{phone} - Get chat history",
                "DELETE /history/{phone} - Clear history"
            ],
            "flow": "Sign up once → Chat forever (auto-saved)"
        }
    
    # ========== SIGNUP ENDPOINT ==========
    
    @app.post("/signup", response_model=SignupResponse)
    async def signup(request: SignupRequest):
        """Signup user - creates if new, returns if existing"""
        try:
            result = db.signup_user(
                phone=request.phone,
                full_name=request.full_name
            )
            
            if not result["success"]:
                raise HTTPException(status_code=500, detail=result["message"])
            
            return SignupResponse(
                user_id=result["user_id"],
                phone=result["phone"],
                full_name=result["full_name"],
                message=result["message"]
            )
            
        except Exception as e:
            print(f"❌ Signup error: {e}")
            raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")
    
    # ========== CHAT ENDPOINTS ==========
    
    @app.post("/chat", response_model=ChatResponse)
    async def chat(request: ChatRequest):
        """Chat with AI - automatically saves messages"""
        if agent is None:
            raise HTTPException(status_code=503, detail="AI service initializing")
        
        try:
            # Save user message
            db.save_chat_message(request.phone, request.message, "user")
            
            # Invoke agent
            result = agent.invoke(
                {"messages": [HumanMessage(content=request.message)]},
                config={"configurable": {"thread_id": request.phone}}
            )
            
            # Extract response and sources
            final_response = None
            sources = []
            
            for message in result["messages"]:
                if isinstance(message, AIMessage):
                    if hasattr(message, 'tool_calls') and message.tool_calls:
                        # Extract sources
                        for tool_call in message.tool_calls:
                            if 'args' in tool_call and 'query' in tool_call['args']:
                                retrieved_docs = nelfund_retriever.search(tool_call['args']['query'])
                                for doc in retrieved_docs:
                                    source_entry = {
                                        "source": doc.get("source", "Unknown"),
                                        "page": doc.get("page", "N/A"),
                                        "content_preview": doc.get("content", "")[:200] + "..."
                                    }
                                    if source_entry not in sources:
                                        sources.append(source_entry)
                    
                    final_response = extract_content_from_ai_message(message)
            
            if not final_response:
                final_response = "I apologize, I couldn't generate a response. Please try rephrasing your question."
            
            # Clean response
            final_response = re.sub(r"\\(.?)\\*", r"\1", final_response)
            final_response = re.sub(r"[\n•*-]+", ". ", final_response)
            final_response = re.sub(r"\s{2,}", " ", final_response).strip()
            final_response = re.sub(r"\.\s*\.", ".", final_response)
            final_response = re.sub(r"\s+([.,!?])", r"\1", final_response)
            
            if final_response and not final_response[-1] in '.!?':
                final_response += "."
            
            # Save AI response
            db.save_chat_message(request.phone, final_response, "ai", sources)
            
            return ChatResponse(
                response=final_response,
                phone=request.phone,
                sources=sources
            )
            
        except Exception as e:
            print(f"❌ Chat error: {e}")
            raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
    
    @app.get("/history/{phone}", response_model=ChatHistoryResponse)
    async def get_chat_history(phone: str):
        """Get chat history for phone"""
        try:
            history = db.get_chat_history(phone)
            
            return ChatHistoryResponse(
                phone=phone,
                history=history
            )
            
        except Exception as e:
            print(f"❌ History error: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to get history: {str(e)}")
    
    @app.delete("/history/{phone}")
    async def clear_chat_history(phone: str):
        """Clear chat history for phone"""
        try:
            success = db.clear_chat_history(phone)
            
            if success:
                return {"status": "success", "message": "Chat history cleared"}
            else:
                return {"status": "no_content", "message": "No chat history to clear"}
            
        except Exception as e:
            print(f"❌ Clear history error: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to clear history: {str(e)}")
    @app.post("/chat", response_model=ChatResponse)
    async def chat(request: ChatRequest):
        """Main chat endpoint"""
        if agent is None:
            raise HTTPException(status_code=503, detail="Service initializing")
        
        try:
            # Get or create session
            if request.phone_number not in sessions:
                sessions[request.phone_number] = {
                    "created_at": datetime.now(),
                    "messages": []
                }
            
            # Invoke agent
            result = agent.invoke(
                {"messages": [HumanMessage(content=request.message)]},
                config={"configurable": {"thread_id": request.phone_number}}
            )
            
            # Extract response and sources
            final_response = None
            used_retrieval = False
            sources = []
            
            for message in result["messages"]:
                if isinstance(message, AIMessage):
                    if hasattr(message, 'tool_calls') and message.tool_calls:
                        used_retrieval = True
                        # Extract sources from tool calls
                        for tool_call in message.tool_calls:
                            if 'args' in tool_call and 'query' in tool_call['args']:
                                # Retrieve the actual documents to extract sources
                                retrieved_docs = nelfund_retriever.search(tool_call['args']['query'])
                                for doc in retrieved_docs:
                                    source_entry = {
                                        "source": doc.get("source", "Unknown"),
                                        "page": doc.get("page", "N/A"),
                                        "content_preview": doc.get("content", "")[:200] + "..."
                                    }
                                    if source_entry not in sources:
                                        sources.append(source_entry)
                    
                    final_response = extract_content_from_ai_message(message)
            
            if not final_response:
                final_response = "I apologize, I couldn't generate a response. Please try rephrasing your question."
            
            # Format output - clean escape sequences and improve readability
            final_response = re.sub(r"\*\*(.*?)\*\*", r"\1", final_response)  # Remove bold markdown
            final_response = re.sub(r"[\n•*-]+", ". ", final_response)  # Replace newlines and bullets with periods
            final_response = re.sub(r"\s{2,}", " ", final_response).strip()  # Remove extra spaces
            final_response = re.sub(r"\.\s*\.", ".", final_response)  # Fix double periods
            final_response = re.sub(r"\s+([.,!?])", r"\1", final_response)  # Fix spacing before punctuation
            
            # Ensure proper sentence endings
            if final_response and not final_response[-1] in '.!?':
                final_response += "."
            
            # Update session history
            sessions[request.phone_number]["messages"].append({
                "role": "user",
                "content": request.message,
                "timestamp": datetime.now()
            })
            
            sessions[request.phone_number]["messages"].append({
                "role": "assistant",
                "content": final_response,
                "timestamp": datetime.now()
            })
            
            return ChatResponse(
                response=final_response,
                phone_number=request.phone_number,
                used_retrieval=used_retrieval,
                sources=sources
            )
            
        except Exception as e:
            print(f"❌ Error in chat endpoint: {e}")
            import traceback
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
    @app.get("/sessions/{phone_number}")
    async def get_session(phone_number: str):
        """Get conversation history for a session"""
        if phone_number not in sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        return {
            "phone_number": phone_number,
            "created_at": sessions[phone_number]["created_at"],
            "messages": sessions[phone_number]["messages"],
            "message_count": len(sessions[phone_number]["messages"])
        }
    
    @app.post("/reset/{phone_number}")
    async def reset_session(phone_number: str):
        """Reset a conversation session"""
        if phone_number in sessions:
            sessions[phone_number]["messages"] = []
        return {"status": "session reset", "phone_number": phone_number}
    
    @app.get("/status")
    async def system_status():
        """System status and statistics"""
        return {
            "status": "operational" if agent else "error",
            "sessions_active": len(sessions),
            "total_messages": sum(len(s["messages"]) for s in sessions.values()),
            "vector_store": "loaded" if nelfund_retriever else "not_loaded",
            "agent": "ready" if agent else "not_ready",
            "ai_provider": "Google Gemini AI (Chat)",
            "embedding_model": config.SENTENCE_TRANSFORMER_MODEL,
            "cost_saving": "Yes - Sentence Transformers used for embeddings (no API calls)"
        }
    
    @app.post("/reload-embeddings")
    async def reload_embeddings():
        """Reload the vector store with updated documents"""
        try:
            from vectorstore import create_vector_store
            from retriever import NelfundRetriever, set_retriever
            
            vectorstore = create_vector_store()
            new_retriever = NelfundRetriever(vectorstore)
            set_retriever(new_retriever)
            
            return {"status": "success", "message": "Embeddings reloaded successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.post("/debug-gemini")
    async def debug_gemini(message: str):
        """Debug endpoint to see Gemini response format"""
        if llm is None:
            raise HTTPException(status_code=503, detail="LLM not initialized")
        
        try:
            from langchain_core.messages import SystemMessage, HumanMessage
            
            test_messages = [
                SystemMessage(content="You are a helpful assistant."),
                HumanMessage(content=message)
            ]
            
            response = llm.invoke(test_messages)
            
            return {
                "raw_response": str(response),
                "response_type": type(response).__name__,
                "content_type": type(response.content).__name__,
                "content_value": response.content,
                "has_tool_calls": hasattr(response, 'tool_calls'),
                "tool_calls": getattr(response, 'tool_calls', None),
                "extracted_content": extract_content_from_ai_message(response)
            }
        except Exception as e:
            return {"error": str(e)}
    
    return app