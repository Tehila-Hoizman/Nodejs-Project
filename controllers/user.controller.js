const bcrypt = require('bcrypt');
const { User, generateToken, userValidators } = require("../models/user.model");

exports.signIn = async (req, res, next) => {
    //extract email and password from the request body
    const { email, password } = req.body;
    //search the user by email and password in the DB
    const user = await User.findOne({ email });
    if (user) {
        // check the password
        //comparing the unencrypted password from the request body to the encrypted password from the database
        bcrypt.compare(password, user.password, (err, same) => {
            if (err)
                return next(new Error(err.message));
            if (same) {//if equal
                const token = generateToken(user);
                user.password = "****";//hiding the password that returned to the client
                return res.send({ user, token });
            }
            //general answer of not authorized
            return next({ message: "Auth Failed", status: 401 })
        })
    }
    else {
        return next({ message: "Auth Failed", status: 401 })
    }

}

exports.signUp = async (req, res, next) => {
    const { username, password, email, address, role } = req.body;

    const v = userValidators.login.validate({email,password});
    if (v.error)
        return next({ message: v.error.message })

    try {
        // saving the user in the database
        const user = new User({ username, password, email, address, role });
        await user.save();// first of all, go to the pre operation and encrypt the password there
        // if he succeeded in encrypting - tries to insert into the database
        //checked by Mongo if the details are valid

        const token = generateToken(user);
        user.password = "****"//hiding the password that returned to the client
        return res.status(201).json({ user, token }); //returning the user
    } catch (error) {
        return next({ message: error.message, status: 409 })
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-__v')
        return res.json(users);
    } catch (error) {
        next(error);
    }
}