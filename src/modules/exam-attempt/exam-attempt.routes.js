import express from "express";
import { authenticate } from "../auth/authmiddleware.js";
import { startExam, submitExam } from "./exam-attempt.controller.js";

const examAttemptRoutes = express.Router();

examAttemptRoutes.post("/:examId", authenticate, startExam);
examAttemptRoutes.post("/:examId/:attemptId", authenticate, submitExam);


export default examAttemptRoutes;