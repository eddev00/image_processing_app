"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import { modeStore } from "../store/mode";
import { imageStore } from "../store/image";
import { prStore } from "../store/processed";
export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);

 
  const mode = modeStore((state) => state.mode);
  const imagePath = imageStore((state) => state.imagePath.path);
  const processedImagePa = prStore((state) => state.pr.path);
  const updatePath = imageStore((state) => state.updatePath);
  const updatePr = prStore((state) => state.updatePr);

  useEffect(() => {
    // Rerender when new imagePath
    console.log("Image path updated:", imagePath);
  }
  , [imagePath, processedImagePa]);


  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Automatically submit the file after it's selected
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:8000/upload/", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        const uploadedImagePath = `http://localhost:8000/images/${data.filename}`;
        
        updatePath(uploadedImagePath);
        console.log("Uploaded image:", imagePath);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleDownload = async () => {
    if (processedImagePa) {
      try {
        const response = await fetch(processedImagePa);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
  
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'processed_image.jpg'); // Specify the file name here
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        // Clean up the object URL
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to download image:', error);
      }
    }
  };
  

  const handleNewEntryClick = () => {
    window.location.reload();
  };

  return (
    <main className="flex min-h-screen flex-col font-rubik w-full px-9 gap-[32px] py-20">
      <div className="text-white flex justify-between items-center">
        <p className="text-[24px] font-semibold">Upload your image</p>
        <div
          onClick={handleNewEntryClick}
          className="text-[16px] font-semibold bg-[#3549FF] opacity-90 flex items-center justify-center py-[8px] px-[80px] rounded-lg cursor-pointer"
        >
          <p>New Entry</p>
        </div>
      </div>

      {!selectedImage && (
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-[#13122D]-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      )}
   

      {imagePath && (
        <div className="flex justify-center mt-4">
          <Image
            src={imagePath}
            alt="Uploaded Image"
            width={400}
            height={200}
            className="rounded-lg"
          />
        </div>
      )}

     

      {mode.name && (
        <div className="text-white flex justify-between items-center">
          <p className="text-[24px] font-semibold">{mode.name}</p>
          
          <div
            onClick={handleDownload}
            className="text-[16px] font-semibold bg-[#3549FF] opacity-90 flex items-center justify-center py-[8px] px-[80px] rounded-lg cursor-pointer"
          >
            <p>Download</p>
          </div>
        </div>
      )}
      
      
       {processedImagePa && (
        <div className="flex justify-center mt-4">
          <Image
            src={processedImagePa}
            alt="Processed Image"
            width={400}
            height={200}
            className="rounded-lg"
          />
        </div>
      )}
    </main>
  );
}
