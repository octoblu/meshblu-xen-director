var XenDirectorConnection = require('./xen-director-connection');

var xenDirectorConnection = new XenDirectorConnection({
    baseUrl : 'https://xdtestcust5.xdtesting.net/Director',
    domain : 'xdtestcust5',
    userName : 'administrator',
    password : 'Citrix123!'
});

xenDirectorConnection.getViewStateData()
.then(function(viewStateData){
  return xenDirectorConnection.authenticate(viewStateData);
})
.then(function(authResults){
  console.log('Auth Results', authResults);
  return xenDirectorConnection.getInitializationData();
})
.then(function(initData){
  console.log('Initialization Data', initData);
})
.catch(function(error){
  console.log('Ooops me no workey', error);
});
