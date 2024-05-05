import Joi from "joi";

export const createProductSchema = Joi.object({
  title: Joi.string().min(2).max(20).required(),
  description: Joi.string().min(2).max(500).required(),
  quantity: Joi.number().min(0).required(),
  category: Joi.string().hex().length(24).required(),
  subCategory: Joi.string().hex().length(24).required(),
  brand: Joi.string().hex().length(24).required(),
  subCategory: Joi.string().min(2).max(500).required(),
  description: Joi.string().min(2).max(500).required(),
  sold: Joi.number(),
  ratingAvg: Joi.number().min(1).max(5),
  ratingCount: Joi.number().min(0),
  price: Joi.number().min(1).required(),
});
export const updateProductSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  title: Joi.string().min(2).max(20),
});
export const getProductSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
export const deleteProductSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
