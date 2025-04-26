import { connect } from "mongoose";

class DatabaseConnect {
  constructor(url) {
    this.url = url;
    if (typeof DatabaseConnect.instance === "object") {
      //console.log("no se crea la instancia, porque ya existe");
      return DatabaseConnect.instance;
    } else {
      //console.log("se crea la instancia por primera vez");
      DatabaseConnect.instance = this;
      return this;
    }
  }
  /**
   * @dbConnect
   * se conecta a la base de datos
   * recibe un link de conexión a mongo
   * registra en la consola el éxito o el fracaso
   */
  dbConnect = async (url) => {
    try {
      connect(url);
      console.log("mongo database connected");
    } catch (error) {
      console.log(error);
    }
  };
}

export default DatabaseConnect;
