import express from "express";
import router from "./src/routers/index.router.js";
import errorHandler from "./src/middlewares/errorHandler.mid.js";

/* server */
const server = express();
const port = 8080;
const ready = () => console.log("server ready on port " + port);
server.listen(port, ready);

/* middlewares */
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

/* routers */
server.use("/", router);
server.use(errorHandler);
