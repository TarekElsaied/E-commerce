import Joi from "joi";

export const createSubCategorySchema = Joi.object({
  category: Joi.string().hex().length(24).required(),
  name: Joi.string().min(2).max(20).required(),
});
export const updateSubCategorySchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  category: Joi.string().hex().length(24).required(),
  name: Joi.string().min(2).max(20),
});
export const getSubCategorySchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
export const deleteSubCategorySchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
