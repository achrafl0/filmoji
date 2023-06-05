import { useQuizStore } from "@/clientState/quizState";
import {
  HeadLayout,
  PageLayout,
  Button,
  Input,
  LoadingPage,
} from "@/components";
import { generateSSGHelper } from "@/server/helpers/ssgHelpers";
import { api } from "@/utils/api";
import { type DehydratedState } from "@tanstack/react-query";
import type { GetStaticProps, NextPage, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { shallow } from "zustand/shallow";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const QuestionPage: NextPage<Props> = ({
  questionId,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [answer, setAnswer] = useState<string>("");
  const router = useRouter();
  const [answerQuestion, currentQuizId] = useQuizStore(
    (state) => [state.answerQuestion, state.currentQuizId],
    shallow
  );
  if (!currentQuizId) {
    return <LoadingPage />;
  }
  const {
    data: question,
    error: questionError,
    isLoading: isQuestionLoading,
  } = api.question.getQuestionById.useQuery({
    id: questionId,
  });

  const { mutateAsync: validateQuizMutation } =
    api.question.validateQuiz.useMutation();

  const { mutate: answerQuestionMutation, isLoading: isAnswering } =
    api.question.answerQuestion.useMutation({
      onSuccess: async ({ correctAnswer, isCorrectAnswer, newScore }) => {
        const { isFinished, nextQuestionId, nextScore } = answerQuestion({
          correctAnswer,
          newScore,
          isCorrectAnswer,
        });

        if (isFinished) {
          toast.success(`You finished the quiz ! You got ${nextScore}`);
          await validateQuizMutation({ quizId: currentQuizId });
          return await router.push("/");
        }
        return await router.push(`/question/${nextQuestionId}`);
      },
    });

  if (questionError) {
    return <p>Error oupsi</p>;
  }

  if (isQuestionLoading || !question) {
    return <LoadingPage />;
  }

  const guess = () => {
    answerQuestionMutation({
      quizId: currentQuizId,
      userAnswer: answer,
      questionId,
    });
    setAnswer("");
  };

  return (
    <>
      <HeadLayout />
      <PageLayout>
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          {question.emoji}
        </h1>
        <div className="flex w-3/5 flex-row justify-items-center gap-4 align-middle">
          <Input
            placeholder="Write your guess here !"
            disabled={isAnswering}
            onChange={setAnswer}
            value={answer}
            onValidate={guess}
          />
          <Button
            text={!isAnswering ? "Guess" : "Guessing..."}
            disabled={isAnswering}
            onClick={guess}
          />
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps<{
  questionId: string;
  trpcState: DehydratedState;
}> = async (context) => {
  const ssg = generateSSGHelper();

  const questionId = context.params?.id;

  if (typeof questionId !== "string") throw new Error("no id");

  await ssg.question.getQuestionById.prefetch({ id: questionId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      questionId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default QuestionPage;
