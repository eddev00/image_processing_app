# Image Processing Web Application

This project is an advanced image processing web application that allows users to upload images and apply various image processing techniques, including morphological operations, edge detection, and skeletonization. The application provides an intuitive interface for users to select and configure different image processing modes and view the results in real-time.

## Features

### Image Upload
- **Drag and Drop**: Users can drag and drop images to upload them to the application.
- **File Upload**: Users can select images from their local filesystem to upload.
- **Automatic Upload**: The application automatically uploads the image once it is selected.

### Image Processing Modes

#### Morphological Operations
- **Erosion**: Removes small-scale details from the foreground of the image.
- **Dilation**: Adds pixels to the boundaries of objects in an image.
- **Opening**: Erosion(Dilation).
- **Closing**: Dilation(Erosion).

##### Configurable Parameters
- **Kernel Size**: Define the size of the structuring element.
- **Kernel Shape**: Choose from rectangular, elliptical, or cross-shaped kernels.
- **Iterations**: Specify the number of times the operation should be applied.

#### Edge Detection
- **Gaussian Blur**: Apply Gaussian blur to smooth the image.
- **Sobel Operator**: Detect edges using the Sobel operator.

##### Configurable Parameters
- **Kernel Size**: Define the size of the Gaussian kernel.
- **Sigma**: Standard deviation for Gaussian kernel.
- **Low Threshold**: Lower bound for hysteresis thresholding.
- **High Threshold**: Upper bound for hysteresis thresholding.

#### Skeletonization
- **Skeletonization**: Reduce binary objects in the image to their skeletal form.

##### Configurable Parameters
- **Threshold**: Define the threshold value for binary thresholding.

### User Interface
- **Sidebar Navigation**: A fixed sidebar with options for selecting different image processing modes.
- **Parameter Inputs**: Interactive input fields for configuring parameters specific to each mode.
- **Real-Time Processing**: Immediate feedback on image processing results.
- **Download Processed Image**: Users can download the processed image after the operation is complete.

### Backend API
- **FastAPI**: The backend is powered by FastAPI, a modern, fast (high-performance) web framework for building APIs with Python.
- **Endpoints**:
  - `/upload/`: Handle image uploads.
  - `/process/`: Process images based on the selected mode and parameters.
  - `/images/{filename}`: Retrieve the uploaded images.
  - `/processed/{filename}`: Retrieve the processed images.


## Technologies Used
- **Frontend**:
  - React with Next.js
  - Tailwind CSS for styling
  - Zustand for state management

- **Backend**:
  - FastAPI for building APIs
  - NumPy and OpenCV for image processing
  - Scikit-Image for skeletonization
  - PIL for image handling

## Setup and Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/image-processing-app.git
   cd image-processing-app

2. **Install Frontend Dependencies**:
   ```bash
    cd frontend
    npm install
3. **Install Backend Dependencies**:
   ```bash
      cd backend
      python -m venv venv
      source venv/bin/activate  # On Windows: venv\Scripts\activate
      pip install -r requirements.txt

4. **Run the Backend Server**:
   ```bash
          cd backend
          uvicorn main:app --reload

5. **Run the Frontend Server**:
   ```bash
     cd frontend
     npm run dev


   
