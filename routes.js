const { sampleHandlers } = require('./Handlers/Route handlers/sampleHandlers');
const { userHandlers } = require('./Handlers/Route handlers/userHandlers');

const routes = {
  sample: sampleHandlers,
  user: userHandlers,
};

module.exports = routes;
