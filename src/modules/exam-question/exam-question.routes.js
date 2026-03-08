import express from "express";
import { authenticate } from "../auth/authmiddleware.js";
import { addExamQuestion } from "./exam-question.controller.js";

const examQuestionRoutes = express.Router();

examQuestionRoutes.post("/:id", authenticate, addExamQuestion);


export default examQuestionRoutes;
