import express from "express";
import * as coupon from "./coupon.controller.js";
import { allowedTo, protectdRoutes } from "../auth/auth.controller.js";

const couponRouter = express.Router();

couponRouter
  .route("/")
  .post(protectdRoutes, allowedTo("admin"), coupon.createCoupon)
  .get(protectdRoutes, allowedTo("admin"), coupon.getAllCoupons);

couponRouter
  .route("/:id")
  .put(protectdRoutes, allowedTo("admin"), coupon.updateCoupon)
  .delete(protectdRoutes, allowedTo("admin"), coupon.deleteCoupon)
  .get(protectdRoutes, allowedTo("admin"), coupon.getCoupon);

export default couponRouter;
