import express from "express";
import * as wishlist from "./wishlist.controller.js";
import { allowedTo, protectdRoutes } from "../auth/auth.controller.js";
const wishlistRouter = express.Router();

wishlistRouter
  .route("/")
  .patch(protectdRoutes, allowedTo("user"), wishlist.addToWishlist)
  .get(protectdRoutes, allowedTo("user"), wishlist.getAllUserWishlist)
  .delete(protectdRoutes, allowedTo("user"), wishlist.removeFromWishlist);

export default wishlistRouter;
