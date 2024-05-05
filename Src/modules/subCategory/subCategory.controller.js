import { SubCategoryModel } from "../../../database/models/subCategory.js";
import slugify from "slugify";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";

const createSubCategory = catchAsyncError(async (req, res) => {
  const { name, category } = req.body;
  let result = new SubCategoryModel({ name, category, slug: slugify(name) });
  await result.save();
  res.json({ message: "Success", result });
});

const deleteSubCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await SubCategoryModel.findByIdAndDelete(id);
  !result && next(new AppError("Subcategory not found"), 404);
  result && res.json({ message: "Success", result });
});

const updateSubCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  let result = await SubCategoryModel.findByIdAndUpdate(
    id,
    {
      name,
      category,
      slug: slugify(name),
    },
    { new: true }
  );
  !result && next(new AppError("Subcategory not found", 404));
  result && res.json({ message: "Success", result });
});

const getAllSubCategories = catchAsyncError(async (req, res) => {
  let filter = {};
  if (req.params.categoryID) {
    filter = { category: req.params.categoryID };
  }
  let result = await SubCategoryModel.find({
    category: req.params.categoryID,
  });

  res.json({ message: "Success", result });
});

const getSubCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await SubCategoryModel.findById(id);
  !result && next(new AppError("Subcategory not found"), 404);
  result && res.json({ message: "Success", result });
});

export {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  updateSubCategory,
  getSubCategory,
};
