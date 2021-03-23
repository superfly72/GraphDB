const neo4j = require('neo4j-driver').v1;
const config = require ('../config/config');
const driver = neo4j.driver(config.neo4j_db_uri, neo4j.auth.basic(config.neo4j_db_user, config.neo4j_db_pass));

const CREATE_CONSTRAINT_FOR_JOCKEY = 'CREATE CONSTRAINT ON (j:Jockey) ASSERT j.name IS UNIQUE';
const CREATE_CONSTRAINT_FOR_TRAINER = 'CREATE CONSTRAINT ON (t:Trainer) ASSERT t.name IS UNIQUE';
const CREATE_CONSTRAINT_FOR_HORSE = 'CREATE CONSTRAINT ON (h:Horse) ASSERT h.name IS UNIQUE';
const CREATE_CONSTRAINT_FOR_EVENT = 'CREATE CONSTRAINT ON (e:Event) ASSERT e.name IS UNIQUE';
const CREATE_JOCKEY_RODE_ON_HORSE_NODES = 'MERGE (j:Jockey {name: $jockeyname}) MERGE (h:Horse {name: $horsename}) MERGE (j)-[:RODE_ON]->(h)';
const CREATE_TRAINER_TRAINED_HORSE_NODES ='MERGE (t:Trainer {name: $trainername}) MERGE (h:Horse {name: $horsename}) MERGE (t)-[:TRAINED]->(h)';
const CREATE_OWNER_OWNS_HORSE_NODES = 'MERGE (o:Owner {name: $ownername}) MERGE (h:Horse {name: $horsename}) MERGE (o)-[:OWNS]->(h)';
const CREATE_HORSE_RAN_IN_EVENT_NODES = 'MERGE (h:Horse {name: $horsename}) MERGE (e:Event {name: $competitionname}) MERGE (h)-[r:RAN_IN]->(e) ON CREATE SET r.racenumber=$racenumber';



function getSession () {
  return driver.session();
}

function createGraph(hojt) {

  let session = getSession();

  create_Jockey_RODE_ON_Horse(hojt, session)
    .then( create_Trainer_TRAINED_Horse(hojt, session) )
    .then( Promise.all(create_Owner_OWNS_Horse(hojt, session)) )
    .then( create_Horse_RAN_IN_Event(hojt, session) )
    .then(result => {
        session.close();
      })
    .catch((err) => {
      session.close();
      throw(err);
    });
}


function createConstraints () {
  console.log('creating Constraints');

  let session = getSession();

  session.run(
      CREATE_CONSTRAINT_FOR_JOCKEY
  );
  session.run(
      CREATE_CONSTRAINT_FOR_TRAINER
  );
  session.run(
      CREATE_CONSTRAINT_FOR_HORSE
  );
  session.run(
      CREATE_CONSTRAINT_FOR_EVENT
  );
  session.close();
}

function create_Jockey_RODE_ON_Horse (hojt, session) {
  if (hojt.jockey == null || hojt.horse == null) {
    throw "Unable to create Jockey RODE_ON Horse: " + JSON.stringify(hojt);
  } else {
    console.log('creating Jockey RODE_ON Horse : %s - %s', hojt.jockey, hojt.horse);
    return session.run(
      CREATE_JOCKEY_RODE_ON_HORSE_NODES,
      {jockeyname: hojt.jockey, horsename: hojt.horse},
    );
  }
}


function create_Trainer_TRAINED_Horse (hojt, session) {
  if (hojt.trainer == null || hojt.horse == null) {
    throw "Unable to create Trainer TRAINED Horse: " + JSON.stringify(hojt);
  } else {
    console.log('creating Trainer TRAINED Horse : %s - %s', hojt.trainer, hojt.horse);
    return session.run(
      CREATE_TRAINER_TRAINED_HORSE_NODES,
      {trainername: hojt.trainer, horsename: hojt.horse},
    );
  }
}


function create_Owner_OWNS_Horse (hojt, session) {
  if (hojt.owners.length == 0 || hojt.horse == null) {
    throw "Unable to create Owner OWNS Horse: " + JSON.stringify(hojt);
  } else {
    console.log('creating Owner OWNS Horse : %s - %s', hojt.owners, hojt.horse);

    var promisearray = new Array();
    var arrayLength = hojt.owners.length;
    for (var i = 0; i < arrayLength; i++) {
      promisearray.push(
      session.run(
        CREATE_OWNER_OWNS_HORSE_NODES,
        {ownername: hojt.owners[i], horsename: hojt.horse},
      ));
    }
    return promisearray;
  }
}



function create_Horse_RAN_IN_Event (hojt, session) {
  if (hojt.jockey == null || hojt.horse == null) {
    throw "Unable to create Horse RAN_IN Event: " + JSON.stringify(hojt);
  } else {
    console.log('creating Horse RAN_IN Event : %s - %s,%s', hojt.horse, hojt.competitionname, hojt.racenumber);
    return session.run(
      CREATE_HORSE_RAN_IN_EVENT_NODES,
      {horsename: hojt.horse, competitionname: hojt.competitionname, racenumber: hojt.racenumber},
    );
  }
}


// exports the functions above so that other modules can use them
module.exports = {
  createGraph: createGraph,
  createConstraints: createConstraints

}