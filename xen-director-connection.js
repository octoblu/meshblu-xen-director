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

XenDirectorConn.prototype.authenticate = function(viewData, callback){
  if(!viewData){
    return callback(new Error('View Data is required!'));
  }

  if(!viewData.viewState || !viewData.eventValidation){
    return callback(new Error("viewState and eventValidation are required!"));
  }

  var self = this;
  self.request({
    uri : self.baseUrl + '/Logon.aspx',
    rejectUnauthorized : false,
    jar: true,
    followAllRedirects : true,
    followRedirect : true,
    method : 'POST',
    form : {
      "__VIEWSTATE" : viewData.viewState,
      "__EVENTVALIDATION" : viewData.eventValidation,
       UserName : self.userName,
       Password : self.password,
       Domain : self.domain,
       uDate : "-420",
       Submit : "Log On"
    }
  },
  function(error, response, body){
      if(error){
        return callback(error);
      }

      return callback(null, body);
  });
};

XenDirectorConn.prototype.getInitializationData = function(siteId, callback){
  if(!siteId){
    return callback(new Error('Site Id is required!'));
  }


  var self = this;
  self.request({
    uri : self.baseUrl + '/service.svc/web/GetInitializationData',
    rejectUnauthorized : false,
    jar: true,
    followAllRedirects : true,
    followRedirect : true,
    method : 'POST',
    json : true
  },
  function(error, response, body){
      if(error){
        return callback(error);
      }

      return callback(null, body);
  });
};

XenDirectorConn.prototype.getConnectionFailuresData = function(siteId, callback){
  if(!siteId){
    return callback(new Error('Site Id is required!'));
  }
  var self = this;
  self.request({
    uri : self.baseUrl + '/service.svc/web/GetConnectionFailuresData',
    rejectUnauthorized : false,
    json: true,
    method : 'POST',
    body : {
      siteId : viewData.viewState
    }
  },
  function(error, response, body){
      if(error){
        return callback(error);
      }
      callback(null, body);
  });
};

XenDirectorConn.prototype.getFailedVDIMachinesData = function(siteId, callback){
  if(!siteId){
    return callback(new Error('Site Id is required!'));
  }


  var self = this;
  self.request({
    uri : self.baseUrl + '/service.svc/web/GetFailedVDIMachinesData',
    rejectUnauthorized : false,
    json: true,
    method : 'POST',
    body : {
      siteId : siteId
    }
  },
  function(error, response, body){
      if(error){
        return callback(error);
      }
      callback(null, body);
  });

};

module.exports = XenDirectorConn;
