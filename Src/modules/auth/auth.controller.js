import { userModel } from "../../../database/models/user.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = catchAsyncError(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user) return next(new AppError("account already exist", 409));
  req.body.email = req.body.email.replace(/\s+/g, "");
  let result = new userModel(req.body);
  await result.save();
  res.json({ message: "success", result });
});

export const signIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  let isFound = await userModel.findOne({ email });
  let match = await bcrypt.compare(password, isFound.password);
  if (isFound && match) {
    let token = jwt.sign(
      {
        name: isFound.name,
        userId: isFound._id,
        role: isFound.role,
      },
      process.env.SECRET_KEY
    );
    return res.json({ message: "success", token });
  }
  next(new AppError("incorrect email or password", 401));
});

export const protectdRoutes = catchAsyncError(async (req, res, next) => {
  let { token } = req.headers;
  if (!token) return next(new AppError("Token not provided", 401));

  let decoded = await jwt.verify(token, process.env.SECRET_KEY);

  let user = await userModel.findById(decoded.userId);
  if (!user) return next(new AppError("invalid token", 401));

  if (user.passwordChangedAt) {
    let cangePasswordDate = parseInt(user.passwordChangedAt.getTime() / 1000);
    if (cangePasswordDate > decoded.iat)
      return next(new AppError("invalid token", 401));
  }

  req.user = user;
  next();
});

export const allowedTo = (...roles) => {
  return catchAsyncError(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError(
          "You are not authorized to access tis route. You are" + user.role,
          401
        )
      );
    next();
  });
};
