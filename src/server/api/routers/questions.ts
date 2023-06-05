import { z } from "zod";
import _sampleSize from "lodash/sampleSize";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

const simplifyWordForComparaison = (word: string) => {
  return word
    .toLowerCase()
    .replaceAll(/and/g, "")
    .replaceAll(/the/g, "")
    .replaceAll(/of/g, "")
    .replaceAll(/:/g, "")
    .trim()
    .replaceAll(/\s/g, "");
};

export const questionRouter = createTRPCRouter({
  generateQuiz: publicProcedure
    .input(
      z.object({
        username: z.string(),
        numberOfQuestions: z.number().min(2).max(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { numberOfQuestions, username } = input;

      const everyQuestion = await ctx.prisma.question.findMany({
        select: { id: true },
      });

      const randomQuestionsIds = _sampleSize(
        everyQuestion,
        numberOfQuestions
      ).map(({ id }) => id);

      const createdScore = await ctx.prisma.score.create({
        data: {
          username,
          numberOfQuestions,
        },
      });

      return {
        questionsIds: randomQuestionsIds,
        quizId: createdScore.id,
      };
    }),
  getQuestionById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const question = await ctx.prisma.question.findUnique({
        where: { id: input.id },
        select: { emoji: true, id: true, type: true },
      });

      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No question found",
        });
      }

      return question;
    }),

  answerQuestion: publicProcedure
    .input(
      z.object({
        questionId: z.string(),
        answer: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.prisma.question.findUnique({
        where: { id: input.questionId },
        select: { name: true, emoji: true },
      });

      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No question found",
        });
      }

      const isAnswerCorrect =
        simplifyWordForComparaison(question.name) ===
        simplifyWordForComparaison(input.answer);

      return {
        isAnswerCorrect,
        questionEmoji: question.emoji,
        correctAnswer: question.name,
      };
    }),
});
