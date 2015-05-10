var XenDirectorConnection = require('./xen-director-connection');

var xenDirectorConnection = new XenDirectorConnection({
    baseUrl : 'https://xdtestcust5.xdtesting.net/Director',
    domain : 'xdtestcust5',
    userName : 'administrator',
    password : 'Citrix123!'
});

xenDirectorConnection.getViewStateData(function(error, viewStateData){
  if(error){
    console.log('Error', error);
  }

  xenDirectorConnection.authenticate(viewStateData, function(authError, authResults){
    if(authError){
      console.log('Authentication Error', authError);
    }

    console.log('Authenticated');
    console.log(authResults);

    xenDirectorConnection.getInitializationData(function(initError, initializationData){
      if(initError){
        console.log('Initialization Error', initError);
      }

      console.log('Initialization Data');
      console.log(initializationData);
    });
  });
});
