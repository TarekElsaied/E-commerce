import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { cartModel } from "../../../database/models/cart.js";
import { productModel } from "../../../database/models/product.js";
import { orderModel } from "../../../database/models/order.model.js";
import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_KEY);

const createCashOrder = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new AppError("cart not found ", 404));

  const totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;

  const order = new orderModel({
    shippingAddress: req.body.shippingAddress,
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
  });

  await order.save();

  if (order) {
    let options = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: {
          $inc: { quantity: -item.quantity, sold: item.quantity },
        },
      },
    }));

    await productModel.bulkWrite(options);
    await cartModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ messaeg: "success", order });
  } else {
    return next(new AppError("error in cart id ", 404));
  }
});

const getSpecificOrder = catchAsyncError(async (req, res, next) => {
  let order = await orderModel
    .findOne({ user: req.user._id })
    .populate("cartItems.product");
  if (order) {
    return res.status(200).json({ message: "success", order });
  } else {
    return next(new AppError("There is no order for this user", 404));
  }
});
const getAllOrders = catchAsyncError(async (req, res, next) => {
  let orders = await orderModel.find({}).populate("cartItems.product");

  if (orders) {
    return res.status(200).json({ message: "success", orders });
  } else {
    return next(new AppError("There is no order for this user", 404));
  }
});

const createCheckOutSession = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findById(req.params.id);
  const totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;

  let session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000/api/v1/orders/",
    cancel_url: "http://localhost:3000/api/v1/carts/",
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    metadata: req.body.shippingAddress,
  });
  res.status(201).json({ message: "succes", session });
});

const createOnlineOrder = catchAsyncError(async (request, response) => {
  const sig = request.headers["stripe-signature"].toString();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.endpointSecret
    );
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type == "checkout.session.completed") {
    const cart = await cartModel.findById(
      event.data.object.client_reference_id
    );
    if (!cart) return next(new AppError("cart not found ", 404));
    let user = await userModel.findOne({ email: event.customer_email });

    const order = new orderModel({
      shippingAddress: event.metadata.shippingAddress,
      user: user._id,
      cartItems: cart.cartItems,
      totalOrderPrice: event.amount_total / 100,
      paymentType: "card",
      ispaid: true,
      paidAt: Date.now(),
    });

    await order.save();

    if (order) {
      let options = cart.cartItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: {
            $inc: { quantity: -item.quantity, sold: item.quantity },
          },
        },
      }));

      await productModel.bulkWrite(options);
      await cartModel.findByIdAndDelete(user._id);
      return res.status(200).json({ messaeg: "success", order });
    } else {
      return next(new AppError("error in cart id ", 404));
    }
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }
});

export {
  createCashOrder,
  getSpecificOrder,
  getAllOrders,
  createCheckOutSession,
  createOnlineOrder,
};
async function card(event, res) {}
