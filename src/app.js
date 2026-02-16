import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import questionRoutes from "./modules/question/question.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);


app.get("/", (req, res) => {
  res.send("Express server is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

