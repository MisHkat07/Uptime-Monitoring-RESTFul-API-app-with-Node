const utilities = {};
const crypto = require('crypto');
const environtments = require('./environments');

utilities.parseJSON = (stringJSON) => {
  let output = {};
  try {
    output = JSON.parse(stringJSON);
  } catch (err) {
    output = {};
  }

  return output;
};

utilities.hash = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto
      .createHmac('sha256', environtments.secretKey)
      .update(str)
      .digest('hex');
    return hash;
  }
  return false;
};

module.exports = utilities;
