import { productsManager } from "../data/fs/manager.fs.js";

const createOneService = async (data) => await productsManager.createOne(data);
const readAllService = async (filter) => await productsManager.readAll(filter);
const readByIdService = async (pid) => await productsManager.readById(pid);
const updateByIdService = async (pid) => await productsManager.updateById(pid, data);
const destroyByIdService = async (pid) => await productsManager.destroyById(pid);

export {
  createOneService,
  readAllService,
  readByIdService,
  updateByIdService,
  destroyByIdService,
};
