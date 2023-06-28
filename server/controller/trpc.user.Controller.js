import bcrypt from "bcrypt";
import prisma from "../utils/connectDB.js";
import userAdapter from "../model/user.js";
import { TRPCError } from "@trpc/server";
import { reCaptchaVerify } from "../utils/reCaptchaVerify.js";
import { publicProcedure, userProcedure } from "../utils/trpc.js";
import { z } from "zod";

/**
 * return the current user
 * @type {Controller}
 */
const userInfo = userProcedure.query(async ({ ctx }) => {
    if (ctx.error) return ctx.errorMessage;
    return {
        user: await userAdapter(prisma).getUser(ctx.req.user),
    };
})

/**
 * register new user
 * @type {Controller}
 */
const register = publicProcedure
    .input(
        z.object({
            email: z.string().email("Must be a valid email address"),
            password: z
                .string()
                .regex(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
                    "Password must be at least 8 to 32 characters long, 1 upper character, 1 lower character and 1 special character character"
                ),
            name: z
                .string()
                .max(32, "Name must contain at most 32 character(s)")
                .min(3, "Name must contain at least 3 character(s)"),
            gReCaptchaToken: z.string(),
        })
    )
    .mutation(async ({ input, ctx }) => {
        // verify recaptcha token
        if (input.gReCaptchaToken != "Tester") {
            let verifyToken = await reCaptchaVerify(input.gReCaptchaToken);
            if (verifyToken.status != "success" || ctx.req.user)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: verifyToken.message,
                });
        }
        let user = await userAdapter(prisma).getUserByEmail(input.email);
        if (user) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "User already exists",
            });
        }
        if (!user)
            user = await userAdapter(prisma).createUser({
                email: input.email,
                name: input.name,
                accounts: {
                    create: {
                        password: await bcrypt.hash(input.password, 10),
                        provider: "credential",
                        type: "credential",
                    },
                },
            });
        return {
            user: user.id,
        };
    })
export { userInfo, register }