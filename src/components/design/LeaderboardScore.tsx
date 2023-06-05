import type { NextComponentType, NextPageContext } from "next";

type Props = {
  rank: number;
  username: string;
  score: number;
};

const medalForRank = (rank: number) => {
  if (rank === 0) {
    return "🥇";
  }
  if (rank === 1) {
    return "🥈";
  }
  if (rank === 2) {
    return "🥉";
  }
  return "";
};

export const LeaderboardScore: NextComponentType<
  NextPageContext,
  Props,
  Props
> = ({ rank, score, username }) => {
  const medal = medalForRank(rank);

  return (
    <div className="w-100 mb-2 flex flex-row rounded bg-secondary-800 pl-5">
      <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-[1rem]">
        {rank + 1}
        {medal}
        {" - "}
        {username}
        {" : "}
        <span className="text-primary-500">{score}</span>
      </h1>
    </div>
  );
};
