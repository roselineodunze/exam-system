import * as examQuestionService from "./exam-question.service.js";

export async function addExamQuestion(req, res) {
  try {
    const userId = Number(req.user.id);
    const examId = Number(req.params.id);

    const exams = await examQuestionService.addExamQuestion(userId, examId, req.body);
    res.status(201).json({
      success: true,
      data: exams,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}