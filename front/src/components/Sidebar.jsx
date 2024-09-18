"use client";
import { useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import logo from "../../public/logo.png";
import icon1 from "../../public/picture-in-picture-off.png";
import icon2 from "../../public/triangle-square-circle.png";
import icon3 from "../../public/fish-bone.png";
import arrowdown from "../../public/arrow-down.svg";
import arrowup from "../../public/Vector.png";
import { modeStore } from "../store/mode";
import { imageStore } from "../store/image";
import { prStore } from "../store/processed";
import { morphStore } from "../store/morphOp";
import ProgressBar from "@badrap/bar-of-progress";
import Link from "next/link";

import github from "../../public/Octocat.svg";
import linkedin from "../../public/LinkedIn.svg";

import arrowupp from "../../public/arrow-up.svg";

import edge from "../../public/edge.png";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [kernelSize, setKernelSize] = useState(5);
  const [sigma, setSigma] = useState(1.0);
  const [lowThreshold, setLowThreshold] = useState(20);
  const [highThreshold, setHighThreshold] = useState(40);
  const [progress, setProgress] = useState(0);
  const [threshold, setThreshold] = useState(150); // New parameter for skeletonize

  const mode = modeStore((state) => state.mode);
  const updateMode = modeStore((state) => state.updateMode);
  const imagePath = imageStore((state) => state.imagePath.path);
  const processedImagePa = prStore((state) => state.pr.path);
  const updatePath = imageStore((state) => state.updatePath);
  const updatePr = prStore((state) => state.updatePr);

  const morphOp = morphStore((state) => state.morphOp);
  const updateMorphOp = morphStore((state) => state.updateMorphOp);
  const progressBar = new ProgressBar({
    size: 4,
    color: "#FF3544",
    className: "z-50",
    delay: 100,
  });

  const handleModeChange = (newMode, newSettings) => {
    updateMode(newMode, newSettings);
    ("Mode changed to", mode.name);
    ("Settings changed to", mode.settings);
  };

  const toggleMenu = (menu) => {
    if (openMenu === menu) {
      setOpenMenu(null);
    } else {
      setOpenMenu(menu);
    }
  };

  const handleProcessClick = async () => {
    setProgress(0);
    progressBar.start();
    if (imagePath && mode.name === "Upscale") {
    }
    if (imagePath && mode.name === "MorphOp") {
      const filename = imagePath.split("/").pop();
      const requestBody = {
        filename: filename,
        mode: mode.name,
        kernel_size: morphOp.settings.kernelSize,
        kernel_shape: morphOp.settings.kernelShape,
        morph_op: morphOp.name,
        iterations: morphOp.settings.iterations,
      };

      try {
        const response = await fetch("https://backend-imageprocessing.onrender.com/process/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error("Error processing image");
        }

        const data = await response.json();
        const processedImagePath = `https://backend-imageprocessing.onrender.com/processed/${data.processed_filename}`;

        updatePr(processedImagePath);
        ("Processed image:", processedImagePa);
        progressBar.finish();
      } catch (error) {
        console.error("Error processing image:", error);
        progressBar.finish();
      }
    }if (imagePath && mode.name === "Skeletonize") {
      const filename = imagePath.split("/").pop();
      const requestBody = {
        filename: filename,
        mode: mode.name,
        threshold: threshold, // Pass the threshold parameter
      };

      try {
        const response = await fetch("https://backend-imageprocessing.onrender.com/process/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error("Error processing image");
        }

        const data = await response.json();
        const processedImagePath = `https://backend-imageprocessing.onrender.com/processed/${data.processed_filename}`;

        updatePr(processedImagePath);
        ("Processed image:", processedImagePa);
        progressBar.finish();
      } catch (error) {
        console.error("Error processing image:", error);
        progressBar.finish();
      }
    }
    if (imagePath && mode.name === "Edge") {
      const filename = imagePath.split("/").pop();
      const requestBody = {
        filename: filename,
        mode: mode.name,
        kernel_size: kernelSize,
        sigma: sigma,
        low_threshold: lowThreshold,
        high_threshold: highThreshold,
      };

      try {
        const response = await fetch("https://backend-imageprocessing.onrender.com/process/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error("Error processing image");
        }

        const data = await response.json();
        const processedImagePath = `https://backend-imageprocessing.onrender.com/processed/${data.processed_filename}`;

        updatePr(processedImagePath);
        ("Processed image:", processedImagePa);
        progressBar.finish();
      } catch (error) {
        console.error("Error processing image:", error);
        progressBar.finish();
      }
    }
  };

  const handleDownload = () => {
    if (processedImagePa) {
      const link = document.createElement("a");
      link.href = processedImagePa;
      link.download = "processed_image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {}, [mode.name, mode.settings, morphOp, processedImagePa]);

  return (
    <div className="min-w-[300px] xl:w-[325px]">
    <div className="fixed h-full text-white min-w-[300px] xl:w-[325px] bg-secondary pl-[24px]  pr-[16px] py-6 flex-col  ">
      <div className=" h-full ">
        <Link href="/">
          {" "}
          <Image src={logo} alt="logo" className="ml-[16px] mb-14 " />
        </Link>

        <div className="mb-2 py-[12px] px-[16px] rounded-[10px] flex flex-col font-rubik font-medium text-[16px] button w-full bg-[#222143] gap-[16px] ">
          <div
            className="rounded-[10px] flex items-start w-full gap-[16px] cursor-pointer"
            onClick={() => {
              handleModeChange("MorphOp", {});
              toggleMenu("MorphOp");
            }}
          >
            <Image width={24} height={24}  src={icon1} alt="logo" />
            <p className=" text-[16px] font-medium">Morphological Operations</p>
            <Image  
              src={openMenu === "MorphOp" ? arrowupp : arrowdown}
              className="ml-auto self-start"
              alt="arrow"
              width={24} 
              height={24} 
            />
          </div>
          {openMenu === "MorphOp" && (
            <div className="flex flex-col gap-3 mt-5">
              <div className="flex justify-between items-center text-[14px] font-light">
                <p className="leading-0 inline opacity-70">Morph operation</p>
                <select
                  name="morphOp  "
                  onChange={(e) =>
                    updateMorphOp(e.target.value, { ...morphOp.settings })
                  }
                  className="inline leading-0 border-r-[5px] border-[#393957] mt-1 text-[16px]  text-left bg-[#393957] p-2 rounded-[8px] cursor-pointer"
                >
                  <option selected value=""> Select</option>
                  <option  value="erosion">Erosion</option>
                  <option value="dilation">Dilation</option>
                  <option value="opening">Opening</option>
                  <option value="closing">Closing</option>
                </select>
              </div>
              {morphOp.name && (
              <div className="flex justify-between items-center text-[14px] font-light">
                 <p className="leading-0 inline opacity-70">Kernel shape</p>

                  <select
                    name="shape"
                    onChange={(e) =>
                      updateMorphOp(morphOp.name, {
                        ...morphOp.settings,
                        kernelShape: e.target.value,
                      })
                    }
                    className="max-w-[104px] inline leading-0 border-r-[5px] border-[#393957] mt-1 text-[16px]  text-left bg-[#393957] p-2 rounded-[8px] cursor-pointer"
                  >
                    <option selected value="cross">
                      cross
                    </option>
                    <option value="rect">rectangle</option>
                    <option value="ellipse">ellipse</option>
                  </select>
                </div>
              )}
              {morphOp.name && morphOp.settings.kernelShape && (
                              <div className="flex justify-between items-center text-[14px] font-light">

                 <p className="leading-0 inline opacity-70">Kernel size</p>

                  <input
                    type="number"
                    defaultValue={morphOp.settings.kernelSize}
                    onChange={(e) =>
                      updateMorphOp(morphOp.name, {
                        ...morphOp.settings,
                        kernelSize: e.target.value,
                      })
                    }
                    className="max-w-[104px] inline leading-0 border-r-[5px] border-[#393957] mt-1 text-[16px]  text-left bg-[#393957] py-2 pl-3 pr-3 rounded-[8px] cursor-pointer"
                  />
                </div>
              )}

              <div
                onClick={morphOp && imagePath ? handleProcessClick : null}
                className={`mt-4 text-[14px] font-semibold flex items-center justify-center py-[8px] rounded-lg cursor-pointer ${
                  morphOp && imagePath
                    ? "bg-[#3549FF] opacity-90"
                    : "bg-[#3549FF] opacity-50 cursor-not-allowed"
                }`}
              >
                <p>Start {morphOp.name}</p>
              </div>
            </div>
          )}
        </div>
        <div className="mb-2 py-[12px] px-[16px] rounded-[10px] flex flex-col font-rubik font-medium text-[16px] button w-full bg-[#222143] gap-[16px] ">
          <div
            className="rounded-[10px] flex items-center w-full gap-[16px] cursor-pointer"
            onClick={() => {
              handleModeChange("Edge", {
                kernel_size: kernelSize,
                sigma: sigma,
                low_threshold: lowThreshold,
                high_threshold: highThreshold,
              });
              toggleMenu("Edge");
            }}
          >
            <Image src={edge} alt="logo" />
            <p>Edge detection</p>
            <Image
              src={openMenu === "Edge" ? arrowupp: arrowdown}
              className="ml-auto"
              alt="arrow"
              width={24}
              height={24}
            />
          </div>
          {openMenu === "Edge" && (
            <div>
              <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-[14px] font-light">

              <p className="leading-0 inline opacity-70">Kernel Size</p>

                  <input
                    type="number"
                    value={kernelSize}
                    onChange={(e) => setKernelSize(Number(e.target.value))}
                    className="max-w-[104px] inline leading-0 border-r-[5px] border-[#393957] mt-1 text-[16px]  text-left bg-[#393957] py-2 pl-3 pr-3 rounded-[8px] cursor-pointer"
                  />
                </div>
                <div className="flex justify-between items-center text-[14px] font-light">
                <p className="leading-0 inline opacity-70">Sigma </p>
                  <input
                    type="number"
                    value={sigma}
                    onChange={(e) => setSigma(Number(e.target.value))}
                    className="max-w-[104px] inline leading-0 border-r-[5px] border-[#393957] mt-1 text-[16px]  text-left bg-[#393957] py-2 pl-3 pr-3 rounded-[8px] cursor-pointer"
                  />
                </div>
                <div className="flex justify-between items-center text-[14px] font-light">
                <p className="leading-0 inline opacity-70">Low Threshold</p>
                  <input
                    type="number"
                    value={lowThreshold}
                    onChange={(e) => setLowThreshold(Number(e.target.value))}
                    className="max-w-[104px] inline leading-0 border-r-[5px] border-[#393957] mt-1 text-[16px]  text-left bg-[#393957] py-2 pl-3 pr-3 rounded-[8px] cursor-pointer"
                  />
                </div>
                <div className="flex justify-between items-center text-[14px] font-light">
                <p className="leading-0 inline opacity-70">High Threshold</p>
                  <input
                    type="number"
                    value={highThreshold}
                    onChange={(e) => setHighThreshold(Number(e.target.value))}
                    className="max-w-[104px] inline leading-0 border-r-[5px] border-[#393957] mt-1 text-[16px]  text-left bg-[#393957] py-2 pl-3 pr-3 rounded-[8px] cursor-pointer"
                  />
                </div>
              </div>
              <div
                onClick={imagePath ? handleProcessClick : null}
                className={`mt-4 text-[14px] font-semibold flex items-center justify-center py-[8px] rounded-lg cursor-pointer ${
                  imagePath
                    ? "bg-[#3549FF] opacity-90"
                    : "bg-[#3549FF] opacity-50 cursor-not-allowed"
                }`}
              >
                <p>Process Image</p>
              </div>
            </div>
          )}
        </div>

        

        <div
            className="mb-2 py-[12px] px-[16px] rounded-[10px] flex flex-col font-rubik font-medium text-[16px] button w-full bg-[#222143] gap-[16px]"
            onClick={() => {
              handleModeChange("Skeletonize", { threshold });
              toggleMenu("Skeletonize");
            }}
          >
            <div className="rounded-[10px] flex items-center w-full gap-[16px] cursor-pointer">
              <Image src={icon3} alt="logo" />
              <p>Skeletonize</p>
              <Image
                src={openMenu === "Skeletonize" ? arrowup : arrowdown}
                className="ml-auto"
                alt="arrow"
              />
            </div>
            {openMenu === "Skeletonize" && (
              <div className="flex flex-col gap-3 mt-5">
                <div className="flex justify-between items-center text-[14px] font-light">
                  <p className="leading-0 inline opacity-70">Threshold</p>
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="max-w-[104px] inline leading-0 border-r-[5px] border-[#393957] mt-1 text-[16px]  text-left bg-[#393957] py-2 pl-3 pr-3 rounded-[8px] cursor-pointer"
                  />
                </div>
                <div
                  onClick={imagePath ? handleProcessClick : null}
                  className={`mt-4 text-[14px] font-semibold flex items-center justify-center py-[8px] rounded-lg cursor-pointer ${
                    imagePath
                      ? "bg-[#3549FF] opacity-90"
                      : "bg-[#3549FF] opacity-50 cursor-not-allowed"
                  }`}
                >
                  <p>Start Skeletonize</p>
                </div>
              </div>
            )}
          </div>

        <div className="mb-2 py-[12px] px-[16px] rounded-[10px] flex flex-col font-rubik font-medium text-[16px] button w-full bg-[#222143] gap-[16px] ">
          <div
            className="rounded-[10px] flex items-center w-full gap-[16px] cursor-pointer"
            onClick={() => {
              handleModeChange("Upscale", "X2");
              toggleMenu("Upscale");
            }}
          >
            <Image src={icon1} alt="logo" />
            <p>Upscale</p>
            <Image
              src={openMenu === "Upscale" ? arrowup : arrowdown}
              className="ml-auto"
              alt="arrow"
            />
          </div>
          {openMenu === "Upscale" && (
            <div>
              <div className="grid grid-cols-2 gap-2">
                <div
                  className="text-center bg-[#393957] p-2 rounded-[8px] cursor-pointer text-[14px] font-normal"
                  onClick={() => handleModeChange("Upscale", "X2")}
                >
                  X2
                </div>
                <div
                  className="text-center bg-[#393957] p-2 rounded-[8px] cursor-pointer text-[14px] font-normal"
                  onClick={() => handleModeChange("Upscale", "X4")}
                >
                  X4
                </div>
              </div>
              <div
                className={`mt-4 text-[14px] font-semibold flex items-center justify-center py-[8px] rounded-lg cursor-pointer bg-[#FF3544] opacity-50 cursor-not-allowed'}`}
              >
                <p>Unavailable now</p>
              </div>
            </div>
          )}
        </div>
        <div
          className="mb-2 py-[12px] px-[16px] rounded-[10px] flex flex-col font-rubik font-medium text-[16px] button w-full bg-[#222143] gap-[16px]"
          onClick={() => {
            handleModeChange("Segmentation", {
              exampleKey: "segmentationValue",
            });
            toggleMenu("Segmentation");
          }}
        >
          <div className="rounded-[10px] flex items-center w-full gap-[16px] cursor-pointer">
            <Image src={icon2} alt="logo" />
            <p>Segmentation</p>
            <Image
              src={openMenu === "Segmentation" ? arrowup : arrowdown}
              className="ml-auto"
              alt="arrow"
            />
          </div>
          {openMenu === "Segmentation" && (
            <div className="">
              <div
                className={`mt-4 text-[14px] font-semibold flex items-center justify-center py-[8px] rounded-lg cursor-pointer bg-[#FF3544] opacity-50 cursor-not-allowed'}`}
              >
                <p>Unavailable now</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-10  items-center justify-between fixed bottom-5">
          <div className=" font-semibold text-[18px]">Connect with me</div>
          <div className="flex">
          <Link href="https://github.com/eddev00">
               <Image src={github} alt="logo"  width={40} height={40}/>
          </Link>
          <Link href="https://www.linkedin.com/in/mohamed-baarar/">
               <Image src={linkedin} alt="logo"  width={40} height={40}/>
          </Link>
        </div></div>
        
      </div>
      
    </div></div>
  );
};

export default Sidebar;
