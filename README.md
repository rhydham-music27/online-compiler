# ProCompiler — Online IDE

A full-stack, browser-based IDE that executes code in multiple languages, profiles runtime performance, and provides an integrated AI coding assistant powered by OpenRouter.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Multi-language execution** | Python 3, C++ (G++), Java 17, JavaScript (Node.js) |
| **Web preview** | HTML5 + CSS live preview via sandboxed `<iframe>` |
| **Performance profiler** | Real-time memory sampling every 5 ms, peak-memory tracking, execution time in ms |
| **Run history** | Last 10 executions stored in memory; expandable output snapshots |
| **Complexity estimator** | Static loop-count heuristic (`O(1)` / `O(N)` / `O(N²)`) |
| **AI Assistant** | Sliding chat panel backed by OpenRouter (meta-llama/llama-3-8b-instruct by default) |
| **Smart editor** | Monaco Editor with custom `cursor-theme`, IntelliSense snippets, font-zoom controls, and code download |
| **Keyboard shortcuts** | `Ctrl+Enter` / `Ctrl+S` to run · `Ctrl++/-` to zoom · `Escape` to reset |

---

## 🗂️ Project Structure

```
online-compiler/
├── backend/               # FastAPI server
│   ├── main.py            # API entry point & route definitions
│   ├── executor.py        # Subprocess-based code runner + profiler
│   ├── ai_assistant.py    # OpenRouter chat integration
│   ├── models.py          # Pydantic request models
│   ├── config.py          # Env-var config (API key, model, URL)
│   ├── requirements.txt   # Python dependencies
│   └── .env               # ← NOT committed (see .env.example)
│
└── frontend/              # React + Vite SPA
    ├── src/
    │   ├── App.jsx                        # Root component & state orchestration
    │   └── components/
    │       ├── Header.jsx                 # Top nav: logo, language picker, Run button
    │       ├── EditorPanel.jsx            # Monaco editor, IntelliSense, download
    │       ├── ConsolePanel.jsx           # Output / History / Profiler tabs
    │       ├── ComplexityGraph.jsx        # Memory-over-time Recharts chart
    │       ├── PreviewPanel.jsx           # Sandboxed iframe for HTML/CSS
    │       ├── AIChatPanel.jsx            # Slide-in AI chat drawer
    │       ├── RightSidebar.jsx           # Utility bar: AI, history, shortcuts
    │       ├── CustomDropdown.jsx         # Animated language selector
    │       └── Footer.jsx                 # Status bar
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Minimum Version |
|---|---|
| Python | 3.10+ |
| Node.js | 18+ |
| G++ | Any modern version (for C++ execution) |
| Java JDK | 17+ (for Java execution) |

### 1. Clone the repository

```bash
git clone <repo-url>
cd online-compiler
```

### 2. Backend setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# → Edit .env and add your API key (see Configuration section)

# Start the server
python main.py
# Server runs at http://127.0.0.1:8000
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
# Dev server runs at http://localhost:5173
```

---

## ⚙️ Configuration

Create `backend/.env` from the example:

