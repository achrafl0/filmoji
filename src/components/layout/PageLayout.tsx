import { useQuizStore } from "@/clientState/quizState";
import type { ReactFCWithChildren } from "@/react";
import Link from "next/link";

export const PageLayout: ReactFCWithChildren = ({ children }) => {
  const [userName, currentScore] = useQuizStore((state) => [
    state.username,
    state.currentScore,
  ]);
  return (
    <>
      <header className="flex w-screen  flex-row content-end gap-2 bg-secondary-500 pl-2 pt-2">
        <Link href="/">
          <h1 className="text-xl font-extrabold tracking-tight text-white ">
            🍿 |
          </h1>
        </Link>
        <Link href="/">
          <h1 className="text-xl font-extrabold tracking-tight text-white ">
            🏆
          </h1>
        </Link>
        {userName && (
          <>
            <h1 className="text-xl font-extrabold tracking-tight text-white ">
              {" | "}
              {userName}{" "}
            </h1>
            <h1 className="text-2xl font-extrabold tracking-tight text-primary-500">
              {currentScore}
            </h1>
          </>
        )}
      </header>
      <main className="flex max-h-screen min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#DC2026] to-[#7E1616]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {children}
        </div>
      </main>
    </>
  );
};
