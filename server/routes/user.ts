import { Router, Request, Response } from "express";
import { db } from "../db";
import { ObjectId } from "mongodb";


/**
 * Endpoints: 
 * - POST api/users -> Register
 * - GET api/users/:id
 * - PUT api/users/:id/likes
 * - GET api/users/:id/likes
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



// PUT /api/users/:id/likes → Update liked movies
// router.put("/:id/likes", async (req: Request, res: Response): Promise<void>  => {
//   const { id } = req.params;
//   const { likedMovies } = req.body;

//   if (!Array.isArray(likedMovies)) {
//     res.status(400).json({ error: "likedMovies must be an array of movie IDs" });
//     return
//   }

//   await db.collection("users").updateOne(
//     { _id: new ObjectId(id) },
//     { $set: { likedMovies } }
//   );

//   res.json({ message: "Likes updated" });
// });

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

  if (!user) {
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

// Maybe I'll change "likes" to 1-5 ratings? 
// PUT /api/users/:id/ratings → Update ratings
// router.put("/:id/ratings", async (req: Request, res: Response): Promise<void>  => {
//   const { id } = req.params;
//   const { ratings } = req.body;

//   if (typeof ratings !== "object" || Array.isArray(ratings)) {
//     return res.status(400).json({ error: "ratings must be an object" });
//   }

//   await db.collection("users").updateOne(
//     { _id: new ObjectId(id) },
//     { $set: { ratings } }
//   );

//   res.json({ message: "Ratings updated" });
// });

export default router;