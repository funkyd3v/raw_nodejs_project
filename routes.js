// dependencies
const { notFoundHandler } = require('./hadlers/routehandlers/notFoundHandler');
const { sampleHandler } = require('./hadlers/routehandlers/sampleHandler');
const { tokenHandler } = require('./hadlers/routehandlers/tokenHandler');
const { userHandler } = require('./hadlers/routehandlers/userHandler');
// all routes
const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
};

module.exports = routes;