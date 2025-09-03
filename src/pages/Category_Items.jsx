import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import BackgroundLogo from "../components/BG_ChemistryPattern.jsx";

const API_BASE = "/api"; // keep your Vite proxy

export default function CategoryItems() {
  const { id } = useParams();
  const [search] = useSearchParams();
  const initialName = search.get("name") || "Category";

  const [catName, setCatName] = useState(initialName);
  const [catImage, setCatImage] = useState(null);
  const [items, setItems] = useState([]);
  const [state, setState] = useState("loading"); // loading | ready | empty | error
  const [q, setQ] = useState("");
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setState("loading");
        const res = await fetch(`${API_BASE}/types/by-id?id=${id}`, {
          signal: ac.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data?.name) setCatName(data.name);
        if (data?.image) setCatImage(data.image);

        const menus = Array.isArray(data?.menus) ? data.menus : [];
        const norm = menus.map((m, i) => ({
          id: m.id ?? i,
          title: m.name ?? "Item",
          price: m.price ?? null,
          image: m.image ?? null,
          description1: m.description1 ?? "",
          description2: m.description2 ?? "",
          rating: Number(m.rating ?? 4.5),
        }));
        setItems(norm);
        setState(norm.length ? "ready" : "empty");
      } catch (e) {
        if (e.name !== "AbortError") setState("error");
      }
    })();
    return () => ac.abort();
  }, [id]);

  const filtered = useMemo(() => {
    if (!q) return items;
    const s = q.toLowerCase();
    return items.filter(
      (it) =>
        it.title.toLowerCase().includes(s) ||
        it.description1.toLowerCase().includes(s) ||
        it.description2.toLowerCase().includes(s)
    );
  }, [items, q]);

  const toggleFav = (itemId) =>
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      next.has(itemId) ? next.delete(itemId) : next.add(itemId);
      return next;
    });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#EED573]">
      <BackgroundLogo />
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-10">
        {/* Gradient app bar */}
        <div className="sticky top-0 z-20 -mx-4 px-4 pt-6 pb-4 bg-gradient-to-b from-[#B45654] to-[#C3726E] text-white rounded-b-[28px] shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {catImage ? (
                <img
                  src={catImage}
                  alt={catName}
                  className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/30"
                />
              ) : null}
              <h1 className="text-xl sm:text-2xl font-semibold truncate">{catName}</h1>
            </div>
            <Link
              to="/categories"
              className="rounded-full px-4 py-2 bg-white/90 text-[#3C4B59] font-medium shadow-sm hover:translate-y-[1px] transition"
            >
              ← Categories
            </Link>
          </div>

          {/* Search */}
          <div className="mt-4">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search"
                className="w-full rounded-2xl bg-white/95 text-[#3C4B59] placeholder-white/60 px-4 py-3 pr-10 shadow-sm focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60">🔎</span>
            </div>
          </div>
        </div>

        {/* Content states */}
        {state === "loading" && <CardSkeletonGrid />}
        {state === "error" && (
          <div className="mt-6 rounded-2xl bg-white/90 ring-1 ring-red-200 p-4 text-red-700">
            Couldn’t load items. Please try again.
          </div>
        )}
        {state === "empty" && (
          <div className="mt-6 rounded-2xl bg-white/90 ring-1 ring-[#E3C85C] p-4 text-[#3C4B59]">
            No items in this category yet.
          </div>
        )}

        {state === "ready" && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it) => (
              <ProductCard
                key={it.id}
                item={it}
                isFav={favoriteIds.has(it.id)}
                onToggleFav={() => toggleFav(it.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** --- UI PARTS --- **/

function ProductCard({ item, isFav, onToggleFav }) {
  return (
    <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-b from-white to-white/95 ring-1 ring-[#E3C85C] shadow-md hover:shadow-lg transition">
      {/* big image */}
      <div className="relative">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-56 object-cover" />
        ) : (
          <div className="w-full h-56 bg-[#EED573] grid place-items-center text-4xl">🥤</div>
        )}

        {/* price tag */}
        {item.price != null && (
          <div className="absolute right-3 bottom-3">
            <PriceTag value={item.price} />
          </div>
        )}

        {/* heart */}
        <button
          type="button"
          onClick={onToggleFav}
          aria-label="favorite"
          className="absolute right-3 top-3 grid place-items-center h-10 w-10 rounded-full bg-white/95 ring-1 ring-black/5 shadow"
        >
          <span className={`text-xl ${isFav ? "text-red-500" : "text-[#3C4B59]/60"}`}>
            {isFav ? "❤️" : "🤍"}
          </span>
        </button>
      </div>

      {/* body */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-[#3C4B59]">{item.title}</h2>

        <div className="mt-1 flex items-center gap-2">
          <StarRating value={item.rating} />
          <span className="text-xs text-[#3C4B59]/60">{item.rating.toFixed(1)}/5</span>
        </div>

        {item.description1 && (
          <p className="mt-2 text-sm text-[#3C4B59]/80">{item.description1}</p>
        )}
        {item.description2 && (
          <p className="mt-1 text-sm text-[#3C4B59]/60">{item.description2}</p>
        )}

        {/* avatars like “reviews” */}
        <div className="mt-3 flex -space-x-2">
          {["🧑‍🍳","👩‍🔬","🧑‍🔬","👩‍🍳","🧑‍🍳"].map((e,i)=>(
            <div key={i} className="h-7 w-7 rounded-full bg-[#EED573] grid place-items-center ring-2 ring-white text-sm">{e}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PriceTag({ value }) {
  const label = formatPrice(value);
  return (
    <div className="rounded-full bg-white/95 px-3 py-1 text-[#3C4B59] font-semibold shadow ring-1 ring-black/5">
      {label}
    </div>
  );
}

function StarRating({ value = 4.5, max = 5 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center">
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f-${i}`} className="text-yellow-500">★</span>
      ))}
      {half && <span className="text-yellow-500">★</span>}
      {Array.from({ length: max - full - (half ? 1 : 0) }).map((_, i) => (
        <span key={`e-${i}`} className="text-yellow-500/30">★</span>
      ))}
    </div>
  );
}

function CardSkeletonGrid() {
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-80 rounded-[28px] bg-white/70 ring-1 ring-[#E3C85C]/60 animate-pulse" />
      ))}
    </div>
  );
}

/** --- utils --- **/
function formatPrice(val) {
  const num = Number(val);
  if (Number.isFinite(num)) return `${num.toFixed(num % 1 ? 2 : 0)} SAR`;
  return String(val);
}
