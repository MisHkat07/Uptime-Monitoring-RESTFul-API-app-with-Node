/* eslint-disable no-underscore-dangle */

const data = require('../../lib/data');
const { hash } = require('../../Assistants/utilities');
const { createRandomString } = require('../../Assistants/utilities');
const { parseJSON } = require('../../Assistants/utilities');
// module scaffolding
const handler = {};

handler.tokenHandlers = (requestProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === 'string' &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === 'string' &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;
  if (phone && password) {
    data.read('users', phone, (err1, userData) => {
      const hashedPassword = hash(password);
      if (hashedPassword === parseJSON(userData).password) {
        const tokenId = createRandomString(20);
        const expires = Date.now() + 60 * 60 * 1000;
        const tokenObject = {
          phone,
          id: tokenId,
          expires,
        };
        data.create('tokens', tokenId, tokenObject, (err2) => {
          if (!err2) {
            callback(200, tokenObject);
          } else {
            callback(500, { error: 'Something went worng!' });
          }
        });
      } else {
        callback(400, { error: 'Password is not valid!' });
      }
    });
  } else {
    callback(400, { error: 'You have a problem in request!' });
  }
};

// @TODO: Authentication
handler._token.get = (requestProperties, callback) => {};

// @TODO: Authentication
handler._token.put = (requestProperties, callback) => {};

// @TODO: Authentication
handler._token.delete = (requestProperties, callback) => {};

module.exports = handler;
