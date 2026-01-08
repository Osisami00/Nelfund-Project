# """
# models.py
# Pydantic models for API requests and responses
# """
# from pydantic import BaseModel, Field
# from typing import List, Dict, Literal
# from datetime import datetime
# import uuid


# class ChatMessage(BaseModel):
#     content: str
#     role: Literal["user", "assistant"]
#     timestamp: datetime = Field(default_factory=datetime.now)


# class ChatRequest(BaseModel):
#     message: str
#     session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))


# class ChatResponse(BaseModel):
#     response: str
#     session_id: str
#     used_retrieval: bool = False
#     sources: List[Dict] = Field(default_factory=list)
#     timestamp: datetime = Field(default_factory=datetime.now)


# class SessionInfo(BaseModel):
#     session_id: str
#     message_count: int
#     created_at: datetime


"""
models.py
Pydantic models for API requests and responses
"""
from pydantic import BaseModel, Field
from typing import List, Dict, Literal
from datetime import datetime


class ChatMessage(BaseModel):
    content: str
    role: Literal["user", "assistant"]
    timestamp: datetime = Field(default_factory=datetime.now)


class ChatRequest(BaseModel):
    message: str
    phone_number: str = Field(..., description="User's phone number for session identification")


class ChatResponse(BaseModel):
    response: str
    phone_number: str
    used_retrieval: bool = False
    sources: List[Dict] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.now)


class SessionInfo(BaseModel):
    phone_number: str
    message_count: int
    created_at: datetime