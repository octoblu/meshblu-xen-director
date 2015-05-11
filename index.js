'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var debug = require('debug')('meshblu-xen-director')
var XenDirectorConnection = require('./xen-director-connection');

var MESSAGE_SCHEMA = {
  type: 'object',
  properties: {
    request: {
      type: 'string',
      required: true,
      enum : ['GetInitializationData', 'GetConnectionFailuresData', 'GetFailedVDIMachinesData' ]
    },
    siteId : {
      type : 'string'
    }
  }
};

var DEFAULT_OPTIONS = {
  userName : '',
  password : '',
  baseUrl : '',
  domain : ''
};

var OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    userName: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    domain: {
      type : 'string',
      required : true
    },
    baseUrl: {
      type : 'string',
      required: true
    }

  }
};

function Plugin(){
  this.options = {};
  this.messageSchema = MESSAGE_SCHEMA;
  this.optionsSchema = OPTIONS_SCHEMA;
  return this;
}
util.inherits(Plugin, EventEmitter);

Plugin.prototype.onMessage = function(message){
  var self = this;
  var payload = message.payload;
  if(message.payload.request){
     if(request === 'GetInitializationData'){
       self.xenDirectorConnection
       .getInitializationData()
       .then(function(initData){
         self.emit('data', initData)
       })
       .catch(function(error){
           self.emit('data', error);
       });
     }

     if(request === 'GetConnectionFailuresData'){
       self.xenDirectorConnection
        .getConnectionFailuresData(message.payload.siteId)
        .then(function(connectionData){
          self.emit('data', connectionData);
        })
        .catch(function(error){
          self.emit('data', error);
        });
     }

     if(request === 'GetFailedVDIMachinesData'){
       self.xenDirectorConnection
        .getFailedVDIMachinesData(message.payload.siteId)
        .then(function(connectionData){
          self.emit('data', connectionData);
        })
        .catch(function(error){
          self.emit('data', error);
        });
     }
  }
};

Plugin.prototype.onConfig = function(device){
  this.setOptions(device.options|| DEFAULT_OPTIONS);
};

Plugin.prototype.setOptions = function(options){
  var self = this;
  this.options = options;
  self.xenDirectorConnection = new XenDirectorConnection(options);
  self.xenDirectorConnection
    .getViewStateData()
    .then(function(viewStateData){
      return xenDirectorConnection.authenticate(viewStateData);
    })
    .then(function(authResults){
      debug('Authenticated', authResults);
    });
};


module.exports = {
  messageSchema: MESSAGE_SCHEMA,
  optionsSchema: OPTIONS_SCHEMA,
  Plugin: Plugin
};
