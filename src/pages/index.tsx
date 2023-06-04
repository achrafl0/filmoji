import { type NextPage } from "next";
import { api } from "@/utils/api";
import { Input, Button, HeadLayout, PageLayout } from "@/components";

type Props = Record<string, never>;

const Home: NextPage<Props> = ({}) => {
  return (
    <>
      <HeadLayout />
      <PageLayout>
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Start playing <span className="text-[#FCC252]">Filmoji 🍿</span>
        </h1>
        <div className="flex w-3/5 flex-row justify-items-center gap-4 align-middle">
          <Input placeholder="Write your guess here !" />
          <Button text="Guess" />
        </div>
      </PageLayout>
    </>
  );
};

export default Home;
