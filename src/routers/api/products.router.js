import CustomRouter from "../custom.router.js";
import { productsManager } from "../../data/mongo/managers/manager.mongo.js";
import passportCb from "../../middlewares/passportCb.mid.js";
import { Types } from "mongoose";

const createOne = async (req, res) => {
  const data = req.body;
  const response = await productsManager.createOne(data);
  res.json201(response)
};
const readAll = async (req, res) => {
  const filter = req.query;
  const response = await productsManager.readAll(filter);
  if (response.length === 0) {
    res.json404()
  }
  res.json200(response)
};
const readById = async (req, res) => {
  const { pid } = req.params;
  const response = await productsManager.readById(pid);
  if (!response) {
    res.json404()
  }
  res.json200(response)
};
const updateById = async (req, res) => {
  const { pid } = req.params;
  const data = req.body;
  const response = await productsManager.readById(pid);
  if (!response) {
    res.json404()
  }
  res.json200(response)
};
const destroyById = async (req, res) => {
  const { pid } = req.params;
  const response = await productsManager.destroyById(pid);
  if (!response) {
    res.json404()
  }
  res.json200(response)
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
    this.create("/", ["ADMIN"], createOne);
    this.read("/", ["PUBLIC"], readAll);
    this.read("/:pid", ["PUBLIC"], readById);
    this.update("/:pid", ["ADMIN"], updateById);
    this.destroy("/:pid", ["ADMIN"], destroyById);
    this.router.param("pid", pidParam);
  };
}

let productsRouter = new ProductsRouter();
productsRouter = productsRouter.getRouter();
export default productsRouter;
