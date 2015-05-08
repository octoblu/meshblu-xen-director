module.exports = function(viewState, eventValidation){
  return '<html>' +
    '<head></head>' +
    '<body>' +
      '<input id="__VIEWSTATE" value="'+viewState+'"></input>' +
      '<input id="__EVENTVALIDATION" value="'+eventValidation+'"></input>' +
      '</body>' +
  '</html>'
}
