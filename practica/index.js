import "dotenv/config.js";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import dbConnect from "./src/helpers/dbConnect.helper.js";
import router from "./src/routers/index.router.js";
import errorHandler from "./src/middlewares/errorHandler.mid.js";
import pathHandler from "./src/middlewares/pathHandler.mid.js";

/* server settings */
const server = express();
const port = process.env.PORT || 8080;
const ready = async () => {
  console.log("server ready on port " + port);
  dbConnect(process.env.LINK_MONGO);
};
server.listen(port, ready);

/* engine settings */
server.engine("handlebars", engine());
server.set("view engine", "handlebars");
server.set("views", __dirname + "/src/views");

/* middlewares settings */
server.use(morgan("dev"));
server.use(cookieParser(process.env.COOKIE_KEY));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static("public"));

/* router settings */
server.use("/", router);
server.use(errorHandler);
server.use(pathHandler);
