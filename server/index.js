dotenv.config();
import * as dotenv from "dotenv";
import express from "express";
import LoadMiddleware from "./middleware/loadMiddleware.js";

// Define Variables
const app = express();
// eslint-disable-next-line no-undef
const port = process.env.NODE_ENV === "production" ? 3000 : 4000;
// Define & Use Middleware
LoadMiddleware(app, express, () => {
});
// Create Server
app.listen(port, () => {
  console.log("Created Server On Port " + port);
});
