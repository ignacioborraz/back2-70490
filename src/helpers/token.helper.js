import jsonwebtoken from "jsonwebtoken";

/**
 * @createToken
 * recibe información a tokenizar
 * devuelve un token protegido
 */
const createToken = (data) => {
  try {
    const token = jsonwebtoken.sign(data, process.env.SECRET, {
      expiresIn: 60 * 60 * 24 * 7,
    });
    return token;
  } catch (error) {
    error.statusCode = 401;
    throw error;
  }
};

/**
 * @verifyToken
 * recibe un token y lo verifica
 * devuelve el booleano correspondiente
 */
const verifyToken = (token) => {
  try {
    const verify = jsonwebtoken.verify(token, process.env.SECRET);
    return verify;
  } catch (error) {
    error.statusCode = 401;
    throw error;
  }
};

export { createToken, verifyToken }