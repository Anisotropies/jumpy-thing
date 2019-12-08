var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var server = http.Server(app);
var io = socketIO(server);

//var socket = io();
class Deck {
	constructor() {
		this.deck = [];
    this.reset();
	}
	
	reset(){
		this.deck = [];
		
		var characters = ['Miss_Scarlet', 'Col_Mustard', 'Mrs_White', 'Mr_Green', 'Mrs_Peacock', 'Prof_Plum'];
		var weapons    = ['Candlestick', 'Knife', 'Revolver', 'Lead_Pipe', 'Rope', 'Wrench'];
		var rooms      = ['Conservatory', 'Ballroom', 'Kitchen', 'Library', 'Billiard_Room', 'Dining_Room', 'Study', 'Hall', 'Lounge'];
    
    for (let char in characters){
      this.deck.push(`${characters[char]}`);
    }
    
    for (let weapon in weapons){
      this.deck.push(`${weapons[weapon]}`);
    }
    
    for (let room in rooms){
      this.deck.push(`${rooms[room]}`);
    }
	}
	
	drawCrime() {
    
		var room      = this.deck.splice(Math.floor(Math.random() * 9) + 12, 1);
		var weapon    = this.deck.splice(Math.floor(Math.random() * 6) + 6, 1);
    var character = this.deck.splice(Math.floor(Math.random() * 6), 1);
    
		var Crime = [character, weapon, room];
		
		return Crime;
	}
	
	shuffle() {
		const {deck} = this;
		let c = deck.length, i;
		
		while(c) {
			i = Math.floor(Math.random() * c--); //get random card less than moving end index
  		[deck[c], deck[i]] = [deck[i], deck[c]];//switch random card with end index card
		}
		return this;
	}
	
	dealCard(){
		return this.deck.pop();
	}
	
	cards_in_deck(){
		return this.deck.length;
	}
  
  dealDeck(game){
    var newDeck = this.deck;
    var newGame = game;
    var cards = newDeck.cards_in_deck();
    var num_players = newGame.getNumPlayers();
    var players = newGame.getAllPlayers();
    var player_num = 0;
    while(cards) {
      var card = newDeck.dealCard();
      newGame.addCard(card, players[player_num].player_id);
      cards--;
      player_num = (player_num + 1) % num_players;
    }
    return [newDeck, newGame];
  }
}

//mark card in notepad
function makeNote(card, game, player_id){
  game.addCardName2Notepad(player_id, card);
}

//returns true if player can move in direction (assuming no logic checks besides boundaries)
function check_if_can_move(location, direction){
  if(direction == "secret"){
    if (location[0] % 4 == 0 && location[1] % 4 == 0){
      return true;
    }
    return false;
  }
  
  switch(direction) {
    case "left": 
      if ((location[0] - 1) < 0)
        return false;
      break;
    case "up":
      if ((location[1] + 1) > 4)
        return false;
      break;
    case "right":
      if((location[0] + 1) > 4)
        return false;
      break;
    case "down":
      if((location[1] - 1) < 0)
        return false;
      break;
  }
  return true;
}

//returns new location after movement (assuming no logic checks besides boundaries)
function new_location(location, direction){
  var new_loc = location;
  
  if (direction == "secret"){
    if(new_loc[0] == 0){new_loc[0] = 4;}
    else if(new_loc[0] == 4){new_loc[0] = 0;}
    
    if(new_loc[1] == 0){new_loc[1] = 4;}
    else if(new_loc[1] == 4){new_loc[1] = 0;}
    //console.log("CONTROLLER Player Using Secret Passage");
    return new_loc;
  }
  
  switch(direction) {
    case "left": 
      new_loc[0] -= 1;
      break;
    case "up":
      new_loc[1] += 1;
      break;
    case "right":
      new_loc[0] += 1;
      break;
    case "down":
      new_loc[1] -= 1;
      break;
  }
  return new_loc;
}

function check_if_in_room(location){
  var room = false;
  if(location[0] % 2 == 0 && location[1] % 2 == 0){
    room = true;
  }
  return room;
}

 function movePlayerLocation(game, player_id, direction,callback){
   var loc = game.getPlayerLocation(player_id);
   var can_move = check_if_can_move(loc, direction);
   let promise = Promise.resolve();
   if (can_move){
     var new_loc = new_location(loc, direction)
     game.setPlayerLocation(player_id, new_loc[0], new_loc[1]);  
     console.log("new loc: "+ new_loc);
     
     if (new_loc[0] % 2 != 0 || new_loc[1] % 2 != 0){
       //console.log("CONTROLLER Player (" + player_id + ") Moving Into Hallway");
     } 
     
     if(check_if_in_room(new_loc)){
       //console.log("CONTROLLER Player (" + player_id + ") Moving Into Room");
     }
   } 
   callback(new_loc);
 }

/*
//returns array of possible move locations
function possible_moves(board_state, player){
	var moves = [];
	var x_coor = player.current_location[0];
	var y_coor = player.current_location[1];
	if ((x_coor % 4 == 0) && (y_coor % 4 == 0)) { //in corner case
		moves.push(secret_room(x_coor,y_coor)); //adds secret room jump to possible moves
		//check for other possible moves
	}
	else { //not corner case
		//check for other possible moves
	}
	
	if (player.got_moved == true) { //player was moved due to suggestion and can stay in room
		moves.push(stay_put);
	}
	
	return moves;
}
*/


