from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from random import randint
import uuid
from shutil import copyfile

from pydantic import BaseModel

class ProcessImageRequest(BaseModel):
    filename: str

IMAGEDIR = "images/"
PROCESSEDDIR = "processed/"

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",  # React app origin
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

    # Save the file
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

    # For now, just copy the file to the processed directory
    copyfile(original_path, processed_path)

    return {"processed_filename": request.filename}

@app.get("/processed/{filename}")
async def get_processed_image(filename: str):
    file_path = os.path.join(PROCESSEDDIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)
