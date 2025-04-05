import { usersManager } from "../data/mongo/managers/manager.mongo.js";
import { verifyToken } from "../helpers/token.helper.js";

/**
 * @isUser
 * evalúa la autenticación necesaria
 * deja pasar sólo si es un usuario de la app
 * en cualquier otra caso construye el error correspondiente
 */
const isUser = async (req, res, next) => {
  try {
    const headers = req?.headers?.authorization;
    if (!headers || !headers.startsWith("Bearer ")) {
      const error = new Error("Token is required");
      error.statusCode = 403;
      throw error;
    }
    const token = headers.split(" ")[1];
    const data = verifyToken(token);
    const user = await usersManager.readById(data.user_id);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default isUser;
