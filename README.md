# Justify.ai – AI Legal Assistant for Everyone

> An AI-powered platform that simplifies legal jargon, helping users understand complex Indian laws and legal documents in simple terms.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Issues](https://img.shields.io/github/issues/aryan9653/Justify.ai)
![Stars](https://img.shields.io/github/stars/aryan9653/Justify.ai)

---

## Overview

**Justify.ai** is designed to make legal information more accessible for citizens by breaking down complicated legal language into plain, understandable terms. Whether it’s an IPC section, a government notice, or a scanned legal document, Justify.ai provides clarity using AI.

It uses state-of-the-art language models, Retrieval-Augmented Generation (RAG), and OCR to interpret legal content, with support for multiple Indian languages.

---

## Features

- 🧠 **Simplify Legal Text** – Convert complex legal jargon into plain English or local languages.
- 📄 **Upload PDFs with OCR** – Extract and explain legal text from scanned documents.
- 🔍 **RAG-Based Q&A** – Ask legal questions, get answers backed by actual IPC, CrPC, and IT Act references.
- 🧾 **IPC Section Prediction** – Suggest legal sections based on user-submitted complaints.
- 🌐 **Multilingual Support** – Explanations in English, Hindi, Marathi, and more.
- 🔐 **Firebase Authentication** – User login, session management, and query history.

---

## 🧰 Tech Stack

| Layer        | Technology                                         |
|--------------|-----------------------------------------------------|
| **Frontend** | Next.js, TypeScript, Tailwind CSS, ShadCN UI       |
| **Backend**  | FastAPI, LangChain, Hugging Face Transformers      |
| **Database** | SQLite (local), FAISS (vector search)              |
| **Auth**     | Firebase Authentication                            |
| **AI Models**| Hugging Face LLMs, Sentence Transformers, Tesseract OCR |
| **Storage**  | Firebase Storage (for PDFs)                        |

---

## 🏗️ Project Structure

```bash
Justify.ai/
├── backend/
│   ├── main.py               # FastAPI backend
│   ├── langchain_pipeline.py # RAG + LLM logic
│   └── database/             # SQLite DB for query storage
├── frontend/
│   ├── pages/                # Next.js pages
│   ├── components/           # UI components (ShadCN)
│   └── public/               # Static files
├── ocr/
│   └── ocr_parser.py         # OCR with Tesseract
├── law-corpus/               # IPC, CrPC, IT Act legal docs
├── README.md
└── requirements.txt
