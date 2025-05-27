import { API_BASE } from "../utils/config";
import type { Movie } from "../types/Movie";
import type { MovieFilters } from "../types/MovieFilters";

interface FetchMoviesResponse {
  movies: Movie[];
  page: number;
  total: number;
  totalPages: number;
}

export async function fetchMoviesFromApi(
  filters: MovieFilters,
  page: number,
  limit: number,
  signal?: AbortSignal
): Promise<FetchMoviesResponse> {
    
  const params = new URLSearchParams();
  if (filters.genre) params.append("genre", filters.genre);
  if (filters.decade) params.append("decade", filters.decade.toString());
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const res = await fetch(`${API_BASE}/movies?${params.toString()}`, { signal });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}