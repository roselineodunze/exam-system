import * as questionService from "./question.service.js";

export async function getAllUserQuestions(req, res) {
  try {
    const userId = Number(req.query.userId)
    const questions = await questionService.getAllUserQuestions(userId);
    res.status(201).json({
      success: true,
      data: questions,
    });
  } catch (err) {
    res.status(400).json({
        success: false,
        message: err.message,
      });
  }
}
