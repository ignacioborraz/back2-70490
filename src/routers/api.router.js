import { Router } from "express";
import usersRouter from "./api/users.router.js"

const apiRouter = Router();

apiRouter.use("/users", usersRouter)

export default apiRouter;
