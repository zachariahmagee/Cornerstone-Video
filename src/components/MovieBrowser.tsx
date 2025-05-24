import { useState } from "react"; 
import { useMovies } from "../hooks/useMovie";
import type { MovieFilters } from "../types/MovieFilters";
import Header from "./Header";
import FilteringPanel from "./FilteringPanel";
import MovieCard from "./MovieCard";

export default function MovieBrowser() {
    const [filters, setFilters] = useState<MovieFilters>({});
    const { movies, loading, error } = useMovies(filters);

    return (
        <main>
            <Header/>
            <FilteringPanel filters={filters} onChange={setFilters} />
            <section>
                { loading && <p>Loading movies...</p> }
                { error && <p style={{ color: "red" }}>{error}</p> }
                { !loading && !error && (
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
                                <MovieCard movie={movie} />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    )
}