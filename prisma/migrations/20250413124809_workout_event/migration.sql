/*
  Warnings:

  - You are about to drop the column `date` on the `WorkoutEvent` table. All the data in the column will be lost.
  - Added the required column `start` to the `WorkoutEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkoutEvent" DROP COLUMN "date",
ADD COLUMN     "end" TIMESTAMP(3),
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;
