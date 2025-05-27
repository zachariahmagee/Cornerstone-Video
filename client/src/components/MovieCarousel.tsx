// components/ResponsiveCarousel.tsx
import { useRef } from "react";

interface CarouselProps {
  children: React.ReactNode[];
}

export default function MovieCarousel({ children }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.offsetWidth * 0.9; // 90% of width
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return <>
    <h1>Recommended Movies</h1>
    <div style={{ position: "relative" }}>
        <div
          ref={containerRef}
          style={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            gap: "1rem",
            padding: "1rem 0",
          }}
        >
          {children.map((child, idx) => (
            <div
              key={idx}
              style={{
                flex: "0 0 auto",
                minWidth: "200px",
                scrollSnapAlign: "start",
              }}
            >
              {child}
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={() => scroll("left")}
          style={{
            position: "absolute",
            top: "50%",
            left: "0.5rem",
            transform: "translateY(-50%)",
            zIndex: 1,
          }}
        >
          ◀
        </button>
        <button
          onClick={() => scroll("right")}
          style={{
            position: "absolute",
            top: "50%",
            right: "0.5rem",
            transform: "translateY(-50%)",
            zIndex: 1,
          }}
        >
          ▶
        </button>
      </div>
  </>
}