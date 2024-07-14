"use client";
import { useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import logo from "../../public/logo.png";
import icon1 from "../../public/picture-in-picture-off.png";
import icon2 from "../../public/triangle-square-circle.png";
import icon3 from "../../public/fish-bone.png";
import arrowdown from "../../public/Vector-1.png";
import arrowup from "../../public/Vector.png";
import { modeStore } from "../store/mode";
import { imageStore } from "../store/image";
import { prStore } from "../store/processed";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const mode = modeStore((state) => state.mode);
  const updateMode = modeStore((state) => state.updateMode);
  const imagePath = imageStore((state) => state.imagePath.path);
  const processedImagePa = prStore((state) => state.pr.path);
  const updatePath = imageStore((state) => state.updatePath);
  const updatePr = prStore((state) => state.updatePr);

  const handleModeChange = (newMode, newSettings) => {
    updateMode(newMode, newSettings);

    console.log("Mode changed to", mode.name);
    console.log("Settings changed to", mode.settings);
  };

  const toggleMenu = (menu) => {
    if (openMenu === menu) {
      setOpenMenu(null);
    } else {
      setOpenMenu(menu);
    }
  };
  const handleProcessClick = async () => {
    if (imagePath) {
      const filename = imagePath.split('/').pop();

      try {
        const response = await fetch("http://localhost:8000/process/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filename: filename, mode: mode.name }),
        });

        if (!response.ok) {
          throw new Error("Error processing image");
        }

        const data = await response.json();
        const processedImagePath = `http://localhost:8000/processed/${data.processed_filename}`;
        
        updatePr(processedImagePath);
        console.log("Processed image:", processedImagePa);
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }
  };
  

  useEffect(() => {}, [mode.name, mode.settings]);

  return (
    <div className="text-white max-w-72 xl:min-w-72 bg-secondary pl-[24px]  pr-[16px] py-6  ">
      <div className="sticky">
        <Image src={logo} alt="logo" className="ml-[16px] mb-14 " />
        {/*}
      <div>
        Active mode: {mode.name}
        Active settings: {mode.settings}
      </div>*/}

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
                onClick={handleProcessClick}
                className=" mt-4 text-[14px] font-semibold bg-[#FF3544] opacity-90 flex items-center justify-center py-[8px]  rounded-lg cursor-pointer"
              >
                <p>Upscale</p>
              </div>
            </div>
          )}
        </div>
        <div className="mb-2 py-[12px] px-[16px] rounded-[10px] flex flex-col font-rubik font-medium text-[16px] button w-full bg-[#222143] gap-[16px] ">
          <div
            className="rounded-[10px] flex items-center w-full gap-[16px] cursor-pointer"
            onClick={() => {
              handleModeChange("Edge", "");
              toggleMenu("Edge");
            }}
          >
            <Image src={icon1} alt="logo" />
            <p>Edge detection</p>
            <Image
              src={openMenu === "Upscale" ? arrowup : arrowdown}
              className="ml-auto"
              alt="arrow"
            />
          </div>
          {openMenu === "Edge" && (
            <div>
            <div className="grid grid-cols-2 gap-2">
              <div
                className="text-center bg-[#393957] p-2 rounded-[8px] cursor-pointer text-[14px] font-normal"
                onClick={() => handleModeChange("Edge", "X2")}
              >
                X2
              </div>
              <div
                className="text-center bg-[#393957] p-2 rounded-[8px] cursor-pointer text-[14px] font-normal"
                onClick={() => handleModeChange("Edge", "X4")}
              >
                X4
              </div>
              
            </div>
            <div
                onClick={handleProcessClick}
                className=" mt-4 text-[14px] font-semibold bg-[#FF3544] opacity-90 flex items-center justify-center py-[8px]  rounded-lg cursor-pointer"
              >
                <p>Process Image</p>
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
            <div className="pl-[40px]">
              <p>Option 1</p>
              <p>Option 2</p>
            </div>
          )}
        </div>

        <div
          className="mb-2 py-[12px] px-[16px] rounded-[10px] flex flex-col font-rubik font-medium text-[16px] button w-full bg-[#222143] gap-[16px]"
          onClick={() => {
            handleModeChange("Skeletonize", { exampleKey: "skeletonizeValue" });
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
            <div className="pl-[40px]">
              <p>Option 1</p>
              <p>Option 2</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
