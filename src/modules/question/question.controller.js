import * as questionService from "./question.service.js";

export async function getAllUserQuestions(req, res) {
  try {
    const userId = Number(req.user.id)
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

export async function getQuestionById(req, res) {
  try {
    const userId = Number(req.user.id)
    const questionId = Number(req.params.id)

    const question = await questionService.getQuestionById(questionId, userId);
    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (err) {
    res.status(400).json({
        success: false,
        message: err.message,
      });
  }
}

export async function createQuestion(req, res) {
  console.log("creating")
  try {
    const userId = Number(req.user.id)
    console.log(req.body)
    const question = await questionService.createQuestion(userId, req.body);
    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (err) {
    res.status(400).json({
        success: false,
        message: err.message,
      });
  }
}

export async function updateQuestion(req, res) {
  try {
    const userId = Number(req.user.id)
    const questionId = Number(req.params.id)
    const question = await questionService.updateQuestion(questionId, userId, req.body);
    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (err) {
    res.status(400).json({
        success: false,
        message: err.message,
      });
  }
}

export async function deleteQuestion(req, res) {
  try {
    const userId = Number(req.user.id)
    const questionId = Number(req.params.id)

    const question = await questionService.deleteQuestion(questionId, userId);
    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (err) {
    res.status(400).json({
        success: false,
        message: err.message,
      });
  }
}
