from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import CodeRequest, ChatRequest
from executor import CodeExecutor
from ai_assistant import AIAssistant

app = FastAPI(title="Pro Compiler API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/execute")
async def execute_code(request: CodeRequest):
    """
    Endpoint to execute code in various languages with performance profiling.
    """
    return CodeExecutor.execute(
        code=request.code, 
        language=request.language, 
        input_data=request.input_data
    )

@app.post("/ai/chat")
async def ai_chat(request: ChatRequest):
    """
    Endpoint for AI-powered code analysis and debugging.
    """
    return AIAssistant.get_chat_response(request)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
