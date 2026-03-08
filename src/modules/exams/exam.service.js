import prisma from "../../../prisma/client.js";

export async function getAllExamsOwned(userId) {
  if (!userId) {
    throw new Error("userId is required");
  }
  const exams = await prisma.exam.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      questions: true,
      attempts: true,
      enrolls: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return exams;
}

export async function getExamById(examId, userId) {
  const question = await prisma.exam.findFirst({
    where: {
      id: examId,
      ownerId: userId,
    },
    include: {
      questions: true,
      attempts: true,
      enrolls: true,
    },
  });

  if (!question) {
    throw new Error("Question not found or unauthorized");
  }
  return question;
}

export async function getAllExamsEnrolled(userId) {
  if (!userId) {
    throw new Error("userId is required");
  }
  const enrollments = await prisma.examEnrollment.findMany({
    where: {
      userId: userId,
    },
    include: {
      exam: true,
    },
    orderBy: {
      exam: {
        startDate: "asc",
      },
    },
  });

  return enrollments.map((e) => e.exam);
}

export async function createExam(userId, data) {
  const {
    title,
    instructions,
    autoPublish,
    totalMark,
    durationMinutes,
    shuffleQuestions,
    shuffleOptions,
    startDate,
    endDate,
    distributeMark
  } = data;

  if (totalMark <= 0) {
    throw new Error("Exam total mark must be greater than 0");
  }
  const createdExam = await prisma.exam.create({
    data: {
      title,
      instructions,
      autoPublish,
      totalMark,
      durationMinutes,
      shuffleQuestions,
      shuffleOptions,
      startDate,
      endDate,
      distributeMark,
      isPublished: autoPublish,
      ownerId: userId,
    },
  });

  return createdExam;
}

export async function updateExam({ examId, userId, data }) {
  const {
    title,
    instructions,
    autoPublish,
    totalMark,
    durationMinutes,
    shuffleQuestions,
    shuffleOptions,
    startDate,
    endDate,
  } = data;
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.exam.findFirst({
      where: {
        id: examId,
        ownerId: userId,
      },
    });
    if (!existing) {
      throw new Error("Exam not found or unauthorized");
    }
    await tx.exam.update({
      where: { id: examId },
      data: {
        title,
        instructions,
        autoPublish,
        totalMark,
        durationMinutes,
        shuffleQuestions,
        shuffleOptions,
        startDate,
        endDate,
      },
    });

    return tx.exam.findUnique({
      where: { id: examId },
    });
  });
}
