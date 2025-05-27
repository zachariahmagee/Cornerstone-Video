import { useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { API_BASE } from "../utils/config";
import type { Movie } from "../types/Movie";
import { fetchRecommendations } from "../api/users";

export function useRecommendations(refresh: boolean) {
  const { user } = useUser();
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      if (!user) return;

      const fetchAndSetRecommendations = async () => {
          setLoading(true);
          const result = await fetchRecommendations(user.id);
          if (result.success) {
            setRecommended(result.data);
            setError(null);
          } else {
            setError(result.error || "Log in to see customized Recommendations!");
          }
          setLoading(false);
      };

      fetchAndSetRecommendations();
  }, [refresh, user]);

  return { recommended, loading, error };
}