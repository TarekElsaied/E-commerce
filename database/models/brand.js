import mongoose from "mongoose";

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name is requierd"],
      trim: true,
      minLength: [2, "Brand name too short!"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    logo: String,
  },
  { timestamps: true }
);
brandSchema.post("init", (doc) => {
  doc.logo = process.env.BASE_URL + "/brand/" + doc.logo;
});

export const brandModel = mongoose.model("brand", brandSchema);
