import requests
import json
from config import config
from models import ChatRequest

class AIAssistant:
    @staticmethod
    def get_chat_response(request: ChatRequest):
        if not config.API_KEY:
            return {
                "reply": "⚠️ OpenRouter API Key not found.\n\nPlease set your API key in your .env file as `API_KEY` or `OPENROUTER_API_KEY`.",
                "type": "error"
            }

        system_prompt = f"""You are an expert AI Coding Assistant integrated into a high-performance Online IDE called 'Pro Compiler'.
Your goal is to help the user with their code based on the context provided.

CONTEXT:
- Language: {request.language}
- Current Code:
```{request.language}
{request.code}
```
- Last Output: {request.output if request.output else 'No output yet'}
- Last Error: {request.error if request.error else 'None'}

INSTRUCTIONS:
- Provide clear, concise, and professional advice.
- If there are errors, explain why they happened and how to fix them.
- If asked for optimization, focus on Big O notation (Time and Space).
- Keep responses formatted for a chat bubble (use markdown).
"""

        try:
            response = requests.post(
                url=config.OPENROUTER_URL,
                headers={
                    "Authorization": f"Bearer {config.API_KEY}",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Pro Compiler IDE",
                },
                data=json.dumps({
                    "model": "openrouter/auto",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": request.message}
                    ]
                })
            )
            
            result = response.json()
            if "choices" in result:
                reply = result["choices"][0]["message"]["content"]
                return {"reply": reply, "type": "text"}
            else:
                return {"reply": f"AI Error: {result.get('error', {}).get('message', 'Unknown API error')}", "type": "error"}

        except Exception as e:
            return {"reply": f"Connection Error: {str(e)}", "type": "error"}
