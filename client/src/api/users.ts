import type { Movie } from "../types/Movie";
import type User from "../types/User";
import { API_BASE } from "../utils/config";

// Register a user
type RegistrationResult = 
    | { success: true; user: User }
    | { success: false; error: string };

export async function registerUser(name: string, email: string): Promise<RegistrationResult> {
  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, error: `HTTP ${res.status}: ${errorText}` };
    }

    const user: User = await res.json();
    return { success: true, user };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// Retrieve Recommendations
type RecommendationResult =
  | { success: true; data: Movie[] }
  | { success: false; error: string };

export async function fetchRecommendations(userId: string): Promise<RecommendationResult> {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/recommendations`);
    if (!res.ok) {
      const errorText = await res.text(); // capture error details if sent
      return { success: false, error: `HTTP ${res.status}: ${errorText}` };
    }
    const data: Movie[] = await res.json();
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}


// Toggle like status for a movie
export async function putToggledLike(userId: string, movieId: string, liked: boolean): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/likes`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movieId, liked }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    console.error("Error updating like:", err);
    throw err;
  }
}

// Fetch all liked movies for a user
export async function fetchLikedMovies(userId: string): Promise<Movie[]> {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/likes`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    return data.movies;
  } catch (err) {
    console.error(`Couldn't fetch liked movies for user ${userId}:`, err);
    throw err;
  }
}