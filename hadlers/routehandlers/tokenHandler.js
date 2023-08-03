// dependecies
const data = require('../../lib/data');
const { hash, createRandomString, parseJSON } = require('../../helpers/utilities')

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
    const id = typeof (requestProperties.queryObj.id) === 'string' && requestProperties.queryObj.id.trim().length == 20 ? requestProperties.queryObj.id : false;

    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) };
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
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length == 11 ? requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (phone && password) {
        data.read('users', phone, (err, userData) => {
            let hashedPassword = hash(password);
            if (hashedPassword === parseJSON(userData).password) {
                let tokenId = createRandomString(20);
                let expires = Date.now() + 60 * 60 * 5000;
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
handler._token.put = (requestProperties, callback) => {
    const id = typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length == 20 ? requestProperties.body.id : false;

    const extend = typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true ? true : false;

    if (id && extend) {
        data.read('tokens', id, (err1, tokenData) => {
            let tokenObj = parseJSON(tokenData);
            if (tokenObj.expires > Date.now()) {
                tokenObj.expires = Date.now() + 60 * 60 * 5000;

                // store data
                data.update('tokens', id, tokenObj, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'Success'
                        })
                    } else {
                        callback(500, {
                            error: 'There was a server side error!'
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'Token already expired!'
                });
            }
        });
    } else {
        callback(400, {
            error: 'There was a problem in your request'
        });
    }
}
handler._token.delete = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryObj.id) === 'string' && requestProperties.queryObj.id.trim().length == 20 ? requestProperties.queryObj.id : false;

    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                data.delete('tokens', id, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'Token was successfully deleted!'
                        })
                    } else {
                        callback(500, {
                            error: 'There was server side error!'
                        })
                    }
                });
            } else {
                callback(500, {
                    error: 'There was server side error!'
                })
            }
        });
    } else {
        callback(400, {
            error: 'Requested data not found!'
        })
    }
}

// token verify
handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            if (parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    })
}

module.exports = handler;