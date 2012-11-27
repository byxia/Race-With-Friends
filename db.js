function dbError(msg){
  console.log("------------Database Error Report Begins------------");
  console.log("Message: " + msg);
  console.log("Time   :"  + new Date());
  console.log("============Database Error Report Finishes==========")
  console.log("\n");
}

/*====TABLE (Collection) NAMES =====*/
/*prefix with T*/
var T_USER = "User";
var T_RACE = "Race";
var T_FRIEND = "Friend";

/*==== Models ====*/
var USER;
var RACE;
var FRIEND;


var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/test');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connection Success");

  var USER_SCHEMA = new mongoose.Schema({
    first_name   : String,
    last_name    : String,
    password     : String,
    longest_run  : Number
    //TODO add personal records & achievment
    //TODO add profile pic
  });

  var RACE_SCHEMA = new mongoose.Schema({
    racer_one_id  : String,
    racer_two_id  : String,
    status        : String,
    time          : { type: Date, default: Date.now },
    racer_one_route : [],
    racer_two_route : [],
    racer_one_time  : String,
    racer_two_time  : String,
    length          : Number
  });

  var FRIEND_SCHEMA = new mongoose.Schema({
    user_one_id : String,
    user_two_id : String
  });

  USER = db.model(T_USER,   USER_SCHEMA);
  RACE = db.model(T_RACE, RACE_SCHEMA);
  FRIEND = db.model(T_FRIEND,FRIEND_SCHEMA);
  var me = new USER({
    first_name : "Zi",
    last_name : "Wang"
  });
  
  // USER.find({_id: "50b42d98a7df94501f000001"},function(err,user){
  //   log(user);
  // });
  

  // //Schema ~= table
  // var kittySchema = new mongoose.Schema({
  //     name: []
  // },{ autoIndex: true });

  // //Model ~= Bean (instance class)
  // // var Kitten = db.model('Kitten', kittySchema);
  // // var silence = new Kitten({ name: 'Silence' });
  // // console.log(silence.name + "/" + silence['name']); // 'Silence'

  
  // var Kitten = db.model('Kitten_Test', kittySchema);

  // var fluffy = new Kitten({ name: [['a','b']] });
  // //var silence = new Kitten({ name: 'Silence' });
  // fluffy.save();
  // // silence.save();

  // Kitten.find(function(err,kitten){

  //   console.log(kitten);
  //   // for(var i=0;i<kitten.length;i++){
  //   //   console.log(kitten[i]._id);
  //   // }
  // });

  
});


/*====CRUD Ops====*/

function getAllUsers(successCallback,errorCallback){
  if(isNull(USER)){
    dbError("No database connection or no user schema defined.");
    errorCallback("No database connection or no user schema defined.");
  }
  USER.find(function(err,users){
    if(err){
        errorCallback(err);
    }
    else{
        successCallback(users);
    }
  });
}

function getUserById(id,successCallback,errorCallback){
  if(isNull(id) || !validString(id)){
    dbError("Invalid id provided to getUserById().");
    errorCallback("Invalid id provided to getUserById().");
    return;
  }
  if(isNull(USER)){
    dbError("No database connection or no user schema defined.");
    errorCallback("No database connection or no user schema defined.");
    return;
  }
  USER.find({_id : id},function(err,user){
    if(err){
      errorCallback(err);
    }
    else{
      successCallback(user);
    }
  });
}



// /*=====Util=====*/
function validString(s){
  return (!isNull(s)) && typeof(s)==="string" && s.trim().length >0 ;
}

function isNull(obj){
  return obj == undefined || obj == null
          || obj === undefined || obj === null;
}

function log(obj){
  console.log(obj);
}


