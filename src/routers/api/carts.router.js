import CustomRouter from "../custom.router.js";
import { cartsManager } from "../../data/mongo/managers/carts.mongo.js";
import isUser from "../../middlewares/isUser.mid.js";

const addProductToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user._id;
  const one = await cartsManager.addProductToCart(
    product_id,
    user_id,
    quantity
  );
  res.status(201).json({
    method: req.method,
    url: req.url,
    response: one,
  });
};
const readProductsFromUser = async (req, res) => {
  const user_id = req.user._id;
  console.log({ user_id });

  const all = await cartsManager.readProductsFromUser(user_id);
  console.log({ all });
  if (all.length > 0) {
    return res.status(200).json({
      method: req.method,
      url: req.url,
      response: all,
    });
  }
  const error = new Error("Not Found!");
  error.statusCode = 404;
  throw error;
};
const updateQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const one = await cartsManager.updateQuantity(id, quantity);
  if (one) {
    return res.status(200).json({
      method: req.method,
      url: req.url,
      response: one,
    });
  }
  const error = new Error("Not Found!");
  error.statusCode = 404;
  throw error;
};
const updateState = async (req, res) => {
  const { id, state } = req.params;
  const states = ["reserved", "paid", "delivered"];
  if (states.includes(state)) {
    const one = await cartsManager.updateState(id, state);
    if (one) {
      return res.status(200).json({
        method: req.method,
        url: req.url,
        response: one,
      });
    }
    const error = new Error("Not Found!");
    error.statusCode = 404;
    throw error;
  }
  const error = new Error("Invalid state!");
  error.statusCode = 400;
  throw error;
};
const removeProductFromCart = async (req, res) => {
  const { id } = req.params;
  const one = await cartsManager.removeProductFromCart(id);
  if (one) {
    return res.status(200).json({
      method: req.method,
      url: req.url,
      response: one,
    });
  }
  const error = new Error("Not Found!");
  error.statusCode = 404;
  throw error;
};

class CartsRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }
  init = () => {
    this.create("/", isUser, addProductToCart);
    this.read("/", isUser, readProductsFromUser);
    this.update("/:id", isUser, updateQuantity);
    this.update("/:id/:state", isUser, updateState);
    this.destroy("/:id", isUser, removeProductFromCart);
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
  };
}

const cartsRouter = new CartsRouter();
export default cartsRouter.getRouter();
