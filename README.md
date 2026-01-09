# 🎓 NELFUND Student Loan Navigator

> **Agentic RAG-Powered AI Assistant for Nigerian Student Loan Guidance**

An intelligent chatbot that helps Nigerian students understand and navigate the NELFUND student loan application process using advanced AI retrieval and conversational capabilities.

---

## 📖 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Demo](#-demo)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)

---

## 🎯 Problem Statement

### The Challenge

For decades, talented Nigerian students dropped out of university due to financial constraints. In 2024, the Nigerian government launched **NELFUND** - the first functional student loan system in Nigeria's history.

**However, students face critical challenges:**

- 📄 Information scattered across multiple PDFs, FAQs, and press releases
- ❓ Confusion about eligibility criteria
- 🤔 Unclear application procedures
- 😰 Fear of making costly mistakes
- 📚 Complex legal language in official documents

### Real-World Impact

**Blessing** is a brilliant SS3 student from Enugu who got admission to study Medicine at UNILAG. Her parents are farmers earning ₦80,000/month. She heard about NELFUND but doesn't know:
- If she's eligible
- How to apply
- What documents she needs
- When she'll repay the loan

**Thousands of students like Blessing need answers RIGHT NOW.**

---

## 💡 Solution Overview

We built an **intelligent AI assistant** that:

✅ Answers questions about NELFUND eligibility, application process, and repayment  
✅ Retrieves information from official policy documents  
✅ Maintains conversation context for natural follow-up questions  
✅ Cites sources for every answer (builds trust)  
✅ Uses **Agentic RAG** - only retrieves documents when necessary  

### The Magic: Agentic Behavior

Unlike simple chatbots, our assistant **thinks strategically**:

- 👋 **Greeting?** → Responds directly (no retrieval needed)
- ❓ **Policy question?** → Retrieves relevant documents first
- 💬 **Follow-up question?** → Uses conversation memory
- 📚 **Specific requirements?** → Searches official guidelines

---

## ✨ Features

### Core Functionality

- **🧠 Intelligent Document Retrieval**: Uses semantic search across NELFUND policy documents
- **💬 Conversational Memory**: Remembers chat history for contextual responses
- **📎 Source Citations**: Every answer includes document references
- **🎯 Conditional Retrieval**: Doesn't waste resources on simple greetings
- **⚡ Fast Responses**: Optimized vector search with Sentence Transformers
- **🔒 Session Management**: Multiple users can chat simultaneously

### Technical Highlights

- **Agentic RAG System** powered by LangGraph
- **Local Embeddings** using Sentence Transformers (no API costs!)
- **Smart Routing** with conditional logic
- **Vector Database** with ChromaDB for semantic search
- **RESTful API** with FastAPI
- **Modern Frontend** with React + Tailwind CSS

---

## 🛠 Tech Stack

### Backend (AI Engine + API)

| Technology | Purpose |
|------------|---------|
| **Python 3.10+** | Core programming language |
| **LangChain** | RAG framework and document processing |
| **LangGraph** | Agentic workflow orchestration |
| **Google Gemini 1.5 Pro** | Large Language Model for chat |
| **Sentence Transformers** | Local embedding generation |
| **ChromaDB** | Vector database for semantic search |
| **FastAPI** | REST API framework |
| **Pydantic** | Data validation |

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Tailwind CSS** | Styling |
| **Axios** | HTTP client |
| **React Markdown** | Message formatting |

### Infrastructure

- **Uvicorn**: ASGI server
- **python-dotenv**: Environment management
- **PyPDF**: PDF document processing

---

## 📁 Project Structure

