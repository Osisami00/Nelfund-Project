# # """
# # models.py
# # Pydantic models for API requests and responses
# # """
# # from pydantic import BaseModel, Field
# # from typing import List, Dict, Literal
# # from datetime import datetime
# # import uuid


# # class ChatMessage(BaseModel):
# #     content: str
# #     role: Literal["user", "assistant"]
# #     timestamp: datetime = Field(default_factory=datetime.now)


# # class ChatRequest(BaseModel):
# #     message: str
# #     session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))


# # class ChatResponse(BaseModel):
# #     response: str
# #     session_id: str
# #     used_retrieval: bool = False
# #     sources: List[Dict] = Field(default_factory=list)
# #     timestamp: datetime = Field(default_factory=datetime.now)


# # class SessionInfo(BaseModel):
# #     session_id: str
# #     message_count: int
# #     created_at: datetime




# # """
# # models.py
# # Pydantic models for API requests and responses
# # """
# # from pydantic import BaseModel, Field
# # from typing import List, Dict, Literal
# # from datetime import datetime


# # class ChatMessage(BaseModel):
# #     content: str
# #     role: Literal["user", "assistant"]
# #     timestamp: datetime = Field(default_factory=datetime.now)


# # class ChatRequest(BaseModel):
# #     message: str
# #     phone_number: str = Field(..., description="User's phone number for session identification")


# # class ChatResponse(BaseModel):
# #     response: str
# #     phone_number: str
# #     used_retrieval: bool = False
# #     sources: List[Dict] = Field(default_factory=list)
# #     timestamp: datetime = Field(default_factory=datetime.now)


# # class SessionInfo(BaseModel):
# #     phone_number: str
# #     message_count: int
# #     created_at: datetime


# """
# models.py
# Pydantic models for API requests and responses
# """
# from pydantic import BaseModel, Field
# from typing import List, Dict, Literal, Optional
# from datetime import datetime
# import uuid


# class ChatMessage(BaseModel):
#     content: str
#     role: Literal["user", "assistant"]
#     timestamp: datetime = Field(default_factory=datetime.now)


# class ChatRequest(BaseModel):
#     message: str
#     phone_number: Optional[str] = Field(
#         default_factory=lambda: f"guest_{str(uuid.uuid4())[:8]}", 
#         description="User's phone number for session identification. Auto-generated for guest users."
#     )


# class ChatResponse(BaseModel):
#     response: str
#     phone_number: str
#     used_retrieval: bool = False
#     sources: List[Dict] = Field(default_factory=list)
#     timestamp: datetime = Field(default_factory=datetime.now)


# class SessionInfo(BaseModel):
#     phone_number: str
#     message_count: int
#     created_at: datetime

# from pydantic import BaseModel, Field, validator
# import re
# from typing import Optional, List, Dict, Any
# from datetime import datetime

# # Only need Signup and Chat models
# class SignupRequest(BaseModel):
#     phone: str = Field(..., description="Phone number (digits only)")
#     full_name: str = Field(..., description="User's full name")
    
#     @validator('phone')
#     def validate_phone(cls, v):
#         digits = re.sub(r'\D', '', v)
#         if len(digits) < 10:
#             raise ValueError('Phone number must have at least 10 digits')
#         return digits

# class SignupResponse(BaseModel):
#     user_id: str = Field(..., description="User ID")
#     phone: str = Field(..., description="Phone number")
#     full_name: str = Field(..., description="Full name")
#     message: str = Field(..., description="Response message")

# class ChatRequest(BaseModel):
#     phone: str = Field(..., description="User's phone number")
#     message: str = Field(..., description="Chat message")

# class ChatResponse(BaseModel):
#     response: str = Field(..., description="AI response")
#     phone: str = Field(..., description="User's phone")
#     sources: List[Dict[str, Any]] = Field(default_factory=list, description="Source documents")

# class ChatHistoryRequest(BaseModel):
#     phone: str = Field(..., description="User's phone number")

# class ChatHistoryResponse(BaseModel):
#     phone: str = Field(..., description="Phone number")
#     history: List[Dict[str, Any]] = Field(..., description="Chat history")

"""
models.py
Pydantic models for API requests and responses
"""
from pydantic import BaseModel, Field, field_validator
from typing import List, Dict, Literal, Optional
from datetime import datetime
import uuid


class ChatMessage(BaseModel):
    content: str
    role: Literal["user", "assistant"]
    timestamp: datetime = Field(default_factory=datetime.now)


class ChatRequest(BaseModel):
    message: str
    phone_number: Optional[str] = Field(
        default=None, 
        description="User's phone number for session identification. Auto-generated for guest users."
    )
    
    @field_validator('phone_number', mode='before')
    @classmethod
    def set_default_phone_number(cls, v):
        """Generate guest ID if phone_number is not provided"""
        if v is None or v == "":
            return f"guest_{str(uuid.uuid4())[:8]}"
        return v


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