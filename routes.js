// dependencies
const { notFoundHandler } = require('./hadlers/routehandlers/notFoundHandler');
const { sampleHandler } = require('./hadlers/routehandlers/sampleHandler');
const { userHandler } = require('./hadlers/routehandlers/userHandler');
// all routes
const routes = {
    sample: sampleHandler,
    user: userHandler,
};

module.exports = routes;