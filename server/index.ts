import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./db"; 
import userRoutes from "./routes/user";
import movieRoutes from "./routes/movie";

dotenv.config();

const app = express();
export const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);

connectToDatabase().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        })
})



