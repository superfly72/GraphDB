const elasticsearch = require('elasticsearch');
const config = require ('../config/config');
const client = new elasticsearch.Client({
  host: config.elasticsearch_uri,
  log: config.elasticsearch_log
});


function createIndex() {

  client.indices.create({
    index: 'hojt'
  },function(err,resp,status) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("create",resp);
    }
  });
}


function indexDocument(hojt) {
  client.index({
    index: 'hojt',
    type: 'hojt',
    body: hojt
  },function(err,resp,status) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("index",resp);
    }
  });
}


// exports the functions above so that other modules can use them
module.exports = {
  indexDocument: indexDocument,
  createIndex : createIndex
}
