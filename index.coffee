'use strict';
util           = require 'util'
{EventEmitter} = require 'events'
debug          = require('debug')('meshblu-xen-director')
_              = require 'lodash'
request        = require 'request'
ntlm           = require 'request-ntlm'
#Constants for Query Commands and Query Paths
LATEST_SERVER_OS_FAILURE = "Latest Server OS Failure"
LATEST_SERVER_OS_FAILURE_QUERY = "Citrix/Monitor/OData/v3/methods/GetMachineFailureTrendsByTypeLatest()?intervalLength=1&numberOfIntervals=0&machineFailureType=0&sessionSupport=2&$format=json"

LATEST_DESKTOP_OS_FAILURE = "Latest Desktop OS Failure"
LATEST_DESKTOP_OS_FAILURE_QUERY = "Citrix/Monitor/OData/v3/methods/GetMachineFailureTrendsByTypeLatest()?intervalLength=1&numberOfIntervals=0&machineFailureType=0&sessionSupport=1&$format=json"

LOGON_COUNT = "Logon Count"
LOGON_COUNT_QUERY = "Citrix/Monitor/OData/v3/methods/GetLogOnCountTrendLatest()?intervalLength=1&numberOfIntervals=60&$format=json"

LATEST_CONNECTION_FAILURE = "Latest connection failures"
LATEST_CONNECTION_FAILURE_QUERY = "Citrix/Monitor/OData/v3/methods/GetConnectionFailureTrendsByTypeLatest()?intervalLength=1&numberOfIntervals=60&connectionFailureType=0&$format=json"

NUMBER_OF_RUNNING_ACTIVE_SESSIONS = "Number of running active sessions"
NUMBER_OF_RUNNING_ACTIVE_SESSIONS_QUERY = "Citrix/Monitor/OData/v3/methods/GetConcurrentSessionsTrendLatest()?intervalLength=1&numberOfIntervals=60&$format=json"

MESSAGE_SCHEMA =
  type: 'object'
  properties:
    query:
      type: 'string'
      required: true
      enum: [LATEST_SERVER_OS_FAILURE, LATEST_DESKTOP_OS_FAILURE, LATEST_CONNECTION_FAILURE, LOGON_COUNT, NUMBER_OF_RUNNING_ACTIVE_SESSIONS ]

OPTIONS_SCHEMA =
  type: 'object'
  properties:
    customerId:
      type: 'string'
      required: true
    domain:
      type: 'string'
      required: true
    username:
      type: 'string'
      required: true
    password:
      type: 'string'
      required: true

class Plugin extends EventEmitter
  constructor: ->
    @options = {}
    @messageSchema = MESSAGE_SCHEMA
    @optionsSchema = OPTIONS_SCHEMA
    @queryKeys = [LATEST_SERVER_OS_FAILURE, LATEST_DESKTOP_OS_FAILURE, LATEST_CONNECTION_FAILURE, LOGON_COUNT, NUMBER_OF_RUNNING_ACTIVE_SESSIONS ]
    @queryMap =
      "#{LATEST_SERVER_OS_FAILURE}" : LATEST_SERVER_OS_FAILURE_QUERY
      "#{LATEST_DESKTOP_OS_FAILURE}": LATEST_DESKTOP_OS_FAILURE_QUERY
      "#{LATEST_CONNECTION_FAILURE}": LATEST_CONNECTION_FAILURE_QUERY
      "#{LOGON_COUNT}" : LOGON_COUNT_QUERY
      "#{NUMBER_OF_RUNNING_ACTIVE_SESSIONS}": NUMBER_OF_RUNNING_ACTIVE_SESSIONS_QUERY


  onMessage: (message) =>
    debug "Message", message
    payload = message.payload
    query = message.query or payload.query
    return @emit "error", "Missing customerId from config" unless @options.customerId?
    return @emit "error", "Missing domain from config" unless @options.domain?
    return @emit "error", "Missing username from config" unless @options.username?
    return @emit "error", "Missing password from config" unless @options.password?
    return @emit "error", "Missing query from message" unless query?
    return @emit "error", "Invalid query option: #{query}" unless _.contains @queryKeys, query

    queryUrl = "https://#{@options.customerId}.#{@options.domain}/#{@queryMap[query]}"
    debug "Query URL", queryUrl

    authHeader = new Buffer("#{@options.domain}/#{@options.username}:#{@options.password}").toString("base64")

    reqOptions =
      username: @options.username
      password: @options.password
      domain: "#{@options.customerId}.#{@options.domain}"
      url: queryUrl

    debug "Request Options", reqOptions

    ntlm.post reqOptions, (err, response) =>
      if err?
        debug "Error: ", err
        return @emit "error", err

      debug "Response: ", response.statusCode
      result =
        status: response.statusCode

      return @emit "message: ", result
    # request reqOptions, (error, response, body) =>
    #   if error?
    #     debug "Error", error
    #     return @emit "error", error
    #
    #   debug "Response", response.statusCode
    #   debug "Body", body
    #   result =
    #     status : response.statusCode
    #     data: body
    #
    #   return @emit "message", result

  onConfig: (device) =>
    debug "Options", device.options
    @setOptions device.options

  setOptions: (options={}) =>
    debug "Set Options", options
    @options = options

module.exports =
  messageSchema: MESSAGE_SCHEMA
  optionsSchema: OPTIONS_SCHEMA
  Plugin: Plugin
