const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);
const addressSchema = new mongoose.Schema({
    city: { type: String },
    street: { type: String },
    houseNumber: { type: Number },
})
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: [addressSchema],
    role: { type: String, default: 'user', enum: ['admin', 'user'] }
})
//encrypt the password before saving it in a database
//must to send a standard function and not an arrow function because use "this"
userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, +process.env.BCRYPT_SALT, async (err, hashPass) => {
        if (err)
            throw new Error(err.message);
        this.password = hashPass;
        next();
    })
})
module.exports.userSchema = userSchema;
module.exports.User = mongoose.model('users', userSchema);

module.exports.userValidators = {
    login: joi.object().keys({
        email: joi.string().email().required(),
        password: joiPassword
        .string().min(6).max(10)
        .minOfNumeric(3)
        .noWhiteSpaces()
        .doesNotInclude(['password'])
        .onlyLatinCharacters()
        .minOfUppercase(1)
        .minOfSpecialCharacters(1)
    })
}

//token creation
module.exports.generateToken = (user) => {
    const privateKey = process.env.JWT_SECRET || 'JWT_SECRET'; // secret string by which the token was created
    const data = { role: user.role, user_id: user._id }; //the data that is relevant for user permissions
    const token = jwt.sign(data, privateKey, { expiresIn: '1h' }); //token creation + expiration
    return token;
}