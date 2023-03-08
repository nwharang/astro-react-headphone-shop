import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import { handler as ssrHandler } from "../../build/server/index.mjs";
import { errorHandler } from "./errHandler.js";
import { header } from "./header.js";
import { logEvents } from "./logger.js";
import { Passport } from "./passport.js";
import { trpc } from "./trpc.js";

export default async function loadMiddleware(app, express, cb = () => {}) {
  await logEvents(app, express);
  app.set("etag", "strong");
  app.use(header);
  app.use(
    cors({
      method: "GET,POST",
    })
  );
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(compression()); // G-Zip Compression - Compress about 20%
  Passport(app, express);
  cb();
  app.use(ssrHandler);
  app.use(express.static("./build/client/", { redirect: true }));
  app.use("/trpc", trpc);
  app.use(errorHandler);
}
