const Joi = require("joi");

const signupRequestSchema = Joi.object({
  username: Joi.string().alphanum().min(4).max(20).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,20}$")),
});

const validate = async (data) => {
  try {
    const validateResult = await signupRequestSchema.validateAsync(data);
    return { success: true, data: validateResult };
  } catch (error) {
    return {
      success: false,
      errors: error.details.map((detail) => detail.message.split('"').join("")),
    };
  }
};

module.exports = validate;
