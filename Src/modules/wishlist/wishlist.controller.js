import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { userModel } from "../../../database/models/user.js";

const addToWishlist = catchAsyncError(async (req, res, next) => {
  const { productId } = req.body;
  let result = await userModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: productId } },
    {
      new: true,
    }
  );
  !result && next(new AppError("Wishlist not found"), 404);
  result && res.json({ message: "Success", result: result.wishlist });
});

const getAllUserWishlist = catchAsyncError(async (req, res, next) => {
  let result = await userModel
    .findOne({ _id: req.user._id })
    .populate("wishlist");
  !result && next(new AppError("Wishlist not found"), 404);
  result && res.json({ message: "Success", result: result.wishlist });
});

const removeFromWishlist = catchAsyncError(async (req, res, next) => {
  const { productId } = req.body;
  let result = await userModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: productId } },
    { new: true }
  );
  !result && next(new AppError("Wishlist not found"), 404);
  result && res.json({ message: "Success", result: result.wishlist });
});

export { addToWishlist, getAllUserWishlist, removeFromWishlist };
