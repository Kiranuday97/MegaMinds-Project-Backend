const JWT = require ('jsonwebtoken')


exports.requireSignIn = async(req,res,next) =>{
    try {
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.SECRETE_KEY
        )
        req.user = decode;
        next()
    } catch (error) {
        console.log(error);
    }
}

