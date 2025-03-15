import { Router } from "express";
import passport from "../../middlewares/passport.mid.js";

const authRouter = Router();

const register = async (req, res, next) => {
  try {
    /* passport done(null, response) agrega al objeto req, la propiedad user */
    /* con los datos correspondientes del usuario */
    const response = req.user;
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
    /* passport done(null, response) agrega al objeto req, la propiedad user */
    /* con los datos correspondientes del usuario */
    const response = req.user;
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
const badAuth = async (req, res, next) => {
  try {
    const error = new Error("Bad auth from redirect");
    error.statusCode = 401;
    throw error;
  } catch (error) {
    next(error);
  }
};

authRouter.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "/api/auth/bad-auth",
  }),
  register
);
authRouter.post(
  "/login",
  passport.authenticate("login", {
    session: false,
    failureRedirect: "/api/auth/bad-auth",
  }),
  login
);
authRouter.post("/online", online);
authRouter.post("/signout", signout);
authRouter.get("/bad-auth", badAuth);

export default authRouter;
