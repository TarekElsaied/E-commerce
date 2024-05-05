import express from "express";
const productRouter = express.Router();
import * as product from "./product.controller.js";
import { validation } from "../../middleware/validation.js";
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from "./product.validation.js";
import { allowedTo, protectdRoutes } from "../auth/auth.controller.js";
import { uploadMixOfFiles } from "../../middleware/fileUpload.js";

let fieldsArray = [
  { name: "imgCover", maxCount: 1 },
  { name: "imgs", maxCount: 10 },
];
productRouter
  .route("/")
  .post(
    protectdRoutes,
    allowedTo("admin", "user"),
    uploadMixOfFiles(fieldsArray, "product"),
    validation(createProductSchema),
    product.createProduct
  )
  .get(product.getAllProducts);

productRouter
  .route("/:id")
  .put(
    protectdRoutes,
    allowedTo("admin"),
    uploadMixOfFiles(fieldsArray, "product"),
    validation(updateProductSchema),
    product.updateProduct
  )
  .delete(
    protectdRoutes,
    allowedTo("admin"),
    validation(deleteProductSchema),
    product.deleteProduct
  )
  .get(validation(getProductSchema), product.getProduct);

export default productRouter;
