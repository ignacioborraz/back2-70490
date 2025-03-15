import { Router } from "express";
import { productsManager } from "../../data/mongo/manager.mongo.js";

const productsRouter = Router();

const createOne = async (req, res, next) => {
  try {
    const data = req.body;
    const response = await productsManager.createOne(data);
    res.status(201).json({
      response,
      method: req.method,
      url: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
};
const readAll = async (req, res, next) => {
  try {
    const filter = req.query;
    const response = await productsManager.readAll(filter);
    if (response.length === 0) {
      const error = new Error("Not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      response,
      method: req.method,
      url: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
};
const readById = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const response = await productsManager.readById(pid);
    if (!response) {
      const error = new Error("Not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      response,
      method: req.method,
      url: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
};
const updateById = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const data = req.body;
    const response = await productsManager.readById(pid);
    if (!response) {
      const error = new Error("Not found");
      error.statusCode = 404;
      throw error;
    }
    await productsManager.updateById(pid, data);
    res.status(200).json({
      response,
      method: req.method,
      url: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
};
const destroyById = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const response = await productsManager.destroyById(pid);
    if (!response) {
      const error = new Error("Not found");
      error.statusCode = 404;
      throw error;
    }
    await productsManager.destroyById(pid);
    res.status(200).json({
      response,
      method: req.method,
      url: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
};

productsRouter.post("/", createOne);
productsRouter.get("/", readAll);
productsRouter.get("/:pid", readById);
productsRouter.put("/:pid", updateById);
productsRouter.delete("/:pid", destroyById);

export default productsRouter;
