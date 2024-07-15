"use client";
import { useEffect, useState, useRef  } from "react";
import Image from "next/image";


import donwload from "../../public/download.png";
import upload from "../../public/upload.png";
import neww from "../../public/new.png";

import { modeStore } from "../store/mode";
import { imageStore } from "../store/image";
import { prStore } from "../store/processed";
import { morphStore } from "../store/morphOp";

import ProgressBar from "@badrap/bar-of-progress";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const mode = modeStore((state) => state.mode);
  const updateMode = modeStore((state) => state.updateMode);
  const imagePath = imageStore((state) => state.imagePath.path);
  const processedImagePa = prStore((state) => state.pr.path);
  const updatePath = imageStore((state) => state.updatePath);
  const updatePr = prStore((state) => state.updatePr);

  const morphOp = morphStore((state) => state.morphOp);
  const updateMorphOp = morphStore((state) => state.updateMorphOp);
  const processedImageRef = useRef(null);

  const progressBar = new ProgressBar({
    size: 4,
    color: "#FF3544",
    className: "z-50",
    delay: 100,
  });
  useEffect(() => {
    // Scroll to the processed image when the path is updated
    if (processedImagePa) {
      processedImageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [processedImagePa]);
  useEffect(() => {
    // Rerender when new imagePath
    console.log("Image path updated:", imagePath);
    console.log("Processed path updated:", processedImagePa);

    
  }, [imagePath, processedImagePa, morphOp.name, processedImagePa]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    updatePr(null);
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
    setProgress(0);
    progressBar.start();
    if (processedImagePa) {
      try {
        const response = await fetch(processedImagePa);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "processed_image.jpg"); // Specify the file name here
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the object URL
        URL.revokeObjectURL(url);
        progressBar.finish();
      } catch (error) {
        console.error("Failed to download image:", error);
        progressBar.finish();
      }
    }
  };

  const handleUploadButton = async (event) => {
    updatePr(null);

    const file = event.target.files[0];
    setProgress(0);
    progressBar.start();
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
        console.log("Uploaded image:", uploadedImagePath);
        progressBar.finish();
      } catch (error) {
        console.error("Error uploading image:", error);
        progressBar.finish();
      }
    }
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleNewClick = () => {
    window.location.reload();
  };

  return (
    <main
      className={`flex min-h-screen flex-col font-rubik px-[104px] gap-[32px] min-w-[45%]  py-12 items-center ${
        imagePath ? " w-fit mx-auto" : "w-full"
      }`}
    >
      <div className="flex flex-col gap-4 w-full justify-between">
        <div className="text-white flex justify-between items-center w-full">
          <p className="text-[24px] font-semibold">Upload your image</p>
          <div className="flex gap-2">
        
          {selectedImage && (  <div
            onClick={imagePath ? handleUploadClick : null}
            className=" hover:bg-[#3549FF] hover:border-[#3549FF] gap-2 text-[16px] font-semibold bg-[#1E1E38] border border-[#8E8E9B] opacity-90 flex items-center justify-center py-[8px] px-[16px] rounded-lg cursor-pointer"
          >
            <Image src={neww} alt="New" width={20} height={20} />
            <p>New entry</p>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleUploadButton}
            />
            
          </div>)}
          {!selectedImage && (<div
            onClick={ handleUploadClick}
            className="hover:bg-[#1E1E38] gap-2 text-[16px] font-semibold bg-[#3549FF] opacity-90 flex items-center justify-center py-[8px] px-[16px] rounded-lg cursor-pointer"
          >
            <Image src={upload} alt="Upload" width={20} height={20} />
            <p>Upload</p>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleUploadButton}
            />
          </div>)}
          
        </div></div>

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
                <span className="font-semibold">Click to upload</span> or drag
                and drop
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
              width={0}
              height={0}
              sizes="100vw"
              className="rounded-lg h-[70vh] w-auto"
            />
          </div>
        )}
      </div>

      <hr class="w-full h-1 mx-auto  bg-gray-100 border-0 rounded  dark:bg-gray-700" />
      <div className="flex flex-col gap-4 w-full justify-between">
        <div className="text-white flex justify-between items-center font-semibold">
          <p
            className={`text-[24px] font-semibold ${
              mode.name && processedImagePa
                ? `text-white`
                : `text-white opacity-50`
            }`}
          >
            Processed Image{" "}
          </p>

          <div
            onClick={mode.name && processedImagePa ? handleDownload : null}
            className={` text-[16px] font-semibold  flex items-center justify-center py-[8px] px-[16px] rounded-lg cursor-pointer gap-2 ${
              mode.name && processedImagePa
                ? `bg-[#3549FF] opacity-90 hover:bg-[#1E1E38]`
                : `bg-[#3549FF] opacity-50 cursor-not-allowed`
            }`}
          >
            <Image src={donwload} alt="Download" width={24} height={24} />
            <p>Download</p>
          </div>
        </div>

        {processedImagePa && (
          <div className="flex justify-center mt-4">
            <Image
              ref={processedImageRef}
              src={processedImagePa}
              alt="Processed Image"
              width={0}
              height={0}
              sizes="100vw"
              className="rounded-lg h-[70vh] w-auto"
            />
          </div>
        )}
      </div>
    </main>
  );
}
