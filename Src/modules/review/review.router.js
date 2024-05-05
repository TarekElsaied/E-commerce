import express from "express";
import * as review from "./review.controller.js";
import { allowedTo, protectdRoutes } from "../auth/auth.controller.js";

const reviewRouter = express.Router();

reviewRouter
  .route("/")
  .post(protectdRoutes, allowedTo("user"), review.createReview)
  .get(review.getAllReviews);

reviewRouter
  .route("/:id")
  .put(protectdRoutes, allowedTo("user"), review.updateReview)
  .delete(protectdRoutes, allowedTo("admin", "user"), review.deleteReview)
  .get(review.getReview);

export default reviewRouter;
