/*
  Warnings:

  - You are about to drop the column `orderInProgram` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `programId` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the `WorkoutProgram` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_programId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutProgram" DROP CONSTRAINT "WorkoutProgram_userId_fkey";

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "orderInProgram",
DROP COLUMN "programId";

-- DropTable
DROP TABLE "WorkoutProgram";
