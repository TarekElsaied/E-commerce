import express from "express";
import * as coupon from "./coupon.controller.js";
import { allowedTo, protectdRoutes } from "../auth/auth.controller.js";

const couponRouter = express.Router();

couponRouter
  .route("/")
  .post(protectdRoutes, allowedTo("user"), coupon.createCoupon)
  .get(coupon.getAllCoupons);

couponRouter
  .route("/:id")
  .put(protectdRoutes, allowedTo("user"), coupon.updateCoupon)
  .delete(protectdRoutes, allowedTo("admin", "user"), coupon.deleteCoupon)
  .get(coupon.getCoupon);

export default couponRouter;
