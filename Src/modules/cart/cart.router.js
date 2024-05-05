import express from "express";
import * as cart from "./cart.controller.js";
import { allowedTo, protectdRoutes } from "../auth/auth.controller.js";

const cartRouter = express.Router();

cartRouter
  .route("/")
  .post(protectdRoutes, allowedTo("user"), cart.addProductToCart)
  .get(protectdRoutes, allowedTo("user"), cart.getLoggedUserCart);
cartRouter
  .route("/applyCoupon")
  .post(protectdRoutes, allowedTo("user"), cart.applyCupon);

cartRouter
  .route("/:id")
  .put(protectdRoutes, allowedTo("user"), cart.updateProductQuantity)
  .delete(
    protectdRoutes,
    allowedTo("admin", "user"),
    cart.removeProductFromCartItems
  );

export default cartRouter;
