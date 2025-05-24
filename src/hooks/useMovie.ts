import { useEffect, useState } from 'react';
import type { Movie } from '../types/Movie';
import type { MovieFilters } from '../types/MovieFilters';
import { filterMovies } from '../utils/filterUtils';

export function useMovies(filters: MovieFilters) {
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/movies.json')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then((data: Movie[] )=> {
                const moviesWithId = data.map((movie: Movie, index: number) => ({
                    ...movie, 
                    id: `${movie.title}+${movie.year}+${index}`
                }));
                setAllMovies(moviesWithId);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || 'Failed to load movie data.');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!filters || allMovies.length === 0) return;
        const result = filterMovies(allMovies, filters);
        setFilteredMovies(result);
    }, [filters, allMovies]);

    return { movies: filteredMovies, loading, error };
}
