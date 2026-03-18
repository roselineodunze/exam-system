import express from "express";
import { authenticate } from "../auth/authmiddleware.js";
import { getAllExamAttempts, getAllUserAttempts, startExam, submitExam } from "./exam-attempt.controller.js";

const examAttemptRoutes = express.Router();

examAttemptRoutes.post("/:examId", authenticate, startExam);
examAttemptRoutes.post("/:examId/:attemptId", authenticate, submitExam);
examAttemptRoutes.get("/:examId", authenticate, getAllExamAttempts);
examAttemptRoutes.get("/", authenticate, getAllUserAttempts);


export default examAttemptRoutes;