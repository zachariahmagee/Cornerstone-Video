import { useMemo, useState, useRef, useEffect, useCallback } from "react"; 
import { useInfiniteMovies } from "../hooks/useMovie";
import { useLikes } from "../hooks/useLikes";
import type { MovieFilters } from "../types/MovieFilters";
import Header from "./Header";
import FilteringPanel from "./FilteringPanel";
import MovieCard from "./MovieCard";

export default function MovieBrowser() {
    const [filters, setFilters] = useState<MovieFilters>({});
    // const memoizedFilters = useMemo(() => ({genre: filters.genre, decade: filters.decade }), [filters.genre, filters.decade]);
    const { movies, loading, error, hasMore, loadMore } = useInfiniteMovies(filters);
    const { likedIds, toggleLike, isLiked, setLikesFromServer, syncGuestLikesToServer } = useLikes();
    // const observerRef = useRef<HTMLDivElement | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);
    // useEffect(() => {
    //     if (loading || !hasMore) return;
    //     const observer = new IntersectionObserver((entries) => {
    //         if (entries[0].isIntersecting && hasMore) {
    //             loadMore();
    //         }
    //     }, { rootMargin: "10px" });
    //     const element = observerRef.current;
    //     if (element) observer.observe(element);

    //     return () => { 
    //         if (element) observer.unobserve(element); 
    //     }
        // }, [loading, hasMore, loadMore]);


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
    },
    []
    );

    return (
        <main>
            <Header/>
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
                            padding: 0,
                            listStyle: "none",
                        }}
                    >
                        {
                        movies.map((movie) => (
                            <li key={movie.id}>
                                <MovieCard movie={movie} liked={isLiked(movie.id)} toggleLike={toggleLike} />
                            </li>
                        )
                        )}
                    </ul>
                )}
                <div ref={endOfMovieElementsRef} style={{ height: "100px" }}>{/* Infinite Scroll Trigger*/}</div>
            </section>
        </main>
    )
}