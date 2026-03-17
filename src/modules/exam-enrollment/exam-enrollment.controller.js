import * as examEnrollmentService from "./exam-enrollment.service.js";

export async function enrollUserInExam(req, res) {
  try {
    const userId = Number(req.user.id);
    const examId = Number(req.params.examId);

    const enrollment = await examEnrollmentService.enrollUserInExam(userId, examId);
    res.status(201).json({
      success: true,
      data: enrollment,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getExamEnrollees(req, res) {
  try {
    const userId = Number(req.user.id);
    const examId = Number(req.params.examId);

    const examEnrollees = await examEnrollmentService.getExamEnrollees(userId, examId);
    res.status(201).json({
      success: true,
      data: examEnrollees,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getUserEnrolledExams(req, res) {
  try {
    const userId = Number(req.user.id);

    const userEnrolledExams =
      await examEnrollmentService.getUserEnrolledExams(userId);
    res.status(201).json({
      success: true,
      data: userEnrolledExams,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

export async function unEnrollUser(req, res) {
  try {
    const userId = Number(req.user.id);
    const examId = Number(req.params.examId);

    const unEnrollUser =
      await examEnrollmentService.unEnrollUser(userId, examId);
    res.status(201).json({
      success: true,
      data: unEnrollUser,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

export async function removeEnrollee(req, res) {
  try {
    const ownerId = Number(req.user.id);
    const examId = Number(req.params.examId);
    const targetUserId = Number(req.params.targetUserId)

    console.log(ownerId + examId + targetUserId );

    const unEnrollUser =
      await examEnrollmentService.removeEnrollee(ownerId, examId, targetUserId);
    res.status(201).json({
      success: true,
      data: unEnrollUser,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}
