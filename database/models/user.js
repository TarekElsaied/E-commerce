import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minLenth: [9, "Name to short"],
      maxLenth: [30, "Name to long"],
      required: [true, "Name is requierd"],
      trim: true,
    },
    passwordChangedAt: Date,
    password: {
      type: String,
      minLenth: [9, "Password to short"],
      required: [true, "Pasword is requierd"],
    },
    email: {
      type: String,
      unique: [true, "Email is unique"],
      required: [true, "Email is requierd"],
      trim: true,
      minLenth: 1,
    },
    phoneNumber: {
      type: String,
      required: [true, "phone is requierd"],
    },
    profilePic: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    wishlist: [{ type: mongoose.SchemaTypes.ObjectId, ref: "product" }],
    addresses: [
      {
        city: String,
        street: String,
        phone: Number,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 7);
});

userSchema.pre("findOneAndUpdate", function () {
  if (this._update.password)
    this._update.password = bcrypt.hashSync(this._update.password, 7);
});

export const userModel = mongoose.model("user", userSchema);
