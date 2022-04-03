const { sampleHandlers } = require('./Handlers/Route handlers/sampleHandlers');
const { userHandlers } = require('./Handlers/Route handlers/userHandlers');
const { tokenHandlers } = require('./Handlers/Route handlers/tokenHandlers');
const { checkHandlers } = require('./Handlers/Route handlers/checkHandlers');

const routes = {
  sample: sampleHandlers,
  user: userHandlers,
  token: tokenHandlers,
  check: checkHandlers,
};

module.exports = routes;
