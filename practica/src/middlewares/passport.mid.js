import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { usersManager } from "../data/manager.mongo.js";
import { compareHash, createHash } from "../helpers/hash.helper.js";
import { createToken } from "../helpers/token.helper.js";

passport.use(
  "register",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      try {
        let user = await usersManager.readBy({ email });
        if (user) {
          const error = new Error("Invalid credentials!");
          error.statusCode = 401;
          throw error;
        }
        req.body.password = createHash(password);
        user = await usersManager.createOne(req.body);
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
passport.use(
  "login",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      try {
        let user = await usersManager.readBy({ email });
        if (!user) {
          const error = new Error("Invalid credentials!");
          error.statusCode = 401;
          throw error;
        }
        const verifyPassword = compareHash(password, user.password);
        if (!verifyPassword) {
          const error = new Error("Invalid credentials!");
          error.statusCode = 401;
          throw error;
        }
        const data = {
          user_id: user._id,
          role: user.role,
        };
        const token = createToken(data);
        req.token = token;
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport;
