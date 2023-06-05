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
import { useState } from "react";
import toast from "react-hot-toast";
import { shallow } from "zustand/shallow";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const QuestionPage: NextPage<Props> = ({
      questionId,
    }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [answer, setAnswer] = useState<string>("");
  const [answerQuestion] = useQuizStore(
    (state) => [state.answerQuestion],
    shallow
  );
  const {
    data: question,
    error: questionError,
    isLoading: isQuestionLoading,
  } = api.question.getQuestionById.useQuery({
    id: questionId,
  });

  const { mutate: answerQuestionMutation, isLoading: isAnswering } =
    api.question.answerQuestion.useMutation({
      onSuccess: async ({ isAnswerCorrect, questionEmoji, correctAnswer }) => {
        await answerQuestion({
          isAnswerCorrect,
          question: questionEmoji,
          correctAnswer,
        });
      },
    });

  if (questionError) {
    return <p>Error oupsi</p>;
  }

  if (isQuestionLoading || !question) {
    return <LoadingPage />;
  }

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
          />
          <Button
            text={!isAnswering ? "Guess" : "Guessing..."}
            disabled={isAnswering}
            onClick={() => {
              answerQuestionMutation({
                answer,
                questionId,
              });
              setAnswer("");
            }}
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
