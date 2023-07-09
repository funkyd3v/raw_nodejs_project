// module scaffolding
const handler = {};

// handler

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        'message' : 'The URL you requested was not found!',
    });
}

module.exports = handler;