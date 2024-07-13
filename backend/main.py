from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from shutil import copyfile
import uuid
from pydantic import BaseModel
from edge_detection import process_edge_detection

class ProcessImageRequest(BaseModel):
    filename: str
    mode: str

IMAGEDIR = "images/"
PROCESSEDDIR = "processed/"

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.path.exists(IMAGEDIR):
    os.makedirs(IMAGEDIR)

if not os.path.exists(PROCESSEDDIR):
    os.makedirs(PROCESSEDDIR)

@app.post("/upload/")
async def create_upload_file(file: UploadFile = File(...)):
    file.filename = f"{uuid.uuid4()}.jpg"
    contents = await file.read()

    with open(f"{IMAGEDIR}{file.filename}", "wb") as f:
        f.write(contents)

    return {"filename": file.filename}

@app.get("/images/{filename}")
async def get_image(filename: str):
    file_path = os.path.join(IMAGEDIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

@app.post("/process/")
async def process_image(request: ProcessImageRequest):
    original_path = os.path.join(IMAGEDIR, request.filename)
    processed_path = os.path.join(PROCESSEDDIR, request.filename)

    if not os.path.exists(original_path):
        raise HTTPException(status_code=404, detail="Original file not found")

    if request.mode == 'Edge':
        processed_path = os.path.join(PROCESSEDDIR, f"edge_{request.filename}")
        processed_image_path = process_edge_detection(original_path, processed_path)
        print(f"Edge-detected image saved at: {processed_image_path}")
    else:
        # For now, just copy the file to the processed directory for other modes
        print(f"Copying {original_path} to {processed_path}")
        copyfile(original_path, processed_path)

    return {"processed_filename": os.path.basename(processed_path)}

@app.get("/processed/{filename}")
async def get_processed_image(filename: str):
    file_path = os.path.join(PROCESSEDDIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)
