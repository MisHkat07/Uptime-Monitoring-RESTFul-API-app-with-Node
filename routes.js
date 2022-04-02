const { sampleHandlers } = require('./Handlers/Route handlers/sampleHandlers');
const { userHandlers } = require('./Handlers/Route handlers/userHandlers');
const { tokenHandlers } = require('./Handlers/Route handlers/tokenHandlers');

const routes = {
  sample: sampleHandlers,
  user: userHandlers,
  token: tokenHandlers,
};

module.exports = routes;
