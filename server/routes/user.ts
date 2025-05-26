import { Router, Request, Response } from "express";
import { db } from "../db";
import { ObjectId } from "mongodb";


/**
 * Endpoints: 
 * - POST api/users -> Register
 * - GET api/users/:id
 * - PUT api/users/:id/likes
 * - GET api/users/:id/likes
 * - GET api/users/:id/Recommendations
 */

const router = Router();


// POST /api/users → Register a new user
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { name, email } = req.body;

  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return
  }

  const existingUser = await db.collection("users").findOne({ email });

  if (existingUser) {
    res.status(200).json({
      id: existingUser._id.toString(),
      ...existingUser,
      _id: undefined,
    });
    return;
  }

  const newUser = {
    name,
    email,
    likedMovies: [],
  };

  const result = await db.collection("users").insertOne(newUser);

  res.status(201).json({ id: result.insertedId.toString(), ...newUser });
});



// GET /api/users/:id → Fetch user info
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return
  }

  const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return
  }

  res.json({ id: user._id.toString(), ...user, _id: undefined });
});


// MovieID for testing: 6833552f055b45eff55fd0c9
// Update a liked movie 
router.put("/:id/likes", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { movieId, liked } = req.body;

  if (!movieId || typeof liked !== "boolean") {
    res.status(400).json({ error: "movieId and liked(boolean) are required" });
    return;
  }

  const userObjectId = new ObjectId(id);

  const update = liked
    ? { $addToSet: { likedMovies: movieId } } // prevent duplicates
    : { $pull: { likedMovies: movieId } };    // remove if exists

  const result = await db.collection("users").updateOne(
    { _id: userObjectId },
    update
  );
  console.log(id, movieId, liked);

  if (result.modifiedCount === 0) {
    res.status(404).json({ error: "User not found or no change made" });
    return;
  }

  res.json({ message: liked ? "Movie liked" : "Movie unliked" });
});



// POST /api/users/:id/likes/bulk
router.post("/:id/likes/bulkUpdate", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { movieIds } = req.body;

  if (!Array.isArray(movieIds)) {
    res.status(400).json({ error: "movieIds must be an array" });
    return
  }

  await db.collection("users").updateOne(
    { _id: new ObjectId(id) },
    { $addToSet: { likedMovies: { $each: movieIds } } }
  );

  res.json({ message: "Bulk likes added" });
});



// GET /api/users/:id/likes → Fetch liked movies
router.get("/:id/likes", async (req: Request, res: Response): Promise<void>  => {
  const { id } = req.params;

  const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
  console.log("inside get likes:", id);
  if (!user) {
    console.log("Could not find user:", id);
    res.status(404).json({ error: "User not found" });
    return;
  }

  const movies = await db.collection("movies")
    .find({ _id: { $in: user.likedMovies.map((id: string) => new ObjectId(id)) } })
    .toArray();

  const result = movies.map(({ _id, ...rest }) => ({
    id: _id.toString(),
    ...rest,
  }));

  res.json(result);
});


router.get("/:id/recommendations", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

  if (!user || !user.likedMovies.length) {
    res.status(404).json({ error: "User or liked movies not found"});
    return
  } 

  // Get liked movie details
  const likedMovies = await db.collection("movies").find({
    _id: { $in: user.likedMovies.map((id: string) => new ObjectId(id)) } 
  }).toArray();

  // Build a set of liked genres and cast
  const likedGenres = new Set<string>();
  const likedActors = new Set<string>();

  for (const movie of likedMovies) {
    (movie.genres || []).forEach((g: string) => likedGenres.add(g));
    (movie.cast || []).forEach((a: string) => likedActors.add(a));
  }

  // Get candidate movies Not already liked
  const candidates = await db.collection("movies")
    .find({
      _id: { $nin: user.likedMovies.map((id: string) => new ObjectId(id)) }
    }).toArray();

  // Score each candidate
  const scored = candidates.map((movie) => {
    const genreScore = (movie.genres || []).filter((g: string) => likedGenres.has(g)).length;
    const actorScore = (movie.cast || []).filter((a: string) => likedActors.has(a)).length

    const score = genreScore * 2 + actorScore; // weight genre higher
    return { movie, score };
  })

  const top = scored
    .filter(s => s.score > 0)
    .sort((a,b) => b.score - a.score)
    .slice(0, 50)
    .map(({ movie }) => ({
      id: movie._id.toString(),
      ...movie,
    }));

    res.json(top);
})

export default router;