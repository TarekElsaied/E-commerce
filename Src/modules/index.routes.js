import { globalErrorMiddleware } from "../middleware/globalErrorMiddleware.js";
import { AppError } from "../utils/AppError.js";
import adressRouter from "./address/adress.router.js";
import authRouter from "./auth/auth.router.js";
import brandRouter from "./brand/brand.router.js";
import cartRouter from "./cart/cart.router.js";
import categoryRouter from "./category/category.router.js";
import couponRouter from "./coupon/coupon.router.js";
import orderRouter from "./order/order.router.js";
import productRouter from "./product/product.router.js";
import reviewRouter from "./review/review.router.js";
import subCategoryRouter from "./subCategory/subCategory.router.js";
import userRouter from "./user/user.router.js";
import wishlistRouter from "./wishlist/wishlist.router.js";

export function init(app) {
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subCategories", subCategoryRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/adress", adressRouter);
  app.use("/api/v1/coupons", couponRouter);
  app.use("/api/v1/carts", cartRouter);
  app.use("/api/v1/orders", orderRouter);

  app.get("*", (req, res, next) =>
    next(new AppError(`can not find this route:${req.originalUrl}`, 404))
  );
  app.use(globalErrorMiddleware);
  process.on("unhandledRejection", (err) => {
    console.log("unhandledRejection", err);
  });
}
