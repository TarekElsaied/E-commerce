import express from "express";
import * as subCategory from "./subCategory.controller.js";
import { validation } from "../../middleware/validation.js";
import {
  createSubCategorySchema,
  deleteSubCategorySchema,
  getSubCategorySchema,
  updateSubCategorySchema,
} from "./subCategory.validation.js";
import { allowedTo, protectdRoutes } from "../auth/auth.controller.js";

const subCategoryRouter = express.Router({ mergeParams: true });

subCategoryRouter
  .route("/")
  .post(
    protectdRoutes,
    allowedTo("admin"),
    validation(createSubCategorySchema),
    subCategory.createSubCategory
  )
  .get(subCategory.getAllSubCategories);

subCategoryRouter
  .route("/:id")
  .put(
    protectdRoutes,
    allowedTo("admin"),
    validation(updateSubCategorySchema),
    subCategory.updateSubCategory
  )
  .delete(
    protectdRoutes,
    allowedTo("admin"),
    validation(deleteSubCategorySchema),
    subCategory.deleteSubCategory
  )
  .get(validation(getSubCategorySchema), subCategory.getSubCategory);

export default subCategoryRouter;
