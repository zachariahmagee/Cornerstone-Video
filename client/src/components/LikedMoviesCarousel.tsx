import MovieCarousel from "./MovieCarousel"
import MovieCard from "./MovieCard"
import type { Movie } from "../types/Movie"


interface RecommendedTypes {
    refresh: boolean;
    isLiked: (id: string) => boolean;
    toggleLike: (id: string) => void;
}

export default function LikedMoviesCarousel({refresh, isLiked, toggleLike}: RecommendedTypes) {


    return <>
        { loading && <p>Loading movies...</p> }
        { error && <p style={{ color: "red" }}>{error}</p> }
        {
        !error && (
            <MovieCarousel> 
                {
                    recommended.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} liked={isLiked(movie.id)} toggleLike={toggleLike} />  
                    ))
                }
            </MovieCarousel>
        )
        }
    </>
}