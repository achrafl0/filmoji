import type { ReactFCWithChildren } from "@/react";

export const PageLayout: ReactFCWithChildren = ({ children }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#DC2026] to-[#7E1616]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        {children}
      </div>
    </main>
  );
};
