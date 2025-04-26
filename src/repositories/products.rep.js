import { productsManager } from "../data/dao.factory.js";
import ProductDTO from "../dto/products.dto.js";

const createOneRep = async (data) => {
  data = new ProductDTO(data)
  await productsManager.createOne(data);
}
const readAllRep = async (filter) => await productsManager.readAll(filter);
const readByIdRep = async (pid) => await productsManager.readById(pid);
const updateByIdRep = async (pid) => await productsManager.updateById(pid, data);
const destroyByIdRep = async (pid) => await productsManager.destroyById(pid);

export {
  createOneRep,
  readAllRep,
  readByIdRep,
  updateByIdRep,
  destroyByIdRep,
};
