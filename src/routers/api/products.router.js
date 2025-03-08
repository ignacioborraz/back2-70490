import { Router } from "express";

const productsRouter = Router();

const createOne = () => {};
const readAll = () => {};
const readById = () => {};
const updateById = () => {};
const destroyById = () => {};

productsRouter.post("/", createOne);
productsRouter.get("/", readAll);
productsRouter.get("/:uid", readById);
productsRouter.put("/:uid", updateById);
productsRouter.delete("/:uid", destroyById);

export default productsRouter;