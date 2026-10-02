# PySmith 🛠️

A lightweight, open-source Low-Code Platform MVP. It serves as a Python-powered alternative to platforms like Appsmith, allowing developers to build internal tools and dashboards quickly with a drag-and-drop interface and reactive JavaScript evaluation.

## Key Features

* **Drag-and-Drop Canvas:** Build UIs instantly using an absolute-positioned grid layout.
* **Reactive JS Evaluation Engine:** Safely execute dynamic JavaScript bindings inside `{{ }}` using an isolated, sandboxed Web Worker. 
* **CORS-Bypassing Proxy:** Securely fetch external API data via the FastAPI backend proxy without triggering browser CORS restrictions.
* **Global State Management:** Seamless state synchronization and dynamic property updates powered by Zustand.

## Tech Stack

* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Zustand, react-grid-layout.
* **Backend:** Python 3.11+, FastAPI, Uvicorn, SQLite (SQLAlchemy), httpx.

## Getting Started

### 1. Run the Backend
Navigate to the backend directory, activate the virtual environment, and start the FastAPI server:

```powershell
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

2. Run the Frontend
Open a new terminal, navigate to the frontend directory, and start the Vite development server:

```powershell
cd frontend
npm install
npm run dev
```
