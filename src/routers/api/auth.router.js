import { Router } from "express";
import passport from "../../middlewares/passport.mid.js";
import isUser from "../../middlewares/isUser.mid.js";

const authRouter = Router();

const register = async (req, res, next) => {
  try {
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
    const response = req.user;
    const token = req.token;
    res.status(200).json({
      token,
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
    if (req.user._id) {
      res.status(200).json({
        user_id: req.user._id,
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
const google = async (req, res, next) => {
  try {
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
authRouter.post("/online", isUser, online);
authRouter.post("/signout", isUser, signout);
authRouter.get("/bad-auth", badAuth);
/* primera ruta de google para acceder a la pantalla de consentimiento y acceder al objeto profile de google con los datos del usuario */
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    failureRedirect: "/api/auth/bad-auth",
  })
);
/* segunda ruta de google para acceder a la logica de la estrategia con los datos del profile del usuario */
authRouter.get(
  "/google/cb",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/bad-auth",
  }),
  google
);

export default authRouter;
