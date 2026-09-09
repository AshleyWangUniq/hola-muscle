import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { type AuthRequest, authMiddleware, optionalAuthMiddleware } from "./middleware/authMiddleware";
import Workout from "./models/Workout";
import { connectDB } from "./config/db";
import exerciseRoutes from "./routes/exerciseRoutes";
import userRoutes from "./routes/userRoutes";
import workoutRoutes from "./routes/workoutRoutes";

dotenv.config();

const app = express();
const route = express.Router();
const PORT = process.env.PORT || 3000;
// const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use(route);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);

//MongoDB connection, server starter
async function startServer() {
  await connectDB();
  app.listen(PORT, ()=>{console.log(`Server is running on ${PORT}`);})
}
startServer();


app.get("/", (req, res) => {
  res.send("Server is running");
});