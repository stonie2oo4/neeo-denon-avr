'use strict';

const neeoapi = require('neeo-sdk');
const controller = require('./controller');

console.log('NEEO SDK Example "Denon" adapter');
console.log('---------------------------------------------');

// first we set the device info, used to identify it on the Brain
const denon = neeoapi.buildDevice('Denon AVR TCP')
  .setManufacturer('Denon')
  .addAdditionalSearchToken('AVR TCP')
  .setType('AVRECEIVER')
  .enableDiscovery({headerText: 'discovering', description: 'discovering'}, controller.discoverDenon)

// Adding Buttons
// NEEO Hardkeys
  .addButtonGroup('Volume')         // VOLUME UP, VOLUME DOWN & MUTE
  .addButtonGroup('Controlpad')     // CURSOR ENTER, CURSOR UP, CURSOR DOWN, CURSOR LEFT & CURSOR RIGHT
  .addButtonGroup('Menu and Back')  // MENU & BACK
  .addButtonGroup('Power')          // POWER ON & POWER OFF

//NEEO Softkey (predefined Screen integration)
  .addButton({ name: 'INPUT CD', label: 'CD' })
  .addButton({ name: 'INPUT TUNER', label: 'TUNER' })
  .addButton({ name: 'INPUT DVD', label: 'DVD' })
  .addButton({ name: 'INPUT BD', label: 'BD' })  
  .addButton({ name: 'INPUT TV', label: 'TV' })
  .addButton({ name: 'INPUT CBL/SAT', label: 'CBL/SAT' })
  .addButton({ name: 'INPUT MEDIA PLAYER', label: 'MEDIA PLAYER' })
  .addButton({ name: 'INPUT GAME', label: 'GAME' })  
  .addButton({ name: 'INPUT AUX 1', label: 'AUX 1' })
  .addButton({ name: 'INPUT AUX 2', label: 'AUX 2' })  
  .addButton({ name: 'INPUT NET', label: 'NET' })
  .addButton({ name: 'INPUT IPOD', label: 'IPOD' })
  .addButton({ name: 'INPUT MPLAY', label: 'MPLAY' })
  .addButton({ name: 'INPUT MXPORT', label: 'MXPORT' })  

  .addTextLabel({ name: 'sourceText', label: 'Source' }, controller.getSource)
  .addSlider({ name: 'sliderVolumeValue', label: 'VOLUME SLIDER', range: [0,70], unit: 'Vol' },
  { setter: controller.sliderVolumeValueSet, getter: controller.sliderVolumeValueGet })
  .registerSubscriptionFunction(controller.registerStateUpdateCallback)

// Button Handler / Sends the Pressed Button to controller.js
  .addButtonHander(controller.onButtonPressed);

//Overhand Driver to NEEO CLI
  module.exports = {
    devices: [denon]
  }
