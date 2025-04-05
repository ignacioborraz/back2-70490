import CustomRouter from "../custom.router.js";
import { productsManager } from "../../data/mongo/managers/manager.mongo.js";
import passportCb from "../../middlewares/passportCb.mid.js";
import { Types } from "mongoose";

const createOne = async (req, res) => {
  const data = req.body;
  const response = await productsManager.createOne(data);
  res.status(201).json({
    response,
    method: req.method,
    url: req.originalUrl,
  });
};
const readAll = async (req, res) => {
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
};
const readById = async (req, res) => {
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
};
const updateById = async (req, res) => {
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
};
const destroyById = async (req, res) => {
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
};
const pidParam = (req, res, next, pid) => {
  try {
    const isObjectId = Types.ObjectId.isValid(pid);
    if (isObjectId) return next();
    const error = new Error("Invalid ID");
    error.statusCode = 400;
    throw error;
  } catch (error) {
    next(error);
  }
};

class ProductsRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }
  init = () => {
    this.create("/", passportCb("admin"), createOne);
    this.read("/", readAll);
    this.read("/:pid", readById);
    this.update("/:pid", passportCb("admin"), updateById);
    this.destroy("/:pid", passportCb("admin"), destroyById);
    this.router.param("pid", pidParam);
  };
}

let productsRouter = new ProductsRouter();
productsRouter = productsRouter.getRouter();
export default productsRouter;
