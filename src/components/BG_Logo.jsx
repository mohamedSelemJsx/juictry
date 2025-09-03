import React from "react";
import logo from "../assets/logo.png";

export default function BackgroundLogo() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10 ">
      <img
        src={logo}
        alt="Background Logo"
        className="w-[80%] max-w-3xl object-contain"
        draggable="false"
      />
    </div>
  );
}
