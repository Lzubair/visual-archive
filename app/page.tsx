"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import Lenis from "lenis";
import portfolioData from "../portfolio_data.json";

interface ArtItem {
  category: string;
  tags: string[];
  filename: string;
}

export default function Portfolio() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(portfolioData.map((item: any) => item.category))
    );
    return ["All", ...uniqueCategories as string[]];
  }, []);

  const filteredData = useMemo(() => {
    if (activeFilter === "All") return portfolioData;
    return portfolioData.filter(
      (item: any) => item.category === activeFilter
    );
  }, [activeFilter]);

  // Smooth scroll with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // GSAP stagger animation on filter change
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".portfolio-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: "power3.out",
          overwrite: true,
        }
      );
    }, galleryRef);

    return () => ctx.revert();
  }, [activeFilter]);

  // Distribute items into 3 columns
  const col1 = filteredData.filter((_: any, i: number) => i % 3 === 0);
  const col2 = filteredData.filter((_: any, i: number) => i % 3 === 1);
  const col3 = filteredData.filter((_: any, i: number) => i % 3 === 2);

  const handleImageError = (filename: string) => {
    setImageErrors((prev) => ({ ...prev, [filename]: true }));
  };

  return (
    <main
      style={{
        backgroundColor: "#09090B",
        minHeight: "100vh",
        color: "#ffffff",
        padding: "5rem 1.5rem",
      }}
    >
      {/* Header */}
      <header
        style={{
          marginBottom: "4rem",
          maxWidth: "80rem",
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "clamp(3rem, 10vw, 6rem)",
              fontFamily: "var(--font-serif), Georgia, serif",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
              lineHeight: 1,
            }}
          >
            Zubair Liibaan
          </h1>
          <p
            style={{
              color: "#71717a",
              fontSize: "0.75rem",
              fontFamily: "monospace",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Visual Media Collection // 2024-2026
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1rem" }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              style={{
                padding: "0.5rem 1.25rem",
                fontSize: "0.875rem",
                borderRadius: "9999px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor: activeFilter === category ? "#ffffff" : "#18181b",
                color: activeFilter === category ? "#09090B" : "#a1a1aa",
                fontWeight: activeFilter === category ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== category) {
                  e.currentTarget.style.backgroundColor = "#27272a";
                  e.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== category) {
                  e.currentTarget.style.backgroundColor = "#18181b";
                  e.currentTarget.style.color = "#a1a1aa";
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* Masonry Grid */}
      <div
        ref={galleryRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          maxWidth: "80rem",
          marginLeft: "auto",
          marginRight: "auto",
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {col1.map((item: any, idx: number) => (
            <ArtCard
              key={`${item.filename}-${idx}`}
              item={item}
              hasError={imageErrors[item.filename]}
              onError={handleImageError}
            />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {col2.map((item: any, idx: number) => (
            <ArtCard
              key={`${item.filename}-${idx}`}
              item={item}
              hasError={imageErrors[item.filename]}
              onError={handleImageError}
            />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {col3.map((item: any, idx: number) => (
            <ArtCard
              key={`${item.filename}-${idx}`}
              item={item}
              hasError={imageErrors[item.filename]}
              onError={handleImageError}
            />
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "8rem 0",
            color: "#52525b",
            fontFamily: "monospace",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          No archives found for this category.
        </div>
      )}

      {/* Contact Footer */}
      <footer
        style={{
          marginTop: "8rem",
          paddingTop: "2rem",
          borderTop: "1px solid #27272a",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          color: "#71717a",
          fontSize: "0.75rem",
          fontFamily: "monospace",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        <p>© {new Date().getFullYear()} ZUBAIR LIIBAAN. ALL RIGHTS RESERVED.</p>
        <a
          href="mailto:zubairliibaan2022@gmail.com"
          style={{
            color: "#ffffff",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#a1a1aa")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
        >
          INITIATE CONTACT // zvon_104
        </a>
      </footer>
    </main>
  );
}

// Art Card Component
function ArtCard({
  item,
  hasError,
  onError,
}: {
  item: ArtItem;
  hasError: boolean;
  onError: (filename: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="portfolio-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#18181b",
          borderRadius: "2px",
          aspectRatio: "4 / 5",
        }}
      >
        {hasError ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#18181b",
              color: "#52525b",
              fontFamily: "monospace",
              fontSize: "0.75rem",
            }}
          >
            <div style={{ textAlign: "center", padding: "1rem" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>&#9633;</div>
              <div>{item.filename}</div>
            </div>
          </div>
        ) : (
          <Image
            src={`/extracted_art/${encodeURIComponent(item.filename)}`}
            alt={item.category}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{
              objectFit: "cover",
              transition: "transform 1s ease-out, opacity 0.3s ease",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
              opacity: isHovered ? 1 : 0.9,
            }}
            onError={() => onError(item.filename)}
          />
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <span
          style={{
            color: "#e4e4e7",
            fontSize: "0.75rem",
            fontWeight: 500,
            backgroundColor: "rgba(39, 39, 42, 0.5)",
            padding: "0.375rem 0.75rem",
            borderRadius: "2px",
          }}
        >
          {item.category}
        </span>

        {item.tags.slice(0, 2).map((tag: string, i: number) => (
          <span
            key={i}
            style={{
              color: "#a1a1aa",
              fontSize: "0.75rem",
              fontFamily: "monospace",
              textTransform: "lowercase",
              border: "1px solid #27272a",
              padding: "0.375rem 0.75rem",
              borderRadius: "2px",
              transition: "border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#52525b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#27272a";
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}