import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import * as factor from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import qrcode from "qrcode";
import { couponModel } from "../../../database/models/coupon.js";

const createCoupon = catchAsyncError(async (req, res, next) => {
  let result = new couponModel(req.body);
  await result.save();
  res.json({ message: "Success", result });
});

const updateCoupon = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await couponModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  !result &&
    next(
      new AppError(
        "Coupon not found or you are not authorized to perform this action"
      ),
      404
    );
  result && res.json({ message: "Success", result });
});

const getAllCoupons = catchAsyncError(async (req, res) => {
  let apiFeatures = new ApiFeatures(couponModel.find(), req.query)
    .paginate()
    .filter()
    .search()
    .fields()
    .sort();

  //execute query
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "Success", page: apiFeatures.page, result });
});

const getCoupon = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await couponModel.findById(id);
  let url = await qrcode.toDataURL("Fuck You Bitch!!");
  !result && next(new AppError("Coupon not found"), 404);
  result && res.json({ message: "Success", result, url });
});

const deleteCoupon = factor.deleteOne(couponModel);

export { updateCoupon, deleteCoupon, getAllCoupons, createCoupon, getCoupon };
