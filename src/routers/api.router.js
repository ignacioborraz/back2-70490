import { Router } from "express";
import authRouter from "./api/auth.router.js";
import productsRouter from "./api/products.router.js";
import cartsRouter from "./api/carts.router.js";
import { Types } from "mongoose";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/carts", cartsRouter);

export default apiRouter;