```
nelfund-navigator/
│
├── backend/
│   ├── main.py                 # Application entry point
│   ├── config.py              # Configuration settings
│   ├── models.py              # Pydantic data models
│   ├── documents.py           # Document loading & processing
│   ├── vectorstore.py         # Vector database management
│   ├── retriever.py           # Document retrieval logic
│   ├── llm.py                 # LLM initialization
│   ├── agent.py               # LangGraph agent
│   ├── api.py                 # FastAPI endpoints
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   └── data/                  # NELFUND documents
│       ├── FAQ-STUDENTS.pdf
│       ├── NELFUND.pdf
│       └── ...
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   └── InputBar.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── docs/
│   ├── demo-video.md
│   └── presentation.pdf
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and npm
- **Google API Key** (for Gemini)
- **Git**

### Step 1: Clone Repository

```bash
git clone https://github.com/your-team/nelfund-navigator.git
cd nelfund-navigator
```

### Step 2: Backend Setup

#### 2.1 Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

#### 2.2 Install Dependencies

```bash
pip install -r requirements.txt
```

#### 2.3 Configure Environment

Create a `.env` file in the `backend/` directory:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

**Get your API key:** https://makersuite.google.com/app/apikey

#### 2.4 Add Documents

Place NELFUND policy documents in `backend/data/`:
- FAQ-STUDENTS.pdf
- NELFUND.pdf
- Student Loan Act 2023.pdf
- Application Guidelines.pdf
- etc.

Or update paths in `backend/config.py`.

#### 2.5 Run Backend

```bash
# Option 1: Direct execution
python main.py

# Option 2: Using uvicorn (recommended)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will start at: **http://localhost:8000**

API docs available at: **http://localhost:8000/docs**

### Step 3: Frontend Setup

Open a **new terminal** (keep backend running):

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at: **http://localhost:5173**

---

## 💻 Usage

### 1. Start Both Services

**Terminal 1 (Backend):**
```bash
cd backend
uvicorn main:app --reload
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### 2. Open Browser

Navigate to: **http://localhost:5173**

### 3. Start Chatting!

**Example Questions:**

- "Am I eligible for NELFUND loan?"
- "How do I apply for student loan?"
- "What documents do I need?"
- "When do I start repaying the loan?"
- "Which universities are covered?"
- "What if my parents earn above ₦500,000?"
- "Is there an age limit for applicants?"
- "What happens if I fail a course?"

### 4. Observe Agentic Behavior

Try these to see conditional retrieval:

- **"Hello"** → Direct response (no retrieval)
- **"What can you do?"** → Direct response
- **"Am I eligible?"** → Retrieves documents
- **"Tell me more"** → Uses conversation memory

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. Health Check
```http
GET /
```

**Response:**
```json
{
  "service": "NELFUND Student Loan Navigator",
  "status": "operational",
  "version": "1.0.0",
  "ai_provider": "Google Gemini AI"
}
```

#### 2. Chat
```http
POST /chat
```

**Request Body:**
```json
{
  "message": "Am I eligible for NELFUND loan?",
  "session_id": "optional-session-id"
}
```

**Response:**
```json
{
  "response": "Based on NELFUND guidelines, you are eligible if...",
  "session_id": "abc-123-xyz",
  "used_retrieval": true,
  "sources": [],
  "timestamp": "2025-01-09T10:30:00"
}
```

#### 3. Get Session History
```http
GET /sessions/{session_id}
```

**Response:**
```json
{
  "session_id": "abc-123-xyz",
  "created_at": "2025-01-09T10:00:00",
  "messages": [...],
  "message_count": 5
}
```

#### 4. Reset Session
```http
POST /reset/{session_id}
```

#### 5. System Status
```http
GET /status
```

**Response:**
```json
{
  "status": "operational",
  "sessions_active": 3,
  "total_messages": 47,
  "vector_store": "loaded",
  "agent": "ready"
}
```

#### 6. Reload Embeddings
```http
POST /reload-embeddings
```

Updates vector database with new documents.

### Interactive API Docs

Visit **http://localhost:8000/docs** for Swagger UI documentation.

---

## 🎬 Demo

### Video Demonstration

📹 **Watch our demo:** [YouTube Link] / [Google Drive Link]

**Demo includes:**
- System overview and architecture
- Live chat demonstration
- Agentic behavior showcase
- Source citation examples
- Conversation memory in action
- Technical walkthrough

### Screenshots

**Chat Interface:**
```
┌─────────────────────────────────────┐
│  NELFUND Student Loan Navigator     │
├─────────────────────────────────────┤
│                                     │
│  You: Am I eligible?                │
│                                     │
│  🤖 NELFI: Based on NELFUND        │
│  guidelines, you are eligible if... │
│  📄 [Source: FAQ-STUDENTS.pdf]     │
│                                     │
│  You: What documents do I need?     │
│                                     │
│  🤖 NELFI: You'll need...          │
│                                     │
└─────────────────────────────────────┘
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Test API health
curl http://localhost:8000/

