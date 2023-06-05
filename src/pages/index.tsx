import { type NextPage } from "next";
import { api } from "@/utils/api";
import { Input, Button, HeadLayout, PageLayout, Modal } from "@/components";
import type { EmptyObject } from "@/utils";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useQuizStore } from "@/clientState/quizState";
import { shallow } from "zustand/shallow";
type Props = EmptyObject;

const Home: NextPage<Props> = ({}) => {
  const [username, setUsername] = useState<string>("");
  const [isModalOpened, setModalState] = useState<boolean>(false);
  const [startQuiz, resetQuiz] = useQuizStore(
    (state) => [state.startQuiz, state.reset],
    shallow
  );
  const { mutate } = api.question.generateQuiz.useMutation({
    onSuccess: async ({ questionsIds, quizId }) => {
      await startQuiz({
        currentQuizId: quizId,
        currentQuizQuestionsIds: questionsIds,
        username,
      });
    },
  });

  useEffect(() => {
    resetQuiz();
  });
  return (
    <>
      <HeadLayout />
      <Modal
        isOpen={isModalOpened}
        onClose={() => {
          setModalState(false);
        }}
        title="Add a question"
      />
      <PageLayout>
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Start playing <span className="text-[#FCC252]">Filmoji 🍿</span>
        </h1>
        <div className="flex w-3/5 flex-row justify-items-center gap-4 align-middle">
          <Input
            placeholder="Your username"
            value={username}
            onChange={setUsername}
          />
          <Button
            text="Let's go !"
            onClick={() => {
              mutate({
                username,
                numberOfQuestions: 3,
              });
            }}
          />
        </div>
        <Button
          text="+ Add question"
          onClick={() => {
            setModalState(true);
          }}
        />
      </PageLayout>
    </>
  );
};

export default Home;
