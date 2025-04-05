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
          //const error = new Error("Invalid data");
          //error.statusCode = 400;
          //throw error;
          return done(null, null, { message: "Invalid data", statusCode: 400 });
        }
        const user = await usersManager.readBy({ email });
        if (user) {
          //const error = new Error("Invalid credentials");
          //error.statusCode = 401;
          //throw error;
          return done(null, null, {
            message: "Invalid credentials",
            statusCode: 401,
          });
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
          return done(null, null, {
            message: "Invalid credentials",
            statusCode: 401,
          });
        }
        const verify = verifyHash(password, response.password);
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
/* middleware para verificar que el ususario es parte de nuestra app */
passport.use(
  /* nombre de la estrategia */
  "current",
  /* constructor de la estrategia */
  new JwtStrategy(
    /* objeto de configuracion de la estrategia */
    {
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
      secretOrKey: SECRET,
    },
    /* callback con la logica de la estrategia */
    async (data, done) => {
      try {
        const { user_id } = data;
        const user = await usersManager.readById(user_id);
        if (!user) {
          return done(null, null, { message: "Bad auth", statusCode: 401 });
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
/* middlewares para verificar que el usuario es admin de nuestra app */
passport.use(
  /* nombre de la estrategia */
  "admin",
  /* constructor de la estrategia */
  new JwtStrategy(
    /* objeto de configuracion de la estrategia */
    {
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
      secretOrKey: SECRET,
    },
    /* callback con la logica de la estrategia */
    async (data, done) => {
      try {
        const { user_id } = data;
        const user = await usersManager.readById(user_id);
        if (!user) {
          return done(null, null, { message: "Bad auth", statusCode: 401 });
        }
        if (user.role !== "ADMIN") {
          return done(null, null, { message: "Forbidden", statusCode: 403 });
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport;
