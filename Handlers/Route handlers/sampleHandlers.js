const handler = {};

handler.sampleHandlers = (requestProperties, callback) => {
  console.log(requestProperties);
  callback(200, {
    message: 'This is a simple url',
  });
};
module.exports = handler;
