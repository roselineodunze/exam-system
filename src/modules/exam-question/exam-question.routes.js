import express from "express";
import { authenticate } from "../auth/authmiddleware.js";
import { addExamQuestion } from "./exam-question.controller.js";

const examQuestionRoutes = express.Router();

examQuestionRoutes.post("/add-exam-question", authenticate, addExamQuestion);
// examQuestionRoutes.post("/", authenticate, createExam);
// examRoutes.get("/enrolled", authenticate, getAllExamsEnrolled);
// examRoutes.put("/:id", authenticate, updateExam);
// examRoutes.get("/:id", authenticate, getExamById);

export default examRoutes;
