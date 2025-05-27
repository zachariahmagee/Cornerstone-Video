import { Router } from "express";
import type { Request, Response } from "express"
import type { Movie } from "../models/Movie";
import type { MovieFilters } from "../types/MovieFilters";
import { Genre, genres } from "../types/Genre";
import { decades } from "../types/Decade";
import { db } from "../db";
import { ObjectId } from "mongodb"

const router = Router();

/**
 * Routes: 
 * - /movies?page=1&limit=50
 * - /movies/:id get single movie
 */

// GET movies filtered by genre and decade 
// Queries: genre, decade, page, limit = 50
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    
    const genre = req.query.genre as Genre | undefined;
    const decade = parseInt(req.query.decade as string);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const filters: Record<string, any> = {};

    if (genre && genres.includes(genre)) {
      filters.genres = genre;
    }

    if (decade && decades.includes(decade)) {
      filters.year = { $gte: decade, $lt: decade + 10 };
    }

    const skip = ((page || 1) - 1) * (limit || 50);

    // If no filters are present sort newest first
    const noGenre = !genre || !genres.includes(genre);
    const noDecade = !decade || !decades.includes(decade);

    const sortByYear = noGenre && noDecade ? -1 : 1;

    const cursor = db.collection("movies")
      .find(filters)
      .sort({ year: sortByYear, title: 1 })
      .skip(skip)
      .limit(limit || 50);

    const movies = await cursor.toArray();
    const total = await db.collection("movies").countDocuments(filters);

    const results = movies.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));

    res.json({
      movies: results,
      page,
      total,
      totalPages: Math.ceil(total / (limit || 50)),
    });
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// GET movie with :id === movie.id
router.get("/:id", async (req: Request<{id: string}>, res: Response): Promise<void> => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid movie ID format" });
        }
        const movie = await db.collection("movies").findOne({ _id: new ObjectId(id) });

        if (!movie) {
            res.status(404).json({ error: "Movie not found" });
            return;
        }

        const result = {
            id: movie._id.toString(),
            ...movie,
        };

        res.json(result);
    } catch (err) {
        console.error("Error fetching movie: ", err);
        res.status(500).json({ error: "Internal server error" });
    }
});


export default router;