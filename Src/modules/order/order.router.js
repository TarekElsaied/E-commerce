import express from "express";
import * as order from "./order.controller.js";
import { allowedTo, protectdRoutes } from "../auth/auth.controller.js";

const orderRouter = express.Router();

orderRouter
  .route("/:id")
  .post(protectdRoutes, allowedTo("user"), order.createCashOrder);

orderRouter
  .route("/")
  .get(protectdRoutes, allowedTo("user"), order.getSpecificOrder);
orderRouter.get("/all", protectdRoutes, order.getAllOrders);
orderRouter.post(
  "/checkOut/:id",
  protectdRoutes,
  allowedTo("user"),
  order.createCheckOutSession
);
export default orderRouter;
