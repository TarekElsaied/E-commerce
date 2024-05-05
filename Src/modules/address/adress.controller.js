import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { userModel } from "../../../database/models/user.js";

const addAddress = catchAsyncError(async (req, res, next) => {
  console.log(req.user._id);
  let result = await userModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    {
      new: true,
    }
  );
  !result && next(new AppError("Address not found"), 404);
  result && res.json({ message: "Success", result: result.addresses });
});

const getAllAddresses = catchAsyncError(async (req, res, next) => {
  let result = await userModel.findOne({ _id: req.user._id });
  !result && next(new AppError("Address not found"), 404);
  result && res.json({ message: "Success", result: result.addresses });
});

const removeAddress = catchAsyncError(async (req, res, next) => {
  const { addresses } = req.body;
  let result = await userModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: addresses } } },
    { new: true }
  );
  !result && next(new AppError("Address not found"), 404);
  result && res.json({ message: "Success", result: result.addresses });
});

export { addAddress, getAllAddresses, removeAddress };
/*ee*/
