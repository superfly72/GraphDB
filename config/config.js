
module.exports = {
  use_neo4j : true,
  use_elastic : false,

  hr_domestic_url : 'https://apisvcs.sportsbet.com.au/sportsbook-racing/Sportsbook/Racing/NextEvents/HRDomestic',
  event_racecard_url : 'https://apisvcs.sportsbet.com.au/sportsbook-racing/Sportsbook/Racing/Events',

  neo4j_db_uri : 'bolt://localhost',
  neo4j_db_user : 'jockey',
  neo4j_db_pass : 'jockeypass',

  elasticsearch_uri : 'localhost:9200',
  elasticsearch_log : 'trace'
}
