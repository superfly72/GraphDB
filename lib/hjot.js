function newHJOT(horse, jockey, owners, trainer, selectionid, eventid, competitionname, racenumber ) {

  var obj = {
    horse : horse,
    jockey: jockey,
    owners: owners,
    trainer: trainer,
    selectionid: selectionid,
    eventid: eventid,
    competitionname: competitionname,
    racenumber: racenumber
  };
  return obj;
}


// exports the functions above so that other modules can use them
module.exports = {
  newHJOT: newHJOT
}

