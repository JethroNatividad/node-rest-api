const jwt = require('jsonwebtoken')

module.exports = verifyAuthToken = (req, res, next) => {
    
    //grab the auth token in the header, auth-token is passed on loggin in with correct credentials
    const token = req.header('auth-token')

    //if there is no token, deny the access
    if (!token) return res.status(401).json({
        status: 401,
        message: 'access denied'
    })

    try{

        //check if token is verified
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        //value of verfied is the _id of the user, we passed it in from signing the jwt token

        //if it is verified, pass the _id to the req.user so we can access it
        req.user = verified;
        //this is a middleware so
        next()

    }catch(error){
        //if there is an error, response this
        return res.status(400).json({
            status: 400,
            message: 'invalid token'
        })
    }

}