//creates classes for dbs and players

const cardId2Name = {
  0: "Study",
  1: "Hall",
  2: "Lounge",
  3: "Library",
  4: "Billiard_Room",
  5: "Dining_Room",
  6: "Conservatory",
  7: "Ballroom",
  8: "Kitchen",
  9: "Miss_Scarlet",
  10: "Col_Mustard",
  11: "Mrs_White",
  12: "Mr_Green",
  13: "Mrs_Peacock",
  14: "Prof_Plum",
  15: "Rope",
  16: "Lead_Pipe",
  17: "Knife",
  18: "Wrench",
  19: "Candlestick",
  20: "Revolver"
};

const cardName2Id = {
  Study: 0,
  Hall: 1,
  Lounge: 2,
  Library: 3,
  Billiard_Room: 4,
  Dining_Room: 5,
  Conservatory: 6,
  Ballroom: 7,
  Kitchen: 8,
  Miss_Scarlet: 9,
  Col_Mustard: 10,
  Mrs_White: 11,
  Mr_Green: 12,
  Mrs_Peacock: 13,
  Prof_Plum: 14,
  Rope: 15,
  Lead_Pipe: 16,
  Knife: 17,
  Wrench: 18,
  Candlestick: 19,
  Revolver: 20
};

//https://mariusschulz.com/blog/removing-elements-from-javascript-arrays
function remove(array, index) {
  if (index !== -1) {
    array.splice(index, 1);
  }
}

//INTERNAL OBJECT FOR PLAYERS--ACTS AS A RECORD FOR EACH PLAYER
//convert player into class and create function like get player id
function Player(player_id, character, location_x, location_y) {
  (this.player_id = player_id),
    (this.character = character),
    (this.location_x = location_x),
    (this.location_y = location_y),
    (this.moved = 0), //your player moved
    (this.beenMoved =0), //you were moved by another player by suggestion
    (this.active = 1),
    (this.cards = {
      Study: 0,
      Hall: 0,
      Lounge: 0,
      Library: 0,
      Billiard_Room: 0,
      Dining_Room: 0,
      Conservatory: 0,
      Ballroom: 0,
      Kitchen: 0,
      Miss_Scarlet: 0,
      Col_Mustard: 0,
      Mrs_White: 0,
      Mr_Green: 0,
      Mrs_Peacock: 0,
      Prof_Plum: 0,
      Rope: 0,
      Lead_Pipe: 0,
      Knife: 0,
      Wrench: 0,
      Candlestick: 0,
      Revolver: 0
    }),
    (this.notepad = {
      Study: 0,
      Hall: 0,
      Lounge: 0,
      Library: 0,
      Billiard_Room: 0,
      Dining_Room: 0,
      Conservatory: 0,
      Ballroom: 0,
      Kitchen: 0,
      Miss_Scarlet: 0,
      Col_Mustard: 0,
      Mrs_White: 0,
      Mr_Green: 0,
      Mrs_Peacock: 0,
      Prof_Plum: 0,
      Rope: 0,
      Lead_Pipe: 0,
      Knife: 0,
      Wrench: 0,
      Candlestick: 0,
      Revolver: 0
    });
  //TODO: EACH PLAYER DOESN'T NEED TO KNOW ID; SERVER SHOULD KEEP TRACK OF IT; DON'T WANT TO PASS IT IN THE FRONT END
  //this.getPlayerId
}

