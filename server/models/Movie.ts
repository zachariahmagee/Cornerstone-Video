
export interface Movie {
  _id?: string; 
  title: string;
  year: number;
  genres: string[];
  cast?: string[];
  extract?: string;
  thumbnail?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
  href?: string | null;
}