import express from "express";
import * as adress from "./adress.controller.js";
import { allowedTo, protectdRoutes } from "../auth/auth.controller.js";
const adressRouter = express.Router();

adressRouter
  .route("/")
  .patch(protectdRoutes, allowedTo("user"), adress.addAddress)
  .get(protectdRoutes, allowedTo("user"), adress.getAllAddresses)
  .delete(protectdRoutes, allowedTo("user"), adress.removeAddress);

export default adressRouter;
