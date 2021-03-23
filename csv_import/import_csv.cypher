// Script to import IRRIS data on Horses/Jockeys/Trainers/Races to Neo4j
//
// *** The database config entry: dbms.directories.import=import needs to be commented out to allow LOAD CSV to access files in
//     other locations rather than in the 'import ' directory
//
// Uses 4 separate csv files exported from IRRIS
//    horses_unique.csv (unique list of Horses)
//    jockey_unique.csv (unique list of Jockeys)
//    trainer_unique.csv (unique list of Trainers)
//    race_entries.csv (list of all race entries - with jockey, horse and trainer)
//
// Execute via cypher-shell
// cat /Users/royh/git/royh/personal/graphdb---jockeydata/csv_import/import_csv.cypher | bin/cypher-shell -u jockey -p jockeypass
//

// ====================
// Delete all nodes/relationships/labels
// ====================
MATCH (n) DETACH DELETE n;

// ====================
// Create Nodes
// ====================

// Create Horse Nodes
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:///Users/royh/git/royh/personal/graphdb---jockeydata/csv_import/horses_unique.csv" AS row
CREATE (:Horse {horseID: row.HorseID, horseName: row.HorseName, yearOfBirth: row.YearOfBirth, sireID: row.sireID, damID: row.DamID, prizeMoney: row.PrizeMoney, starts: row.Starts, wins: row.Wins, seconds: row.Seconds, thirds: row.Thirds});

// Create Jockey Nodes
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:///Users/royh/git/royh/personal/graphdb---jockeydata/csv_import/jockeys_unique.csv" AS row
CREATE (:Jockey {jockeyID: row.JockeyID, jockeyName: row.JockeyName, numMetroRides: row.RidesMetro, numMetroWins: row.WinsMetro, numMetroPlace2: row.Place2Metro, numMetroPlace3: row.Place3Metro});

// Create Trainer Nodes
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:///Users/royh/git/royh/personal/graphdb---jockeydata/csv_import/trainers_unique.csv" AS row
CREATE (:Trainer {trainerID: row.TrainerID, trainerName: row.TrainerName});

// Create RaceEntry Nodes
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:///Users/royh/git/royh/personal/graphdb---jockeydata/csv_import/race_entries.csv" AS row
CREATE (:RaceEntry {raceEntryID: row.RaceEntryID, raceID: row.RaceID, raceName: row.RaceName, raceNumber: row.RaceNo, distance: row.Distance});

// Create Customer Nodes
USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:///Users/royh/git/royh/personal/graphdb---jockeydata/csv_import/customers.csv" AS row
CREATE (:Customer {customerID: row.CustomerID, customerName: row.CustomerName, blackbookID: row.BlackbookID});


// Create Constraint on the RaceEntry nodes
CREATE CONSTRAINT ON (r:RaceEntry) ASSERT r.raceEntryID IS UNIQUE;


// Create Indexes
CREATE INDEX ON :Horse(horseID);
CREATE INDEX ON :Horse(horseName);
CREATE INDEX ON :Jockey(jockeyID);
CREATE INDEX ON :Jockey(jockeyName);
CREATE INDEX ON :Trainer(trainerID);
CREATE INDEX ON :Trainer(trainerName);
CREATE INDEX ON :RaceEntry(raceID);
CREATE INDEX ON :RaceEntry(raceName);
CREATE INDEX ON :Customer(customerID);



// ====================
// Create Relationships
// ====================

USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:///Users/royh/git/royh/personal/graphdb---jockeydata/csv_import/race_entries.csv" AS row
MATCH (j:Jockey {jockeyID: row.JockeyID})
MATCH (re:RaceEntry {raceEntryID: row.RaceEntryID})
MERGE (j)-[:RODE_IN]->(re);

USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:///Users/royh/git/royh/personal/graphdb---jockeydata/csv_import/race_entries.csv" AS row
MATCH (h:Horse {horseID: row.HorseID})
MATCH (re:RaceEntry {raceEntryID: row.RaceEntryID})
MERGE (h)-[:RAN_IN {finishingPosition: row.FinishingPosition, scratchedFlag: row.ScratchedFlag}]->(re);


USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:///Users/royh/git/royh/personal/graphdb---jockeydata/csv_import/race_entries.csv" AS row
MATCH (t:Trainer {trainerID: row.TrainerID})
MATCH (re:RaceEntry {raceEntryID: row.RaceEntryID})
MERGE (t)-[:TRAINED]->(re);


USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:///Users/royh/git/royh/personal/graphdb---jockeydata/csv_import/blackbooks.csv" AS row
MATCH (c:Customer {blackbookID: row.BlackbookID})
MATCH (h:Horse {horseID: row.HorseID})
MERGE (c)-[:BLACKBOOKED]->(h);