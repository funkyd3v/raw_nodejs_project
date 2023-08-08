// module scaffolding
const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'hsdjfhsdkjfhsdf',
    maxChecks: 5,
    twilio: {
        fromPhone: '+17063883891',
        accountSid: 'ACffb9f2c12a514298f885cca32b7fc3a1',
        authToken: '5fb377afe22dde926b120af53b7bd61b',
    }
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'dadkasdkaposdsf',
    maxChecks: 5,
    twilio: {
        fromPhone: '+17063883891',
        accountSid: 'ACffb9f2c12a514298f885cca32b7fc3a1',
        authToken: '5fb377afe22dde926b120af53b7bd61b',
    }
};

// determine which environment was passed
const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

const environmenToExport = typeof (environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmenToExport;