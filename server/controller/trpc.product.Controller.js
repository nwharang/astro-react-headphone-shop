import productAdapter from "../model/product.js";
import rateLimitAdapter from "../model/rateLimiter.js";
import prisma from "../utils/connectDB.js";
import { middleware, publicProcedure } from "../utils/trpc.js";
import { z } from "zod";
import { TRPCError } from "@trpc/server";


const useRateLimiter = middleware(async ({ ctx, next }) => {
    const getIP = () =>
        ctx.req.ip ||
        ctx.req.headers["x-forwarded-for"] ||
        ctx.req.headers["x-real-ip"] ||
        ctx.req.connection.remoteAddress;
    let rateLimiter = await rateLimitAdapter(prisma).validateIp(
        getIP(),
        2,
        1 * 60 * 1000
    );
    // rateLimiter returns null then
    if (!rateLimiter) {
        throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
        });
    }
    return next({ ctx });
});

let cachedData;
let lastCacheTime;

/**
 * get list of products
 * @type {Controller}
 */
const product = publicProcedure
    .input(
        z
            .object({
                cursor: z.number().optional(),
            })
            .optional()
    )
    .query(async ({ input }) => {
        let data = await productAdapter(prisma).getProduct(input.cursor);
        return data;
    })

/**
 * get product by id
 * @type {Controller}
 */
const productId = publicProcedure
    .use(useRateLimiter)
    .input(
        z.object({
            id: z.string(),
        })
    )
    .query((req) => {
        return productAdapter(prisma).getProductById(req.input.id);
    })

/**
 * get list of all product
 * @type {Controller}
 */
const productSearch = publicProcedure.query(async () => {
    if (cachedData && lastCacheTime > Date.now() - 5 * 60 * 1000) {
        return cachedData;
    } else {
        cachedData = await productAdapter(prisma).getProductSearch();
        lastCacheTime = Date.now();
        return cachedData;
    }
})


export { product, productId, productSearch }