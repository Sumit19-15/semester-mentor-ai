import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
import noteRoutes from './routes/noteRoutes.js';
import pyqRoutes from './routes/pyqRoutes.js';

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/topics", topicRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/pyqs', pyqRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Semester Mentor API is running!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
