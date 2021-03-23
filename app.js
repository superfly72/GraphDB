const apiservice = require('./lib/api-service.js');
const neo4jservice = require('./lib/neo4j-service.js');
const elasticsearchService = require('./lib/elasticsearch-service.js');
const config = require ('./config/config');

function main() {

  // Get All the Event id's,
  // then, for each event, get the Racecard,
  // then, for each Racecard pull out the Horse/Owner/Jocket/Trainer (HOJT) information
  // For each HOJT item,
  //   Create Nodes and Relationships in Neo4j

  apiservice.getEventIds()
    .then(function(events) {
      Promise.all(events.map(function (eventid) {
        return apiservice.getRaceCard(eventid);
      })).then(function(result) {

        // Promise.all returns array of arrays so need to combine into a single array
        result = Array.prototype.concat.apply([], result);


        if (config.use_neo4j) {
          neo4jservice.createConstraints();
          for (var i = 0, len = result.length; i < len; i++) {
            try {
              console.log('Calling create jockey for: ' + JSON.stringify(result[i]));
              neo4jservice.createGraph(result[i]);

            } catch (err) {
              console.log(err);
            }
          }
        }

        if (config.use_elastic) {
          elasticsearchService.createIndex();
          for (var i = 0, len = result.length; i < len; i++) {
            try {
              console.log('Calling create jockey for: ' + JSON.stringify(result[i]));
              elasticsearchService.indexDocument(result[i]);

            } catch (err) {
              console.log(err);
            }
          }
        }
      });
  });
  
}

main();