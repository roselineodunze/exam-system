import express from "express";
import { authenticate } from "../auth/authmiddleware.js";
import { createExam, getAllExamsEnrolled, getAllExamsOwned, getExamById, updateExam } from "./exam.controller.js";

const examRoutes = express.Router();

examRoutes.get("/", authenticate, getAllExamsOwned);
examRoutes.post("/", authenticate, createExam);
examRoutes.get("/enrolled", authenticate, getAllExamsEnrolled);
examRoutes.put("/:id", authenticate, updateExam);
examRoutes.get("/:id", authenticate, getExamById);

export default examRoutes;
