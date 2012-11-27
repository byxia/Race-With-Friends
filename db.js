function dbError(msg){
  console.log("------------Database Error Report Begins------------");
  console.log("Message: " + msg);
  console.log("Time   :"  + new Date());
  console.log("============Database Error Report Finishes==========")
  console.log("\n");
}

var mongo = require('mongodb'),
  Server = mongo.Server,
  Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('exampleDb', server,{ w : 1});

db.open(function(err, db) {
  
  if(!err) {
    console.log("We are connected");


  }
  else{
    dbError("Error occured in db.open(): \n" + err);
  }

});


/*====TABLE (Collection) NAMES =====*/
/*prefix with T*/
var T_USER = "User";
var T_RACE = "Race";


/*====CRUD Ops====*/
function create(table, obj){

}

function read(table, id){

}

/*=====Database Ops======*/
function createTable(tableName){

}

function dropTable(tableName){
  if(!validString(tableName)){
    dbError("Invalid table name : " + tableName + " in dropTable()");
    return;
  }

}




/*=====Util=====*/
function validString(s){
  return (!isNull(s)) && typeof(s)==="string" && s.trim().length >0 ;
}

function isNull(obj){
  return obj == undefined || obj == null
          || obj === undefined || obj === null;
}

