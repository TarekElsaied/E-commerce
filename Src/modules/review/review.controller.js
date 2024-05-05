import { reviewModel } from "../../../database/models/review.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import * as factor from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const createReview = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user._id;
  let isReviewd = await reviewModel.findOne({
    user: req.user._id,
    product: req.body.product,
  });
  if (isReviewd) return next(new AppError("You created a review before", 409));
  let result = new reviewModel(req.body);
  await result.save();
  res.json({ message: "Success", result });
});

const updateReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let result = await reviewModel.findOneAndUpdate(
    { id: id, user: req.user._id },
    req.body,
    { new: true }
  );
  !result &&
    next(
      new AppError(
        "Review not found or you are not authorized to perform this action"
      ),
      404
    );
  result && res.json({ message: "Success", result });
});

const getAllReviews = catchAsyncError(async (req, res) => {
  let apiFeatures = new ApiFeatures(reviewModel.find(), req.query)
    .paginate()
    .filter()
    .search()
    .fields()
    .sort();

  //execute query
  let result = await apiFeatures.mongooseQuery;
  res.json({ message: "Success", page: apiFeatures.page, result });
});

const getReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await reviewModel.findById(id);
  !result && next(new AppError("Review not found"), 404);
  result && res.json({ message: "Success", result });
});

const deleteReview = factor.deleteOne(reviewModel);

export { createReview, deleteReview, getAllReviews, updateReview, getReview };
