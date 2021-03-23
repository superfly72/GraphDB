const expect = require('chai').expect;
const _ = require('lodash');
const nock = require('nock');
const service = require('../lib/api-service');
const fs = require("fs");


describe('Get Event IDs tests', () => {
  beforeEach(() => {

    // read the json fixtures file to mock the Sportsbook API response
    var eventsContents = fs.readFileSync('test/fixtures/events.json');
    var eventJsonContent = JSON.parse(eventsContents);
    nock('https://apisvcs.sportsbet.com.au')
      .get('/sportsbook-racing/Sportsbook/Racing/NextEvents/HRDomestic')
      .reply(200, eventJsonContent);
  });

  it('Get some Event data', () => {
    return service.getEventIds()
      .then(response => {

        // expect that the API response is parsed to return an array of event id's e.g. [ 3983168, 3983169, 3983087, 3983088 ]
        expect(response).to.be.an('array');
        var expectedarray = [ 3983168, 3983169, 3983087, 3983088 ];
        expect(_.isEqual(response, expectedarray)).to.be.true;

      });
  });
});


describe('Get Racecard Data tests', () => {
  beforeEach(() => {

    // read the json fixtures file to mock the Sportsbook API response
    var racecardContents = fs.readFileSync('test/fixtures/racecard-3983087.json');
    var racecardJsonContent = JSON.parse(racecardContents);

    // https://apisvcs.sportsbet.com.au/sportsbook-racing/Sportsbook/Racing/Events/
    nock('https://apisvcs.sportsbet.com.au')
      .get('/sportsbook-racing/Sportsbook/Racing/Events/3983087/Racecard')
      .reply(200, racecardJsonContent);
  });

  it('Get some Racecard data', () => {
    return service.getRaceCard(3983087)
      .then(response => {

        // expect that the API response is a json object with racecard details
        expect(response).to.be.an('array').length(14);
        // check one of the objects in the array
        expect(response[0]).to.deep.equal({

          horse: "By Magic",
          jockey: "Bb Hong",
          owners: [
            "Barry Phillips",
            "Brent Phillips",
            "Emma Phillips"
          ],
          trainer: "Danny Crozier",
          selectionid: 376930690,
          competitionname: "Riccarton",
          eventid: 3983087,
          racenumber: 1

        })

      });
  });
});

describe('Get Horse, Jockey, Owners and Trainers Data tests', () => {

    it("Extracts the Horse, Jockey, Owners and Trainers from a Racecard response", function(done){

      var racecardContents = fs.readFileSync('test/fixtures/racecard-3983087.json');
      var racecardJsonContent = JSON.parse(racecardContents);

      var result = service.getRunnerDetails(racecardJsonContent)

      expect(result).to.be.an('array');

      // check one of the objects in the array
      expect(result[0]).to.deep.equal({

        horse: "By Magic",
        jockey: "Bb Hong",
        owners: [
         "Barry Phillips",
         "Brent Phillips",
         "Emma Phillips"
        ],
        trainer: "Danny Crozier",
        selectionid: 376930690,
        competitionname: "Riccarton",
        eventid: 3983087,
        racenumber: 1

      })

      // check one of the objects in the array
      expect(result[3]).to.deep.equal({
        horse: "Itstolate",
        jockey: "P Shaikh",
        owners: [
          "M R Pitman"
        ],
        trainer: "M & M Pitman",
        selectionid: 376930693,
        competitionname: "Riccarton",
        eventid: 3983087,
        racenumber: 1


      })

      done();
    });
});