'use strict';
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var debug = require('debug')('meshblu-xen-director')
var request = require('request');

var MESSAGE_SCHEMA = {
  type: 'object',
  properties: {
    request: {
      type: 'string',
      enum : ['ApplicationActivitySummaries','Applications','ApplicationInstances','Sessions','Connections','ConnectionFailureCategories','Machines','Catalogs','LoadIndexes','DesktopGroups','Hypervisors','MachineFailureLogs','MachineHotfixLogs','Hotfixes','Users','ConnectionFailureLogs','FailureLogSummaries','LoadIndexSummaries','SessionActivitySummaries','TaskLogs']
      required: true
    }
  }
};

var OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
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
  var payload = message.payload;
  if(message.payload.request){
    
  }
};

Plugin.prototype.onConfig = function(device){
  this.setOptions(device.options||{});
};

Plugin.prototype.setOptions = function(options){
  this.options = options;
};

module.exports = {
  messageSchema: MESSAGE_SCHEMA,
  optionsSchema: OPTIONS_SCHEMA,
  Plugin: Plugin
};
