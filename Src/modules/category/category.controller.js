import { categoryModel } from "../../../database/models/category.js";
import slugify from "slugify";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const createCategory = catchAsyncError(async (req, res) => {
  req.body.slug = slugify(req.bode.name);
  req.body.image = req.file.filename;
  let result = new categoryModel(req.body);
  await result.save();
  res.json({ message: "Success", result });
});

const deleteCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await categoryModel.findByIdAndDelete(id);
  !result && next(new AppError("category not found"), 404);
  result && res.json({ message: "Success", result });
});

const updateCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.bode.name);
  req.body.image = req.file.filename;
  let result = await categoryModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  !result && next(new AppError("Brand not found"), 404);
  result && res.json({ message: "Success", result });
});

const getAllCategories = catchAsyncError(async (req, res) => {
  let apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
    .paginate()
    .filter()
    .search()
    .fields()
    .sort();

  //execute query
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "Success", page: apiFeatures.page, result });
});

const getCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await categoryModel.findById(id);
  !result && next(new AppError("Brand not found"), 404);
  result && res.json({ message: "Success", result });
});

export {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
  getCategory,
};
