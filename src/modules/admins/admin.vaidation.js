import joi from "joi";

export const createstudent = {
  body: joi
    .object({
      fullName: joi.string().min(10).max(28).required(),
      StudentCode: joi.string().length(15).required(),
      national_number: joi.string().length(15).required(),
      level: joi.string().valid("one", "two", "there", "four").required(),
    })
    .required(),
};
