import { useState, useRef, useCallback } from "react"; 
import { useInfiniteMovies } from "../hooks/useMovie";
import { useLikes } from "../hooks/useLikes";
import type { MovieFilters } from "../types/MovieFilters";
import Header from "./Header";
import FilteringPanel from "./FilteringPanel";
import MovieCard from "./MovieCard";
import MovieCarousel from "./MovieCarousel";

export default function MovieBrowser() {
    const [filters, setFilters] = useState<MovieFilters>({});
    const { movies, loading, error, hasMore, loadMore } = useInfiniteMovies(filters);
    const { likedIds, toggleLike, isLiked, setLikesFromServer, syncGuestLikesToServer } = useLikes();

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

    return (
        <main>
            <Header/>
            <FilteringPanel filters={filters} onChange={setFilters} />
            {/* <MovieCarousel> 
                {
                    likedMovies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} liked={true} toggleLike={toggleLike} />  
                    ))
                }
            </MovieCarousel> */}
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