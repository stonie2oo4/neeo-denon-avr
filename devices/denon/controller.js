'use strict';

  const Denon = require('denon-client');
  var AVR_IP = '192.168.0.20';
  var AVR_PORT = '23';
  var AVR_EVENTKEY = [];
  AVR_EVENTKEY['sliderVolumeValue'] = '6298597872300457984:SLIDERVOLUMEVALUE_SENSOR';
  AVR_EVENTKEY['sourceText'] = '6298597872300457984:SOURCETEXT_SENSOR';
  let inputSelectTextLabel = '';
  let switchPowerState = '';
  let sliderVolumeValue = 0;
  let sendComponentUpdate;
  let content;
  let options;
  let req;
//keeps track of chosen AVR input, in case something tries to change it by HDMI CEC against my will
  let selectedSource='';

  const denonClient = new Denon.DenonClient(AVR_IP,AVR_PORT);
  denonClient.connect()
  const http = require('http');

// hard-coded event keys to work around componentupdate problem
const neeoIp = '192.168.0.50';

function sendComponentUpdateNotification ( uniqueDeviceId, component, value) {
console.log(component);
console.log(AVR_EVENTKEY[component]);

  content = {
    type: AVR_EVENTKEY[component],
    data: value
  };

  console.log('content is.....%j',value);

  options = {
    hostname: neeoIp,
    port: 3000,
    path: '/v1/notifications',
    method: 'POST',
    headers: {'Content-Type': 'application/json'}
  };
  req = http.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', function (body) {
    let reply = JSON.parse(body)
  console.log('JSON response %j', body);
  if (reply.success === true){
  console.log ('[NOTIFICATIONS]\tSuccesfully sent notification with value ' + content.data + ' to eventkey ' + content.type + ' @' + options.hostname);
}
    });
  });
  req.on('error', function(e) {
    console.log ('[NOTIFICATIONS]\tProblem with request: ' + e.message);
  });
  req.write(JSON.stringify(content));
  req.end();
};



  module.exports.sliderVolumeValueSet = function(deviceid, value) {
    console.log(`[CONTROLLER] slide set to ${value} on ${deviceid}`);
    sliderVolumeValue = parseInt(value,10);
    denonClient.setVolume(sliderVolumeValue);
};

  module.exports.getSource = function(deviceid) {
    denonClient.getSource;
    console.log(`[CONTROLLER] get source as ${inputSelectTextLabel} on ${deviceid}`);
    return inputSelectTextLabel;
  };

  module.exports.sliderVolumeValueGet = function(deviceid) {
    denonClient.getVolume;
    console.log(`[CONTROLLER] return slider value is ${sliderVolumeValue} on ${deviceid}`);
     return sliderVolumeValue;
  };

  module.exports.registerStateUpdateCallback = function(updateFunction) {
    console.log('[CONTROLLER] register update state');
    sendComponentUpdate = updateFunction;
};

  module.exports.discoverDenon = function() {
    console.log('[CONTROLLER] denon discover call');
    return [{
    id: 'denon1',
    name: 'Denon AVR',
    reachable: true}];
};


  module.exports.onButtonPressed = function onButtonPressed(name, deviceId) {
  console.log(`[CONTROLLER] ${name} button pressed on ${deviceId}`);

  switch (name) {
    case "VOLUME UP":
    denonClient.setVolume(Denon.Options.VolumeOptions.Up);
    break;

    case "VOLUME DOWN":
      denonClient.setVolume(Denon.Options.VolumeOptions.Down);
      break;

    case "POWER ON":
      denonClient.setPower(Denon.Options.PowerOptions.On);
      break;

    case "POWER OFF":
      denonClient.setPower(Denon.Options.PowerOptions.Standby);
      break;

    case "MUTE TOGGLE":
      denonClient.setMute(Denon.Options.MuteOptions.On);
      break;

    case "INPUT CD":
      selectedSource="CD";  
      denonClient.setInput(Denon.Options.InputOptions.CD);
      break;

    case "INPUT TUNER":
      selectedSource="TUNER";
      denonClient.setInput(Denon.Options.InputOptions.Tuner);
      break;

    case "INPUT DVD":
      selectedSource="DVD";
      denonClient.setInput(Denon.Options.InputOptions.DVD);
      break;

    case "INPUT BD":
      selectedSource="BD";
      denonClient.setInput(Denon.Options.InputOptions.BD);
      break;

    case "INPUT TV":
      selectedSource="TV";
      denonClient.setInput(Denon.Options.InputOptions.TV);
      break;

    case "INPUT CBL/SAT":
      selectedSource="CBL/SAT";
      denonClient.setInput(Denon.Options.InputOptions.Sattalite);
      break;

    case "INPUT MEDIA PLAYER":
      selectedSource="MEDIA PLAYER";
      denonClient.setInput(Denon.Options.InputOptions.MediaPlayer);
      break;

    case "INPUT GAME":
      selectedSource="GAME";
      denonClient.setInput(Denon.Options.InputOptions.Game);
      break;

    case "INPUT AUX 1":
      selectedSource="AUX 1";    
      denonClient.setInput(Denon.Options.InputOptions.Aux1);
      break;

    case "INPUT AUX 2 ":
      selectedSource="AUX 2";  
      denonClient.setInput(Denon.Options.InputOptions.Aux2);
      break;

    case "INPUT NET":
      selectedSource="NET";  
      denonClient.setInput(Denon.Options.InputOptions.Net);
      break;

    case "INPUT IPOD ":
      selectedSource="IPOD";  
      denonClient.setInput(Denon.Options.InputOptions.IPod);
      break;

    case "INPUT MPLAY":
      selectedSource="MPLAY";    
      denonClient.setInput(Denon.Options.InputOptions.MPlay);
      break;

    case "INPUT MXPORT":
      selectedSource="MXPORT";      
      denonClient.setInput(Denon.Options.InputOptions.MXPort);    
      break;

    case "CURSOR UP":
    break;
}
};

