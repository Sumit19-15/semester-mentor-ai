import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Semester Mentor API is running!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
