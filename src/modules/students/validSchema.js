import joi from "joi";

export const login = {
  body: joi
    .object({
      StudentCode: joi.string().length(15).required(),
      password: joi.string().min(8).max(22).required(),
    })
    .required(),
};
