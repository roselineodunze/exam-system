/*
  Warnings:

  - You are about to drop the column `markPerQuestion` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `totalQuestions` on the `Exam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "markPerQuestion",
DROP COLUMN "totalQuestions";
