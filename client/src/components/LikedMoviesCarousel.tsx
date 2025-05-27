import Carousel from "./Carousel"
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
            <Carousel> 
                {
                    recommended.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} liked={isLiked(movie.id)} toggleLike={toggleLike} />  
                    ))
                }
            </Carousel>
        )
        }
    </>
}