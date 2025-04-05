import CustomRouter from "../custom.router.js";
import { productsManager } from "../../data/mongo/managers/manager.mongo.js";
import isAdmin from "../../middlewares/isAdmin.mid.js";
import { Types } from "mongoose";

const createOne = async (req, res, next) => {
  const data = req.body;
  data.owner_id = req.user._id;
  const response = await productsManager.createOne(data);
  res.json201(response);
};
const readAll = async (req, res, next) => {
  const filter = req.query;
  const response = await productsManager.readAll(filter);
  if (response.length === 0) {
    res.json404();
  }
  res.json200(response);
};
const readById = async (req, res, next) => {
  const { id } = req.params;
  const response = await productsManager.readById(id);
  if (!response) {
    res.json404();
  }
  res.json200(response);
};
const updateById = async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const response = await productsManager.updateById(id, data);
  if (!response) {
    res.json404();
  }
  res.json200(response);
};
const destroyById = async (req, res, next) => {
  const { id } = req.params;
  const response = await productsManager.destroyById(id);
  if (!response) {
    res.json404();
  }
  res.json200(response);
};

class ProductsRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }
  init = () => {
    this.router.param("id", (req, res, next, id) => {
      try {
        if (!Types.ObjectId.isValid(id)) {
          const error = new Error("Invalid ID");
          error.statusCode = 400;
          throw error;
        }
        next();
      } catch (error) {
        next(error);
      }
    });
    this.create("/", ["ADMIN"], createOne);
    this.read("/", ["PUBLIC"], readAll);
    this.read("/:id", ["PUBLIC"], readById);
    this.update("/:id", ["ADMIN"], updateById);
    this.destroy("/:id", ["ADMIN"], destroyById);
  };
}

const productsRouter = new ProductsRouter();
export default productsRouter.getRouter();
