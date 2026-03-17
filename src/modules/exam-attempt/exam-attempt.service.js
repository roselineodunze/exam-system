import prisma from "../../../prisma/client.js";

export async function startExam(userId, username, examId) {
  if (!examId || !userId) throw new Error("ExamId and userId are required");

  return prisma.$transaction(async (tx) => {
    const exam = await tx.exam.findFirst({
      where: { id: examId },
    });
    if (!exam) throw new Error("Exam not found");

    if (new Date() < exam.startDate) {
      throw new Error("Exam hasn't started yet");
    }
    if (new Date() >= exam.endDate) {
      throw new Error("Exam has ended");
    }

    const enrollment = await tx.examEnrollment.findUnique({
      where: { userId_examId: { userId, examId } },
    });
    if (!enrollment) throw new Error("User is not enrolled in this exam");

    const existingAttempt = await tx.examAttempt.findFirst({
      where: { userId, examId },
    });
    if (existingAttempt) throw new Error("You have already started this exam");

    const attempt = await tx.examAttempt.create({
      data: {
        userId,
        examId,
        displayName: username,
      },
    });
    return attempt;
  });
}

export async function submitExam(userId, examId, attemptId, data) {
  if (!examId || !userId || !attemptId)
    throw new Error("ExamId, userId and attempId are required");

  return prisma.$transaction(async (tx) => {
    const { attempts } = data;
    const newAttempts = [];

    const attempt = await tx.examAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) throw new Error("Attempt not found");

    for (const a of attempts) {
      const questionTest = await tx.questionTest.findUnique({
        where: { id: a.questionTestId },
        include: {
          question: {
            include: {
              answers: true,
            },
          },
        },
      });

      if (!questionTest) {
        throw new Error(`QuestionTest ${a.questionTestId} not found`);
      }

      // ✅ find correct answer
      const correctAnswer = questionTest.question.answers.find(
        (ans) => ans.isCorrect === true
      );

      if (!correctAnswer) {
        throw new Error("Correct answer not configured");
      }

      // ✅ check if user is correct
      const isCorrect = correctAnswer.id === a.selectedAnswerId;

      // ✅ push attempt
      newAttempts.push({
        attemptId,
        questionTestId: a.questionTestId,
        selectedAnswerId: a.selectedAnswerId,
        isCorrect,
        score: isCorrect ? questionTest.score : 0,
      });
    }

    await tx.attemptAnswer.createMany({
      data: newAttempts,
    });

    const totalScore = newAttempts.reduce((sum, a) => sum + a.score, 0);

    const updatedAttempt = await tx.examAttempt.update({
      where: { id: attemptId },
      data: { score: totalScore },
    });
    return updatedAttempt
  });
}
