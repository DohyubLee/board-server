/**
 * @fileoverview response header setter
 */
/**
 * @type {Object} response header items
 */
var configs = {
    'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Credentials': true
};

module.exports = () => {
   return (req, res, next) => {
        var origin = req.headers.origin;
        res.setHeader('Access-Control-Allow-Origin', origin);

        Object.keys(configs).forEach(cell => {
            res.setHeader(cell, configs[cell]);
        });

        next();
    }
}
