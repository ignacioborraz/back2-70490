import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { usersManager } from "../data/mongo/managers/manager.mongo.js";
import { createHash, verifyHash } from "../helpers/hash.helper.js";
import { createToken } from "../helpers/token.helper.js";
const {
  SECRET,
  GOOGLE_ID: clientID,
  GOGGLE_SECRET: clientSecret,
} = process.env;
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
passport.use(
  "auth",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET,
    },
    async (data, done) => {
      try {
        const { user_id } = data;
        const user = await usersManager.readById(user_id);
        if (!user) {
          const error = new Error("Bad auth");
          error.statusCode = 401;
          throw error;
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "admin",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET,
    },
    async (data, done) => {
      try {
        const { user_id, role } = data;
        const user = await usersManager.readById(user_id);
        if (user.role !== "admin") {
          const error = new Error("Forbidden");
          error.statusCode = 403;
          throw error;
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
