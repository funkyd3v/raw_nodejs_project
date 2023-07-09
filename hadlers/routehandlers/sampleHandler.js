// module scaffolding
const handler = {};

// handler

handler.sampleHandler = (requestProperties, callback) => {
    callback(200, {
        'message' : 'This is a sample message',
    });
}

module.exports = handler;