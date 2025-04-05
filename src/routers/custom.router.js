import { Router } from "express";
import setupResponses from "../middlewares/setupResponses.mid.js";
import applyPolicies from "../middlewares/applyPolicies.mid.js";

class CustomRouter {
  constructor() {
    this.router = Router();
    this.use(setupResponses);
  }
  getRouter = () => this.router;
  applyMiddlewares = (middlewares) =>
    middlewares.map((each) => async (req, res, next) => {
      try {
        await each(req, res, next);
      } catch (error) {
        next(error);
      }
    });
  create = (path, policies, ...middlewares) =>
    this.router.post(
      path,
      applyPolicies(policies),
      this.applyMiddlewares(middlewares)
    );
  read = (path, policies, ...middlewares) =>
    this.router.get(
      path,
      applyPolicies(policies),
      this.applyMiddlewares(middlewares)
    );
  update = (path, policies, ...middlewares) =>
    this.router.put(
      path,
      applyPolicies(policies),
      this.applyMiddlewares(middlewares)
    );
  destroy = (path, policies, ...middlewares) =>
    this.router.delete(
      path,
      applyPolicies(policies),
      this.applyMiddlewares(middlewares)
    );
  use = (path, ...middlewares) =>
    this.router.use(path, this.applyMiddlewares(middlewares));
}

export default CustomRouter;
