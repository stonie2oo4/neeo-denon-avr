const denon = require('./denon').devices;

// export the devices you want to make available to the Brain (see README for more information)
module.exports = {
  devices: [...denon]
};
