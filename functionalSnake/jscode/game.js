// game module
var game = ( function() {
    
   const GAME_URL = "http://localhost/game/snake";
   const RESULT_URL = "http://verzinwat"
    
   var SavedGames = [];//testing purposes {snake: [], food: []}
   var GWL = [{played: 0, wins: 0}]; // list with a stats ADT (games, wins, & (derivable) losses)
   
    
/**
 * @desc Bevat de gegevens zoals de URL, username en password van de server
 */
 const Server = {
    serverURL: "http://localhost/game/snake",
    user: "user",                                 // Username voor onze "server"
    password: "password"                          // Wachtwoord voor onze "server"
 };
   
/**
 * @function saveGameToServer 
 * @desc a function to store a saved game on a server
 * 
 * @param {String} url a server URL
 * @param { Object } state an object literal
 * 
 */
 function saveToServer(url, adt) {
     $.ajax(url,
        {
            type: "POST",
            username: Server.user,
            password: Server.password,
            data: JSON.stringify(adt)  
        });
 }
/**
 * @function retrieveGameFromServer
 * @desc retrieves a string from the server
 * 
 * @param { string } url the server URL
 * @param { string } user the user name
 * @param { string } password the password belonging with this user
 * @return { Object } JSON an an object literal
 */ 
 function retrieveFromServer(url, user, password) {
    return (JSON.parse($.ajax(url,
     {
            type: "GET",
            username: user,
            password: password
     })));
 }
 
 /** 
  * @function save
  * @desc saves a game
  *
  * @param {state} snake de slang
  */
 function save(state){
    SavedGames.push({snake: state.snake, food: state.food}) //for testing purposes so no concat
    saveToServer(GAME_URL,state); // mock representation
 }
/**
 * @function load
 * @desc loads an existing game, for this mockup the last saved game.
 */
 function load(){
    state.snake = SavedGames[SavedGames.length-1].snake;
    state.food = SavedGames[SavedGames.length-1].food;
 }

/**
 * @function result
 * @desc function that updates the stats ADT in both win and lose scenarios
 * 
 * @param {boolean} bool true if the game was won false otherwise.
 */
 function result(bool){
     if (bool) { 
        GWL.push({played: 1 + GWL[0].played, wins: 1 + GWL[0].wins});
        saveToServer(RESULT_URL,{played: 1 + GWL[0].played, wins: 1 + GWL[0].wins}); // mock representation
     }
     else { 
        GWL.push({played: 1 + GWL[0].played, wins: GWL[0].wins});
        saveToServer(RESULT_URL,{played: 1 + GWL[0].played, wins: GWL[0].wins}); // mock representation
     }
     GWL.shift();//keeping one ADT in my list 
 }
/**
 * @function stats 
 * @desc accessor function prevent direct access to the GWL datastructure
 */
 function stats() { return GWL; } 


 // public api 
 return {
     save: save,
     load: load, 
     result: result,
     stats: stats
 };
 
}() );
