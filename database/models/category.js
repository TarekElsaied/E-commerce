import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
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
    image: String,
  },
  { timestamps: true }
);
categorySchema.post("init", (doc) => {
  doc.image = process.env.BASE_URL + "/category/" + doc.image;
});

export const categoryModel = mongoose.model("category", categorySchema);
