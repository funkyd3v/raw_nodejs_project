// dependecies
const data = require('../../lib/data');
const {hash, createRandomString, parseJSON} = require('../../helpers/utilities')

// module scaffolding
const handler = {};

// handler

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);    
    }
    
}
handler._token = {};

handler._token.get = (requestProperties, callback) => {
    const id = typeof(requestProperties.queryObj.id) === 'string' && requestProperties.queryObj.id.trim().length == 20 ? requestProperties.queryObj.id : false;

    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            const token = {...parseJSON(tokenData)};
            if (!err && token) {
                callback(200, token);
            } else {
                callback(404, {
                    error: 'Requested token not found!'
                })    
            }
        });
    } else {
        callback(404, {
            error: 'Requested token not found!'
        })
    }
}    
handler._token.post = (requestProperties, callback) => {
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length == 11 ? requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (phone && password) {
        data.read('users', phone, (err, userData) => {
            let hashedPassword = hash(password);
            if (hashedPassword === parseJSON(userData).password) {
                let tokenId = createRandomString(20);
                let expires = Date.now() + 60 * 60 * 1000;
                let tokenObj = {
                    phone,
                    'id': tokenId,
                    expires
                }

                // store data
                data.create('tokens', tokenId, tokenObj, (err) => {
                    if (!err) {
                        callback(200, tokenObj);
                    } else {
                        callback(500, {
                            error: 'token not created!'
                        })
                    }
                });
            } else {
                callback(404, {
                    error: 'Password not found'
                })
            }
        });
    } else {
        callback(400, {
            error: 'Invalid phone number or password'
        })
    }
}    
handler._token.put = (requestProperties, callback) => {}    
handler._token.delete = (requestProperties, callback) => {}

module.exports = handler;