import {
  productsManager,
  usersManager,
} from "../data/mongo/managers/manager.mongo.js";
import { cartsManager } from "../data/mongo/managers/carts.mongo.js";

const homeView = async (req, res) => {
  try {
    const products = await productsManager.readAll();
    return res.status(200).render("index", { products, title: "HOME" });
  } catch (error) {
    console.log(error);
    return res.status(500).render("error");
  }
};
const profileView = async (req, res) => {
  try {
    const { user_id } = req.params;
    const profile = await usersManager.readById(user_id);
    return res.status(200).render("profile", { title: "PROFILE", profile });
  } catch (error) {
    console.log(error);
    return res.status(500).render("error");
  }
};
const detailsView = async (req, res) => {
  try {
    const { product_id } = req.params;
    const product = await productsManager.readById(product_id);
    return res
      .status(200)
      .render("product", { title: product.title.toUpperCase(), product });
  } catch (error) {
    console.log(error);
    return res.status(500).render("error");
  }
};
const cartView = async (req, res) => {
  try {
    const { user_id } = req.params;
    const carts = await cartsManager.readProductsFromUser(user_id);
    const total = await cartsManager.totalToPay(user_id);
    return res
      .status(200)
      .render("cart", { title: "CART", carts, total: total[0].total });
  } catch (error) {
    console.log(error);
    return res.status(500).render("error");
  }
};
const registerView = (req, res) => {
  try {
    res.status(200).render("register", { title: "REGISTER FORM" });
  } catch (error) {
    console.log(error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).render("error");
  }
};
const loginView = (req, res) => {
  try {
    res.status(200).render("login", { title: "LOGIN FORM" });
  } catch (error) {
    console.log(error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).render("error");
  }
};

export {
  homeView,
  profileView,
  detailsView,
  cartView,
  registerView,
  loginView,
};
