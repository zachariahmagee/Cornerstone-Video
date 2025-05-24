import { useState } from "react";
import type { Movie } from "../types/Movie"
import LikeIcon from "./LikeIcon";


interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const [liked, setLiked] = useState(false);
    return (
        <article
            style={{
                backgroundColor: "#1a1a1a",
                borderRadius: "8px",
                padding: "1rem",
                width: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                color: "#fff",
            }}
        >
        
            <figure style={{ width: "100%", margin: 0 }}>
                <img
                  src={movie.thumbnail ?? "/poster-not-available.png"}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/poster-not-available.png";
                  }}
                  alt={`Poster for ${movie.title}`}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "4px",
                    marginBottom: "0.5rem",
                  }}
                  loading="lazy"
                />
            </figure>
            <h2 style={{ fontSize: "1rem", margin: "0.25rem 0" }}>{movie.title}</h2>
            <div
              style={{
                position: "relative",
                width: "100%",
                fontSize: "0.9rem",
                margin: "0",
                color: "#bbb",
              }}
            >
              <p style={{ textAlign: "center", fontSize: "0.9rem", margin: "0", color: "#bbb" }}>{movie.year}</p>
              <div 
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}>
                <LikeIcon liked={liked} onToggle={() => setLiked((prev) => !prev)} />
              </div>
            </div>
            <p style={{ fontSize: "0.8rem", marginTop: "0.5rem", color: "#ccc" }}>
                {movie.genres.join(", ") || "No genres"}
            </p>
      </article> 
    )
}