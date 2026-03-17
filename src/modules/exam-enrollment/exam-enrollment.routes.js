import express from "express";
import { authenticate } from "../auth/authmiddleware.js";
import { enrollUserInExam, getExamEnrollees, getUserEnrolledExams, removeEnrollee, unEnrollUser } from "./exam-enrollment.controller.js";

const examEnrollmentRoutes = express.Router();

examEnrollmentRoutes.post("/:examId", authenticate, enrollUserInExam);
examEnrollmentRoutes.get("/:examId", authenticate, getExamEnrollees);
examEnrollmentRoutes.get("/", authenticate, getUserEnrolledExams);
examEnrollmentRoutes.delete("/:examId", authenticate, unEnrollUser);
examEnrollmentRoutes.delete("/:examId/:targetUserId", authenticate, removeEnrollee);

export default examEnrollmentRoutes;