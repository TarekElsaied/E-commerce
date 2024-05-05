import express from "express";
import * as brand from "./brand.controller.js";
import { validation } from "../../middleware/validation.js";
import {
  createBrandSchema,
  deleteBrandSchema,
  getBrandSchema,
  updateBrandSchema,
} from "./brand.validation.js";
import { uploadSingleFile } from "../../middleware/fileUpload.js";
import { allowedTo, protectdRoutes } from "../auth/auth.controller.js";

const brandRouter = express.Router();

brandRouter
  .route("/")
  .post(
    protectdRoutes,
    allowedTo("admin"),
    uploadSingleFile("logo", "brand"),
    validation(createBrandSchema),
    brand.createBrand
  )
  .get(brand.getAllBrands);

brandRouter
  .route("/:id")
  .put(
    protectdRoutes,
    allowedTo("admin"),
    uploadSingleFile("logo", "brand"),
    validation(updateBrandSchema),
    brand.updateBrand
  )
  .delete(
    protectdRoutes,
    allowedTo("admin"),
    validation(deleteBrandSchema),
    brand.deleteBrand
  )
  .get(validation(getBrandSchema), brand.getBrand);

export default brandRouter;
