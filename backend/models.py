from pydantic import BaseModel
from typing import Optional

class CodeRequest(BaseModel):
    code: str
    language: str
    input_data: str = ""

class ChatRequest(BaseModel):
    message: str
    code: str
    language: str
    output: str = ""
    error: str = ""
