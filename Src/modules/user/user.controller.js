import { userModel } from "../../../database/models/user.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import * as factor from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const createUser = catchAsyncError(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user) return next(new AppError("User already exist", 409));
  let result = new userModel(req.body);
  await result.save();
  res.json({ message: "Success", result });
});

const deleteUser = factor.deleteOne(userModel);

const getAllUsers = catchAsyncError(async (req, res) => {
  let apiFeatures = new ApiFeatures(userModel.find(), req.query)
    .paginate()
    .filter()
    .search()
    .fields()
    .sort();

  //execute query
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "Success", page: apiFeatures.page, result });
});

const getUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await userModel.findById(id);
  !result && next(new AppError("User not found"), 404);
  result && res.json({ message: "Success", result });
});

const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  req.body.passwordChangedAt = Date.now();
  let result = await userModel.findByIdAndUpdate(id, req.body, { new: true });
  !result && next(new AppError("User not found"), 404);
  result && res.json({ message: "Success", result });
});
const changeUserPassword = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  req.body.passwordChangedAt = Date.now();
  let result = await userModel.findByIdAndUpdate(id, req.body, { new: true });
  !result && next(new AppError("User not found"), 404);
  result && res.json({ message: "Success", result });
});

export {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
  getUser,
  changeUserPassword,
};
