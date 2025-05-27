import { useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { API_BASE } from "../utils/config";
import type { Movie } from "../types/Movie";
import {putToggledLike} from "../api/users"

export function useLikes(refresh: boolean = false) {
    const { user } = useUser();
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
    // const [likedMovies, setLikedMovies] = useState<Movie[]>([]);
    // load likes on mount
    useEffect(() => {
        if (user) { 
            setLikedIds(new Set(user.likedMovies || []));
        } else {
            const guestLikes = JSON.parse(localStorage.getItem("guestLikes") || "[]");
            setLikedIds(guestLikes);
        }
    }, [user]);


    // useEffect(() => {
    //     if (!user) return;
        // const fetchLikedMovies = async () => {
        //     try {
        //         const res = await fetch(`${API_BASE}/users/${user.id}/likes`);
        //         if (!res.ok) throw new Error(`HTTP ${res.status}`);
        //         const data = await res.json();
        //         setLikedMovies([...data.movies]);
        //     } catch (err) {
        //         console.log(user.id);
        //         console.error("Couldn't fetch liked movies:", err);
        //     }
        // }
    //     fetchLikedMovies();
    // }, [refresh, user])



    const toggleLike = async (movieId: string) => {
        const updated = new Set(likedIds);
        const alreadyLiked = updated.has(movieId);

        if (alreadyLiked) {
            updated.delete(movieId);
        } else {
            updated.add(movieId);
        }

        setLikedIds(updated);

        if (user) {
            await putToggledLike(user.id, movieId, !alreadyLiked);
        } else {
            localStorage.setItem("guestLikes", JSON.stringify(Array.from(updated)));
        }
    };

    const isLiked = (movieId: string) => likedIds.has(movieId);

    const setLikesFromServer = (ids: string[]) => setLikedIds(new Set(ids));

    const syncGuestLikesToServer = async () => {
        const localLikes = JSON.parse(localStorage.getItem("guestLikes") || "[]") as string[];
        if (localLikes.length) {
            const bulkRes = await fetch(`${API_BASE}/users/${user.id}/likes/bulkUpdate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ movieIds: localLikes }),
            });

            if (bulkRes.ok) {
                localStorage.removeItem("guestLikes");
            } else {
                console.error("Failed to sync guest likes");
            }
        }
    }


    return { toggleLike, isLiked, setLikesFromServer, syncGuestLikesToServer };
}
