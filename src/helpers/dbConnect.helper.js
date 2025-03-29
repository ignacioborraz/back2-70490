import { connect } from "mongoose";

/**
 * @dbConnect
 * se conecta a la base de datos
 * recibe un link de conexión a mongo
 * registra en la consola el éxito o el fracaso
 */
const dbConnect = async (url) => {
  try {
    connect(url);
    console.log("mongo database connected");
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;
