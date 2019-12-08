const characters = [
  "Miss_Scarlet",
  "Col_Mustard",
  "Mrs_White",
  "Mr_Green",
  "Mrs_Peacock",
  "Prof_Plum"
];


const playerName2Id = {
  "Miss_Scarlet": 0,
  "Col_Mustard": 1,
  "Mrs_White" : 2,
  "Mr_Green" : 3,
  "Mrs_Peacock" : 4,
  "Prof_Plum" : 5
}

var locToRoom = 
    [
      ["Conservatory","","Library","","Study"],
      ["","","","",""],
      ["Ballroom","","Billiard_Room","","Hall"],
      ["","","","",""],
      ["Kitchen","","Dining_Room","","Lounge"]
    ]

// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
//https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var server = http.Server(app);
var io = require('socket.io')(server);
//var io = socketIO(server);
//IMPORT db_setup.js
var db = require('./db_setup.js');
var GameServer = require('./controller_logic.js');

//create a db for the computer
var computer_db = new db();
var GameServer = new GameServer();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));



//computer_db.addPlayer(1,"Miss_Scarlet",2,3);
//console.log("computer_db.getPlayerLocation(1)[0]: "+computer_db.getPlayerLocation(1)[0]+" computer_db.getPlayerLocation(1)[1]: "+computer_db.getPlayerLocation(1)[1]);
//computer_db.addCard("Lounge",1);
//computer_db.addCard("Library",1);
//console.log("computer_db.getCardIds(1) "+computer_db.getCardIds(1)); 

//computer_db.addCardId2Notepad(1,5);
//console.log("computer_db.getCardIds(1) "+computer_db.getCardIds(1)); 

//code in logic so that if there are 2 players, then deal the deck

function clue_game(){
  //wait till a player joins

  //NEW
  //computer_db.resetAllPlayerCardsAndNotepads();
  
  //Generate New Deck
  GameServer.addDeck();
  
  //Draw Crime Sequence for Game Instance
  GameServer.drawCrime();
  
  console.log("GameServer.getCrime() "+GameServer.getCrime() );
  
  // Shuffles Remaining Cards
  GameServer.deckShuffle(); 
  
  //Deals Cards to Players
  computer_db = GameServer.dealDeck(computer_db);
  
  //Debug Code
//  var ScarletCards = computer_db.getCardNames(0);
//  console.log("Miss Scarlet Cards: " + ScarletCards);
  
  //GameServer.InitNotepads(computer_db);
  
}

//clue_game();


//////////////////////////////////////////////////////////////////////////////////////////////////

//ROUTING FUNCTIONS for MODEL TO VIEW//////////////////////////////////////////////////
// http://expressjs.com/en/starter/basic-routing.html
// consider separating routing code: https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/app/index.html');
});

app.get('/get_db', function(request, response) {
  //https://clueless-wcbc.glitch.me/get_db?player_id=0
  let player_id = request.query.player_id;
  var rows = [];
  
  if(player_id!=null){
    rows.push(computer_db.getCardIds(player_id));
    response.send(JSON.stringify(rows)); 
  }
  else{//default to Computer_db if no table specified
      for(var i = 0; i < computer_db.getNumPlayers();  i++)
    {
      rows.push(computer_db.getCardIds(i));//add cards per player
    }
      response.send(JSON.stringify(rows));
   
  }
}); 

app.get('/getNotepadCardIds', function(request, response) {
  //https://clueless-wcbc.glitch.me/getNotepadCardIds?player_id=1
    let player_id = request.query.player_id;
    var rows = []
    rows.push(computer_db.getNotepadCardIds(player_id));
    response.send(JSON.stringify(rows));
});

app.get('/getNotepadCardNames', function(request, response) {
  //https://clueless-wcbc.glitch.me/getNotepadCardNames?player_id=1
    let player_id = request.query.player_id;
    var rows = [];
    rows.push(computer_db.getNotepadCardNames(player_id));
    response.send(JSON.stringify(rows));
});

//emmanuel test
app.get('/movePlayerLocation', function(request, response) {
  //https://clueless-wcbc.glitch.me/movePlayerLocation?player_id=1&direction=up
    let player_id = request.query.player_id;
    let direction = request.query.direction;
    console.log("server move Player Location");
    GameServer.movePlayerLocation(computer_db, player_id, direction,(new_loc)=>{
     //  io.on('connection', (socket) => {
     //    socket.removeAllListeners();
     //    socket.broadcast.emit('updatePlayerLocation',new_loc);
     //    console.log("emitting player location "+ new_loc);
     // });
    });   
});

app.get('/getPlayerLocation', function(request, response) {
  //https://clueless-wcbc.glitch.me/getPlayerLocation?player_id=0
    let player_id = request.query.player_id;
    var rows = []
    if(player_id!=null){
        rows.push(computer_db.getPlayerLocation(player_id));
      console.log("rows: "+rows);
        response.send(JSON.stringify(rows));
    }
  else{
    for(var i = 0; i < computer_db.getNumPlayers();  i++)
    {
      rows.push(computer_db.getPlayerLocation(i));//add cards per player
    }
      response.send(JSON.stringify(rows));
  }

});

