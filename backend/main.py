from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from shutil import copyfile
import uuid
from pydantic import BaseModel
from PIL import Image
import numpy as np
from morphOperations import create_kernel, erode_image, dilate_image, open_image, close_image
from edge_detection import process_edge_detection
from skelitonize import skeletonize_image

class ProcessImageRequest(BaseModel):
    filename: str
    mode: str
    kernel_size: int = 5
    kernel_shape: str = 'rect'
    iterations: int = 1
    sigma: float = 1.0
    low_threshold: int = 20
    high_threshold: int = 40
    morph_op: str = ''
    threshold: int = 128

IMAGEDIR = "images/"
PROCESSEDDIR = "processed/"

app = FastAPI()

origins = [
    "https://image-processing-webapp-4zxav3xk5-eddev00s-projects.vercel.app",
   
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

@app.get("/")
def home():
    return {"message": "Hello World"}

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
    unique_id = uuid.uuid4()
    processed_filename = f"{unique_id}_{request.filename}"
    processed_path = os.path.join(PROCESSEDDIR, processed_filename)

    if not os.path.exists(original_path):
        raise HTTPException(status_code=404, detail="Original file not found")

    if request.mode == 'Edge':
        processed_image_path = process_edge_detection(
            original_path,
            processed_path,
            request.kernel_size,
            request.sigma,
            request.low_threshold,
            request.high_threshold
        )
        print(f"Edge-detected image saved at: {processed_image_path}")
    elif request.mode == 'MorphOp':
        image = Image.open(original_path).convert('L')
        image = np.array(image)
        kernel = create_kernel(request.kernel_size, request.kernel_shape)

        if request.morph_op == 'erosion':
            processed_image = erode_image(image, kernel, request.iterations)
        elif request.morph_op == 'dilation':
            processed_image = dilate_image(image, kernel, request.iterations)
        elif request.morph_op == 'opening':
            processed_image = open_image(image, kernel, request.iterations)
        elif request.morph_op == 'closing':
            processed_image = close_image(image, kernel, request.iterations)
        else:
            raise HTTPException(status_code=400, detail="Invalid morphological operation")
        
        processed_image = Image.fromarray(processed_image)
        processed_image.save(processed_path)

    elif request.mode == 'Skeletonize':
        processed_image_path = skeletonize_image(
            original_path,
            processed_path,
            request.threshold
        )
        print(f"Skeletonized image saved at: {processed_image_path}")
    else:
        copyfile(original_path, processed_path)

    return {"processed_filename": os.path.basename(processed_path)}

@app.get("/processed/{filename}")
async def get_processed_image(filename: str):
    file_path = os.path.join(PROCESSEDDIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)
