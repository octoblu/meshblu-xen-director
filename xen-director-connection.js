var cheerio = require('cheerio');
var request = require('request');

function XenDirectorConn(options){
  options = options || {};
  this.baseUrl = options.baseUrl || '';
  this.domain = options.domain || '';
  this.userName = options.userName || '';
  this.password = options.password || '';
  this.cheerio = options.cheerio || require('cheerio');
  this.request = options.request || require('request');
  return this;
}

XenDirectorConn.prototype.getViewStateData = function(callback){


};

XenDirectorConn.prototype.authenticate = function(callback){

};

XenDirectorConn.prototype.getInitializationData = function(siteId, callback){

};

XenDirectorConn.prototype.getConnectionFailuresData = function(siteId, callback){

};

XenDirectorConn.prototype.getFailedVDIMachinesData = function(siteId, callback){

};

module.exports = XenDirectorConn;
