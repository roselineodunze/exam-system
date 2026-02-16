import bcrypt from "bcrypt";
import prisma from "../../../prisma/client.js";

export async function getAllUserQuestions({userId}) {
  const questions = await prisma.question.findMany({
    where: {
      creatorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return questions;
}
