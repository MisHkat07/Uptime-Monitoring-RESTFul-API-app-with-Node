//    Title = Uptime Monitoring App
//   Descriptiion = A RESTFul API to monitor user defined link.

// ------------------dependencies-
const http = require('http');
const { handleReqRes } = require('./Assisants/handleReqRes');

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

// ------------------- handle Req Res
app.handleReqRes = handleReqRes;

// -------------------Starting server
app.createServer();
