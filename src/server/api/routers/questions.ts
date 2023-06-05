import { z } from "zod";
import _sampleSize from "lodash/sampleSize";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { scoreQuestion } from "@/server/services/quiz/scoreQuestion";

export const questionRouter = createTRPCRouter({
  generateQuiz: publicProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(1, "comment ça mon boeuf, tu t'appelles RIEN ????"),
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
          score: 0,
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
        userAnswer: z.string().max(255, "on t'a pas demandé un résume"),
        quizId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.prisma.question.findUnique({
        where: { id: input.questionId },
        select: { name: true, emoji: true },
      });

      const quiz = await ctx.prisma.score.findFirst({
        where: { id: input.quizId },
      });

      if (!question || !quiz || quiz.score === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No question found",
        });
      }

      const { isCorrectAnswer, nextScore } = scoreQuestion(quiz.score)({
        correctAnswer: question.name,
        difficulty: question.emoji.length,
        lastAnsweredAt: quiz.updatedAt,
        userAnswer: input.userAnswer,
      });

      await ctx.prisma.score.update({
        where: {
          id: input.quizId,
        },
        data: {
          score: nextScore,
        },
      });

      return {
        correctAnswer: question.name,
        isCorrectAnswer,
        newScore: nextScore,
      };
    }),

  validateQuiz: publicProcedure
    .input(
      z.object({
        quizId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      console.log("HELLO");
      return ctx.prisma.score.update({
        where: {
          id: input.quizId,
        },
        data: {
          submittedAt: new Date(),
        },
      });
    }),

  addQuestion: publicProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(
            3,
            "frero, c koi ce film qui fait moins de 3 lettres, bon a part 'ça', fait pas iech"
          )
          .max(255, "on demande pas le résumé frero"),
        emojis: z
          .string()
          .emoji("Tu comprends pas quoi à EMOJIS ??? 👍🏽")
          .min(
            2,
            "1 emoji ou moins, t'a cru les gens sont telepathes???? vasy bouge tchip"
          )
          .max(255, "weshhhh on demande pas un résumé mon gaté"),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.create({
        data: {
          emoji: input.emojis,
          name: input.name,
          type: "movie",
        },
      });
    }),

  getLeaderboard: publicProcedure
    .output(
      z.array(
        z.object({ username: z.string(), score: z.number(), id: z.string() })
      )
    )
    .query(async ({ ctx }) => {
      const leaderboard = await ctx.prisma.score.findMany({
        orderBy: {
          score: "desc",
        },
        where: {
          AND: [
            {
              NOT: {
                submittedAt: null,
              },
            },
            {
              NOT: {
                score: null,
              },
            },
          ],
        },
        take: 10,
        select: {
          score: true,
          username: true,
          id: true,
        },
      });
      return leaderboard as { username: string; score: number; id: string }[];
    }),
});