```env
# backend/.env
API_KEY=your_openrouter_api_key_here
# OR use the alternate key name:
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Get a free API key from [openrouter.ai](https://openrouter.ai).

> The AI Assistant is optional. The code execution engine works fully without an API key.

---

## 🌐 API Reference

The backend exposes two REST endpoints. Both accept and return JSON.

### `POST /execute`

Executes source code and returns profiling data.

**Request body:**
```json
{
  "code": "print('hello')",
  "language": "python",
  "input_data": ""
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `code` | string | ✅ | Source code to execute |
| `language` | string | ✅ | `python`, `cpp`, `java`, or `javascript` |
| `input_data` | string | ❌ | Data piped to stdin (default: `""`) |

**Response:**
```json
{
  "stdout": "hello\n",
  "stderr": "",
  "exit_code": 0,
  "time": 42.15,
  "memory": 8.32,
  "samples": [
    { "t": 5.0, "m": 7.91 },
    { "t": 10.1, "m": 8.32 }
  ]
}
```

| Field | Type | Description |
|---|---|---|
| `stdout` | string | Standard output |
| `stderr` | string | Standard error / compile error |
| `exit_code` | int | Process exit code (`0` = success) |
| `time` | float | Total wall-clock time in **milliseconds** |
| `memory` | float | Peak RSS memory in **megabytes** |
| `samples` | array | Time-series `{ t: ms, m: MB }` for the profiler graph |

---

### `POST /ai/chat`

Sends a message to the AI assistant with the current code context.

**Request body:**
```json
{
  "message": "Why does this crash?",
  "code": "print(x)",
  "language": "python",
  "output": "",
  "error": "NameError: name 'x' is not defined"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `message` | string | ✅ | User's question |
| `code` | string | ✅ | Current editor content (for context) |
| `language` | string | ✅ | Current language |
| `output` | string | ❌ | Last stdout (default: `""`) |
| `error` | string | ❌ | Last stderr (default: `""`) |

**Response:**
```json
{
  "reply": "The variable `x` is not defined…",
  "type": "text"
}
```

| Field | Possible Values | Description |
|---|---|---|
| `reply` | string | Markdown-formatted AI response |
| `type` | `"text"`, `"error"` | `"error"` when API key is missing or request fails |

---

## 🧩 Frontend Components

| Component | Responsibility |
|---|---|
| `App.jsx` | Global state, `handleExecute` logic, keyboard shortcut listener |
| `Header` | Language `CustomDropdown`, Run/Preview button, "Ask AI" trigger |
| `EditorPanel` | Monaco editor instance, custom `cursor-theme`, IntelliSense providers, font-size controls, code download |
| `ConsolePanel` | Three tabs: **Terminal** (stdin + stdout), **History** (last 10 runs), **Profiler** (memory chart) |
| `ComplexityGraph` | Recharts `AreaChart` of memory samples over time |
| `PreviewPanel` | Sandboxed `<iframe>` that renders HTML/CSS code directly |
| `AIChatPanel` | Animated slide-in drawer with chat bubbles, quick-action buttons (Fix / Explain / Optimize), typing indicator |
| `RightSidebar` | Icon utility bar; slide-out panels for keyboard shortcuts and expandable run history |
| `CustomDropdown` | Animated language selector with flags |
| `Footer` | Status bar showing "Cloud Compute Active", "Sandbox v2", encoding |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Enter` | Run / execute current code |
| `Ctrl + S` | Run / execute current code |
| `Ctrl + +` | Increase editor font size |
| `Ctrl + -` | Decrease editor font size |
| `Ctrl + 0` | Reset editor font size |
| `Escape` | Reset execution status to idle |

---

## 🔒 Security Notes

- Code execution runs in a **temporary directory** via Python's `tempfile.TemporaryDirectory`. The directory and all files are deleted automatically after execution.
- There is **no sandboxing** (no Docker, no seccomp). Do **not** expose this backend to the public internet without adding a proper sandbox layer.
- CORS is set to `allow_origins=["*"]` — tighten this before any production deployment.

---

## 🛠️ Tech Stack

### Backend
- [FastAPI](https://fastapi.tiangolo.com/) — async web framework
- [Uvicorn](https://www.uvicorn.org/) — ASGI server
- [Pydantic v2](https://docs.pydantic.dev/) — request validation
- [psutil](https://psutil.readthedocs.io/) — cross-platform memory profiling
- [python-dotenv](https://pypi.org/project/python-dotenv/) — `.env` loading
- [OpenRouter](https://openrouter.ai/) — LLM API gateway

### Frontend
- [React 19](https://react.dev/) — UI library
- [Vite 8](https://vitejs.dev/) — build tool & dev server
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) — code editor (same engine as VS Code)
- [Framer Motion](https://www.framer-motion.com/) — animations
- [Recharts](https://recharts.org/) — memory profiler chart
- [Axios](https://axios-http.com/) — HTTP client
- [Lucide React](https://lucide.dev/) — icon set

---

## 📄 License

MIT
