import "./src/helpers/setEnv.helper.js"
import express from "express";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors"
import __dirname from "./utils.js";
import router from "./src/routers/index.router.js";
import errorHandler from "./src/middlewares/errorHandler.mid.js";
import pathHandler from "./src/middlewares/pathHandler.mid.js";
import args from "./src/helpers/setArgs.helper.js";

/* server settings */
const server = express();
const port = process.env.PORT || 8080;
const ready = () => {
  console.log("server ready on port " + port);
  console.log("server ready on mode " + args.mode);
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
server.use(cors({
  origin: true, // cuando tengamos la url del front se cambia true por la url
  credentials: true
}))

/* routers settings */
server.use("/", router);
server.use(errorHandler);
server.use(pathHandler);

//console.log(process.pid);
//console.log(process.platform);
//console.log(process.argv);
