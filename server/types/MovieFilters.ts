import { Genre } from "./Genre";
import { Decade } from "./Decade";

export interface MovieFilters {
    genre?: Genre;
    decade?: Decade;
    page?: number;
    limit?: number;
}