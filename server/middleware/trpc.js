import * as trpcExpress from "@trpc/server/adapters/express";
import appRouter from "../routes/trpc.js";
export const trpc = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext: async ({ req, res }) => {
    return { req, res };
  },
});
