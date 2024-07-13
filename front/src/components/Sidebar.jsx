"use client";
import { useEffect, useState } from "react";
import React from 'react';
import Image from 'next/image';
import logo from "../../public/logo.png";
import icon1 from "../../public/picture-in-picture-off.png";
import icon2 from "../../public/triangle-square-circle.png";
import icon3 from "../../public/fish-bone.png";
import arrowdown from "../../public/Vector-1.png";
import arrowup from "../../public/Vector.png";

import { modeStore } from "../store/mode";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const mode = modeStore((state) => state.mode);
  const updateMode = modeStore((state) => state.updateMode);

  const handleModeChange = (newMode, newSettings) => {
    updateMode(newMode,newSettings);

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

  useEffect(() => {
    
  }, [mode.name, mode.settings]);

  return (
    <div className='text-white max-w-72 xl:w-72 bg-secondary pl-[24px]  pr-[16px] py-6  '>
      <div className="sticky">
      <Image src={logo} alt="logo" className='ml-[16px] mb-14 ' />
      {/*}
      <div>
        Active mode: {mode.name}
        Active settings: {mode.settings}
      </div>*/}

      <div
        className='mb-2 py-[12px] px-[16px] rounded-[10px] flex flex-col font-rubik font-medium text-[16px] button w-full bg-[#222143] gap-[16px] '
        
      >
        <div  className="rounded-[10px] flex items-center w-full gap-[16px] cursor-pointer"
        onClick={() => {
            handleModeChange("Upscale", "X2");
            toggleMenu("Upscale");
          }}>
          <Image src={icon1} alt="logo" />
          <p>Upscale</p>
          <Image src={openMenu === "Upscale" ? arrowup : arrowdown} className='ml-auto' alt="arrow" />
        </div>
        {openMenu === "Upscale" && (
          <div className='grid grid-cols-2 gap-2'>
            <div className="text-center bg-[#393957] p-2 rounded-[8px] cursor-pointer text-[14px] font-normal" onClick={() => handleModeChange("Upscale","X2")}>X2</div>
            <div className="text-center bg-[#393957] p-2 rounded-[8px] cursor-pointer text-[14px] font-normal" onClick={() => handleModeChange("Upscale","X4")}>X4</div>
            <div className="text-center bg-[#393957] p-2 rounded-[8px] cursor-pointer text-[14px] font-normal" onClick={() => handleModeChange("Upscale","X2")}>X2</div>
            <div className="text-center bg-[#393957] p-2 rounded-[8px] cursor-pointer text-[14px] font-normal" onClick={() => handleModeChange("Upscale","X4")}>X4</div>
          </div>
        )}
      </div>

      <div
        className='mb-2 py-[12px] px-[16px] rounded-[10px] flex flex-col font-rubik font-medium text-[16px] button w-full bg-[#222143] gap-[16px]'
        onClick={() => {
          handleModeChange("Segmentation", { exampleKey: "segmentationValue" });
          toggleMenu("Segmentation");
        }}
      >
        <div className="rounded-[10px] flex items-center w-full gap-[16px] cursor-pointer">
          <Image src={icon2} alt="logo" />
          <p>Segmentation</p>
          <Image src={openMenu === "Segmentation" ? arrowup : arrowdown} className='ml-auto' alt="arrow" />
        </div>
        {openMenu === "Segmentation" && (
          <div className='pl-[40px]'>
            <p>Option 1</p>
            <p>Option 2</p>
          </div>
        )}
      </div>

      <div
        className='mb-2 py-[12px] px-[16px] rounded-[10px] flex flex-col font-rubik font-medium text-[16px] button w-full bg-[#222143] gap-[16px]'
        onClick={() => {
          handleModeChange("Skeletonize", { exampleKey: "skeletonizeValue" });
          toggleMenu("Skeletonize");
        }}
      >
        <div className="rounded-[10px] flex items-center w-full gap-[16px] cursor-pointer">
          <Image src={icon3} alt="logo" />
          <p>Skeletonize</p>
          <Image src={openMenu === "Skeletonize" ? arrowup : arrowdown} className='ml-auto' alt="arrow" />
        </div>
        {openMenu === "Skeletonize" && (
          <div className='pl-[40px]'>
            <p>Option 1</p>
            <p>Option 2</p>
          </div>
        )}
      </div>
    </div></div>
  );
};

export default Sidebar;
