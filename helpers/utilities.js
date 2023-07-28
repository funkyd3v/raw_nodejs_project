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
        const hash = crypto.createHmac('sha256', environment.secretKey).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
}

// create random string
utilities.createRandomString = (strlength) => {
    let length = strlength;
    length = typeof strlength === 'number' && strlength > 0 ? strlength : false;
    if (length) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let output = '';

        for (let i = 1; i <= length; i++) {
            const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
            output += randomChar; 
        }
        
        return output;
    } else {
        return false; 
    }
    

}

module.exports = utilities;