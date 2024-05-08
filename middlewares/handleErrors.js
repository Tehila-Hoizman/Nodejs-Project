// when the path is not found, an error 404 is sent - page not found
exports.pageNotFound = (req, res, next) => {
    const error = new Error(`the page is Not Found`);
    error.status = 404;
    next(error);// automatically sent to middleware that catches errors
// because we sent a parameter
}
// General middleware for error catching
// accepts 4 parameters
// The first parameter is the error sent to it from another middleware
// The last middleware all errors will go to
// so that all errors are of the same format
exports.serverNotFound = (error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        }
    })
}