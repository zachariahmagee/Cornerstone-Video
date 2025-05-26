import { useEffect, useState, useRef } from 'react';
import type { Movie } from '../types/Movie';
import type { MovieFilters } from '../types/MovieFilters';
import { filterMovies } from '../utils/filterUtils';
import { API_BASE } from '../utils/config';

// development: `http://localhost:8080/api/v1/movies`
const apiBase = `${API_BASE}/movies`;


// infinitely scroll movies
interface UseInfiniteMoviesResult {
    movies: Movie[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => void;
}


export function useInfiniteMovies(filters: MovieFilters, limit = 50): UseInfiniteMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { genre, decade } = filters;
  // Reset movies if filters change
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [genre, decade]);

  useEffect(() => {
    // const controller = new AbortController();
    // const signal = controller.signal;

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (genre) params.append("genre", genre);
        if (decade) params.append("decade", decade.toString());
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        
        const res = await fetch(`${apiBase}?${params.toString()}`);//, { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setMovies(prev => [...prev, ...data.movies]);
        setHasMore(page < data.totalPages);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load movies.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();

    // return () => controller.abort();
  }, [page, genre, decade, limit]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return { movies, loading, error, hasMore, loadMore };
}


// For pagination, each page shows 50 movies.
interface UseMoviesResult {
    movies: Movie[];
    loading: boolean;
    error: string | null;
    total: number;
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
}
export function useMovies(filters: MovieFilters, initialPage = 1): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    if (filters.genre) params.append("genre", filters.genre);
    if (filters.decade) params.append("decade", filters.decade.toString());
    params.append("page", page.toString());
    params.append("limit", "50");

    fetch(`${apiBase}?${params.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setMovies(data.movies || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Failed to load movies.");
        setLoading(false);
      });
  }, [filters, page]);

  return { movies, loading, error, total, page, totalPages, setPage };
}


// load movies from movies.json
export function useClientSideMovies(filters: MovieFilters) {
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