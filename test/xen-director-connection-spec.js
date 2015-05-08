var XenDirectorConnection = require('../xen-director-connection');
testHtml = require('./test-html.js');

describe('XenDirectorConnection', function () {
  var dependencies;
  var FakeRequest, FakeCheerio, FakeSubCheerio;

  beforeEach(function () {
    FakeRequest = sinon.stub();
    FakeSubCheerio = function(){
      this.attr = sinon.spy()
      return this;
    };
    FakeCheerio = {
      load : sinon.stub().returns(FakeSubCheerio)
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

      xdescribe('when the request is successful', function(){
        var callback = sinon.spy();
        var error, response, html, cheerio;
        beforeEach(function(done){
          html = testHtml('123', '456')
          FakeRequest.yields(null, {}, html);
          sut = new XenDirectorConnection({ uri: 'whatever'}, dependencies);

          sut.getViewStateData(function(e, r){
            if(e) return done(e);
            response = r;
            done();
          });

        });

        it('it should yield the response', function() {
          expect(response).to.deep.equal({ viewState: '123', eventValidation: '456' });
        });

        it('should cheerio.load with the body', function(){
          expect(FakeCheerio.load).to.have.been.calledWith(html);
        })

        // it('should call the callback with an object that has a viewstate and event')
      });

      xdescribe('when the request is successful', function(){
        var callback = sinon.spy();
        var error, response, html;
        beforeEach(function(done){
          html = testHtml('456', '123')
          FakeRequest.yields(null, {}, html);
          sut = new XenDirectorConnection({ uri: 'whatever'}, dependencies);

          sut.getViewStateData(function(e, r){
            if(e) return done(e);
            response = r;
            done();
          });

        });

        it('it should yield the response', function() {
          expect(response).to.deep.equal({ viewState: '456', eventValidation: '123' });
        });

        it('should cheerio.load with the body', function(){
          expect(FakeCheerio.load).to.have.been.calledWith(html);
        })

        // it('should call the callback with an object that has a viewstate and event')
      });
    });
});
