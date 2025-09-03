import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home_page from "./pages/Home_page.jsx";
import Categories from "./pages/Category.jsx";
import CategoryItems from "./pages/Category_Items.jsx";
import "./index.css";
import MenuPage from "./pages/menu.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/Categories" element={<Categories/>} />
        <Route path="/categories/:id" element={<CategoryItems />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
