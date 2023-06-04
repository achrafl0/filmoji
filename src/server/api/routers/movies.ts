import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const movieRouter = createTRPCRouter({
  getRandomMovie: publicProcedure.query(({ ctx }) => {
    return {
      emojis: "👑🦁",
    };
  }),
});
