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

## 📊 Performance

- **Average Response Time:** < 2 seconds
- **Document Retrieval:** 5 most relevant chunks
- **Embedding Generation:** Local (no API costs)
- **Concurrent Users:** Supports multiple sessions
- **Vector Store Size:** ~72 document chunks

---

## 👥 Team

**Group Members:**

| Name | Role |
|------|------|
| Micheal Osisami | AI Engineer |
| Lukman Ibrahim | AI Developer |
| Samuel Oyedoyin | AI Developer |
| Opeyemi Odejimi| AI Engineer |

**Project Advisor:** [Mr. Badru]

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

This project is licensed under the MIT License 

---

## 🙏 Acknowledgments

- Nigerian Government for launching NELFUND
- Students who inspired this solution
- Open-source community for amazing tools
- Our instructors for guidance and support

---

## 📞 Contact

**Project Repository:** https://github.com/your-team/nelfund-navigator

**Email:** osisamimichael@gmail.com

---

## 🎯 Impact Statement

> *"This project aims to help thousands of Nigerian students access life-changing educational funding by simplifying the NELFUND application process. By making complex policy documents understandable, we're removing barriers to higher education for students from low-income families."*

---

<div align="center">

**Built for Nigerian Students**

*Empowering education through AI*

[![GitHub stars](https://github.com/Osisami00/Nelfund-Project.git)](https://github.com/Osisami00/Nelfund-Project.git)

</div>