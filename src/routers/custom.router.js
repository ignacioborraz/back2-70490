import { Router } from "express";

class CustomRouter {
  constructor() {
    this.router = Router();
  }
  getRouter = () => this.router;
  applyMiddlewares = (cbs) =>
    cbs.map((cb) => async (req, res, next) => {
      try {
        await cb(req, res, next);
      } catch (error) {
        next(error);
      }
    });
  create = (path, ...cbs) => this.router.post(path, this.applyMiddlewares(cbs));
  read = (path, ...cbs) => this.router.get(path, this.applyMiddlewares(cbs));
  update = (path, ...cbs) => this.router.put(path, this.applyMiddlewares(cbs));
  destroy = (path, ...cbs) =>
    this.router.delete(path, this.applyMiddlewares(cbs));
  use = (path, ...cbs) => this.router.use(path, this.applyMiddlewares(cbs));
}

export default CustomRouter;
