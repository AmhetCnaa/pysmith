from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
import httpx
import json
from typing import Optional, Dict, Any

app = FastAPI(title="LowCode MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SQLALCHEMY_DATABASE_URL = "sqlite:///./lowcode.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class AppModel(Base):
    __tablename__ = "apps"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    dsl_json = Column(Text, default="{}")

class PageModel(Base):
    __tablename__ = "pages"
    id = Column(Integer, primary_key=True, index=True)
    app_id = Column(Integer, index=True)
    name = Column(String)
    dsl_json = Column(Text, default="{}")

class ActionModel(Base):
    __tablename__ = "actions"
    id = Column(Integer, primary_key=True, index=True)
    app_id = Column(Integer, index=True)
    name = Column(String)
    config_json = Column(Text, default="{}")

Base.metadata.create_all(bind=engine)

class AppCreate(BaseModel):
    name: str
    dsl_json: Optional[str] = "{}"

class ProxyRequest(BaseModel):
    url: str
    method: str = "GET"
    headers: Optional[Dict[str, str]] = None
    body: Optional[Any] = None

@app.post("/api/v1/apps")
def create_app(app_data: AppCreate):
    db = SessionLocal()
    try:
        db_app = AppModel(name=app_data.name, dsl_json=app_data.dsl_json)
        db.add(db_app)
        db.commit()
        db.refresh(db_app)
        return db_app
    finally:
        db.close()

@app.get("/api/v1/apps/{app_id}")
def get_app(app_id: int):
    db = SessionLocal()
    try:
        db_app = db.query(AppModel).filter(AppModel.id == app_id).first()
        if not db_app:
            raise HTTPException(status_code=404, detail="App not found")
        return db_app
    finally:
        db.close()

@app.put("/api/v1/apps/{app_id}")
def update_app(app_id: int, app_data: AppCreate):
    db = SessionLocal()
    try:
        db_app = db.query(AppModel).filter(AppModel.id == app_id).first()
        if not db_app:
            raise HTTPException(status_code=404, detail="App not found")
        db_app.name = app_data.name
        db_app.dsl_json = app_data.dsl_json
        db.commit()
        db.refresh(db_app)
        return db_app
    finally:
        db.close()

@app.post("/api/v1/proxy")
async def proxy_request(req: ProxyRequest):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                method=req.method,
                url=req.url,
                headers=req.headers,
                json=req.body if req.method in ["POST", "PUT", "PATCH"] else None
            )
            data = response.text
            try:
                data = response.json()
            except:
                pass
            return {
                "status": response.status_code,
                "headers": dict(response.headers),
                "data": data
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
