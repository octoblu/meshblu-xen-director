var _ = require('lodash');
var cookie = require('cookie');
var debug = require('debug')('xen-director-connection');
var when = require('when');
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

XenDirectorConn.prototype.getViewStateData = function(){
  var self = this;


  return when.promise(function(resolve, reject){
    self.request({
      url : self.baseUrl,
      method : "GET",
      rejectUnauthorized : false,
    }, function(error, response, body){

      if(error){
        reject(error);
      }

      $ = self.cheerio.load(body);
      var viewState = $('#__VIEWSTATE').attr('value');
      var eventValidation = $('#__EVENTVALIDATION').attr('value');
      self.viewData = { viewState: viewState, eventValidation: eventValidation };
      console.log('ViewData', self.viewData);
      resolve(self.viewData);
    });
  });
};

XenDirectorConn.prototype.authenticate = function(viewData){
  var self = this;
  self.cookieJar = self.request.jar();
  return when.promise(function(resolve, reject){
    if(!viewData){
      reject(new Error('View Data is required!'));
    }

    if(!viewData.viewState || !viewData.eventValidation){
      reject(new Error("viewState and eventValidation are required!"));
    }

    debug('Making request', self);
    self.request({
      uri : self.baseUrl + '/Logon.aspx',
      rejectUnauthorized : false,
      jar: self.cookieJar,
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
          reject(error);
        }
        self.authenticated = true;
        self.cookieJar.getCookies(self.baseUrl, function(err, cookies){
          self.cookies = cookies;
          debug('cookies', cookies);
          resolve(cookies);
        });
    });
  });
};



XenDirectorConn.prototype.getInitializationData = function(){

  var self = this;
  return when.promise(function(resolve, reject){
    self.request({
      uri : self.baseUrl + '/service.svc/web/GetInitializationData',
      rejectUnauthorized : false,
      method : 'POST',
      json : true,
      jar: true,
      headers : {
        "x-xsrf-token" : self.cookies.XSRF_KEY
      }
    },
    function(error, response, body){
        if(error){
          reject(error);
        }

        debug('The headers sent in the request were', response.request.headers);
        debug('The response from InitializationData is', body);
        resolve(body);
    });

  });

};

XenDirectorConn.prototype.getConnectionFailuresData = function(siteId){
  var self = this;

  return when.promise(function(resolve, reject){
    if(!siteId){
      reject(new Error('Site Id is required!'));
    }

    self.request({
      uri : self.baseUrl + '/service.svc/web/GetConnectionFailuresData',
      rejectUnauthorized : false,
      json: true,
      jar : true,
      method : 'POST',
      body : {
        siteId : siteId
      },
      headers : {
        "x-xsrf-token" : self.cookies.XSRF_KEY
      }
    },
    function(error, response, body){
        if(error){
          reject(error);
        }
        resolve(body);
    });
  });



};

XenDirectorConn.prototype.getFailedVDIMachinesData = function(siteId, callback){

  var self = this;
  return when.promise(function(resolve, reject){
    if(!siteId){
      return reject(new Error('Site Id is required!'));
    }

    self.request({
      uri : self.baseUrl + '/service.svc/web/GetFailedVDIMachinesData',
      rejectUnauthorized : false,
      json: true,
      method : 'POST',
      body : {
        siteId : siteId
      },
      headers : {
        "x-xsrf-token" : self.cookies.XSRF_KEY
      }
    },
    function(error, response, body){
        if(error){
          reject(error);
        }
        resolve(body);
    });
  });



};

module.exports = XenDirectorConn;