app.get('/makeSuggestion', function(request, response) {
  //https://clueless-wcbc.glitch.me/makeSuggestion?player_id=0&character=Miss_Scarlet&weapon=Dagger&room=Library
    let player_id = request.query.player_id;
    let character = request.query.character;
    let weapon = request.query.weapon;
    let room = request.query.room;
    GameServer.makeSuggestion(computer_db, player_id, character, weapon, room);
});

app.get('/makeAccusation', function(request, response) {
  //https://clueless-wcbc.glitch.me/makeAccusation?player_id=0&character=Miss_Scarlet&weapon=Dagger&room=Library
    let player_id = request.query.player_id;
    let character = request.query.character;
    let weapon = request.query.weapon;
    let room = request.query.room;
    GameServer.makeAccusation(computer_db, player_id, character, weapon, room);
});

app.get('/endTurn', function(request, response) {
  //https://clueless-wcbc.glitch.me/endTurn?player_id=0
    let player_id = request.query.player_id;
  //TODO: MOVE TO A BUTTON
    GameServer.endTurn(computer_db, player_id);
});

/*
app.get('/endGame', function(request, response) {
  //https://clueless-wcbc.glitch.me/endGame?player_id=0
    let player_id = request.query.player_id;
    GameServer.endGame(computer_db, player_id);
});
*/
app.post('/makeSuggestion2', function(request, response) {
  //https://clueless-wcbc.glitch.me/makeAccusation?player_id=0
  //https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
  //console.log(request);
  console.log("request.body.character " ,request.body.character);
  console.log("request.body.room " ,request.body.room);
  console.log("request.body.weapon " ,request.body.weapon);
   console.log("request.body.socket_id " ,request.body.socket_id);
    /*var body = JSON.parse(request.body);
    console.log(body.character);
    console.log(body.room);
    console.log(body.weapon);*/
  //TODO: WHICH PLAYER
  var player_id = 0;
    GameServer.makeSuggestion(computer_db, player_id, request.body.character, request.body.weapon, request.body.room);
});





//end of test

//END OF ROUTING FUNCTIONS//////////////////////////////////////////////////

// listen for requests
var listener = server.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

//https://stackoverflow.com/questions/7196212/how-to-create-dictionary-and-add-key-value-pairs-dynamically
var socket_dict = {};
//CHANGE THIS TO SOCKET_DICT AND PLAYER ID, then we can get the player id from here

const numChars = 6;

function assignPlayerToChar (dict, socketId){
  if(Object.keys(socket_dict).length<6){
    dict[socketId] = characters[Object.keys(socket_dict).length];
    console.log("assignPlayerToChar " + JSON.stringify(socket_dict));
  }

}

