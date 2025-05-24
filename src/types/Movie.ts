

export interface Movie {
    id: string;
    liked: boolean;
    title: string;
    year: number;
    cast: string[];
    genres: string[]; // potentially create a Genre type
    href?: string | null;
    extract?: string;
    thumbnail?: string;
    thumbnail_width?: number;
    thumbnail_height?: number;
}