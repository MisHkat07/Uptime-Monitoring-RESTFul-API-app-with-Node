const handler = {};

handler.tokenHandlers = (requestProperties, callback) => {
  console.log(requestProperties);
  callback(200, {
    message: 'This is a token url',
  });
};
module.exports = handler;