function removePlayer (dict, socketId){
  //https://stackoverflow.com/questions/346021/how-do-i-remove-objects-from-a-javascript-associative-array
  delete dict[socketId];
}
var socketArr = [];
io.on('connection', (socket) => {
  //ASSIGN PLAYER TO CHARACTER
  socketArr.push(socket.id);
  var allPlayerLocations = "";
  
  //ADD TO LIST
  assignPlayerToChar(socket_dict,socket.id);
  console.log("GameServer.addPlayer: "+socket.id);
  //TODO ADD PLAYER
  GameServer.addPlayer(computer_db, socket.id, socket_dict[socket.id], 0, 0);
  //ASSIGN LOCATION
  //emit location first time
  socket.emit('updatePlayerCharacter',computer_db.getPlayerCharacter(socket.id));
  socket.emit('updatePlayerLocation',computer_db.getPlayerLocation(socket.id));
  console.log("computer_db.getAllPlayerLocations() "+computer_db.getAllPlayerLocations());
  //BROADCAST TO ALL
  //TODO: TURNS
  //https://stackoverflow.com/questions/37862992/socket-io-broadcasting-not-working
  //BROADCAST TO ALL
  io.emit('updateTurn',"TURN: " +computer_db.getPlayerCharacter(computer_db.getPlayerTurnId()));
  io.emit('updateAllPlayerLocations',"PLAYER LOCATIONS: "+computer_db.getAllPlayerLocations());
  socket.on('movePlayerLocationCommand',(data)=>{
    console.log("player_id: "+data.player_id+" direction: "+data.direction);
    console.log("current location: " + computer_db.getPlayerLocation(socket.id));
    GameServer.movePlayerLocation(computer_db, data.player_id, data.direction, (new_loc)=>{
      //emit only when player moves
      socket.emit('updatePlayerLocation',new_loc);  
      if(new_loc!=null){ 
        var submissionRoomUpdate = locToRoom[new_loc[0]][new_loc[1]];
        console.log("submissionRoomUpdate "+submissionRoomUpdate);
        socket.emit('updateSubmissionRoom',submissionRoomUpdate)
      }
      console.log("computer_db.getAllPlayerLocations() "+computer_db.getAllPlayerLocations());
      //BROADCAST TO ALL
      io.emit('updateTurn',"TURN: " +computer_db.getPlayerCharacter(computer_db.getPlayerTurnId()));
      io.emit('updateAllPlayerLocations',"PLAYER LOCATIONS: "+computer_db.getAllPlayerLocations());
      console.log(data.player_id +" new_log: "+new_loc);
    });
  });
  
  socket.on('submitSuggestion',(data)=>{
      console.log("SUGGESTION FROM player_id: "+data.player_id+" character: "+data.character + " room " +data.room + " weapon " +data.weapon );   
      var result = GameServer.makeSuggestion(computer_db, data.player_id, data.character, data.weapon, data.room);
      socket.emit('suggestionResult',JSON.stringify(result));
      //https://socket.io/docs/server-api/#socket-to-room
      console.log("result FROM SUGGESTION: "+ result);
      var charThatRevealed = result[0];
      if(charThatRevealed!=null){
        socket.emit('suggestionResult',result[0]+" showed card "+result[1]+ " to you");
      }
      else
      {
        socket.emit('suggestionResult','no cards shown to you');
      }
      //TODO: UPDATE NOTEPAD PER PLAYER

      var revealerId = computer_db.getPlayerIdFromCharacter(charThatRevealed);
      //loop through socketArr
      for (var i = 0; i < socketArr.length; i++)
      {
        //If it's not the submitter, if charThatRevealed is not null,  OR the revealer
        if(socketArr[i]!=socket.id && charThatRevealed!=null && socketArr[i]!=revealerId){
          socket.to(socketArr[i]).emit('suggestionResult', result[0]+" showed card to "+computer_db.getPlayerCharacter(socket.id));
        }
        //if revealer
        else if(socketArr[i]==revealerId && charThatRevealed!=null ){
          socket.to(socketArr[i]).emit('suggestionResult', 'You showed card '+result[1]+' to ' + computer_db.getPlayerCharacter(socket.id));
        }
         
        else if(socketArr[i]!=revealerId && charThatRevealed==null ){
          socket.to(socketArr[i]).emit('suggestionResult', "No one showed a card to "+computer_db.getPlayerCharacter(socket.id));
        }
    

      }
      socket.emit('updateNotepad',computer_db.getNotepadCardNames(socket.id));
  });
  
  socket.on('submitAccusation',(data)=>{ 
      console.log("ACCUSATION FROM player_id: "+data.player_id+" character: "+data.character + " room " +data.room + " weapon " +data.weapon );   
      var result = GameServer.makeAccusation(computer_db, data.player_id, data.character, data.weapon, data.room);
     // socket.emit('accusationResult',result);
      var accusationResult = "";
      for(var i = 0; i < computer_db.players.length; i++){
        accusationResult += "player: " + computer_db.players[i].character + " isActive: "+ computer_db.players[i].active + " ";
      }
      io.emit('accusationResult',accusationResult);
      //TODO: io.emit accusation result TELL EVERYONE THEIR ACCUSATION RESULT
  });
  socket.on('startGame',(data)=>{
    console.log("startGame");
    computer_db.setPlayerTurnId(socket.id);
    clue_game();
    //BROADCAST TO ALL
    io.emit('updateTurn',"TURN: " +computer_db.getPlayerCharacter(computer_db.getPlayerTurnId()));
    io.emit('updateAllPlayerLocations',"PLAYER LOCATIONS: "+computer_db.getAllPlayerLocations());
    //RESET NOTEPAD FIRST
    io.emit('resetNotepad');
    //TODO: UPDATE NOTEPAD FOR ALL PLAYERS
    console.log("getNotepadCardNames "+computer_db.getNotepadCardNames(socket.id));
    //tell everyone to ask for update
    io.emit('updateNotepad');
  });
  socket.on('reqUpdateMyNotepad',(data)=>{
    socket.emit('updateMyNotepad',computer_db.getNotepadCardNames(socket.id));
  });
  socket.on('endTurn',(data)=>{
    console.log("endTurn");
    GameServer.endTurn(computer_db,socket.id);
    //BROADCAST TO ALL
    io.emit('updateTurn',"TURN: " +computer_db.getPlayerCharacter(computer_db.getPlayerTurnId()));
    io.emit('updateAllPlayerLocations',"PLAYER LOCATIONS: "+computer_db.getAllPlayerLocations());
  });
  /*
  socket.on('disconnect', function () {
    console.log(socket.id + " left!")  
    computer_db.removePlayer(socket.id);
    removePlayer(socket_dict,socket.id);
    console.log("LEFT computer_db.getAllPlayerLocations() "+computer_db.getAllPlayerLocations());
    
  });
   */  
  
});


  
  

//Need to disconnect: https://hackernoon.com/enforcing-a-single-web-socket-connection-per-user-with-node-js-socket-io-and-redis-65f9eb57f66a
