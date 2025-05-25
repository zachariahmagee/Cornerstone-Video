import type { Decade } from "./Decade";
import type { Genre } from "./Genre";



export interface MovieFilters {
    genre?: Genre;
    decade?: Decade;
}