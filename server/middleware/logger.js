import fs from "fs";
import morgan from "morgan";
import path from "path";
import { __dirname } from "../utils/dirname.js";

const logEvents = async (app) => {
  let accessLogStream = fs.createWriteStream(
    path.join(__dirname, "..", "logs", "reqLog.txt"),
    { flags: "a" }
  );
  app.use(
    morgan(
      ":remote-addr\t:method\t:status\t:url\t:response-time[1] ms\t:remote-user",
      { stream: accessLogStream }
    )
  );
};
export { logEvents };