// Constructor for dB
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects
//https://pietschsoft.com/post/2015/09/05/javascript-basics-how-to-create-a-dictionary-with-keyvalue-pairs
//https://www.w3schools.com/js/js_object_constructors.asp
function Db() {
  this.players = [];
  this.playerTurnId = 0; //Error check if out of bounds
  this.addPlayer = function(player_id, character, location_x, location_y) {
    //console.log("MODEL function addPlayer() called with parameters" + " player_id: " + player_id + " character: " + character + " location_x: " + location_x + " location_y: " + location_y);
    var player = new Player(player_id, character, location_x, location_y);
    this.players.push(player);
  };
  this.getPlayerIndex = function(player_id) {
    //console.log("MODEL function getPlayerLocation() called with parameters" + " player_id: " +player_id);
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].player_id == player_id) {
        return i;
      }
    }
    return null;
  };

  this.getPlayerLocation = function(player_id) {
    //console.log("MODEL function getPlayerLocation() called with parameters" + " player_id: " +player_id);
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].player_id == player_id) {
        return [this.players[i].location_x, this.players[i].location_y];
      }
    }
    return null;
  };

  this.getAllPlayers = function() {
    return this.players;
  };
  //NOTE: FOR DISPLAYING THE STRING ONLY!
  this.getAllPlayerLocations = function() {
    var result = "";
    for (var i = 0; i < this.players.length; i++) {
      result =
        result +
        this.players[i].character +
        " [" +
        this.players[i].location_x +
        ", " +
        this.players[i].location_y +
        "]\n";
    }
    return result;
  };
  
  
  this.getPlayerCharacter = function(player_id) {
    //console.log("MODEL function getPlayerCharacter() called with parameters" + " player_id: " +player_id);
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].player_id == player_id) {
        return [this.players[i].character];
      }
    }
    return null;
  };
  this.getPlayerIdFromCharacter = function(character){
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].character == character) {
        return [this.players[i].player_id];
      }
    }
    return null;
  }
  this.getNumPlayers = function() {
    //console.log("MODEL function getNumPlayers() called");
    return this.players.length;
  };
  this.setPlayerLocation = function(player_id, location_x, location_y) {
    //console.log("MODEL function setPlayerLocation() called with parameters" + " player_id: " +player_id + " location_x: " + location_x + " location_y: " + location_y);
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].player_id == player_id) {
        this.players[i].location_x = location_x;
        this.players[i].location_y = location_y;
      }
    }
  };
  this.isActive = function(player_id) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].player_id == player_id) {
        return this.players[i].active;
      }
    }
  };
  this.setInactive = function(player_id, activity) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].player_id == player_id) {
        this.players[i].active = activity;
      }
    }
  };
  this.addCard = function(card_name, player_id) {
    //console.log("MODEL function addCard() called with parameters" + " card_name: " +card_name + " player_id: " + player_id);
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].player_id == player_id) {
        this.players[i].cards[card_name] = 1; //add to computer DB
        this.players[i].notepad[card_name] = 1; //add to player notepad
      }
    }
  };
  this.getCardIds = function(player_id) {
    //console.log("MODEL function getCardIds() called with parameters" + " player_id: " + player_id);
    var returnArray = [];
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].player_id == player_id) {
        for (const [key, value] of Object.entries(this.players[i].cards)) {
          if (value == 1) {
            returnArray.push(cardName2Id[key]);
          }
        }
      }
    }
    return returnArray;
  };
  this.getCardNames = function(player_id) {
    // console.log("MODEL function getCardNames() called with parameters" + " player_id: " + player_id);
    var returnArray = [];
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].player_id == player_id) {
        for (const [key, value] of Object.entries(this.players[i].cards)) {
          if (value == 1) {
            returnArray.push(key);
          }
        }
      }
    }
    return returnArray;
  };

  //THESE ADD TO THE PLAYERS NOTEPAD ONLY; NOT THE DB
  this.addCardId2Notepad = function(player_id, card_id) {
    //  console.log("MODEL function addCardId2Notepad() called with parameters" + " player_id: " + player_id + " card_id: " + card_id);
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].player_id == player_id) {
        this.players[i].notepad[cardId2Name[card_id]] = 1;
      }
    }
  };
  this.addCardName2Notepad = function(player_id, card_name) {
    //  console.log("MODEL function addCardName2Notepad() called with parameters" + " player_id: " + player_id + " card_name: " + card_name);
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].player_id == player_id) {
        this.players[i].notepad[card_name] = 1;
      }
    }
  };
  this.getNotepadCardIds = function(player_id) {
    // console.log("MODEL function getNotepadCardIds() called with parameters" + " player_id: " + player_id);
    var returnArray = [];
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].player_id == player_id) {
        for (const [key, value] of Object.entries(this.players[i].notepad)) {
          if (value == 1) {
            returnArray.push(cardName2Id[key]);
          }
        }
      }
    }
    return returnArray;
  };
  this.getNotepadCardNames = function(player_id) {
    // console.log("MODEL function getNotepadCardNames() called with parameters" + " player_id: " + player_id);
    var returnArray = [];
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].player_id == player_id) {
        for (const [key, value] of Object.entries(this.players[i].notepad)) {
          if (value == 1) {
            returnArray.push(key);
          }
        }
      }
    }
    return returnArray;
  };
  this.getPlayerTurnId = function() {
    return this.playerTurnId;
  };
  this.setPlayerTurnId = function(player_id) {
    /*
    if(this.players.length<=6){
      this.playerTurnId = player_id;
    }
    else
    {
      console.log("player_id out of bounds!");
    }*/

    this.playerTurnId = player_id;
  };
  this.has_moved = function(player_id) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].player_id == player_id) {
        return this.players[i].moved;
      }
    }
  };
  this.has_been_moved = function(player_id) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].player_id == player_id) {
        return this.players[i].beenMoved;
      }
    }
  };
  this.set_has_moved = function(player_id,moved) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].player_id == player_id) {
        this.players[i].moved = moved;
      }
    }
  };
  this.set_has_been_moved = function(player_id,beenMoved) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].player_id == player_id) {
        this.players[i].beenMoved = beenMoved;
      }
    }
  };
  this.removePlayer = function(player_id) {
    remove(this.players, this.getPlayerIndex(player_id));
  };
  this.resetAllPlayerCardsAndNotepads = function() {
    console.log("resetAllPlayerCardsAndNotepads");
    for (var i = 0; i < this.players.length; i++) {
      console.log("Reset " + this.players[i].character + " cards");
      for (var j = 0; j < Object.keys(this.players[i].cards).length; j++) {
        //https://stackoverflow.com/questions/7866275/access-non-numeric-object-properties-by-index
        this.players[i].cards[Object.keys(this.players[i].cards)[j]] = 0;
        //console.log(
        //  this.players[i].cards[Object.keys(this.players[i].cards)[j]]
        //);
      }
      console.log("Reset " + this.players[i].character + " notepad");
      for (var j = 0; j < Object.keys(this.players[i].notepad).length; j++) {
        //https://stackoverflow.com/questions/7866275/access-non-numeric-object-properties-by-index
        this.players[i].notepad[Object.keys(this.players[i].notepad)[j]] = 0;
        //console.log( 
        //  this.players[i].notepad[Object.keys(this.players[i].notepad)[j]]
        //);
      }
      //https://stackoverflow.com/questions/8312459/iterate-through-object-properties
    }
  };
}
//TODO: ADD CRIME TO DATABASE

//////////////////////////////////////

//EXPORT THE DB so other node.js files can use it
//https://adrianmejia.com/getting-started-with-node-js-modules-require-exports-imports-npm-and-beyond/
module.exports = Db;
