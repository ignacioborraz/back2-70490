import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { usersManager } from "../data/manager.mongo.js";
import { compareHash } from "../helpers/hash.helper.js";
import { createToken } from "../helpers/token.helper.js";
import sendEmailOfRegister from "../helpers/registerEmail.helper.js";

passport.use(
  "register",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      try {
        let data = req.body;
        if (!data.city) {
          return done(null, null, { message: "Invalid data", statusCode: 400 });
        }
        const user = await usersManager.readBy({ email });
        if (user) {
          return done(null, null, {
            message: "Invalid credentials",
            statusCode: 401,
          });
        }
        //data = new UserDTO(data);
        const response = await usersManager.createOne(data);
        await sendEmailOfRegister({ email, verifyCode: response.verifyCode });
        done(null, response);
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
        const response = await usersManager.readBy({ email });
        if (!response) {
          return done(null, null, {
            message: "Invalid credentials",
            statusCode: 401,
          });
        }
        const verfiyAccount = response.isVerify;
        if (!verfiyAccount) {
          return done(null, null, {
            message: "Invalid credentials",
            statusCode: 401,
          });
        }
        const verify = compareHash(password, response.password);
        if (!verify) {
          return done(null, null, {
            message: "Invalid credentials",
            statusCode: 401,
          });
        }
        const data = {
          user_id: response._id,
          email: response.email,
          role: response.role,
        };
        const token = createToken(data);
        req.token = token;
        done(null, response);
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport;
