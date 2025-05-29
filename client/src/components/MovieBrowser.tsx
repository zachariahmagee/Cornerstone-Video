import { useState, useRef, useCallback } from "react"; 
import { useInfiniteMovies } from "../hooks/useMovie";
import { useLikes } from "../hooks/useLikes";
import type { MovieFilters } from "../types/MovieFilters";
import Header from "./Header";
import FilteringPanel from "./FilteringPanel";
import MovieCard from "./MovieCard";
import Carousel from "./Carousel";
import { useRecommendations } from "../hooks/useRecommendations";
import Recommended from "./Recommended";

const tabs = [
    "all",
    "recommended",
    // "liked",
] as const;

type Tab = typeof tabs[number];

export default function MovieBrowser() {
    const [filters, setFilters] = useState<MovieFilters>({});
    const { movies, loading, error, hasMore, loadMore, posterHeight } = useInfiniteMovies(filters);
    const [tab, setTab] = useState<Tab>(tabs[0]);  
    const { toggleLike, isLiked } = useLikes();
    const observer = useRef<IntersectionObserver | null>(null);
    

    const endOfMovieElementsRef = useCallback((node: HTMLDivElement | null) => {
        if (loading || !hasMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                loadMore();
            }
        },
        { rootMargin: "100px", threshold: 1.0 } 
        );

        if (node) observer.current.observe(node);
    },[]);

    // setPosterHeight(movies.reduce(prev, curr) => Math.max(prev?.thumbnail_height ?? 400, curr?.thumbnail_height ?? 400), 0)


    console.log(posterHeight);

    return <>
        <Header/>
        <main>
            <div style={{ display: "flex", gap: "1rem", margin: "1rem 0rem" }}>
                <button onClick={() => setTab("all")}>All Movies</button>
                <button onClick={() => setTab("recommended")}>Recommended</button>
                {/* <button onClick={() => setTab("liked")}>Liked Movies</button> */}
            </div>
            { tab === "recommended" ? (
                    <Recommended refresh={tab == "recommended"} isLiked={isLiked} toggleLike={toggleLike} />
            ) : (
            <>
                <FilteringPanel filters={filters} onChange={setFilters} />
                <section>
                    { loading && <p>Loading movies...</p> }
                    { error && <p style={{ color: "red" }}>{error}</p> }
                    { !error && (
                        <ul 
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                gap: "1rem",
                                rowGap: "1rem",
                                columnGap: "2rem",
                                padding: 0,
                                listStyle: "none",
                            }}
                        >
                            {
                            movies.length ? (movies.map((movie) => (
                                <li key={movie.id}>
                                    <MovieCard movie={movie} liked={isLiked(movie.id)} toggleLike={toggleLike} posterHeight={posterHeight} />
                                </li>
                            ))
                        ) : ( 
                            <li key={0}>No Movies found</li>
                        )}
                        </ul>
                    )}
                    <div ref={endOfMovieElementsRef} style={{ height: "100px" }}>{/* Infinite Scroll Trigger*/}</div>
                </section>
                   </>
                )
            }
        </main>
    </>
}