import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../utils/trpc.js";

export const test = publicProcedure.query(() => {
    throw new TRPCError({ code: "FORBIDDEN" });
})