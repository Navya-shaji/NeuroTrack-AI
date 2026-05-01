import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";

const app = express();

// Middleware
app.use(cors({
  origin: ["https://neurotrack-ai-six.vercel.app", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

export default app;
