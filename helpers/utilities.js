// dependencies
const crypto = require('crypto');
const environment = require('./environments')

// module scaffolding
const utilities = {};

// parse JSON
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {}
    }

    return output;
}

// hash string
utilities.hash = (str) => {
    if (typeof(str) === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', environment[process.env.NODE_ENV].secretKey).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
}

module.exports = utilities;