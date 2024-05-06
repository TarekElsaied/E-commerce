import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import * as factor from "../handlers/factor.handler.js";
import { cartModel } from "../../../database/models/cart.js";
import { productModel } from "../../../database/models/product.js";
import { couponModel } from "../../../database/models/coupon.js";

function calcTotalPrice(cart) {
  let totalPrice = 0;
  cart.cartItems.find((elem) => {
    totalPrice += elem.quantity * elem.price;
  });
  cart.totalPrice = totalPrice;
}

const addProductToCart = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.body.product);
  if (!product) return next(new AppError("product not found"), 404);

  req.body.price = product.price;
  let isCartExists = await cartModel.findOne({ user: req.user._id });
  if (!isCartExists) {
    let cart = new cartModel({
      user: req.user._id,
      cartItems: [req.body],
    });
    calcTotalPrice(cart);
    await cart.save();
    return res.json({ message: "Success", cart });
  }

  let item = isCartExists.cartItems.find(
    (elem) => elem.product == req.body.product
  );
  if (item) {
    item.quantity += req.body.quantity || 1;
  } else {
    isCartExists.cartItems.push(req.body);
  }
  calcTotalPrice(isCartExists);
  if (isCartExists.discount) {
    isCartExists.totalPriceAfterDiscount =
      isCartExists.totalPrice -
      (isCartExists.totalPrice * isCartExists.discount) / 100;
  }

  await isCartExists.save();
  return res.json({ message: "Success", cart: isCartExists });
});

const removeProductFromCartItems = catchAsyncError(async (req, res, next) => {
  let result = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.id } } },
    { new: true }
  );
  !result && next(new AppError("Product not found"), 404);
  calcTotalPrice(result);
  if (result.discount) {
    result.totalPriceAfterDiscount =
      result.totalPrice - (result.totalPrice * result.discount) / 100;
  }

  result && res.json({ message: "Success", result });
});

const updateProductQuantity = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.params.id);
  if (!product) return next(new AppError("product not found"), 404);

  let isCartExists = await cartModel.findOne({ user: req.user._id });

  let item = isCartExists.cartItems.find(
    (elem) => elem.product == req.params.id
  );
  if (item) {
    item.quantity = req.body.quantity;
  }
  calcTotalPrice(isCartExists);
  if (isCartExists.discount) {
    isCartExists.totalPriceAfterDiscount =
      isCartExists.totalPrice -
      (isCartExists.totalPrice * isCartExists.discount) / 100;
  }

  await isCartExists.save();
  return res.json({ message: "Success", cart: isCartExists });
});
const clearUserCart = factor.deleteOne(cartModel);

const applyCupon = catchAsyncError(async (req, res, next) => {
  let coupon = await couponModel.findOne({
    code: req.body.code,
    expires: { $gt: Date.now() },
  });
  let cart = await cartModel.findOne({ user: req.user._id });
  cart.totalPriceAfterDiscount =
    cart.totalPrice - (cart.totalPrice * coupon.discount) / 100;
  cart.discount = coupon.discount;
  await cart.save();
  return res.status(201).json({ message: "success", cart });
});

const getLoggedUserCart = catchAsyncError(async (req, res, next) => {
  let cartItems = await cartModel
    .findOne({ user: req.user._id })
    .populate("cartItems.product");
  return res.status(201).json({ message: "success", cartItems });
});

export {
  removeProductFromCartItems,
  updateProductQuantity,
  getLoggedUserCart,
  addProductToCart,
  applyCupon,
  clearUserCart,
};
