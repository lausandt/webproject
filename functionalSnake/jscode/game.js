"use strict";
/**
 * @module game
 * @desc module om opslag en retrieval te faciliteren
 */
var game = (function () {
    
  const GAME_URL = "http://localhost/game/snake";
  const RESULT_URL = "http://verzinwat";
  const USE_SERVER = false;

   
  const Server = {
    user: "user",                                 // Username voor onze "server"
    password: "password"                          // Wachtwoord voor onze "server"
  };


   
   /**
    * @function saveGameToServer
    * @desc Stuurt het spel op naar de server voor opslag
    *
    * @param {String} url een server URL
    * @param { state } state een object literal
    */
   function saveToServer(url, state) {
      $.ajax(url,
         {
            type: "POST",
            username: Server.user,
            password: Server.password,
            data: JSON.stringify(state)
         });
   }

   /**
   * @function saveGameToServer
   * @desc Stuurt het spel op naar localStorage voor opslag
   *
   * @param {string} arg the key for storage and retrieval
   * @param { Object } state een object literal
   */
   function saveToLocalStorage(arg, state) {
      localStorage.setItem(arg, JSON.stringify(state));
   }

   /**
    * @function retrieveGameFromServer
    * @desc Haalt het spel op van de server
    * 
    * @param { string } url de server URL
    * @param { string } user de gebruikersnaam
    * @param { string } password het wachtwoord van de gebruiker
    * @return { state } state de opgeslagen staat van het spel
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
    * @function retrieveFromLocalStorage
    * @desc Haalt het spel uit localStorage
    *
    * @param {string} arg the key for storage and retrieval
    * @return { state } state de opgeslagen staat van het spel 
    */
   function retrieveFromLocalStorage(arg) {
      return JSON.parse(localStorage.getItem(arg));
   }

   /** 
    * @public
    * @function save
    * @desc Slaat een spel op
    *
    * @param {state} state de staat van het spel
    */
   function save(state) {
       if (USE_SERVER) {
         saveToServer(GAME_URL, state); // mock representation
      } else {
         saveToLocalStorage("game", state);
      }

   }
   /**
    * @public
    * @function load
    * @desc Laadt een opgeslagen spel
    */
   function load() {
     if (USE_SERVER) { // mock representation
         model.state.snake = retrieveFromServer(GAME_URL, user, password).snake; 
         model.state.food = retrieveFromServer(GAME_URL, user, password).food;
      } 
     else {
        model.state.snake = retrieveFromLocalStorage("game").snake;
        model.state.food = retrieveFromLocalStorage("game").food;
     }  
   }

   /**
    * @public
    * @function result
    * @desc Stuurt een update naar de server (of localStorage) met de status van het laatstgespeelde spel (gewonnen of verloren).
    * 
    * @param {boolean} bool true als de game is gewonnen, anders false.
    */
   function result(bool) {
      if (bool) {
         if (USE_SERVER) {
            saveToServer(RESULT_URL, { played: 1 + stats().played, wins: 1 + stats().wins}); // mock representation
         } else {
            saveToLocalStorage("stats", { played: 1 + stats().played, wins: 1 + stats().wins});
         }
      }
      else {
         if (USE_SERVER) {
            saveToServer(RESULT_URL, { played: 1 + stats().played, wins: stats().played }); // mock representation
         } else {
            saveToLocalStorage("stats", { played: 1 + stats().played, wins: stats().wins });
         }
      }
   }
   
   /**
    * @public
    * @function stats
    * @desc haalt de statistieken op
    */
   function stats() { return retrieveFromLocalStorage("stats"); }
   
   /**
    * @function initStats
    * @desc stores the initial stats
    */
   function initStats(stats){
       if (USE_SERVER) {
            saveToServer(RESULT_URL, stats); // mock representation
         } 
       else {
            saveToLocalStorage("stats", stats);
         }
   }


   // public api 
   return {
      save: save,
      load: load,
      result: result,
      stats: stats,
      initStats: initStats
   };
}());