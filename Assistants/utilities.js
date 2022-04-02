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
utilities.createRandomString = (strlegth) => {
  let length = strlegth;
  length = typeof strlegth === 'number' && strlegth > 0 ? strlegth : false;
  if (length) {
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let output = '';
    for (let i = 1; i <= length; i += 1) {
      const randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      output += randomCharacter;
    }
    return output;
  }
  return false;
};

module.exports = utilities;
