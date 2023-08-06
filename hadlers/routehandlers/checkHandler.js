// dependecies
const data = require('../../lib/data');
const { hash, parseJSON, createRandomString } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const { maxChecks } = require('../../helpers/environments');

// module scaffolding
const handler = {};

// handler

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
}
handler._check = {};

handler._check.get = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryObj.id) === 'string' && requestProperties.queryObj.id.trim().length === 20 ? requestProperties.queryObj.id : false;

    if (id) {
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                const token = typeof (requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;

                if (token) {
                    userPhone = parseJSON(checkData).userPhone;
                    tokenHandler._token.verify(token, userPhone, (isTokenValid) => {
                        if (isTokenValid) {
                            callback(200, parseJSON(checkData));
                        } else {
                            callback(500, {
                                error: "There was a server side error"
                            });
                        }
                    });
                } else {
                    callback(403, {
                        error: "Authentication failure"
                    });
                }
            } else {
                callback(404, {
                    error: "There was no check against this id"
                });
            }
        });
    } else {
        callback(400, {
            error: "You have a problem in your request/id"
        });
    }
}
handler._check.post = (requestProperties, callback) => {
    let protocol = typeof requestProperties.body.protocol === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof requestProperties.body.method === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let successMethod = typeof requestProperties.body.successMethod === 'object' && requestProperties.body.successMethod instanceof Array ? requestProperties.body.successMethod : false;

    let timeoutSeconds = typeof requestProperties.body.timeoutSeconds === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

    if (protocol && url && method && successMethod && timeoutSeconds) {
        const token = typeof (requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;

        // read token
        data.read('tokens', token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                let userPhone = parseJSON(tokenData).phone;
                data.read('users', userPhone, (err2, userData) => {
                    if (!err2 && userData) {
                        tokenHandler._token.verify(token, userPhone, (isTokenValid) => {
                            if (isTokenValid) {
                                let userObj = parseJSON(userData);
                                let userChecks = typeof userObj.checks === 'object' && userObj.checks instanceof Array ? userObj.checks : [];

                                if (userChecks.length < maxChecks) {
                                    const checkId = createRandomString(20);
                                    const checkObj = {
                                        'id': checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successMethod,
                                        timeoutSeconds
                                    }

                                    // save data
                                    data.create('checks', checkId, checkObj, (err3) => {
                                        if (!err3) {
                                            // add checkId to the user's object
                                            userObj.checks = userChecks;
                                            userObj.checks.push(checkId);

                                            data.update('users', userPhone, userObj, (err4) => {
                                                if (!err4) {
                                                    callback(200, checkObj);
                                                } else {
                                                    callback(500, {
                                                        error: "Internal server error"
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: "Internal Error"
                                            });
                                        }
                                    });
                                } else {
                                    callback(401, {
                                        error: "User has already reached max check limit"
                                    });
                                }
                            } else {
                                callback(403, {
                                    error: "Authentication failure"
                                })
                            }
                        });
                    } else {
                        callback(404, {
                            error: "User not found"
                        });
                    }
                });
            } else {
                callback(403, {
                    error: "Authentication failure"
                });
            }
        });
    } else {
        callback(400, {
            error: 'There was a problem in your request'
        });
    }
}
handler._check.put = (requestProperties, callback) => {
    const id = typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;

    let protocol = typeof requestProperties.body.protocol === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof requestProperties.body.method === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let successMethod = typeof requestProperties.body.successMethod === 'object' && requestProperties.body.successMethod instanceof Array ? requestProperties.body.successMethod : false;

    let timeoutSeconds = typeof requestProperties.body.timeoutSeconds === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

    if (id) {
        if (protocol || url || method || successMethod || timeoutSeconds) {
            data.read('checks', id, (err, checkData) => {
                if (!err && checkData) {
                    const checkObj = parseJSON(checkData);
                    const token = typeof (requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;

                    tokenHandler._token.verify(token, checkObj.userPhone, (isTokenValid) => {
                        if (isTokenValid) {
                            if (protocol) {
                                checkObj.protocol = protocol;
                            }
                            if (url) {
                                checkObj.url = url;
                            }
                            if (method) {
                                checkObj.method = method;
                            }
                            if (successMethod) {
                                checkObj.successMethod = successMethod;
                            }
                            if (timeoutSeconds) {
                                checkObj.timeoutSeconds = timeoutSeconds;
                            }

                            // save data
                            data.update('checks', id, checkObj, (err2) => {
                                if (!err2) {
                                    callback(200, checkObj);
                                } else {
                                    callback(500, {
                                        error: "Data not saved!"
                                    })
                                }
                            });
                        } else {
                            callback(403, {
                                error: "Authentication failure"
                            });
                        }
                    });
                } else {
                    callback(500, {
                        error: "There was a server side error"
                    });
                }
            });
        } else {
            callback(400, {
                error: "You must provide al least one field to update"
            });
        }
    } else {
        callback(400, {
            error: "You have a problem in your request"
        });
    }
}
handler._check.delete = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryObj.id) === 'string' && requestProperties.queryObj.id.trim().length === 20 ? requestProperties.queryObj.id : false;

    if (id) {
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                const token = typeof (requestProperties.headersObj.token) === 'string' ? requestProperties.headersObj.token : false;

                if (token) {
                    userPhone = parseJSON(checkData).userPhone;
                    tokenHandler._token.verify(token, userPhone, (isTokenValid) => {
                        if (isTokenValid) {
                            data.delete('checks', id, (err2) => {
                                if (!err2) {
                                    data.read('users', userPhone, (err3, userData) => {
                                        if (!err3 && userData) {
                                            let userObj = parseJSON(userData);
                                            let userChecks = typeof userObj.checks === 'object' && userObj.checks instanceof Array ? userObj.checks : [];

                                            // remove check id from user's check array
                                            const checkPosition = userChecks.indexOf(id);
                                            if (checkPosition > -1) {
                                                userChecks.splice(checkPosition, 1);
                                                userObj.checks = userChecks;

                                                // save data again
                                                data.update('users', userPhone, userObj, (err3) => {
                                                    if (!err3) {
                                                        callback(200);
                                                    } else {
                                                        callback(500, {
                                                            error: "Data not saved!"
                                                        });
                                                    }
                                                });
                                            } else {
                                                callback(500, {
                                                    error: "check ID did not found"
                                                });
                                            }
                                        } else {
                                            callback(500, {
                                                error: "There was a server side error"
                                            });
                                        }
                                    });
                                } else {
                                    callback(500, {
                                        error: "There was a server side error"
                                    });
                                }
                            });
                        } else {
                            callback(500, {
                                error: "There was a server side error"
                            });
                        }
                    });
                } else {
                    callback(403, {
                        error: "Authentication failure"
                    });
                }
            } else {
                callback(404, {
                    error: "There was no check against this id"
                });
            }
        });
    } else {
        callback(400, {
            error: "You have a problem in your request/id"
        });
    }
}
module.exports = handler;