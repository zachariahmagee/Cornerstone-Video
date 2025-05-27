import Carousel from "./Carousel"
import MovieCard from "./MovieCard"
import type { Movie } from "../types/Movie"
import { useRecommendations } from "../hooks/useRecommendations";
import { useUser } from "../hooks/UserContext";

interface RecommendedTypes {
    refresh: boolean;
    isLiked: (id: string) => boolean;
    toggleLike: (id: string) => void;
}

export default function Recommended({refresh, isLiked, toggleLike}: RecommendedTypes) {
    const { user } = useUser();
    const { recommended, loading, error } = useRecommendations(refresh && user);

    return <>
        { loading && <p>Loading movies...</p> }
        { error && <p style={{ color: "red" }}>Sign in and like some movies to see your recommendations!</p> }
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