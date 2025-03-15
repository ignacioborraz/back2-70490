import { Router } from "express";
import { usersManager } from "../../data/mongo/manager.mongo.js";

const usersRouter = Router();

const createOne = async (req, res, next) => {
  try {
    const data = req.body;
    const response = await usersManager.createOne(data);
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
    const response = await usersManager.readAll(filter);
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
    const { uid } = req.params;
    const response = await usersManager.readById(uid);
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
    const { uid } = req.params;
    const data = req.body;
    const response = await usersManager.readById(uid);
    if (!response) {
      const error = new Error("Not found");
      error.statusCode = 404;
      throw error;
    }
    await usersManager.updateById(uid, data);
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
    const { uid } = req.params;
    const response = await usersManager.destroyById(uid);
    if (!response) {
      const error = new Error("Not found");
      error.statusCode = 404;
      throw error;
    }
    await usersManager.destroyById(uid);
    res.status(200).json({
      response,
      method: req.method,
      url: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
};

usersRouter.post("/", createOne);
usersRouter.get("/", readAll);
usersRouter.get("/:uid", readById);
usersRouter.put("/:uid", updateById);
usersRouter.delete("/:uid", destroyById);

export default usersRouter;
