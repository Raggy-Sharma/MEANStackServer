const jwt = require('jsonwebtoken');

module.exports.verifyJwtToken = (req, res, next) => {
    var token;
    if('authorization' in req.headers)
        token = req.headers['authorization'].split(' ');
    if(!token)
        return res.status(403).send({auth: false, message: 'No token provided'})
    else{
        jwt.verify(token[1], process.env.JWT_SECRET, (err, decoded) =>{
            if(err){
                return res.status(500).send({auth: false, message: 'Authentication failed'});
            } else {
                req._id = decoded._id;
                next();
            }
        })
    }
}