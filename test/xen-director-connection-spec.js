var XenDirectorConnection = require('../xen-director-connection');


describe('XenDirectorConnection', function () {
  var dependencies;
  var FakeRequest, FakeCheerio;

  beforeEach(function () {
    FakeRequest = sinon.stub();

    FakeCheerio = {
      load : sinon.spy()
    };
    dependencies = { cheerio : FakeCheerio, request: FakeRequest};
  });

    describe('->getViewStateData', function(){
      var sut;
      beforeEach(function(){
          sut = new XenDirectorConnection();
      });

      it('should exist', function(){
        expect(sut.getViewStateData).to.exist;
      });

      describe('when calling getViewStateData', function(){
        var options = {};
        beforeEach(function(){
          options = {
            baseUrl : 'https://rap.music.io',
            userName : 'KillerMike',
            password  : 'GTRGBBB#',
            domain : 'ATL_SHAWTY'
          };
          sut = new XenDirectorConnection(options, dependencies);
          sut.getViewStateData();
        });

        it('should call request with GET, baseUrl and rejectUnauthorized as options', function(){
          expect(FakeRequest).to.have.been.calledWith({
            url : options.baseUrl,
            method : 'GET',
            rejectUnauthorized : false
          });
        });
      });
      describe('when the request yields an error', function(){
        var callback = sinon.spy();
        var error;
        beforeEach(function(done){
          FakeRequest.yields(new Error('Sorry I failed you!'));
          sut = new XenDirectorConnection({ uri: 'whatever'}, dependencies);

          sut.getViewStateData(function(e, response){
            error = e;
            done();
          });

        });

        it('should call the callback with an error', function() {
          expect(error).to.exist;
        });
        
      });
    });
});
