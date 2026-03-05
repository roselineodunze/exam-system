import * as examService from "./exam.service.js";

export async function getAllExamsOwned(req, res) {
  try {
    const userId = Number(req.user.id);
    const exams = await examService.getAllExamsOwned(userId);
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

export async function getAllExamsEnrolled(req, res) {
  try {
    const userId = Number(req.user.id);
    const exams = await examService.getAllExamsEnrolled(userId);
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

export async function createExam(req, res) {
  try {
    const userId = Number(req.user.id);
    const exam = await examService.createExam(userId, req.body);
    res.status(201).json({
      success: true,
      data: exam,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

export async function updateExam(req, res) {
  try {
    const userId = Number(req.user.id);
    const examId = Number(req.params.id);

    const exam = await examService.updateExam(
      examId,
      userId,
      req.body
    );
    res.status(201).json({
      success: true,
      data: exam,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getExamById(req, res) {
  try {
    const userId = Number(req.user.id)
    const examId = Number(req.params.id);

    const exam = await examService.getExamById(examId, userId);
    res.status(201).json({
      success: true,
      data: exam,
    });
  } catch (err) {
    res.status(400).json({
        success: false,
        message: err.message,
      });
  }
}

// export async function updateQuestion(req, res) {
//   try {
//     const userId = Number(req.user.id)
//     const questionId = Number(req.params.id)

//     const question = await questionService.updateQuestion(questionId, userId, req.body);
//     res.status(201).json({
//       success: true,
//       data: question,
//     });
//   } catch (err) {
//     res.status(400).json({
//         success: false,
//         message: err.message,
//       });
//   }
// }

// export async function deletequestion(req, res) {
//   try {
//     const userId = Number(req.user.id)
//     const questionId = Number(req.params.id)

//     const questions = await questionService.deletequestion(questionId, userId);
//     res.status(201).json({
//       success: true,
//       data: questions,
//     });
//   } catch (err) {
//     res.status(400).json({
//         success: false,
//         message: err.message,
//       });
//   }
// }
