import prisma from "../../../prisma/client.js";

// Helper: filter out already added questions
async function filterNewQuestions(tx, examId, questions) {
  console.log("filtering new questions")
  const existing = await tx.questionTest.findMany({
    where: {
      examId,
      questionId: { in: questions.map((q) => q.id) },
    },
    select: { questionId: true },
  });

  const existingIds = existing.map((q) => q.questionId);
  return questions.filter((q) => !existingIds.includes(q.id));
}

// Helper: create new questionTest rows
async function createQuestionTests(tx, examId, newQuestions) {
  console.log("filtering new questiontests")

  if (newQuestions.length === 0) return;

  const data = newQuestions.map((q) => ({
    examId,
    questionId: q.id,
    mark: 0,
  }));

  await tx.questionTest.createMany({ data });
}

// Helper: distribute marks evenly
async function distributeMarks(tx, examId, questions, totalMark) {
  console.log("distributing marks evenly")

  const count = questions.length;
  const rawMark = totalMark / count;
  const roundedMark = Number(rawMark.toFixed(2));
  let accumulated = 0;

  const updateData = questions.map((q, index) => {
    let mark = roundedMark;
    if (index === count - 1) mark = Number((totalMark - accumulated).toFixed(2));
    accumulated += mark;
    return { questionId: q.questionId, mark };
  });

  await Promise.all(
    updateData.map((q) =>
      tx.questionTest.update({
        where: { examId_questionId: { examId, questionId: q.questionId } },
        data: { mark: q.mark },
      })
    )
  );
}

// Helper: validate manual marks
function validateManualMarks(questions, totalMark) {
  console.log("validating manual marks")

  const total = questions.reduce((sum, q) => {
    if (typeof q.mark !== "number") throw new Error("Each question must have a mark");
    if (q.mark <= 0) throw new Error("Each question mark must be greater than 0");
    return sum + q.mark;
  }, 0);

  if (total > totalMark) throw new Error("Total question marks cannot exceed exam totalMark");
}

// Helper: update manual marks
async function updateManualMarks(tx, examId, questions) {
  console.log("updating manual marks")

  await Promise.all(
    questions.map((q) =>
      tx.questionTest.update({
        where: { examId_questionId: { examId, questionId: q.id } },
        data: { mark: q.mark },
      })
    )
  );
}

// Main service
export async function addExamQuestion(userId, examId, data) {
  console.log("adding exam questions")

  const { questions } = data;

  if (!examId || !userId) throw new Error("ExamId and userId are required");
  if (data.totalMark === undefined || data.totalMark <= 0)
    throw new Error("Exam totalMark must be provided and greater than 0");

  return prisma.$transaction(async (tx) => {
    const newQuestions = await filterNewQuestions(tx, examId, questions);
    await createQuestionTests(tx, examId, newQuestions);

    const exam = await tx.exam.findFirst({
      where: { id: examId, ownerId: userId },
      include: { questions: true },
    });
    if (!exam) throw new Error("Exam not found or unauthorized");

    const updatedExam = await tx.exam.update({
      where: { id: examId },
      data: {
        totalMark: data.totalMark,
        distributeMark: data.distributeMark ?? exam.distributeMark,
      },
    });

    if (updatedExam.distributeMark) {
      await distributeMarks(tx, examId, exam.questions, updatedExam.totalMark);
    } else {
      validateManualMarks(questions, updatedExam.totalMark);
      await updateManualMarks(tx, examId, questions);
    }

    return {
      success: true,
      data: await tx.exam.findFirst({
        where: { id: examId, ownerId: userId },
        include: { questions: true },
      }),
    };
  });
}