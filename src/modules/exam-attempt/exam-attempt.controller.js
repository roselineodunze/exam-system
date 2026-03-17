import * as examAttemptService from "./exam-attempt.service.js";

export async function startExam(req, res) {
  try {
    const userId = Number(req.user.id);
    const username = Number(req.user.username);
    const examId = Number(req.params.examId);

    const examAttempt = await examAttemptService.startExam(userId, username, examId);
    res.status(201).json({
      success: true,
      data: examAttempt,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

export async function submitExam(req, res) {
  try {
    const userId = Number(req.user.id);
    const examId = Number(req.params.examId);
    const attemptId = Number(req.params.attemptId);
    const data = req.body;

    const examAttempt = await examAttemptService.submitExam(
      userId,
      examId,
      attemptId,
      data
    );
    res.status(201).json({
      success: true,
      data: examAttempt,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}
