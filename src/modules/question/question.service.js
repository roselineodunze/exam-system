import prisma from "../../../prisma/client.js";

export async function getAllUserQuestions(userId) {
  if (!userId) {
    throw new Error("userId is required");
  }
  const questions = await prisma.question.findMany({
    where: {
      creatorId: userId,
      deletedAt: null,
    },
    include: {
      answers: true,
      questionTests: {
        include: {
          exam: {
            select: {
              id: true,
              title: true,
              publicId: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return questions;
}

export async function getQuestionById(questionId, userId) {
  const question = await prisma.question.findFirst({
    where: {
      id: questionId,
      creatorId: userId,
    },
    include: {
      answers: true,
      questionTests: true,
    },
  });

  if (!question) {
    throw new Error("Question not found or unauthorized");
  }
  return question;
}

export async function createQuestion(userId, data) {
  const { question, instruction, answers } = data;
  return await prisma.$transaction(async (tx) => {
    const createdQuestion = await tx.question.create({
      data: {
        question,
        instruction,
        creatorId: userId,
      },
    });

    await tx.answer.createMany({
      data: answers.map((a) => ({
        content: a.content,
        isCorrect: a.isCorrect ?? false,
        questionId: createdQuestion.id,
      })),
    });

    return tx.question.findUnique({
      where: { id: createdQuestion.id },
      include: { answers: true },
    });
  });
}

export async function updateQuestion(questionId, userId, data) {
  console.log("questionId is " + userId);
  const { question, instruction, answers } = data;
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.question.findFirst({
      where: {
        id: questionId,
        creatorId: userId,
      },
    });
    if (!existing) {
      throw new Error("Question not found or unauthorized");
    }
    await tx.question.update({
      where: { id: questionId },
      data: {
        question,
        instruction,
      },
    });

    await tx.answer.deleteMany({
      where: { questionId },
    });

    await tx.answer.createMany({
      data: answers.map((a) => ({
        content: a.content,
        isCorrect: a.isCorrect ?? false,
        questionId,
      })),
    });

    return tx.question.findUnique({
      where: { id: questionId },
      include: { answers: true },
    });
  });
}

export async function deleteQuestion(questionId, userId) {
  return await prisma.$transaction(async (tx) => {
    const question = await tx.question.findFirst({
      where: {
        id: questionId,
        creatorId: userId,
      },
      include: {
        questionTests: true,
      },
    });
    if (!question) {
      throw new Error("Question not found or unauthorized");
    }
    if (question.questionTests.length > 0) {
      await tx.question.update({
        where: { id: questionId },
        data: {
          deletedAt: new Date(),
        },
      });
      return { message: "Question archived successfully" };
    }

    await tx.answer.deleteMany({
      where: { questionId },
    });

    await tx.question.delete({
      where: { id: questionId },
    });

    return { message: "Question deleted permanently" };
  });
}