denonClient.on('masterVolumeChanged', (volume) => {
  console.log('Volume changed to: ' + (volume));
  sliderVolumeValue = volume;
  console.log('update slider');
  //sendComponentUpdate({uniqueDeviceId: 'denon1', component:'sliderVolumeValue', value: sliderVolumeValue});

  sendComponentUpdateNotification('denon1','sliderVolumeValue', sliderVolumeValue);




 });

denonClient.on('muteChanged', (mute) => {
  console.log('mute changed to: ' + (mute));
});

denonClient.on('inputChanged', (input) => {
  console.log('input changed to: ' + (input));
  inputSelectTextLabel = input;
  if (input === 'TV' && selectedSource != 'TV') {
  switch (selectedSource) {
    case "CD":
      denonClient.setInput(Denon.Options.InputOptions.CD);
      break;
    case "TUNER":
      denonClient.setInput(Denon.Options.InputOptions.Tuner);
      break;
    case "DVD":
      denonClient.setInput(Denon.Options.InputOptions.DVD);
      break;
    case "BD":
      denonClient.setInput(Denon.Options.InputOptions.BD);
      break;
    case "TV":
      denonClient.setInput(Denon.Options.InputOptions.TV);
      break;
    case "CBL/SAT":
      denonClient.setInput(Denon.Options.InputOptions.Sattalite);
      break;
    case "MEDIA PLAYER":
      denonClient.setInput(Denon.Options.InputOptions.MediaPlayer);
      break;
    case "GAME":
      denonClient.setInput(Denon.Options.InputOptions.Game);
      break;
    case "AUX 1":   
      denonClient.setInput(Denon.Options.InputOptions.Aux1);
      break;
    case "AUX 2 ":  
      denonClient.setInput(Denon.Options.InputOptions.Aux2);
      break;
    case "NET": 
      denonClient.setInput(Denon.Options.InputOptions.Net);
      break;
    case "IPOD ": 
      denonClient.setInput(Denon.Options.InputOptions.IPod);
      break;
    case "MPLAY":   
      denonClient.setInput(Denon.Options.InputOptions.MPlay);
      break;
    case "MXPORT":     
      denonClient.setInput(Denon.Options.InputOptions.MXPort);    
      break;
  }
} else {
 sendComponentUpdateNotification('denon1', 'sourceText', inputSelectTextLabel);
}
});

denonClient.on('powerChanged', (power) => {
  console.log('power changed to: ' + (power));
  switchPowerState = (power === 'on') ? true : false;
});
