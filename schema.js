const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    batchname: Joi.string().required(),
    description: Joi.string().required(),
    subject: Joi.string().required(),
    teachername: Joi.string().required(),
    image: Joi.string().allow("",null), 
    assignments: Joi.array(),
});
module.exports.announceSchema = Joi.object({
    announcement:Joi.object({
        comment: Joi.string().required(),
    }).required(),
});
module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().required(),
    }).required(),
});