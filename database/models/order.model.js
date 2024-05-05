import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user" },

    cartItems: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "product" },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
      },
    ],
    totalOrderPrice: Number,
    shippingAddress: {
      street: String,
      city: String,
      phone: Number,
    },
    PaymentMethod: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    ispaid: {
      type: Boolean,
      default: false,
    },
    isdelivered: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("order", orderSchema);
