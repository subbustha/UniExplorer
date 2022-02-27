//Authentication for admin verification.
const jwt = require('jsonwebtoken')
const Admin = require('../models/adminModel')
const auth = async (request, response, next) => {
    try {
        //Trying to fetch the authorization token from the request header
        const token = request.header('Authorization').replace('Bearer ', '')
        if (!token) {
            return response.status(401).send('Unauthorized')
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET) //Decoding the token to get user object id
        const admin = await Admin.findOne({ _id: decoded._id, 'token': token })
        //Admin verification
        if (!admin) {
            return response.status(401).send('Unauthorized')
        }
        request.admin = admin
        request.token = token
        //Goign back to the next router function from the middleware
        next()
    } catch (error) {
        response.status(500).send('Internal Server Error')
    }
}

module.exports = auth