import {
  HeadLayout,
  PageLayout,
  Button,
  Input,
  LoadingPage,
} from "@/components";
import type { EmptyObject } from "@/utils";
import { api } from "@/utils/api";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const QuestionPage: NextPage = ({}: EmptyObject) => {
  const router = useRouter();
  const questionId = router.query.id;
  if (!questionId || Array.isArray(questionId)) {
    return <p>404</p>;
  }
  const {
    data: question,
    error,
    isLoading,
  } = api.question.getQuestionById.useQuery({
    id: questionId,
  });

  if (error) {
    return <p>Error oupsi</p>;
  }

  if (isLoading || !question) {
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
          <Input placeholder="Write your guess here !" />
          <Button text="Guess" />
        </div>
      </PageLayout>
    </>
  );
};

export default QuestionPage;
