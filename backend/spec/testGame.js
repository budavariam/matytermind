const expect = require('chai').expect;
const game = require('../game');

const config = {
  pins: 4,
  colours: 6,
}

describe('generateSequence()', function () {
  it('should generate as many elements as many pins there are', function () {
    const seq = game.generateSequence(config);
    expect(seq.length).to.be.equal(config.pins);
  });
});

describe('evaluateGuess()', function () {
  describe('isOver', function () {
    const testData = [
      {guess: [1,2,3,4], secret: [1,2,3,4], expect: true},
      {guess: [2,3,4,4], secret: [2,3,4,4], expect: true},
      {guess: [3,3,3,3], secret: [3,3,3,3], expect: true},
      {guess: [1,3,3,3], secret: [3,3,3,3], expect: false},
      {guess: [1,2,3,4], secret: [3,3,3,3], expect: false},
    ]

    testData.forEach(function(test) {
      it(`should indicate that the match is ${test.expect ? "not" : ""} over for ${test.secret} & ${test.guess} `, function () {
          const result = game.evaluateGuess(config, test.secret, test.guess)
          expect(result.isOver).to.be.equal(test.expect);
      });
    })
  })

  describe('good guesses', function () {
    const testData = [
      {guess: [2,1,2,4], secret: [1,2,3,4], expect: 1},
      {guess: [1,1,1,1], secret: [1,2,3,4], expect: 1},
      {guess: [2,1,2,4], secret: [2,2,2,4], expect: 3},
      {guess: [1,2,3,4], secret: [1,2,3,4], expect: 4},
      {guess: [2,3,4,4], secret: [2,3,4,4], expect: 4},
      {guess: [3,3,3,3], secret: [3,3,3,3], expect: 4},
      {guess: [3,3,2,3], secret: [3,3,3,3], expect: 3},
    ]

    testData.forEach(function(test) {
      it(`should have ${test.expect} good guesses in ${test.guess} for ${test.secret}`, function(){
        const result = game.evaluateGuess(config, test.secret, test.guess)
        expect(result.goodGuess).to.be.equal(test.expect);
      });
    });
  });

  describe('good colour', function () {
    const testData = [
      {guess: [2,1,2,4], secret: [1,2,3,4], expect: 2},
      {guess: [1,2,3,4], secret: [1,2,5,6], expect: 0},
      {guess: [1,2,3,4], secret: [2,3,4,1], expect: 4},
      {guess: [3,3,3,3], secret: [1,2,3,4], expect: 0},
      {guess: [1,3,6,6], secret: [3,2,5,6], expect: 1},
    ]

    testData.forEach(function(test) {
      it(`should have ${test.expect} good colour in ${test.guess} for ${test.secret}`, function(){
        const result = game.evaluateGuess(config, test.secret, test.guess)
        expect(result.goodColour).to.be.equal(test.expect);
      });
    });
  });
});