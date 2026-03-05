import bcrypt from "bcrypt";
import prisma from "../../../prisma/client.js";
import { signJWTtoken } from "../../../utils/jwt.js";

export async function signup({ email, username, password }) {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const profile = await tx.profile.create({
      data: {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
    });
    console.log("user created");
    return { user, profile };
  });

  const token = signJWTtoken({ userId: result.user.id, email: result.user.email, username: result.user.username });

  return {
    user: {
      id: result.user.id,
      email: result.user.email,
      username: result.user.username,
    },
    token,
  };
}

export async function login({ email, password }) {
  console.log(email)
  console.log(password)
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.password);

  const token = signJWTtoken({ userId: user.id, email: user.email });

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    token,
  };
}
