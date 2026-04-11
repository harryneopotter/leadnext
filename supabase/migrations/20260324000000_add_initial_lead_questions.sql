-- AlterTable
ALTER TABLE "AdminSettings" ADD COLUMN "initialLeadQuestions" JSONB;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "initialQuestionResponses" JSONB;
