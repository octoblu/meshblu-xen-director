var _ = require('lodash');

function XenDirectorConn(options, dependencies){
  options = options || {};
  dependencies = dependencies || {};
  this.baseUrl = options.baseUrl || '';
  this.domain = options.domain || '';
  this.userName = options.userName || '';
  this.password = options.password || '';

  this.cheerio = dependencies.cheerio || require('cheerio');
  this.request = dependencies.request || require('request');
  return this;
}

XenDirectorConn.prototype.getViewStateData = function(callback){
  callback = callback || _.noop();
  var self = this;
  self.request({
    url : self.baseUrl,
    method : "GET",
    rejectUnauthorized : false,
  }, function(error, response, body){
    if(error) return callback(error);
    $ = self.cheerio.load(body);
    var viewState = $('#__VIEWSTATE').attr('value');
    var eventValidation = $('#__EVENTVALIDATION').attr('value');

    callback(null, { viewState: viewState, eventValidation: eventValidation });
  });
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
