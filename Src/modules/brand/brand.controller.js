import { brandModel } from "../../../database/models/brand.js";
import slugify from "slugify";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import * as factor from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const createBrand = catchAsyncError(async (req, res) => {
  req.body.slug = slugify(req.bode.name);
  req.body.logo = req.file.filename;

  let result = new brandModel(req.body);
  await result.save();
  res.json({ message: "Success", result });
});

const deleteBrand = factor.deleteOne(brandModel);

const updateBrand = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.bode.name);
  req.body.logo = req.file.filename;
  let result = await brandModel.findByIdAndUpdate(id, req.body, { new: true });
  !result && next(new AppError("Brand not found"), 404);
  result && res.json({ message: "Success", result });
});

const getAllBrands = catchAsyncError(async (req, res) => {
  let apiFeatures = new ApiFeatures(brandModel.find(), req.query)
    .paginate()
    .filter()
    .search()
    .fields()
    .sort();

  //execute query
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "Success", page: apiFeatures.page, result });
});

const getBrand = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await brandModel.findById(id);
  !result && next(new AppError("Brand not found"), 404);
  result && res.json({ message: "Success", result });
});

export { createBrand, deleteBrand, getAllBrands, updateBrand, getBrand };
