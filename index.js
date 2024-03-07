require("dotenv").config();
const express = require("express");
const db = require("./db/mongodb");
const pino = require("pino");
const expressPinoLogger = require("express-pino-logger");
const auth = require("./auth/routes");
const polls = require("./polls/routes");

const app = express();
const logger = pino({ level: process.env.LOG_LEVEL || "info" });
const expressLogger = expressPinoLogger({ logger });
app.use(expressLogger);
app.use(express.json());
app.use("/auth", auth);
app.use("/polls", polls);

async function start() {
  await db.init();

  app.listen(process.env.PORT, () => {
    console.log("server is running on port " + process.env.PORT);
  });
}

start()
  .then(() => console.log("start complete"))
  .catch((err) => console.log(err));
