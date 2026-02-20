import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import contributionRoutes from "./routes/contributionRoutes.js";
import contributionCertRoutes from "./routes/contributionCertRoute.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/certificates", certificateRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/contributions/cert", contributionCertRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Dev Archive API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
