// dependecies
const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities')

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

}
handler._users.delete = (requestProperties, callback) => {

}
module.exports = handler;