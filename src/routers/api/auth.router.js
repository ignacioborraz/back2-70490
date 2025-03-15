import { Router } from "express";
import { usersManager } from "../../data/mongo/manager.mongo.js";

const authRouter = Router();

const register = async (req, res, next) => {
  try {
    const data = req.body;
    /* validar propiedades obligatorio */
    /* proteger la contraseña */
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
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    /* validar la contraseña */
    const response = await usersManager.readBy({ email });
    if (response.password !== password) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }
    req.session.user_id = response._id;
    req.session.email = email;
    req.session.role = response.role;
    res.status(200).json({
      response,
      method: req.method,
      url: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
};
const online = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      res.status(200).json({
        user_id: req.session.user_id,
        method: req.method,
        url: req.originalUrl,
      });
    } else {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
const signout = async (req, res, next) => {
  try {
    req.session.destroy();
    res.status(200).json({
      message: "Signed out",
      method: req.method,
      url: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
};

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/online", online);
authRouter.post("/signout", signout);

export default authRouter;
