import DatabaseConnect from "../helpers/dbConnect.helper.js";

const { PERSISTENCE } = process.env;

let dao = {};
// el patron factory se va a encargar de "fabricar" el data access object
// con el dao correspondiente a la persistencia de la variable PERSISTENCE

switch (PERSISTENCE) {
  case "memory":
    // si se sellecciona memory tengo que usar los gestores de memory
    break;
  case "fs":
    // si se sellecciona fs tengo que usar los gestores de fs
    {
      console.log("fs database connected");
      const { productsManager, usersManager } = await import(
        "./fs/manager.fs.js"
      );
      const { cartsManager } = await import("./fs/carts.fs.js");
      dao = { productsManager, usersManager, cartsManager };
    }
    break;
  default:
    // pro defecto tengo que usar los gestores de mongo
    {
      const connect = new DatabaseConnect(process.env.MONGO_URL);
      const connect1 = new DatabaseConnect(process.env.MONGO_URL);
      const connect2 = new DatabaseConnect(process.env.MONGO_URL);
      const connect3 = new DatabaseConnect(process.env.MONGO_URL);
      const connect4 = new DatabaseConnect(process.env.MONGO_URL);
      connect.dbConnect(process.env.MONGO_URL);
      const { productsManager, usersManager } = await import(
        "./mongo/managers/manager.mongo.js"
      );
      const { cartsManager } = await import("./mongo/managers/carts.mongo.js");
      dao = { productsManager, usersManager, cartsManager };
    }
    break;
}

const { productsManager, usersManager, cartsManager } = dao;
export { productsManager, usersManager, cartsManager };
export default dao;
