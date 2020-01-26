"use strict";
// game module
var game = (function () {

   const GAME_URL = "http://localhost/game/snake";
   const RESULT_URL = "http://verzinwat";
   const USE_SERVER = false;
   var SavedGames = [];//testing purposes {snake: [], food: []}
   var GWL = [{ played: 0, wins: 0 }]; // list with a stats ADT (games, wins, & (derivable) losses)

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
    * @desc Stuurt het spel op naar de server voor opslag
    *
    * @param {String} url een server URL
    * @param { Object } state een object literal
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
   * @function saveGameToServer
   * @desc Stuurt het spel op naar localStorage voor opslag
   *
   * @param { Object } state een object literal
   */
   function saveToLocalStorage(adt) {
      localStorage.setItem("game", JSON.stringify(adt));
   }

   /**
    * @function retrieveGameFromServer
    * @desc Haalt het spel op van de server
    * 
    * @param { string } url de server URL
    * @param { string } user de gebruikersnaam
    * @param { string } password het wachtwoord van de gebruiker
    * @return { Object } een object literal
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
    */
   function retrieveFromLocalStorage() {
      return JSON.parse(localStorage.getItem("game"));
   }

   /** 
    * @function save
    * @desc Slaat een spel op
    *
    * @param {state} snake de slang
    */
   function save(state) {
      SavedGames.push({ snake: state.snake, food: state.food }) //for testing purposes so no concat
      if (USE_SERVER) {
         saveToServer(GAME_URL, state); // mock representation
      } else {
         saveToLocalStorage(state);
      }

   }
   /**
    * @function load
    * @desc Laadt een voorheen opgeslagen spel
    */
   function load() {
      state.snake = SavedGames[SavedGames.length - 1].snake;
      state.food = SavedGames[SavedGames.length - 1].food;
   }

   /**
    * @function result
    * @desc Stuurt een update naar de server (of localStorage) met de status van het laatstgespeelde spel (gewonnen of verloren).
    * 
    * @param {boolean} bool true als de game is gewonnen, anders false.
    */
   function result(bool) {
      if (bool) {
         GWL.push({ played: 1 + GWL[0].played, wins: 1 + GWL[0].wins });
         if (USE_SERVER) {
            saveToServer(RESULT_URL, { played: 1 + GWL[0].played, wins: 1 + GWL[0].wins }); // mock representation
         } else {
            saveToLocalStorage({ played: 1 + GWL[0].played, wins: 1 + GWL[0].wins });
         }
         console.log("GEWONNEN!!!");
      }
      else {
         GWL.push({ played: 1 + GWL[0].played, wins: GWL[0].wins });
         if (USE_SERVER) {
            saveToServer(RESULT_URL, { played: 1 + GWL[0].played, wins: GWL[0].wins }); // mock representation
         } else {
            saveToLocalStorage({ played: 1 + GWL[0].played, wins: GWL[0].wins });
         }
         console.log("VERLOREN!!!");
      }
      GWL.shift();//keeping one ADT in my list
   }
   /**
    * @function stats
    * @desc Haalt de GWL op voor indirecte toegang tot GWL.
    */
   function stats() { return GWL; }


   // public api 
   return {
      save: save,
      load: load,
      result: result,
      stats: stats
   };
}());
