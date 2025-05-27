import { useCallback, useRef } from "react";
import type { Movie } from "../types/Movie";

interface GridProps {
    children: React.ReactNode[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => void;
}

export default function MovieGrid({ children, loading, error, hasMore, loadMore}: GridProps) {

    const observer = useRef<IntersectionObserver | null>(null);

    const endOfChildrenElementsRef = useCallback((node: HTMLDivElement | null) => {
        if (loading || !hasMore) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
            loadMore();
            }
        },
        { rootMargin: "100px", threshold: 1.0 } 
        );

        if (node) observer.current.observe(node);
    },[]);

    return 

}