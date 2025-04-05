import CustomRouter from "../custom.router.js";
import passport from "../../middlewares/passport.mid.js";
import passportCb from "../../middlewares/passportCb.mid.js";

const register = async (req, res) => {
    const response = req.user;
    res.status(201).json({
      response,
      method: req.method,
      url: req.originalUrl,
    });
};
const login = async (req, res) => {
    const response = req.user;
    const token = req.token;
    const opts = { maxAge: 60 * 60 * 24 * 7, httpOnly: true };
    res.cookie("token", token, opts).status(200).json({
      response,
      method: req.method,
      url: req.originalUrl,
    });
};
const online = async (req, res) => {
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
};
const signout = async (req, res) => {
    res.clearCookie("token").status(200).json({
      message: "Signed out",
      method: req.method,
      url: req.originalUrl,
    });
};
const badAuth = async (req, res) => {
    const error = new Error("Bad auth from redirect");
    error.statusCode = 401;
    throw error;
};
const google = async (req, res) => {
    const response = req.user;
    res.status(200).json({
      response,
      method: req.method,
      url: req.originalUrl,
    });
};

class AuthRouter extends CustomRouter {
  constructor() {
    super()
    this.init()
  }
  init =()=> {
    this.create(
      "/register",
      //passport.authenticate("register", {
        //session: false,
        //failureRedirect: "/api/auth/bad-auth",
      //}),
      passportCb("register"),
      register
    );
    this.create(
      "/login",
      //passport.authenticate("login", {
        //session: false,
        //failureRedirect: "/api/auth/bad-auth",
      //}),
      passportCb("login"),
      login
    );
    this.create(
      "/online",
      passportCb("current"),
      online
    );
    this.create(
      "/signout",
      passportCb("current"),
      signout
    );
    this.read("/bad-auth", badAuth);
    /* primera ruta de google para acceder a la pantalla de consentimiento y acceder al objeto profile de google con los datos del usuario */
    this.read(
      "/google",
      passport.authenticate("google", {
        scope: ["email", "profile"],
        failureRedirect: "/api/auth/bad-auth",
      })
    );
    /* segunda ruta de google para acceder a la logica de la estrategia con los datos del profile del usuario */
    this.read(
      "/google/cb",
      passport.authenticate("google", {
        session: false,
        failureRedirect: "/api/auth/bad-auth",
      }),
      google
    );
  }
}

const authRouter = new AuthRouter()
export default authRouter.getRouter();
