const React = require("react");
const ReactDOM = require("react-dom");
//https://alligator.io/react/axios-react/
const Axios = require("axios");
const socketIOClient = require("socket.io-client");
//https://medium.com/dailyjs/combining-react-with-socket-io-for-real-time-goodness-d26168429a34#6624
//let socket = require('socket.io-client')('https://aquatic-tabletop-socketio-react.glitch.me:3000/');
//https://www.freecodecamp.org/news/how-to-create-a-realtime-app-using-socket-io-react-node-mongodb-a10c4a1ab676/
const socket = socketIOClient("https://jumpy-thing.glitch.me/");

var global = "";

// function subscribeToTimer(cb) {

//   socket.on('state', function (data){
//     cb(null, data);
//     console.log("subscribeToTimer "+JSON.stringify(data));
//     console.log("SOCKET ID "+socket.id);
//   });

//   socket.emit('subscribeToTimer', 1000);
// }

const dependenciesArray = [
  "express - middleware for the node server",
  "react - for generating the views of the app",
  "react-dom - powers the rendering of elements to the DOM, typically paired with React",
  "webpack - for bundling all the javascript",
  "webpack-cli - command line support for webpack",
  "jsx-loader - allows webpack to load jsx files"
];

/* the main page for the index route of this app */
//external function calls
function movePlayerLocation(direction) {
  console.log(
    "VIEW function movePlayerLocation() called with parameters direction: " +
      direction
  );
  socket.emit("movePlayerLocationCommand", {
    player_id: socket.id,
    direction: direction
  });
}
function startGame() {
  console.log("startGame");
  socket.emit("startGame");
}
function endTurn() {
  console.log("endTurn");
  socket.emit("endTurn", { player_id: socket.id });
}

//TODO: REVIEW
function suggestion() {
  let url =
    "/makeSuggestion?player_id=0&character=Miss_Scarlet&weapon=Rope&room=Study";
  console.log(
    "VIEW function suggestion() called with parameters player_id=0&character=Miss_Scarlet&weapon=Rope&room=Study"
  );
  //Axios.get(url);
}

function accusation() {
  let url =
    "/makeAccusation?player_id=0&character=Miss_Scarlet&weapon=Rope&room=Study";
  console.log(
    "VIEW function accusation() called with parameters direction: player_id=0&character=Miss_Scarlet&weapon=Rope&room=Study"
  );
  //Axios.get(url);
}

//BUTTONS
function Suggestion(props) {
  //button for every card
  return (
    <div className="suggestion">
      <button className="square" onClick={() => alert("UP")}>
        Set1
      </button>
      <button className="square" onClick={() => alert("UP")}>
        set2
      </button>
      <button className="square" onClick={() => alert("UP")}>
        Set3
      </button>
      <button className="square" onClick={() => alert("UP")}>
        Set4
      </button>
      <button className="square" onClick={() => alert("UP")}>
        Set5
      </button>
    </div>
  );
}

function renderSquare(type) {
  const result = type;
  return <Square type={result} />;
}

//Space with rooms and Hallway made up of Squares from above
function CommonGround(props) {
  return (
    <div className="CommonGround">
      <div className="board-row">
        {renderSquare("Study [0, 4]")}
        {renderSquare("[1, 4]")}
        {renderSquare("Hall [2, 4]")}
        {renderSquare("[3, 4]")}
        {renderSquare("Lounge [4, 4]")}
      </div>
      <div className="board-row">
        {renderSquare("[0, 3]")}
        {renderSquare("no room")}
        {renderSquare("[2, 3]")}
        {renderSquare("no room")}
        {renderSquare("[4, 3]")}
      </div>
      <div className="board-row">
        {renderSquare("Library [0, 2]")}
        {renderSquare("[1, 2]")}
        {renderSquare("Billiard-Room [2, 2]")}
        {renderSquare("[3, 2]")}
        {renderSquare("Dining-Room [4, 2]")}
      </div>
      <div className="board-row">
        {renderSquare("[0, 1]")}
        {renderSquare("no room")}
        {renderSquare("[2, 1]")}
        {renderSquare("no room")}
        {renderSquare("[4, 1]")}
      </div>
      <div className="board-row">
        {renderSquare("Conservatory [0, 0]")}
        {renderSquare("[1, 0]")}
        {renderSquare("Ball-Room [2, 0]")}
        {renderSquare("[3, 0]")}
        {renderSquare("Kitchen [4, 0]")}
      </div>
    </div>
  );
}

function updatePlayerLocation(cb) {
  socket.on("updatePlayerLocation", function(data) {
    cb(null, data);
    console.log("updatePlayerLocation " + JSON.stringify(data));
    console.log("SOCKET ID " + socket.id);
  });
}

