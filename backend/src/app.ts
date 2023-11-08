import express, { Express, Response, NextFunction } from "express";
// parsing, logging and security packages
import * as bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { RateLimiterMemory } from "rate-limiter-flexible";
// env support
import "dotenv/config";
// configs
import corsOptionsConfig from "./configs/cors";
import rateLimiterConfig from "./configs/rateLimiter";
// DB initializing and validation
import validateDB from "./Database/validateDB";
// Error Handling Model
import HttpError from "./Models/http-error";
// Routes
import commandsRouter from "./Routes/commandsRouter";
import usersRouter from "./Routes/usersRouter";
// types
import Request from "./Types/ExtendedRequest";

const app: Express = express();

// security middlewares
app.use(cors(corsOptionsConfig));
app.use(helmet());
const rateLimiter = new RateLimiterMemory(rateLimiterConfig);
app.use((req: Request, res: Response, next: NextFunction) => {
  rateLimiter
    .consume(req.ip)
    .then(() => next())
    .catch(() => res.status(429).send("Too Many Requests"));
});

// parsing body and logging
app.use(bodyParser.json());
app.use(morgan("tiny"));

app.use("/commands", commandsRouter);
app.use("/users", usersRouter);

// error handler
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  //this function will execute if any middleware Infront of it yields an error
  if (res.headersSent) {
    //check if respond already has been sent
    return next(error);
  }

  console.log(error);
  //if code properties is set or default 500 => error code that something went wrong
  console.log(error.message);
  return res.status(error.code || 500).json({
    body: error.message || "An unknown error occurred!",
    success: !!error.success,
  });
});

const validateDBSuccessful = validateDB();
if (validateDBSuccessful) {
  app.listen(process.env.PORT ?? 5000, () => {
    console.log(`The server is running on port ${process.env.PORT ?? 5000}`);
  });
} else {
  console.log("could not start the server, DB isn't working properly :(");
}