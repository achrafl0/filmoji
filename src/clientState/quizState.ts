/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { create } from "zustand";
import Router from "next/router";
import { toast } from "react-hot-toast";

type State = {
  username: string | null;
  currentQuizId: string | null;
  currentQuestionIndex: number;
  currentQuizQuestionsIds: string[];
  currentScore: number;
};

type StateForQuizStart = Pick<
  State,
  "currentQuizId" | "currentQuizQuestionsIds" | "username"
>;
type AnswerQuestionPayload = {
  newScore: number;
  isCorrectAnswer: boolean;
  correctAnswer: string;
};

type Action = {
  answerQuestion: ({
    isCorrectAnswer,
    newScore,
    correctAnswer,
  }: AnswerQuestionPayload) => {
    isFinished: boolean;
    nextScore: number;
    nextQuestionId: string;
  };

  startQuiz: ({
    currentQuizId,
    currentQuizQuestionsIds,
    username,
  }: StateForQuizStart) => Promise<void>;

  reset: () => void;
};

const initialState: Partial<State> = {
  currentScore: 0,
  currentQuizId: null,
  currentQuestionIndex: -1,
  currentQuizQuestionsIds: [],
};

export const useQuizStore = create<State & Action>((set, get) => ({
  username: null,
  startedAt: null,
  currentScore: 0,
  currentQuizId: null,
  currentQuestionIndex: -1,
  currentQuizQuestionsIds: [],
  answerQuestion: ({ isCorrectAnswer, correctAnswer, newScore }) => {
    if (isCorrectAnswer) {
      toast.success("Correct 🎉");
    } else {
      toast.error(`Wrong 🙊 The correct movie was ${correctAnswer}`);
    }
    const { currentQuestionIndex, currentQuizQuestionsIds } = get();
    const isFinished =
      currentQuestionIndex === currentQuizQuestionsIds.length - 1;
    const nextScore = newScore;
    const nextQuestionIndex = isFinished
      ? currentQuestionIndex
      : currentQuestionIndex + 1;

    const nextQuestionId = currentQuizQuestionsIds[nextQuestionIndex]!;

    set({
      currentScore: nextScore,
      currentQuestionIndex: nextQuestionIndex,
    });

    return { isFinished, nextScore, nextQuestionId };
  },
  startQuiz: async ({ currentQuizId, currentQuizQuestionsIds, username }) => {
    toast.success("Let's get started !");
    set({
      currentQuizId,
      currentQuestionIndex: 0,
      currentQuizQuestionsIds,
      username,
      currentScore: 0,
    });

    await Router.push(`/question/${currentQuizQuestionsIds[0]!}`);
  },

  reset: () => set(initialState),
}));
