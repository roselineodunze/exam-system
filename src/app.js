import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import questionRoutes from "./modules/question/question.routes.js";
import examRoutes from "./modules/exams/exam.routes.js";
import examQuestionRoutes from "./modules/exam-question/exam-question.routes.js";
import examEnrollmentRoutes from "./modules/exam-enrollment/exam-enrollment.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/exam-question", examQuestionRoutes)
app.use("/api/exam-enrollment", examEnrollmentRoutes)


app.get("/", (req, res) => {
  res.send("Express server is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

