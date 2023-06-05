import { HeadLayout, LoadingPage } from "@/components";
import { LeaderboardScore } from "@/components/design/LeaderboardScore";
import type { EmptyObject } from "@/utils";
import { api } from "@/utils/api";
import type { NextPage } from "next";
import Link from "next/link";

const Leaderboard: NextPage<EmptyObject> = ({}) => {
  const { data: leaderboardData, isLoading } =
    api.question.getLeaderboard.useQuery();

  if (isLoading || !leaderboardData) {
    return <LoadingPage />;
  }

  return (
    <>
      <HeadLayout title="Leaderboard 🏆" />
      <header className="flex w-screen  flex-row content-end gap-2 bg-gray-800 pl-2 pt-2">
        <Link href="/">
          <h1 className="text-xl font-extrabold tracking-tight text-primary-500 ">
            🍿 |
          </h1>
        </Link>
        <Link href="/leaderboard">
          <h1 className="text-xl font-extrabold tracking-tight text-primary-500 ">
            🏆
          </h1>
        </Link>
      </header>
      <main className="flex max-h-screen min-h-screen flex-col items-center justify-center bg-gray-800">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Leader<span className="text-primary-500">board</span>
          </h1>
          <div className="flex w-2/4 flex-col">
            {leaderboardData.map(({ score, username, id }, index) => {
              return (
                <LeaderboardScore
                  rank={index}
                  score={score}
                  username={username}
                  key={id}
                />
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default Leaderboard;