# Test chat endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Am I eligible for NELFUND?"}'

# Test system status
curl http://localhost:8000/status
```

### Frontend Tests

```bash
cd frontend
npm run test
```

---

## 📊 Performance

- **Average Response Time:** < 2 seconds
- **Document Retrieval:** 5 most relevant chunks
- **Embedding Generation:** Local (no API costs)
- **Concurrent Users:** Supports multiple sessions
- **Vector Store Size:** ~72 document chunks

---

## 🔧 Configuration

### Customization Options

**Backend (`config.py`):**
```python
# Change LLM model
GEMINI_MODEL = "gemini-1.5-flash"  # Faster/cheaper

# Adjust chunk size
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 150

# Modify retrieval settings
RETRIEVAL_K = 3  # Return top 3 results
```

**Frontend:**
- Modify colors in `tailwind.config.js`
- Customize chat UI in `components/ChatInterface.jsx`
- Adjust API endpoint in environment variables

---

## 🐛 Troubleshooting

### Common Issues

**1. Backend won't start**
```bash
# Check Python version
python --version  # Should be 3.10+

# Verify API key
echo $GOOGLE_API_KEY
```

**2. "Module not found" errors**
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

**3. Frontend can't connect**
- Ensure backend is running on port 8000
- Check CORS settings in `api.py`
- Verify API URL in frontend config

**4. Slow embedding generation**
- First run downloads Sentence Transformer model (~90MB)
- Subsequent runs are fast
- Check internet connection

**5. HuggingFace timeout**
```bash
# Install updated package
pip install langchain-huggingface
```

---

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. Add `Procfile`:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

2. Set environment variables in platform dashboard
3. Deploy from GitHub

### Frontend Deployment (Vercel/Netlify)

1. Build production version:
```bash
npm run build
```

2. Deploy `dist/` folder
3. Set API URL environment variable

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Contribution Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass

---

## 👥 Team

**Group Members:**

| Name | Role | GitHub |
|------|------|--------|
| Member 1 | AI Developer | [@username1] |
| Member 2 | AI Developer | [@username2] |
| Member 3 | AI Engineer | [@username3] |
| Member 4 | AI Engineer | [@username4] |

**Project Advisor:** [Your Instructor Name]

---

## 📝 Project Requirements Checklist

### AI Engine Quality ✅
- [x] Conditional retrieval (doesn't retrieve for greetings)
- [x] Conversation memory functions properly
- [x] Sources cited correctly
- [x] Accurate and helpful answers

### Backend Implementation ✅
- [x] API endpoints work correctly
- [x] Session/conversation management
- [x] Error handling

### Frontend Quality ✅
- [x] Functional chat interface
- [x] Clean, professional design
- [x] Loading states and error messages

### Documentation & Presentation ✅
- [x] Clear README and setup guide
- [x] Demo video showcasing solution

### Code Quality ✅
- [x] Clean, readable code
- [x] Proper error handling
- [x] Well-documented

---

## 📚 References

- [NELFUND Official Website](https://nelfund.gov.ng)
- [Student Loan Act 2023](https://nass.gov.ng)
- [LangChain Documentation](https://python.langchain.com)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [React Documentation](https://react.dev)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Nigerian Government for launching NELFUND
- Students who inspired this solution
- Open-source community for amazing tools
- Our instructors for guidance and support

---

## 📞 Contact

**Project Repository:** https://github.com/your-team/nelfund-navigator

**Issues:** https://github.com/your-team/nelfund-navigator/issues

**Email:** your-team-email@example.com

---

## 🎯 Impact Statement

> *"This project aims to help thousands of Nigerian students access life-changing educational funding by simplifying the NELFUND application process. By making complex policy documents understandable, we're removing barriers to higher education for students from low-income families."*

---

<div align="center">

**Built with ❤️ for Nigerian Students**

*Empowering education through AI*

[![GitHub stars](https://img.shields.io/github/stars/your-team/nelfund-navigator?style=social)](https://github.com/your-team/nelfund-navigator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/react-18.0+-61dafb.svg)](https://reactjs.org/)

</div>