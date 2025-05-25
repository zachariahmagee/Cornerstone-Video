import { connectToDatabase, db } from "../db";
import movies from "./movies.json"

async function seed() {
    await connectToDatabase();
    await db.collection("movies").deleteMany({});
    await db.collection("movies").insertMany(movies);
    console.log("Seeded movie data");
    process.exit();
}

seed();