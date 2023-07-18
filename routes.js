// dependencies
const { notFoundHandler } = require('./hadlers/routehandlers/notFoundHandler');
const { sampleHandler } = require('./hadlers/routehandlers/sampleHandler');

// all routes
const routes = {
    sample: sampleHandler,
    notFound: notFoundHandler,
}

module.exports = routes;