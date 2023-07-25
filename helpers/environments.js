// module scaffolding
const environments = {};

environments.staging = {
    port : 3000,
    envName: 'staging',
    secretKey: 'hsdjfhsdkjfhsdf'
};

environments.production = {
    port : 5000,
    envName: 'production',
    secretKey: 'dadkasdkaposdsf'
};

// determine which environment was passed
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

const environmenToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmenToExport;