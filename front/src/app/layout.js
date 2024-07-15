import { Inter } from "next/font/google";
import { Rubik } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });
const rubik = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "Image Processing App",
  description: "A web app for Image Processing Tasks: Morphological Operations, Image Segmentation, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex bg-primary ">
        <Sidebar />
        {children}
        </body>
    
    </html>
  );
}
