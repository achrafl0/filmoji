/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { create } from "zustand";
import Router from "next/router";
import { toast } from "react-hot-toast";

type State = {
  username: string | null;
  currentQuizId: string | null;
  currentQuestionIndex: number;
  currentQuizQuestionsIds: string[];
  finishedAt: Date | null;
  startedAt: Date | null;
  currentScore: number;
};

type StateForQuizStart = Pick<
  State,
  "currentQuizId" | "currentQuizQuestionsIds" | "username"
>;
type AnswerQuestionPayload = {
  question: string;
  isAnswerCorrect: boolean;
};

type Action = {
  answerQuestion: ({
    isAnswerCorrect,
    question,
  }: AnswerQuestionPayload) => Promise<void>;

  startQuiz: ({
    currentQuizId,
    currentQuizQuestionsIds,
    username,
  }: StateForQuizStart) => Promise<void>;
};

const computeScore = ({ isAnswerCorrect, question }: AnswerQuestionPayload) => {
  return isAnswerCorrect ? 100 * question.length : 0;
};

export const useQuizStore = create<State & Action>((set, get) => ({
  username: null,
  startedAt: null,
  currentScore: 0,
  currentQuizId: null,
  currentQuestionIndex: -1,
  finishedAt: null,
  currentQuizQuestionsIds: [],
  answerQuestion: async ({ isAnswerCorrect, question }) => {
    if (isAnswerCorrect) {
      toast.success("Correct 🎉");
    } else {
      toast.error("Wrong 🙊");
    }
    const { currentQuestionIndex, currentQuizQuestionsIds, currentScore } =
      get();
    const isFinished =
      currentQuestionIndex === currentQuizQuestionsIds.length - 1;
    const nextScore =
      currentScore + computeScore({ isAnswerCorrect, question });
    const nextQuestionIndex = isFinished
      ? currentQuestionIndex
      : currentQuestionIndex + 1;

    console.log({ nextScore, nextQuestionIndex, isFinished, currentScore });
    set({
      currentScore: nextScore,
      finishedAt: isFinished ? new Date() : null,
      currentQuestionIndex: nextQuestionIndex,
    });
    if (isFinished) {
      toast.success(`You finished the quiz ! You got ${nextScore}`);
      await Router.push("/");
      return;
    }
    await Router.push(
      `/question/${currentQuizQuestionsIds[nextQuestionIndex]!}`
    );
  },
  startQuiz: async ({ currentQuizId, currentQuizQuestionsIds, username }) => {
    toast.success("Let's get started !");
    set({
      currentQuizId,
      currentQuestionIndex: 0,
      currentQuizQuestionsIds,
      username,
      currentScore: 0,
      startedAt: new Date(),
    });

    await Router.push(`/question/${currentQuizQuestionsIds[0]!}`);
  },
}));
