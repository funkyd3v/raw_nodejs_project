// dependencies
const http = require('http');

// app object - module scaffolding
const app = {};

// app config
app.config = {
    port: 3000
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Listening on port ${app.config.port}`);
    });
}

// handle request and response
app.handleReqRes = (req, res) => {
    res.end("Hello World");
}

// server start
app.createServer();