var XenDirectorConnection = require('../xen-director-connection');


describe('XenDirectorConnection', function () {
  var FakeRequest, FakeCheerio;

  beforeEach(function () {
    FakeRequest = {
      get: sinon.spy()
    };

    FakeCheerio = {
      load : sinon.spy()
    };

  });

  describe('->getViewData', function(){
    var sut;
    beforeEach(function(){
        sut = new XenDirectorConnection();
    });

    it('should exist', function(){
      expect(sut.getViewStateData).to.exist;
    });

    describe('when calling ', function(){

    });
  });
});
