var model = (function(){
 
// the initial data 
/**
 * @desc the game state two arrays of elements, a snake and food array, initialized as empty
 */
  var state = {
              snake:  [],
              food: []
  };
/**
 * @desc the games stats
 * played {number} initialized at 0
 * wins {number} initialized at 0
 */ 
  var stats = {
    played: 0, 
    wins: 0 
  };
  
  //public api
  return {
      state: state,
      stats: stats
  };

}());