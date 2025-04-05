import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { usersManager } from "../data/mongo/manager.mongo.js";
import { createHash, verifyHash } from "../helpers/hash.helper.js";
import { createToken } from "../helpers/token.helper.js";
const clientID = process.env.GOOGLE_ID;
const clientSecret = process.env.GOGGLE_SECRET;
const callbackURL = "http://localhost:8080/api/auth/google/cb";

passport.use(
  "register",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      try {
        const data = req.body;
        if (!data.city) {
          const error = new Error("Invalid data");
          error.statusCode = 400;
          throw error;
        }
        const user = await usersManager.readBy({ email });
        if (user) {
          const error = new Error("Invalid credentials");
          error.statusCode = 401;
          throw error;
        }
        data.password = createHash(password);
        const response = await usersManager.createOne(data);
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
          const error = new Error("Invalid credentials");
          error.statusCode = 401;
          throw error;
        }
        const verify = verifyHash(password, response.password);
        if (!verify) {
          const error = new Error("Invalid credentials");
          error.statusCode = 401;
          throw error;
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
passport.use(
  "google",
  new GoogleStrategy(
    { clientID, clientSecret, callbackURL },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        const email = profile.id;
        let user = await usersManager.readBy({ email });
        if (!user) {
          user = {
            name: profile.name.givenName,
            avatar: profile.picture,
            email: profile.id,
            password: createHash(profile.id),
            city: "google",
          };
          user = await usersManager.createOne(user);
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport;
