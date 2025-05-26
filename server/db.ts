import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);
export let db: Db;

export async function connectToDatabase() {
    await client.connect();
    db = client.db("cs-video");
    
    // Ensure unique index on email, avoid duplicates
    await db.collection("users").createIndex({ email: 1 }, { unique: true, background: true });
    await db.collection("movies").createIndex({ year: 1 }, { background: true })

    console.log("Connected to Cornerstone Video Database of Movies. Enjoy!");
}