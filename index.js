// dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');

// app object - module scaffolding
const app = {};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Environment is ${process.env.NODE_ENV}`)
        console.log(`Listening on port ${environment.port}`);
    });
}

// handle request and response
app.handleReqRes = handleReqRes;

// server start
app.createServer();