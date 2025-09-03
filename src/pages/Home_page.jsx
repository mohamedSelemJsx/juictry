import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Home_page = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#EED573] flex flex-col">
      {/* Hero / poster image */}
      <div className="w-full flex justify-center pt-12">
        <img
          src={logo}
          alt="JUICETRY — the fresh juice lab"
          className="w-[320px] sm:w-[400px] md:w-[480px] lg:w-[550px] h-auto drop-shadow-md"
          draggable="false"
        />
      </div>

      {/* Center CTA */}
      <div className="flex-1 grid place-items-center">
        <button
          onClick={() => navigate("/categories")}
          className="relative inline-flex items-center justify-center
            rounded-full px-10 py-5
            bg-white text-[#3C4B59] font-semibold text-lg tracking-wide
            shadow-md ring-1 ring-[#E3C85C]
            transition-all
            hover:shadow-lg hover:-translate-y-1
            active:translate-y-0 active:shadow-sm
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3C4B59] focus:ring-offset-[#EED573]"
          aria-label="Go to categories"
        >
          <span className="mr-2 text-xl" aria-hidden>
            🧪
          </span>
          Browse Menu
        </button>
      </div>

      {/* Footer */}
      <footer className="pb-10 text-center text-xs sm:text-sm text-[#3C4B59]/80 leading-relaxed">
        جدة - حي الصفا، شارع عبد الرحمن الداخل ·{" "}
        <span className="font-medium">0557547500</span> · Juicetryjed@gmail.com
      </footer>
    </div>
  );
};

export default Home_page;
