import { Router } from "express";
import {
  homeView,
  profileView,
  detailsView,
  cartView,
  registerView,
  loginView,
  verifyView,
} from "../controllers/views.controller.js";
const viewsRouter = Router();

viewsRouter.get("/", homeView);
viewsRouter.get("/profile/:user_id", profileView);
viewsRouter.get("/product/:product_id", detailsView);
viewsRouter.get("/cart/:user_id", cartView);
viewsRouter.get("/register", registerView);
viewsRouter.get("/login", loginView);
viewsRouter.get("/verify", verifyView);

export default viewsRouter;
