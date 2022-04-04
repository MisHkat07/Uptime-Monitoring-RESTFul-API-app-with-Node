const url = require('url');
const http = require('http');
const https = require('https');
const data = require('./data');
const { parseJSON } = require('../Assistants/utilities');
const { sendTwilioSms } = require('../Assistants/notifications');

const worker = {};

worker.gatherAllChecks = () => {
  data.list('checks', (err1, checks) => {
    if (!err1 && checks && checks.length > 0) {
      checks.forEach((check) => {
        data.read('checks', check, (err2, originalCheckData) => {
          if (!err2 && originalCheckData) {
            worker.validateCheckData(parseJSON(originalCheckData));
          } else {
            console.log('Error: reading one of the checks data!');
          }
        });
      });
    } else {
      console.log('Error: could not find any checks to process!');
    }
  });
};

worker.validateCheckData = (originalCheckData) => {
  const originalData = originalCheckData;
  if (originalCheckData && originalCheckData.id) {
    originalData.state =
      typeof originalCheckData.state === 'string' &&
      ['up', 'down'].indexOf(originalCheckData.state) > -1
        ? originalCheckData.state
        : 'down';

    originalData.lastChecked =
      typeof originalCheckData.lastChecked === 'number' &&
      originalCheckData.lastChecked > 0
        ? originalCheckData.lastChecked
        : false;

    worker.performCheck(originalData);
  } else {
    console.log('Error: check was invalid or not properly formatted!');
  }
};

worker.performCheck = (originalCheckData) => {
  let checkOutCome = {
    error: false,
    responseCode: false,
  };
  let outcomeSent = false;
  const parsedUrl = url.parse(
    `${originalCheckData.protocol}://${originalCheckData.url}`,
    true
  );
  const hostName = parsedUrl.hostname;
  const { path } = parsedUrl;

  const requestDetails = {
    protocol: `${originalCheckData.protocol}:`,
    hostname: hostName,
    method: originalCheckData.method.toUpperCase(),
    path,
    timeout: originalCheckData.timeoutSeconds * 1000,
  };

  const protocolToUse = originalCheckData.protocol === 'http' ? http : https;

  const req = protocolToUse.request(requestDetails, (res) => {
    const status = res.statusCode;
    checkOutCome.responseCode = status;
    if (!outcomeSent) {
      worker.processCheckOutcome(originalCheckData, checkOutCome);
      outcomeSent = true;
    }
  });

  req.on('error', (e) => {
    checkOutCome = {
      error: true,
      value: e,
    };
    if (!outcomeSent) {
      worker.processCheckOutcome(originalCheckData, checkOutCome);
      outcomeSent = true;
    }
  });

  req.on('timeout', () => {
    checkOutCome = {
      error: true,
      value: 'timeout',
    };
    if (!outcomeSent) {
      worker.processCheckOutcome(originalCheckData, checkOutCome);
      outcomeSent = true;
    }
  });
  req.end();
};

worker.processCheckOutcome = (originalCheckData, checkOutCome) => {
  const state =
    !checkOutCome.error &&
    checkOutCome.responseCode &&
    originalCheckData.successCodes.indexOf(checkOutCome.responseCode) > -1
      ? 'up'
      : 'down';
  const alertWanted = !!(
    originalCheckData.lastChecked && originalCheckData.state !== state
  );
  const newCheckData = originalCheckData;

  newCheckData.state = state;
  newCheckData.lastChecked = Date.now();
  data.update('checks', newCheckData.id, newCheckData, (err) => {
    if (!err) {
      if (alertWanted) {
        worker.alertUserToStatusChange(newCheckData);
      } else {
        console.log('Alert is not needed as there is no state change!');
      }
    } else {
      console.log('Error trying to save check data of one of the checks!');
    }
  });
};
worker.alertUserToStatusChange = (newCheckData) => {
  const msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${
    newCheckData.protocol
  }://${newCheckData.url} is currently ${newCheckData.state}`;

  sendTwilioSms(newCheckData.userPhone, msg, (err) => {
    if (!err) {
      console.log(`User was alerted to a status change via SMS: ${msg}`);
    } else {
      console.log('There was a problem sending sms to one of the user!');
    }
  });
};
worker.loop = () => {
  setInterval(() => {
    worker.gatherAllChecks();
  }, 1000 * 60);
};
worker.init = () => {
  worker.gatherAllChecks();
  worker.loop();
};

module.exports = worker;
