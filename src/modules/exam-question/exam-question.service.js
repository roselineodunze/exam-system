import prisma from "../../../prisma/client.js";

export async function addExamQuestion(userId, examId, data) {
  const { questions } = data;

  if (!examId || !userId) {
    throw new Error("ExamId and userId are required");
  }

  if (data.totalMark === undefined || data.totalMark <= 0) {
    throw new Error("Exam totalMark must be provided and greater than 0");
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.questionTest.findMany({
      where: {
        examId,
        questionId: {
          in: questions.map((q) => q.id),
        },
      },
      select: {
        questionId: true,
      },
    });

    const existingIds = existing.map((q) => q.questionId);

    const newQuestions = questions.filter((q) => !existingIds.includes(q.id));

    if (newQuestions.length > 0) {
      const questionData = newQuestions.map((q) => ({
        examId,
        questionId: q.id,
        mark: 0,
      }));

      await tx.questionTest.createMany({
        data: questionData,
      });
    }

    const exam = await tx.exam.findFirst({
      where: { id: examId, ownerId: userId },
      include: { questions: true },
    });

    if (!exam) throw new Error("Exam not found or unauthorized");

    const updatedExam = await tx.exam.update({
      where: { id: examId },
      data: {
        totalMark: data.totalMark ?? exam.totalMark,
        distributeMark: data.distributeMark ?? exam.distributeMark,
      },
    });

    if (updatedExam.distributeMark) {
      const totalMark = updatedExam.totalMark;
      const count = exam.questions.length;

      const rawMark = totalMark / count;

      // Round to 2 decimal places
      const roundedMark = Number(rawMark.toFixed(2));

      let accumulated = 0;
      let newQuestionData = []

      exam.questions.forEach((q, index) => {
        let mark = roundedMark;

        // For last question, assign remaining balance
        if (index === count - 1) {
          mark = Number((totalMark - accumulated).toFixed(2));
        }

        accumulated += mark;

        newQuestionData.push({
          questionId: q.id,
          mark,
        });
      });

      await Promise.all(
        newQuestionData.map((q) =>
          tx.questionTest.update({
            where: {
              examId_questionId: {
                examId,
                questionId: q.questionId,
              },
            },
            data: {
              mark: q.mark,
            },
          })
        )
      );
    } else {
      // 4️⃣ Manual Marks Validation

      const total = questions.reduce((sum, q) => {
        if (typeof q.mark !== "number") {
          throw new Error("Each question must have a mark");
        }
        if (q.mark <= 0) {
          throw new Error("Each question mark must be greater than 0");
        }
        return sum + q.mark;
      }, 0);

      if (total > updatedExam.totalMark) {
        throw new Error("Total question marks cannot exceed exam totalMark");
      }

      await Promise.all(
        questions.map((q) =>
          tx.questionTest.update({
            where: {
              examId_questionId: {
                examId,
                questionId: q.id,
              },
            },
            data: {
              mark: q.mark,
            },
          })
        )
      );
    }
    return {
      success: true,
      data: await tx.exam.findFirst({
        where: {
          id: examId,
          ownerId: userId,
        },
        include: {
          questions: true,
        },
      }),
    };
  });
}

