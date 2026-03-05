import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getAllUserQuestions,
  getQuestionById,
  updateQuestion,
} from "./question.controller.js";
import { authenticate } from "../auth/authmiddleware.js";

const questionRoutes = express.Router();

questionRoutes.get("/", authenticate, getAllUserQuestions);
questionRoutes.get("/:id", authenticate, getQuestionById);
questionRoutes.post("/", authenticate, createQuestion);
questionRoutes.put("/:id", authenticate, updateQuestion);
questionRoutes.delete("/:id", authenticate, deleteQuestion);

export default questionRoutes;
