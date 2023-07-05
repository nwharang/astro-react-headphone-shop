import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../utils/trpc.js";

const errorCreate = (code) = publicProcedure.query(() => {
    throw new TRPCError({ code })
})

const error = {
    400: errorCreate("BAD_REQUEST"),
    401: errorCreate("UNAUTHORIZED"),
    403: errorCreate("FORBIDDEN"),
    404: errorCreate("NOT_FOUND"),
    429: errorCreate("TOO_MANY_REQUESTS"),
    500: errorCreate("INTERNAL_SERVER_ERROR"),
}
export default error