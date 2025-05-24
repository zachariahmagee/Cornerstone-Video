import type { Movie } from "../types/Movie";
import type { MovieFilters } from "../types/MovieFilters";


export function filterMovies(movies: Movie[], filters: MovieFilters): Movie[] {
    const { genre, decade } = filters;

    return movies.filter((movie) => {
        const matchGenre = genre 
            ? movie.genres.includes(genre) 
            : true;
        const matchDecade = decade 
            ? movie.year >= decade && movie.year <= decade + 10 
            : true;

        return matchGenre && matchDecade;
    })
}
