/*
 * Achtergrond: in principe worden bij het opslaan van een spel twee lijstjes opgeslagen in meer zijn we niet geinteresseerd
 * We slaan een algabreisch data type op van de vorm:
 *
 * { 
 *    segments: segments, //lijstje 1
 *    food: food          //lijstje 2
 * }
 * Bij het laden wordt die ADT geladen.
 * Dit is geen object het bestaat niet buiten de opslag (in dit geval binnen SavedGames)
 * 
 * win() en lose() zijn a priori dezelfde functie beiden verhogen ze het aantal gespeelde spellen win verhoogt ook nog het aantal gewonnen spellen 
 * het aantal verloren spellen is niet meer dan het aantal gespeelde spellen min het aantal gewonnen spellen 
 * 
 * saveToServer kan ook gebruikt worden om het resultaat op te slaan maar moet je de URL als argument meegeven ipv die van de server te gebruiken 
 */
var game = ( function() {
    
   const GAME_URL = "http://localhost/game/snake";
   const RESULT_URL = "http://verzintwat";
    
   var SavedGames = [];//testing purposes 
   var GWL = [{played: 0, wins: 0}];
   
    
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
 * @param { ADT } sg a saved game
 */
 function saveToServer(url, sg) {
     $.ajax(url,
        {
            type: "POST",
            username: Server.user,
            password: Server.password,
            data: JSON.stringify(sg)  //JSON.stringify(game.saved[0]) -> "{\"segments\":[{\"radius\":10,\"x\":330,\"y\":150,\"color\":\"DarkRed\"},{\"radius\":10,\"x\":330,\"y\":170,\"color\":\"DarkRed\"},{\"radius\":10,\"x\":330,\"y\":190,\"color\":\"DarkRed\"},{\"radius\":10,\"x\":330,\"y\":210,\"color\":\"DarkOrange\"}],\"food\":[{\"radius\":10,\"x\":130,\"y\":10,\"color\":\"Olive\"},{\"radius\":10,\"x\":190,\"y\":350,\"color\":\"Olive\"},{\"radius\":10,\"x\":330,\"y\":350,\"color\":\"Olive\"}]}"
        });
 }
/**
 * @function retrieveGameFromServer
 * @desc retrieves a string from the server
 * 
 * @param { String } user, the user name
 * @param { String } password
 * @return { Object } JSON
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
  * @param {Element[]} snake de slang
  * @param {Element[]} food het voedsel
  */
 function save(snake, food){
    SavedGames.push({segments: snake.segments, food: food}); //for testing purposes
    saveToServer(GAME_URL,{segments: snake.segments, food: food}); // mock representation
 }
/**
 * @function load
 * @desc loads an existing game, for this mockup the last saved game.
 */
 function load(){
    //snake = new Snake(retrieveFromServer().segments);
    //foods = retrieveFromServer().food;
    $("#mySnakeCanvas").clearCanvas();
    snake = new Snake(SavedGames[SavedGames.length-1].segments); // this is snake from snake.js
    foods = SavedGames[SavedGames.length-1].food;                // ditto 
    draw();
 }
 
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


 // public api 
 return {
     save: save,
     load: load, 
     result: result,
     gwl: GWL //voor testen 
 };
 
}() );
