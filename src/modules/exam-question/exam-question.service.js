import prisma from "../../../prisma/client.js";

export async function addExamQuestion(userId, examId, data) {
  const { distributeMark, questions } = data;

  if (!examId || !userId) {
    throw new Error("ExamId and userId are required");
  }
  if (!questions || questions.length === 0) {
    throw new Error("At least one question is required");
  }

  return prisma.$transaction(async (tx) => {

    // 1️⃣ Verify exam ownership
    const exam = await tx.exam.findFirst({
      where: {
        id: examId,
        creatorId: userId,
      },
    });

    if (!exam) {
      throw new Error("Unauthorized or exam not found");
    }

    // 2️⃣ Prevent duplicates already attached
    const existing = await tx.questionTest.findMany({
      where: {
        examId,
        questionId: {
          in: questions.map(q => q.id),
        },
      },
    });

    if (existing.length > 0) {
      throw new Error("One or more questions already added to this exam");
    }

    let questionData = [];

    // 3️⃣ Distribute Marks Equally
    if (distributeMark) {
      const totalMark = exam.totalMark;
      const count = questions.length;

      if (!totalMark || totalMark <= 0) {
        throw new Error("Exam totalMark must be set before distribution");
      }

      const rawMark = totalMark / count;

      // Round to 2 decimal places
      const roundedMark = Number(rawMark.toFixed(2));

      let accumulated = 0;

      questions.forEach((q, index) => {
        let mark = roundedMark;

        // For last question, assign remaining balance
        if (index === count - 1) {
          mark = Number((totalMark - accumulated).toFixed(2));
        }

        accumulated += mark;

        questionData.push({
          examId,
          questionId: q.id,
          mark,
        });
      });

    } else {
      // 4️⃣ Manual Marks Validation

      const total = questions.reduce((sum, q) => {
        if (typeof q.mark !== "number") {
          throw new Error("Each question must have a mark");
        }
        return sum + q.mark;
      }, 0);

      if (Number(total.toFixed(2)) !== Number(exam.totalMark.toFixed(2))) {
        throw new Error("Sum of question marks must equal exam totalMark");
      }

      questionData = questions.map(q => ({
        examId,
        questionId: q.id,
        mark: q.mark,
      }));
    }

    // 5️⃣ Create QuestionTest entries
    await tx.questionTest.createMany({
      data: questionData,
    });

    return { success: true };
  });
}

