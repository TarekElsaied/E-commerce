import mongoose from "mongoose";

export const conn = async () => {
  return await mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Database connection is established!"))
    .catch((e) => {
      console.log(e);
    });
};
