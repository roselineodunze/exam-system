import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const student = await prisma.user.upsert({
    where: { email: "daniel@gmail.com" },
    update: {},
    create: {
      email: "daniel@gmail.com",
      username: "DanielChuks",
      password: "daniel",
    },
  });

  const lecturer = await prisma.user.upsert({
    where: { email: "roseline@gmail.com" },
    update: {},
    create: {
      email: "roseline@gmail.com",
      username: "RoselineOdu",
      password: "roseline",
    },
  });

  await prisma.profile.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      user: {
        connect: { id: student.id },
      },
      firstname: "Daniel ",
      lastname: "Chukwurah",
      email: student.email,
      username: student.username,
    },
  });

  await prisma.profile.upsert({
    where: { userId: lecturer.id },
    update: {},
    create: {
      user: {
        connect: { id: lecturer.id },
      },
      firstname: "Roseline",
      lastname: "Odunze",
      email: lecturer.email,
      username: lecturer.username,
    },
  });

  const exam = await prisma.exam.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Intro to Programming",
      instructions: "Answer all questions",
      durationMinutes: 5,
      isPublished: true,
      autoPublish: true,
      owner: {
        connect: { id: lecturer.id },
      },
      totalMark: 6.0,
    },
  });

  const question1 = await prisma.question.upsert({
    where: { id: 1 },
    update: {},
    create: {
      creator: {
        connect: { id: lecturer.id },
      },
      question: "What does HTML stand for?",
    },
  });

  const question2 = await prisma.question.upsert({
    where: { id: 2 },
    update: {},
    create: {
      creator: {
        connect: { id: lecturer.id },
      },
      question: "Which of these is a JavaScript framework?",
    },
  });

  const questionTest1 = await prisma.questionTest.upsert({
    where: {
      examId_questionId: {
        examId: exam.id,
        questionId: question1.id,
      },
    },
    update: {},
    create: {
      question: {
        connect: { id: question1.id },
      },
      exam: {
        connect: { id: exam.id },
      },
      mark: 3,
    },
  });

  const questionTest2 = await prisma.questionTest.upsert({
    where: {
      examId_questionId: {
        examId: exam.id,
        questionId: question2.id,
      },
    },
    update: {},
    create: {
      question: {
        connect: { id: question2.id },
      },
      exam: {
        connect: { id: exam.id },
      },
      mark: 3,
    },
  });

  await prisma.answer.upsert({
    where: { id: 1 },
    update: {},
    create: {
      question: {
        connect: { id: question1.id },
      },
      content: "Hyper Text Markup Language",
      isCorrect: true,
    },
  });

  await prisma.answer.upsert({
    where: { id: 2 },
    update: {},
    create: {
      question: {
        connect: { id: question1.id },
      },
      content: "High Text Machine Language",
      isCorrect: false,
    },
  });

  await prisma.answer.upsert({
    where: { id: 3 },
    update: {},
    create: {
      question: {
        connect: { id: question2.id },
      },
      content: "React",
      isCorrect: true,
    },
  });

  await prisma.answer.upsert({
    where: { id: 4 },
    update: {},
    create: {
      question: {
        connect: { id: question2.id },
      },
      content: "Laravel",
      isCorrect: false,
    },
  });

  const examAttempt = await prisma.examAttempt.upsert({
    where: { id: 1 },
    update: {},
    create: {
      user: {
        connect: { id: student.id },
      },
      displayName: student.username,
      exam: {
        connect: { id: exam.id },
      },
      isSubmitted: true,
      score: 3,
    },
  });

  await prisma.attemptAnswer.upsert({
    where: { id: 1 },
    update: {},
    create: {
      attempt: {
        connect: { id: examAttempt.id },
      },
      questionTest: {
        connect: { id: questionTest1.id },
      },
      selectedAnswerId: 2,
      isCorrect: false,
      score: 0,
    },
  });

  await prisma.attemptAnswer.upsert({
    where: { id: 2 },
    update: {},
    create: {
      attempt: {
        connect: { id: examAttempt.id },
      },
      questionTest: {
        connect: { id: questionTest2.id },
      },
      selectedAnswerId: 3,
      isCorrect: true,
      score: 3,
    },
  });

  console.log("✅ Seeding complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
