import { Router } from "express";

const usersRouter = Router();

const create = () => {};
const readAll = () => {};
const readById = () => {};
const updateById = () => {};
const destroyById = () => {};

usersRouter.post("/", createOne);
usersRouter.get("/", readAll);
usersRouter.get("/:uid", readById);
usersRouter.put("/:uid", updateById);
usersRouter.delete("/:uid", destroyById);

export default usersRouter;
