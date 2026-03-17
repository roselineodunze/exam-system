import prisma from "../../../prisma/client.js";

export async function enrollUserInExam(userId, examId) {
  if (!examId || !userId) throw new Error("ExamId and userId are required");

  return prisma.$transaction(async (tx) => {
    console.log("enrolling user to exam");
    const exam = await tx.exam.findFirst({
      where: { id: examId },
    });

    if (!exam) throw new Error("Exam not found");
    if (!exam.isPublished) {
      throw new Error("Exam is not available for enrollment");
    }
    if (exam.ownerId === userId) {
      throw new Error("You cannot enroll in your own exam");
    }

    try {
      const enrollment = await tx.examEnrollment.create({
        data: {
          userId,
          examId,
        },
      });
      return enrollment;
    } catch (err) {
      if (err.code === "P2002") {
        throw new Error("You are already enrolled in this exam");
      }
      throw err;
    }
  });
}

export async function getExamEnrollees(userId, examId) {
  if (!examId || !userId) throw new Error("ExamId and userId are required");
  return prisma.$transaction(async (tx) => {
    const exam = await tx.exam.findFirst({
      where: { id: examId, ownerId: userId },
    });

    if (!exam) throw new Error("Exam not found or unauthorized");

    const examEnrollees = await tx.examEnrollment.findMany({
      where: {
        examId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return examEnrollees;
  });
}

export async function getUserEnrolledExams(userId) {
  if (!userId) throw new Error("UserId is required");

  const exams = await prisma.examEnrollment.findMany({
    where: {
      userId,
    },
    include: {
      exam: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return exams;
}

export async function unEnrollUser(userId, examId) {
  if (!examId || !userId) {
    throw new Error("ExamId and userId are required");
  }

  return prisma.$transaction(async (tx) => {
    const exam = await tx.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) throw new Error("Exam not found or unauthorized");

    if (new Date() >= exam.startDate) {
      throw new Error("Cannot unenroll after exam has started");
    }

    try {
      return await tx.examEnrollment.delete({
        where: {
          userId_examId: { userId, examId },
        },
      });
    } catch (err) {
      if (err.code === "P2025") {
        throw new Error("User is not enrolled in this exam");
      }
      throw err;
    }
  });
}

export async function removeEnrollee(ownerId, examId, targetUserId) {
  if (!examId || !ownerId || !targetUserId) {
    throw new Error("ExamId, userId and targetuserId are required");
  }

  return prisma.$transaction(async (tx) => {
    console.log("removing enrollee");
    const exam = await tx.exam.findFirst({
      where: { id: examId, ownerId },
    });

    if (!exam) throw new Error("Exam not found or unauthorized");

    if (new Date() >= exam.startDate) {
      throw new Error("Cannot unenroll after exam has started");
    }

    try {
      return await tx.examEnrollment.delete({
        where: {
          userId_examId: {
            userId: targetUserId,
            examId,
          },
        },
      });
    } catch (err) {
      if (err.code === "P2025") {
        throw new Error("User is not enrolled in this exam");
      }
      throw err;
    }
  });
}
