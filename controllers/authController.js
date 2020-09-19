const { validateRegister, validateLogin } = require('../validation')
const bycript = require('bcryptjs')
const User = require('../models/user');
const jws = require('jsonwebtoken')

exports.register = async (req, res) => {

    //check request body if qualifies the validateRegister schema
    const { error } = validateRegister(req.body)

    //if it contains error, respond 404 status and the error message coming from Joi validate register 
    if (error) return res.status(400).json({
        status: 400,
        error: error.details[0].message
    })
    //check if email exists in the database so user cannot register taken email
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) return res.status(400).json({
        status: 400,
        error: 'Email already exists'
    })

    //########## PASSWORD ENCRYPTION ############

    //destructures the request body
    const { name, email, password } = req.body

    //generates salt
    const salt = await bycript.genSalt(10);
    
    //creates hashedPassword to save to database
    const hashedPassword = await bycript.hash(password, salt)//the password from the req.body and the salt

    //defines the new user from the mongoose model
    const newUser = new User({
        name,
        email,
        hashedPassword
    })

    // uses try catch block to reduce if(error) crap
    try {
        //here we save the newUser defined abouve to the database
        const data = await newUser.save();
        //this is the response without the hashed password
        const {_id, name, email} = data
        res.status(200).json({
            status: 200,
            message: 'created new user',
            data: {
                _id,
                name,
                email
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 400,
            error: error
        })
    }
}

exports.login = async (req, res) => {

    //check request body if qualifies the validateLogin schema
    const { error } = validateLogin(req.body)

    //if it contains error, respond 404 status and the error message coming from Joi validate register
    if (error) return res.status(400).json({
        status: 400,
        error: error.details[0].message
    })

    //check if the response email exist and if it exist, save it to variable user
    const user = await User.findOne({ email: req.body.email })

    //if the email doesnt exits, 
    if (!user) return res.status(400).json({
        status: 400,
        error: 'Email does not match with any accounts'
    })

    //destructures the password from req.body and hashedPassword from user above
    const { password } = req.body
    const { hashedPassword, _id } = user

    //decrypts the hashedPassword and compares it to the password from req.body
    const validPass = await bycript.compare(password, hashedPassword)
    if(!validPass) return res.status(400).json({
        status: 400,
        error: 'Incorrect password'
    })

    //if the password and the email matches, sign the id of the logged in user with the secret key
    const token = await jws.sign({_id: _id}, process.env.TOKEN_SECRET)

    //pass the token as 'auth-token' in the header
    res.header('auth-token', token).status(200).json({
        status: 200,
        message: 'Logged in',
        token: token
    })
}