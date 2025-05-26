import { useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { API_BASE } from "../utils/config";


export function useLikes() {
    const { user } = useUser();
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

    // load likes on mount
    useEffect(() => {
        if (user) { 
            setLikedIds(new Set(user.likedMovies || []));
        } else {
            const guestLikes = JSON.parse(localStorage.getItem("guestLikes") || "[]");
            setLikedIds(guestLikes);
        }
    }, [user]);


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
            try {
                await fetch(`${API_BASE}/users/${user.id}/likes`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ movieId, liked: !alreadyLiked }),
                });

            } catch(err) {
                console.error("Error updating like:", err);
            }
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


    return { likedIds, toggleLike, isLiked, setLikesFromServer, syncGuestLikesToServer };
}
