import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      minLenth: [2, "product name too short"],
      unique: [true, "product title is unique"],
      required: [true, "product title is unique"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: [true, "product price is requierd"],
    },
    priceAfterDiscount: {
      type: Number,
      min: 0,
    },
    ratingAvg: {
      type: Number,
      min: [1, "rating must be greater than 1"],
      max: [5, "rating must be less than 5"],
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      minLength: [2, "product description too short"],
      maxLength: [500, "product description too long"],
      unique: [true, "product description is unique"],
      required: [true, "product description is unique"],
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
      required: [true, "product quantity requierd"],
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    imgCover: String,
    imgs: [String],
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: [true, "product category requierd"],
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "subCategory",
      required: [true, "product subCategory requierd"],
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "brand",
      required: [true, "product subCategory requierd"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
productSchema.post("init", (doc) => {
  doc.imgCover = process.env.BASE_URL + "product/" + doc.imgCover;
  doc.imgs = doc.imgs.map((path) => process.env.BASE_URL + "product/" + path);
});

productSchema.virtual("reviews", {
  ref: "review",
  localField: "_id",
  foreignField: "product",
  justOne: true,
});
productSchema.pre(/^find/, function () {
  this.populate("reviews");
});
export const productModel = mongoose.model("product", productSchema);
