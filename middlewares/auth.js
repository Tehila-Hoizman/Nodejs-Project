const jwt = require('jsonwebtoken');

// middleware that checks the token coming from the client
exports.auth = (req, res, next) => {
    try {
        const { authorization } = req.headers;//extracting the token from the header
        const [, token] = authorization.split(' ');
        const privateKey = process.env.JWT_SECRET || 'JWT_SECRET'; // secret string by which the token was created

        const data = jwt.verify(token, privateKey);// the data that the token contains
        req.user = data;//adding an data to the request
        next(); // moving to Route/Middlewar
    } catch (err) {
        console.log("error: "+err );
        next({ message: err, status: 401 });
    }
}
exports.authAdmin = (req, res, next) => {
    try {
        const { authorization } = req.headers;//extracting the token from the header
        console.log(authorization);
        const [, token] = authorization.split(' ');
        const privateKey = process.env.JWT_SECRET || 'JWT_SECRET'; // secret string by which the token was created

        const data = jwt.verify(token, privateKey);// the data that the token contains
        req.user = data;//adding an data to the request
        if (data.role == "admin")
            next(); // moving to Route/Middlewar
        else
            next({ message: 'only admin can get all user', status: 403 });
    } catch (err) {
        console.log("error: "+err );
        next({ message: err, status: 401 });
    }
}