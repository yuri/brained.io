'use strict';

var expect = chai.expect;

describe('presentation service', function () {

  // load the service's module
  beforeEach(module('brained-presentation'));

  // instantiate service
  it('should do something', function () {
    var presentation;
    inject(function (_presentation_) {
      presentation = _presentation_;
    });
    expect(presentation).to.not.be.undefined;
  });

});