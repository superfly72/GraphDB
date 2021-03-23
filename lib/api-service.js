const request = require('request-promise');
const _ = require('lodash');
const config = require ('../config/config');
const hjot = require ('./hjot');


function getEventIds () {
  console.log("Getting event ids...");
  return request({
    "method": "GET",
    "uri": config.hr_domestic_url,
    "json": true,
    "headers": {
      "Accept": "application/json"
    }
  }).then(function (events) {

    var results = events.map((events) => (events.id));;
    return results;

  }).catch(function (err) {
    console.error(err);

  })
}

function getRaceCard (eventid) {
  console.log("Getting racecard for eventid :" + eventid);

  return request({
    "method": "GET",
    "uri": config.event_racecard_url + '/' + eventid + '/Racecard',
    "json": true,
    "headers": {
      "Accept": "application/json"
    }
  }).then(function (racecard) {

    var results = getRunnerDetails(racecard);
    return results;


  }).catch(function (err) {
    console.error(err);

  });
}

function getRunnerDetails (racecard) {
  console.log("Getting Runner details from racecard :" + racecard.id);
  var results= new Array();


  var markets = racecard.markets;
  _.each(markets, (item) => {
    if (item.name == 'Win or Place') {

      _.each(item.selections, (selection) => {
        let eventid = racecard.id;
        let racenumber = racecard.raceNumber;
        let competitionname = racecard.competitionName;
        let selectionid = selection.id;
        let horse = selection.name;
        let jockey = selection.jockey;
        let owners = selection.owner;
        if (owners != null) {
          owners = selection.owner.split(/[&,]+/).map(function (owner) {
            return owner.trim();
          });
        }
        let trainers = (selection.trainer);
        if (trainers != null) {
          trainers = selection.trainer.split(/[&,]+/).map(function (trainer) {
            return trainer.trim();
          });
        }


        results.push(hjot.newHJOT(horse, jockey, owners, trainers, selectionid, eventid, competitionname, racenumber));
      })
    }
  })
  return results;
}

// exports the functions above so that other modules can use them
module.exports = {
  getRaceCard: getRaceCard,
  getEventIds: getEventIds,
  getRunnerDetails: getRunnerDetails
}

