//Copy paste of the auth.js code
//Only difference is the authentication modal is User instead of Admin
const jwt = require('jsonwebtoken')
const User = require('../models/userModal')
const authUser = async (request, response, next) => {
    try {
        const token = request.header('Authorization').replace('Bearer ', '')
        if(!token){
            return response.status(401).send('Unauthorized')
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id,token:token})
        if (!user) {
            return response.status(401).send('Unauthorized')
        }
        request.user=user
        request.token=token
        request.userId=decoded._id
        next()
    } catch (error) {
        response.status(500).send('Internal Server Error')
    }
}

module.exports=authUser