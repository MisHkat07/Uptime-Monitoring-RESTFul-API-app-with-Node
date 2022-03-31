//    Title = Uptime Monitoring App
//   Descriptiion = A RESTFul API to monitor user defined link.

// ------------------dependencies-
const http = require('http');
const { handleReqRes } = require('./Assisants/handleReqRes');
const environtments = require('./Assisants/environments');

// ------------------App object - Module Scaffolding
const app = {};

// ------------------Create Server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environtments.port, () => {
    console.log(`listening to port number ${environtments.port}`);
  });
};

// ------------------- handle Req Res
app.handleReqRes = handleReqRes;

// -------------------Starting server
app.createServer();
