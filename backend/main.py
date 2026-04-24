import os
import datetime
import shutil
import uuid
import json
import time
from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import Column, String, Integer, DateTime, JSON, Text, create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

# Load credentials
load_dotenv()

# --- CIPHERS INFINITE CLOUD SYNC ---
POSSIBLE_URLS = [
    "postgresql://postgres.uobwibltjkozkukrizps:9844105815@db.uobwibltjkozkukrizps.supabase.co:5432/postgres?sslmode=require",
    "postgresql://postgres.uobwibltjkozkukrizps:9844105815@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require",
    "postgresql://postgres:9844105815@3.111.105.85:6543/postgres?options=-c%20project=uobwibltjkozkukrizps&sslmode=require",
    "postgresql://postgres:9844105815@db.uobwibltjkozkukrizps.supabase.co:6543/postgres?sslmode=require",
    "sqlite:///./backend/ciphers_vault.db"
]

engine = None
for url in POSSIBLE_URLS:
    try:
        temp_engine = create_engine(url, connect_timeout=5)
        with temp_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            engine = temp_engine
            break
    except Exception: continue

if not engine:
    engine = create_engine("sqlite:///./backend/ciphers_vault.db")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    citizen_name = Column(String)
    citizen_email = Column(String)
    title = Column(String)
    description = Column(Text)
    category = Column(String)
    authority_assigned = Column(String)
    priority = Column(String)
    location = Column(String)
    user_id = Column(String)
    media_paths = Column(JSON)
    status = Column(String, default="Pending")
    updates = Column(JSON, default=[])
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ciphers Core Protocol", version="7.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
UPLOAD_DIR = os.path.join(BASE_DIR, "backend", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="frontend")
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@app.get("/")
async def root():
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/static/select.html")

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        ext = file.filename.split(".")[-1]
        name = f"{uuid.uuid4()}.{ext}"
        path = os.path.join(UPLOAD_DIR, name)
        with open(path, "wb") as buf: shutil.copyfileobj(file.file, buf)
        return {"status": "uploaded", "file_path": f"/uploads/{name}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/complaints")
async def create_complaint(
    citizen_name: str = Form(...), citizen_email: str = Form(...),
    title: str = Form(...), description: str = Form(...),
    category: str = Form(...), priority: str = Form(...),
    location: str = Form(...), user_id: str = Form(...),
    media_paths: Optional[str] = Form(None), db: Session = Depends(get_db)
):
    authority_map = {"Roads": "Infrastructure Node", "Sanitation": "Health Node", "Lighting": "Energy Node", "Parks": "Environment Node", "Water": "Resource Node", "Other": "Admin Node"}
    assigned_node = authority_map.get(category, "Admin Node")
    parsed_media = json.loads(media_paths) if media_paths else []

    new_complaint = Complaint(
        citizen_name=citizen_name, citizen_email=citizen_email, title=title,
        description=description, category=category, authority_assigned=assigned_node,
        priority=priority, location=location, user_id=user_id, media_paths=parsed_media
    )
    try:
        db.add(new_complaint)
        db.commit()
        db.refresh(new_complaint)
        return {"status": "synchronized", "id": new_complaint.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/complaints")
async def list_complaints(role: str, user_id: str, node: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Complaint)
    if role == "citizen": query = query.filter(Complaint.user_id == user_id)
    elif role == "authority" and node: query = query.filter(Complaint.authority_assigned == node)
    return query.order_by(Complaint.created_at.desc()).all()

@app.post("/api/complaints/{complaint_id}/status")
async def update_complaint_status(
    complaint_id: str,
    status: str = Form(...),
    update_text: str = Form(...),
    authority_name: str = Form(...),
    proof_path: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint Node Not Found")
    
    new_update = {
        "id": str(uuid.uuid4()),
        "time": datetime.datetime.utcnow().isoformat(),
        "text": update_text,
        "authority": authority_name,
        "proof_path": proof_path
    }
    
    current_updates = complaint.updates or []
    if isinstance(current_updates, str): current_updates = json.loads(current_updates)
    current_updates.append(new_update)
    
    complaint.status = status
    complaint.updates = current_updates
    
    try:
        db.commit()
        db.refresh(complaint)
        return {"status": "updated", "complaint_id": complaint_id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