function updatePlayerCharacter(cb) {
  socket.on("updatePlayerCharacter", function(data) {
    cb(null, data);
    console.log("updatePlayerCharacter " + JSON.stringify(data));
    console.log("SOCKET ID " + socket.id);
  });
}
function updateTurn(cb) {
  socket.on("updateTurn", function(data) {
    cb(null, data);
  });
}
function updateAllPlayerLocations(cb) {
  socket.on("updateAllPlayerLocations", function(data) {
    cb(null, data);
  });
}

function updateAccusationResult(cb) {
  socket.on("accusationResult", function(data) {
    cb(null, data);
  });
}

function updateSuggestionResult(cb) {
  socket.on("suggestionResult", function(data) {
    cb(null, data);
  });
}

function updateNotepad(cb) {
  socket.on("updateNotepad", function() {
    socket.emit("reqUpdateMyNotepad");
    socket.on("updateMyNotepad", function(data) {
      //send information to server.js to run function
      console.log("updateMyNotepad " + JSON.stringify(data));
      var result = data.join("");
      console.log("data.join() " + result);
      cb(null, result);
    });
  });
}

function submitSuggestion(character, room, weapon) {
  console.log("SUGGESTION MADE ", character, room, weapon, socket.id);
  socket.emit("submitSuggestion", {
    player_id: socket.id,
    character: character,
    room: room,
    weapon: weapon
  });
}

function submitAccusation(character, room, weapon) {
  console.log("Accusation MADE ", character, room, weapon, socket.id);
  socket.emit("submitAccusation", {
    player_id: socket.id,
    character: character,
    room: room,
    weapon: weapon
  });
}

function resetNotepad(cb){
   socket.on("resetNotepad", function() {
     cb();
   });
}

function updateSubmissionRoom(cb){
   socket.on("updateSubmissionRoom", function(data) {
    cb(null, data);
  });
}

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      character: "",
      room: "",
      weapon: "",
      
    };
    updateSubmissionRoom((err, room) =>
      this.setState({
        room
      })
    );
    this.handleChangeCharacter = this.handleChangeCharacter.bind(this);
    this.handleChangeRoom = this.handleChangeRoom.bind(this);
    this.handleChangeWeapon = this.handleChangeWeapon.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeCharacter(event) {
    this.setState({ character: event.target.value });
  }
  handleChangeRoom(event) {
    this.setState({ room: event.target.value });
  }
  handleChangeWeapon(event) {
    this.setState({ weapon: event.target.value });
  }

  handleSubmit(event) {
    submitSuggestion(this.state.character, this.state.room, this.state.weapon);
    event.preventDefault();
  }


  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Character:{" "}
            <input
              type="text"
              name="character"
              value={this.state.character}
              onChange={this.handleChangeCharacter}
            />
            Room:{" "}
            <input
              type="text"
              name="room"
              value={this.state.room}
              onChange={this.handleChangeRoom}
            />
            Weapon:{" "}
            <input
              type="text"
              name="weapon"
              value={this.state.weapon}
              onChange={this.handleChangeWeapon}
            />
          </label>
          <input id="suggestion_form" type="submit" value="Submit Suggestion" />
        </form>
      </div>
    );
  }
}

class AccusationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      character: "",
      room: "",
      weapon: ""
    };

    this.handleChangeCharacter = this.handleChangeCharacter.bind(this);
    this.handleChangeRoom = this.handleChangeRoom.bind(this);
    this.handleChangeWeapon = this.handleChangeWeapon.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeCharacter(event) {
    this.setState({ character: event.target.value });
  }
  handleChangeRoom(event) {
    this.setState({ room: event.target.value });
  }
  handleChangeWeapon(event) {
    this.setState({ weapon: event.target.value });
  }

  handleSubmit(event) {
    submitAccusation(this.state.character, this.state.room, this.state.weapon);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Character:{" "}
            <input
              type="text"
              name="character"
              value={this.state.character}
              onChange={this.handleChangeCharacter}
            />
            Room:{" "}
            <input
              type="text"
              name="room"
              value={this.state.room}
              onChange={this.handleChangeRoom}
            />
            Weapon:{" "}
            <input
              type="text"
              name="weapon"
              value={this.state.weapon}
              onChange={this.handleChangeWeapon}
            />
          </label>
          <input id="accusation_form" type="submit" value="Submit Accusation" />
        </form>
      </div>
    );
  }
}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      type: props.type,
      all_player_locations: "", 
    };
    updateAllPlayerLocations((err, all_player_locations) =>
      this.setState({
        all_player_locations
      })
    );
  }
  componentDidMount() {
    
  }

  render() {
    //all player location is a string like this PLAYER LOCATIONS: Col_Mustard [0, 0] Col_Mustard [0, 0]
    //if square is room give it room properties
    var tempPlayer = [];
    
    if (this.state.type == "no room") {
      return (<div className="square-black"></div>);
    }
    // else if (this.state.type == "Home [-1, -1]") {
    //   return (<div className="square"></div>);
    // }
    else {
      let typeSplit = this.state.type;// type == Ballroom [2, 0]
      let squareType = typeSplit.slice(-5, -1);
      var playLocArrayIni = this.state.all_player_locations.slice(18);
      var playerLocArray = playLocArrayIni.split(/[\]]+/);
      console.log("Start now@@24");
      console.log("squareType: "+ squareType);
      for (var num = 0; num < playerLocArray.length; num++){
        console.log("playerLocArray["+num+"]: "+playerLocArray[num]);
        console.log("slicedUpType: "+ squareType);
        if (playerLocArray[num].search(squareType) != -1) //if 
          {
            let helperVar = playerLocArray[num].search(squareType);
            console.log("helperVar: "+ helperVar);
            tempPlayer.push(playerLocArray[num].slice(0,helperVar-1));
            // this.setState({player:this.state.player.push(playerLocArray[num].slice(0,helperVar-1))})
          }
      }
      console.log("tempPlayer: "+ tempPlayer);
      if (this.state.type == "Home [-1, -1]") {
      return (<div className="square-home">
                <div className="game-title">Home Box</div>
                <div className = "player-names">{tempPlayer}</div>
              </div>);
      }
      
      return (<div className="square">
                <div className = "room-names">{this.state.type}</div>
                <div className = "player-names">{tempPlayer}</div>
              </div>);
    }
  }
}

