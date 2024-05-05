import mongoose from "mongoose";

const SubCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      minLenth: [2, "Category name too short"],
      maxLenth: [30, "Category name too long"],
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
  },
  { timestamps: true }
);

export const SubCategoryModel = mongoose.model(
  "Subcategory",
  SubCategorySchema
);
