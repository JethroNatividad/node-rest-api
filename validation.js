const Joi = require('joi');

exports.validateRegister = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().min(2),
        email: Joi.string().required().min(6).email(),
        password: Joi.string().required().min(6)
    })
    return schema.validate(data)
}
exports.validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().min(6).email(),
        password: Joi.string().required().min(6)
    })
    return schema.validate(data)
}