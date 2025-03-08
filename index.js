import "dotenv/config.js";
import express from "express";
import dbConnect from "./src/helpers/dbConnect.helper.js";
import router from "./src/routers/index.router.js";
import errorHandler from "./src/middlewares/errorHandler.mid.js";

/* server */
const server = express();
const port = 8080;
const ready = () => {
  console.log("server ready on port " + port);
  dbConnect();
};
server.listen(port, ready);

/* engine settings */
// server.engine("handlebars", engine());
// server.set("view engine", "handlebars");
// server.set("views", __dirname + "/src/views");

/* middlewares */
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

/* routers */
server.use("/", router);
server.use(errorHandler);
