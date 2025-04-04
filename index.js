import "dotenv/config.js";
import express from "express";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import __dirname from "./utils.js";
import dbConnect from "./src/helpers/dbConnect.helper.js";
import router from "./src/routers/index.router.js";
import errorHandler from "./src/middlewares/errorHandler.mid.js";
import pathHandler from "./src/middlewares/pathHandler.mid.js";

/* server settings */
const server = express();
const port = process.env.PORT || 8080;
const ready = () => {
  console.log("server ready on port " + port);
  dbConnect(process.env.MONGO_URL);
};
server.listen(port, ready);

/* engine settings */
server.engine("handlebars", engine());
server.set("view engine", "handlebars");
server.set("views", __dirname + "/src/views");

/* middlewares settings */
server.use(morgan("dev"));
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cookieParser(process.env.COOKIE_KEY));

/* routers settings */
server.use("/", router);
server.use(errorHandler);
server.use(pathHandler);
