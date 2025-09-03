import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackgroundLogo from "../components/BG_ChemistryPattern.jsx";

const API_URL = "/api/types";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        // normalize array to simple format
        const cats = json.map((c, i) => ({
          id: c.id ?? i,
          name: c.name ?? "Category",
          description:
            c.description ??
            "Fresh lab-crafted goodness. Tap to explore items.",
        }));
        setCategories(cats);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-[#EED573]">
      <BackgroundLogo/>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-[#3C4B59]">Categories</h1>
          <Link
            to="/"
            className="rounded-full px-5 py-2 bg-white/90 ring-1 ring-[#E3C85C] text-[#3C4B59] font-medium hover:-translate-y-0.5 transition-all shadow-sm"
          >
            ← Home
          </Link>
        </div>

        {/* Content */}
        <div className="mt-8 space-y-4">
          {loading && <SkeletonList />}

          {!loading && categories.length === 0 && (
            <div className="rounded-xl bg-white/90 ring-1 ring-[#E3C85C] p-4 text-[#3C4B59]">
              No categories available yet.
            </div>
          )}

          {!loading &&
            categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                onClick={() => navigate(`/categories/${cat.id}`)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ cat, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-white/95 ring-1 ring-[#E3C85C] rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-center gap-4 p-4">
        {/* Icon */}
        <div className="shrink-0 h-14 w-14 rounded-xl bg-[#EED573] grid place-items-center ring-1 ring-[#E3C85C]">
          <span className="text-2xl" aria-hidden>
            🧃
          </span>
        </div>

        {/* Text */}
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-[#3C4B59] truncate">
            {cat.name}
          </h2>
          <p className="text-sm text-[#3C4B59]/70 line-clamp-2">
            {cat.description}
          </p>
        </div>
      </div>
    </button>
  );
}

function SkeletonList() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-full bg-white/70 ring-1 ring-[#E3C85C]/60 rounded-2xl p-4 animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-[#EED573]/80" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-[#EED573]/80 rounded" />
              <div className="h-3 w-2/3 bg-[#EED573]/70 rounded" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
