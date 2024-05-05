import mongoose from "mongoose";
const couponSchema = mongoose.Schema(
  {
    code: {
      type: String,
      trim: true,
      required: [true, "coupon code requierd"],
      unique: true,
    },
    discount: {
      type: Number,
      min: 0,
      required: [true, "coupon disscount requierd"],
    },
    expires: {
      type: Date,
      required: [true, "coupon date requierd"],
    },
  },
  { timestamps: true }
);

export const couponModel = mongoose.model("coupon", couponSchema);
