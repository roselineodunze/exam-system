-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "isCorrect" DROP NOT NULL,
ALTER COLUMN "isCorrect" SET DEFAULT false;
