import express from "express";
import * as category from "./category.controller.js";

import subCategoryRouter from "../subCategory/subCategory.router.js";
import { validation } from "../../middleware/validation.js";
import {
  createCategorySchema,
  deleteCategorySchema,
  getCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";
import { uploadSingleFile } from "../../middleware/fileUpload.js";
import { allowedTo, protectdRoutes } from "../auth/auth.controller.js";
const categoryRouter = express.Router();

categoryRouter.use("/:categoryID/subcategories", subCategoryRouter);
categoryRouter
  .route("/")
  .post(
    protectdRoutes,
    allowedTo("admin"),
    uploadSingleFile("image", "category"),
    validation(createCategorySchema),
    category.createCategory
  )
  .get(category.getAllCategories);

categoryRouter
  .route("/:id")
  .put(
    protectdRoutes,
    allowedTo("admin"),
    uploadSingleFile("image", "category"),
    validation(updateCategorySchema),
    category.updateCategory
  )
  .delete(
    protectdRoutes,
    allowedTo("admin"),
    validation(deleteCategorySchema),
    category.deleteCategory
  )
  .get(validation(getCategorySchema), category.getCategory);

export default categoryRouter;
