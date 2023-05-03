import { ZodError } from "zod";
import { initTRPC, TRPCError } from "@trpc/server";
import prisma from './connectDB.js';
import rateLimitAdapter from '../model/rateLimiter.js'
/**
 * You should initialize tRPC exactly once per application. Multiple instances of tRPC will cause issues.
 */
const t = initTRPC.context().create({
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.code === "BAD_REQUEST" && error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        };
    },
});

/**
 * Defind Router instance
 * */
const router = t.router;
/**
 * Defind Router middleware
 */
const middleware = t.middleware;
/**
 * Defind procedure
 */
const publicProcedure = t.procedure;

const isAuth = middleware(({ ctx, next }) => {
    if (!ctx.req.isAuthenticated()) {
        return next({
            ctx: {
                error: true,
                errorMessage: {
                    code: 401,
                    error: true,
                    message: "Unauthorized",
                },
            },
        });
    }
    return next({ ctx });
});

const useRateLimiter = middleware(async ({ ctx, next }) => {
    const getIP = () =>
        ctx.req.ip ||
        ctx.req.headers["x-forwarded-for"] ||
        ctx.req.headers["x-real-ip"] ||
        ctx.req.connection.remoteAddress;
    let rateLimiter = await rateLimitAdapter(prisma).validateIp(
        getIP(),
        20,
        5 * 60 * 1000
    );
    // rateLimiter returns null then
    if (!rateLimiter) {
        throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
        });
    }
    return next({ ctx });
});

/**
 * Defind procedure with auth
 */
const userProcedure = t.procedure.use(isAuth);

export { router, middleware, publicProcedure, userProcedure, useRateLimiter }