function GameServer(){
  this.deck = [];  
  this.Crime = [];
  this.playerTurn = 0;
  this.players = 0;
  
  this.addPlayer = function(game, id, char, x, y){
    //console.log("CONTROLLER Player (" + id + " = " + char + ") was Added to Game");
    //console.log("CONTROLLER Player Location is Initialized to [" + x + "," + y + "]");
    this.players += 1;
    game.addPlayer(id, char, x, y);
  };
  
  this.drawCrime = function(){
    //console.log("CONTROLLER Crime has been Drawn");
    this.Crime = this.deck.drawCrime();
  };
  
  this.getCrime = function(){
    return this.Crime;
  }
  
  this.addDeck = function(){
    this.deck = new Deck();
  };
  
  this.deckShuffle = function(){
    //console.log("CONTROLLER Deck has been Shuffled");
    this.deck.shuffle();
  };
  
  this.dealDeck = function (game){
    var newDeck = this.deck;
    var newGame = game;
    var cards = newDeck.cards_in_deck();
    var num_players = newGame.getNumPlayers();
    var players = newGame.getAllPlayers();
    //console.log("CONTROLLER Dealing Cards to " + players +" Players");
    var id = 0;
    while(cards) {
      var card = newDeck.dealCard();
      newGame.addCard(card, players[id].player_id);
      cards--;
      id = (id + 1) % num_players;
    }
    this.deck = newDeck;
    return newGame;
  };
  
  this.movePlayerLocation = function(game,player_id, direction,callback){
    //console.log("CONTROLLER Player (" + player_id + ") Requested to Move "+ direction);
    var loc = game.getPlayerLocation(player_id);
    var can_move = check_if_can_move(loc, direction);
    if (can_move){
      var new_loc = new_location(loc, direction);
      game.setPlayerLocation(player_id, new_loc[0], new_loc[1]);  
      console.log("new test loc: "+ new_loc);
      if (new_loc[0] % 2 != 0 || new_loc[1] % 2 != 0){
       //console.log("CONTROLLER Player (" + player_id + ") Moving Into Hallway");
      } 
      if(new_loc[0] % 2 == 0 && new_loc[1] % 2 == 0){
       //console.log("CONTROLLER Player (" + player_id + ") Moving Into Room");
      }
    } 
    callback(new_loc);
  };
  
  this.makeNote = function(card, game, player_id){
    //console.log("CONTROLLER Player (" + player_id + ") marked card (" + card + ")");
    game.addCardName2Notepad(player_id, card);
  };
  
  this.InitNotepads = function(game){
    //console.log("CONTROLLER Marking Each Players Card on Notepad");
    var players = game.getNumPlayers();
    var i, j;
    for (i= 0; i < players; i++){
      var cards = game.getCardNames(i);
      for (j in cards){
        this.makeNote(cards[j], game, i);
      }
    }
  }
  
  this.makeSuggestion = function(game, player_id, character, weapon, room){
    console.log("CONTROLLER Player (" + player_id + ") Made a Suggestion");
    console.log("CONTROLLER Suggestion: " + character + " committed the crime using a " + weapon + " in the " + room);
    var j;
    var cardback = [];
    var suggestion = [character, weapon, room];
    var player_index = game.getPlayerIndex(player_id);
    var players = game.getAllPlayers();
    var numPlayers = game.getNumPlayers();  
    var player_loc = game.getPlayerLocation(player_id);
    
    if (check_if_in_room(player_loc)){
      var next_player = (player_index + 1) % numPlayers;
      //loop through players and add first card that matches the suggestion
      while(next_player != player_index){
        var cards = game.getCardNames(players[next_player].player_id);
        for (j in cards){
          if(suggestion.includes(cards[j])){
            cardback.push(players[next_player].character);
            cardback.push(cards[j]);
            this.makeNote(cardback[1], game, player_id);
            return cardback;
          }
        }
        next_player = (next_player + 1) % numPlayers;
      }
    }
    else{
      cardback.push("Out of Room");
    }
    return cardback;
  };
  
  this.makeAccusation = function(game, player_id, character, weapon, room){
    console.log("CONTROLLER Player (" + player_id + ") Made an Accusation");
    console.log("CONTROLLER Accusation: " + character + " committed the crime using a " + weapon + " in the " + room);
    var accusation = [character, weapon, room];
    var crime = this.getCrime();
    console.log("Crime: " + crime);
    console.log("accusation: " + accusation);
    if (crime[0] == accusation[0] && crime[1] == accusation[1]  && crime[2] == accusation[2]){
      this.presentWinner(player_id);
      return 1;
    }
    else {
      //UI CALL NEEDED notify users that accusation is incorrect
      //UI CALL NEEDED tell player he is out
      game.setInactive(player_id, 0);
      return 0;
    }
  };
  
  this.endTurn = function(game,player_id){
    var curr_id = game.getPlayerTurnId();
    console.log("Current Player Id: " + curr_id);
    var num_players = game.getNumPlayers()
    var players = game.getAllPlayers();
    var curr_player_num = game.getPlayerIndex(curr_id);  
    curr_player_num = (curr_player_num + 1) % num_players;
    while(!game.isActive(players[curr_player_num].player_id)){
      curr_player_num = (curr_player_num + 1) % num_players;
    }
    console.log("players[curr_player_num].player_id " +players[curr_player_num].player_id);
    game.setPlayerTurnId(players[curr_player_num].player_id);
    //UI CALL NEEDED notify next player that it is their turn
  }
  
  this.endGame = function(game, player_id){
    //console.log("CONTROLLER Player (" + player_id + " ) Has Requested to End Game");
  }
  
  this.presentWinner = function(game, player_id){
    //UI CALL NEEDED present winner on all clients 
  }
}

module.exports = GameServer;