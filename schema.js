const Joi = require("joi");

const schema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("", null),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

module.exports = schema;

const reviewSchema = Joi.object({
  review: Joi.object({
    comments: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});

module.exports = reviewSchema;
