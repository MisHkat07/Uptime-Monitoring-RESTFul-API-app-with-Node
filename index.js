/* eslint-disable prettier/prettier */
//    Title = Uptime Monitoring App
//   Descriptiion = A RESTFul API to monitor user defined link.

// ------------------dependencies-
const http = require('http');
const url = require('url');

// ------------------App object - Module Scaffolding
const app = {};

// ------------------Configuration
app.config = {
    port: 3000,
};

// ------------------Create Server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listening to port number ${app.config.port}`);
    });
};

// ------------------ Handle Request & Response
app.handleReqRes = (req, res) => {
    // handle Requests
    // parsing url
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    console.log(path);
    // handle Response
    res.end('Hello world');
};

// -------------------Starting server
app.createServer();
