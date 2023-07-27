// dependecies
const data = require('../../lib/data');
const {hash, parseJSON} = require('../../helpers/utilities')

// module scaffolding
const handler = {};

// handler

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);    
    }
    
}
handler._users = {};

handler._users.get = (requestProperties, callback) => {
    const phone = typeof(requestProperties.queryObj.phone) === 'string' && requestProperties.queryObj.phone.trim().length == 11 ? requestProperties.queryObj.phone : false;

    if (phone) {
        data.read('users', phone, (err, data) => {
            const user = {...parseJSON(data)};
            if (!err && phone) {
                delete user.password;
                callback(200, user);
            } else {
                callback(404, {
                    error: 'Requested data not found!'
                })    
            }
        });
    } else {
        callback(404, {
            error: 'Requested data not found!'
        })
    }
}
handler._users.post = (requestProperties, callback) => {
    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.toString().trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length == 11 ? requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'boolean' && requestProperties.body.tosAgreement ? requestProperties.body.tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        data.read('users', phone, (err) => {
            if (err) {
                const userObj = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };

                // store data
                data.create('users', phone, userObj, (err) => {
                    if (!err) {
                        callback(200, {
                            message : 'User has created successfully!',
                        });
                    } else {
                        callback(500, {
                            error: 'User not created!',
                        })
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a server side error',
                })
            }
        });
    } else { 
        callback(400, {
            error: 'Wrong input or request!',
        });
    }
}
handler._users.put = (requestProperties, callback) => {
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length == 11 ? requestProperties.body.phone : false;

    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.toString().trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (phone) {
        if (firstName || lastName || password) {
            // look up the data
            data.read('users', phone, (err, uData) => {
                const userData = {...parseJSON(uData)}
                if (!err && userData) {
                    if(firstName){
                        userData.firstName = firstName;
                    }
                    if(lastName){
                        userData.lastName = lastName;
                    }
                    if(password){
                        userData.password = hash(password);
                    }

                    // store data
                    data.update('users', phone, userData, (err) => {
                        if (!err) {
                            callback(200, {
                                message: 'User successfully updated!'
                            });
                        }else{
                            callback(500, {
                                error: 'There is a problem in server side!'
                            })
                        }
                    });
                } else {
                    callback(400, {
                        error: 'You have problem in your request!'
                    })
                }
            });
        } else {
            callback(400, {
                error: 'Invalid request!'
            })
        }
    } else {
        callback(400, {
            error: 'Invalid phone number!'
        })
    }

    
}
handler._users.delete = (requestProperties, callback) => {
    const phone = typeof(requestProperties.queryObj.phone) === 'string' && requestProperties.queryObj.phone.trim().length == 11 ? requestProperties.queryObj.phone : false;

    if (phone) {
        data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                data.delete('users', phone, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'User successfully deleted!'
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
module.exports = handler;