//Class Board

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      computer_db_status: "",
      personal_np_name: "",
      personal_np_status: [],
      Study: "--",
      Hall: "--",
      Lounge: "--",
      Library: "--",
      Billiard_Room: "--",
      Dining_Room: "--",
      Conservatory: "--",
      Ballroom: "--",
      Kitchen: "--",
      Miss_Scarlet: "--",
      Col_Mustard: "--",
      Mrs_White: "--",
      Mr_Green: "--",
      Mrs_Peacock: "--",
      Prof_Plum: "--",
      Rope: "--",
      Lead_Pipe: "--",
      Knife: "--",
      Wrench: "--",
      Candlestick: "--",
      Revolver: "--"
    };
    updateNotepad((err, personal_np_name) => {
      this.setState({ personal_np_name });
      console.log("Board constructor did mount: " + personal_np_name);
      if (personal_np_name.search("Study") != -1) {
        console.log("Study found");
        this.setState({ Study: "X" });
      }
      if (personal_np_name.search("Hall") != -1) {
        console.log("Hall found");
        this.setState({ Hall: "X" });
      }
      if (personal_np_name.search("Lounge") != -1) {
        console.log("Lounge found");
        this.setState({ Lounge: "X" });
      }
      if (personal_np_name.search("Library") != -1) {
        console.log("Library found");
        this.setState({ Library: "X" });
      }
      if (personal_np_name.search("Billiard_Room") != -1) {
        console.log("Billiard_Room found");
        this.setState({ Billiard_Room: "X" });
      }
      if (personal_np_name.search("Dining_Room") != -1) {
        console.log("Dining_Room found");
        this.setState({ Dining_Room: "X" });
      }
      if (personal_np_name.search("Conservatory") != -1) {
        console.log("Conservatory found");
        this.setState({ Conservatory: "X" });
      }
      if (personal_np_name.search("Ballroom") != -1) {
        console.log("Ballroom found");
        this.setState({ Ballroom: "X" });
      }
      if (personal_np_name.search("Kitchen") != -1) {
        console.log("Kitchen found");
        this.setState({ Kitchen: "X" });
      }
      if (personal_np_name.search("Miss_Scarlet") != -1) {
        console.log("Miss_Scarlet found");
        this.setState({ Miss_Scarlet: "X" });
      }
      if (personal_np_name.search("Col_Mustard") != -1) {
        console.log("Col_Mustard found");
        this.setState({ Col_Mustard: "X" });
      }
      if (personal_np_name.search("Mrs_White") != -1) {
        console.log("Mrs_White found");
        this.setState({ Mrs_White: "X" });
      }
      if (personal_np_name.search("Mr_Green") != -1) {
        console.log("Mr_Green found");
        this.setState({ Mr_Green: "X" });
      }
      if (personal_np_name.search("Mrs_Peacock") != -1) {
        console.log("Mrs_Peacock found");
        this.setState({ Mrs_Peacock: "X" });
      }
      if (personal_np_name.search("Prof_Plum") != -1) {
        console.log("Prof_Plum found");
        this.setState({ Prof_Plum: "X" });
      }
      if (personal_np_name.search("Rope") != -1) {
        console.log("Rope found");
        this.setState({ Rope: "X" });
      }
      if (personal_np_name.search("Lead_Pipe") != -1) {
        console.log("Lead_Pipe found");
        this.setState({ Lead_Pipe: "X" });
      }
      if (personal_np_name.search("Knife") != -1) {
        console.log("Knife found");
        this.setState({ Knife: "X" });
      }
      if (personal_np_name.search("Wrench") != -1) {
        console.log("Wrench found");
        this.setState({ Wrench: "X" });
      }
      if (personal_np_name.search("Candlestick") != -1) {
        console.log("Candlestick found");
        this.setState({ Candlestick: "X" });
      }
      if (personal_np_name.search("Revolver") != -1) {
        console.log("Revolver found");
        this.setState({ Revolver: "X" });
      }
    });
    resetNotepad(() => {
      this.setState({ Study: "--" });
      this.setState({ Hall: "--" });
      this.setState({ Lounge: "--" });
      this.setState({ Library: "--" });
      this.setState({ Billiard_Room: "--" });
      this.setState({ Dining_Room: "--" });
      this.setState({ Conservatory: "--" });
      this.setState({ Ballroom: "--" });
      this.setState({ Kitchen: "--" });
      this.setState({ Miss_Scarlet: "--" });
      this.setState({ Col_Mustard: "--" });
      this.setState({ Mrs_White: "--" });
      this.setState({ Mr_Green: "--" });
      this.setState({ Mrs_Peacock: "--" });
      this.setState({ Prof_Plum: "--" });
      this.setState({ Rope: "--" });
      this.setState({ Lead_Pipe: "--" });
      this.setState({ Knife: "--" });
      this.setState({ Wrench: "--" });
      this.setState({ Candlestick: "--" });
      this.setState({ Revolver: "--" });
    });
  }

  //Billiard_RoomBallroomMrs_WhiteCandlestick

  componentDidMount() {}

  updateNotePadInternal(list_name) {
    console.log("outside list name: " + list_name);
  }

  renderSquare(i) {
    return (
      <Square
        value={i}
        // onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderNotepadList() {
    let notepadName = [];
    notepadName.push(
      <div>
        <tr>
          <td>Miss_Scarlet</td>
          <td>{this.state.Miss_Scarlet}</td>
        </tr>
        <tr>
          <td>Mr_Green</td>
          <td>{this.state.Mr_Green}</td>
        </tr>
        <tr>
          <td>Mrs_Peacock</td>
          <td>{this.state.Mrs_Peacock}</td>
        </tr>
        <tr>
          <td>Prof_Plum</td>
          <td>{this.state.Prof_Plum}</td>
        </tr>
        <tr>
          <td>Col_Mustard</td>
          <td>{this.state.Col_Mustard}</td>
        </tr>
        <tr>
          <td>Mrs_White</td>
          <td>{this.state.Mrs_White}</td>
        </tr>
        <tr>
          <td>Study</td>
          <td>{this.state.Study}</td>
        </tr>
        <tr>
          <td>Hall</td>
          <td>{this.state.Hall}</td>
        </tr>
        <tr>
          <td>Lounge</td>
          <td>{this.state.Lounge}</td>
        </tr>
        <tr>
          <td>Billiard_Room</td>
          <td>{this.state.Billiard_Room}</td>
        </tr>
        <tr>
          <td>Dining_Room</td>
          <td>{this.state.Dining_Room}</td>
        </tr>
        <tr>
          <td>Ballroom</td>
          <td>{this.state.Ballroom}</td>
        </tr>
        <tr>
          <td>Kitchen</td>
          <td>{this.state.Kitchen}</td>
        </tr>
        <tr>
          <td>Library</td>
          <td>{this.state.Library}</td>
        </tr>
        <tr>
          <td>Conservatory</td>
          <td>{this.state.Conservatory}</td>
        </tr>
        <tr>
          <td>Wrench</td>
          <td>{this.state.Wrench}</td>
        </tr>
        <tr>
          <td>Lead Pipe</td>
          <td>{this.state.Lead_Pipe}</td>
        </tr>
        <tr>
          <td>Rope</td>
          <td>{this.state.Rope}</td>
        </tr>
        <tr>
          <td>Knife</td>
          <td>{this.state.Knife}</td>
        </tr>
        <tr>
          <td>Candlestick</td>
          <td>{this.state.Candlestick}</td>
        </tr>
        <tr>
          <td>Revolver</td>
          <td>{this.state.Revolver}</td>
        </tr>
      </div>
    );
    return notepadName;
  }

  renderActionButtons(props) {
    return (
      <div className="Move">
        <button className="run-btn" onClick={() => startGame()}>
          START_GAME
        </button>
        <button className="run-btn" onClick={() => endTurn()}>
          END_TURN
        </button>
        <button className="run-btn" onClick={() => movePlayerLocation("up")}>
          UP
        </button>
        <button className="run-btn" onClick={() => movePlayerLocation("down")}>
          DOWN
        </button>
        <button className="run-btn" onClick={() => movePlayerLocation("left")}>
          LEFT
        </button>
        <button className="run-btn" onClick={() => movePlayerLocation("right")}>
          RIGHT
        </button>
        <button
          className="run-btn"
          onClick={() => movePlayerLocation("secret")}
        >
          SECRET
        </button>
      </div>
    );
  }

  renderNameForm(i) {
    return <NameForm value={i} />;
  }

  renderAccusationForm(i) {
    return <AccusationForm value={i} />;
  }

  render() {
    return (
      <div className="container-flex">
        <div className="player-action">
          <div className="game-title">Player Action</div>
          {this.renderActionButtons()}
          <div className="suggestion-form">
            {this.renderNameForm("Suggestion Form")}
          </div>
          <div className="accusation-form">
            {this.renderAccusationForm("Accusation Form")}
          </div>
        </div>

        <CommonGround />

        <div className="personal-notebook">
          <div className="game-title">Personal Notebook</div>
          <table>{this.renderNotepadList()}</table>
        </div>
        <div className = "home-square">
          {renderSquare("Home [-1, -1]")}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      xIsNext: true,
      computer_db_status: "",
      miss_scarlet_db_status: "",
      col_mustard_db_status: "",
      mrs_white_db_status: "",
      mr_green_db_status: "",
      mrs_peacock_db_status: "",
      prof_plum_db_status: "",
      player_location_status: "",
      status: "",
      endpoint: "https://jumpy-thing.glitch.me/",
      timestamp: "no timestamp yet",
      player_data: "no data yet",
      canMoveId: "",
      turn: "",
      all_player_locations: "",
      accusationResult: "",
      suggestionResult: ""
    };
    //socket = socketIOClient(this.state.endpoint);
    updatePlayerLocation((err, player_location_status) =>
      this.setState({
        player_location_status:
          "[" +
          player_location_status[0] +
          "," +
          player_location_status[1] +
          "]"
      })
    );
    updatePlayerCharacter((err, player_data) =>
      this.setState({
        player_data
      })
    ); 
    updateTurn((err, turn) =>
      this.setState({
        turn
      })
    );
    updateAllPlayerLocations((err, all_player_locations) =>
      this.setState({
        all_player_locations
      })
    );
    updateAccusationResult((err, accusationResult) =>
      this.setState({
        accusationResult
      })
    );
    updateSuggestionResult((err, suggestionResult) =>
      this.setState({
        suggestionResult
      })
    );
  }

  //https://alligator.io/react/axios-react/
  componentDidMount() {
    console.log("Game component did mount");
    /*
    Axios.get("/get_db").then(res => {
      const computer_db_status = JSON.stringify(res.data);
      this.setState({ computer_db_status });
    });

    Axios.get("/endGame?player_id=0").then(res => {
      const status = JSON.stringify(res.data);
      this.setState({ status });
    });*/
  }

  handleClick(i) {
    //TODO
  }


  render() {
    console.log("rendering Game Class");
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{this.state.status}</div>
        </div>
        <div className="App">
          <p className="App-intro">
            You are assigned this character: {this.state.player_data} @ this
            location: {this.state.player_location_status}
          </p>
          <p className="App-intro">{this.state.turn}</p>
          <p className="App-intro">
            ACCUSATION RESULT: {this.state.accusationResult}
          </p>
          <p className="App-intro">
            SUGGESTION RESULT: {this.state.suggestionResult}
          </p>
        </div>
      </div>
    );
  }
}

// ========================================
// IN THE REACT HTML MAKE SURE NOT TO PASS OBJECTS E.G. STRINGIFY THEM https://stackoverflow.com/questions/33117449/invariant-violation-objects-are-not-valid-as-a-react-child-->

//TODO: HOW TO SHOW LOCATION?

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

module.exports = Game;
