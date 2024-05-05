import { productModel } from "../../../database/models/product.js";
import slugify from "slugify";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import * as factor from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const createProduct = catchAsyncError(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  console.log(req.file);
  req.body.imgCover = req.files.imgCover[0].filename;
  req.body.imgs = req.files.imgs.map((obj) => obj.filename);
  let result = new productModel(req.body);
  await result.save();
  res.json({ message: "Success", result });
});

const deleteProduct = factor.deleteOne(productModel);

const updateProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) req.body.slug = slugify(req.body.title);
  let result = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  !result && next(new AppError("Product not found"), 404);
  result && res.json({ message: "Success", result });
});

const getAllProducts = catchAsyncError(async (req, res) => {
  //build qurey
  let apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .paginate()
    .filter()
    .search()
    .fields()
    .sort();

  //execute query
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "Success", page: apiFeatures.page, result });
});

const getProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await productModel.findById(id);
  !result && next(new AppError("Product not found"), 404);
  result && res.json({ message: "Success", result });
});

export {
  createProduct,
  getProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
};
