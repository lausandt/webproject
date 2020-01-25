// state based snake 
 
var id;
var state = { 
              snake:  [] , 
              food: [] 
};

/**
 * @function init
 * @desc creëer een slang, genereer voedsel, en teken alles
 */
function init() {
    state.snake = createSnake();
    state.food = createFoods(5,[]);
    draw();
}

/**
 * @function stop
 * @desc Laat slang en voedsel verdwijnen, en teken leeg veld (verwijder alle elementen)
 */
function stop() {
    state.food = [];
    state.snake = [];
    updatePoints(0);
    clearInterval(id);
    $("#mySnakeCanvas").clearCanvas();
}

function save() { 
    game.save(state); 
    stop();
    } 

function load() { 
    game.load();
    draw();    
    }

function stats() {
    $("#statssheet").html("Played: " + game.stats()[0].played + ", Wins: " +  game.stats()[0].wins + ", Losses: " + (game.stats()[0].played - game.stats()[0].wins) );
} 
/**
 * @function draw
 * @desc Teken de slang en het voedsel
 */
function draw() {
    var canvas = $("#mySnakeCanvas").clearCanvas();
    state.snake.forEach(seg => drawElement(seg, canvas));
    state.food.forEach(bite => drawElement(bite, canvas));
}

/**
 * @function arrowKeyMove
 * @desc an eventhandler that makes a move if one of the arrow keys is pressed
 * @param { event } event a keyboardEvent
 */
 function arrowKeyMove(event) {
        
        switch(event.key) {
            case "ArrowLeft": // left
                clearInterval(id); // is getest en noodzakelijk
                id = setInterval(move, $("#myRange").val(), LEFT);
                break;
            case "ArrowUp": // up
                clearInterval(id); // is getest en noodzakelijk
                id = setInterval(move, $("#myRange").val(), UP);
                break;
            case "ArrowRight": // right
                clearInterval(id); // is getest en noodzakelijk
                id = setInterval(move, $("#myRange").val(), RIGHT);
                break;
            case "ArrowDown": // down
                clearInterval(id); // is getest en noodzakelijk
                id = setInterval(move, $("#myRange").val(), DOWN);
                break;
            default: return; // exit this handler for other keys
        }
        event.preventDefault(); // prevent the default action (scroll / move caret)
 }
/**
 * @function move
 * @desc Beweeg slang in aangegeven richting tenzij slang uit canvas zou verdwijnen
 *
 * @param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
 */
function move(direction) {
    if (canMove(direction)) {
        doMove(direction);
    } else {
        console.log("snake cannot move " + direction);
    }
}

/**
 * @function canMove
 * @desc methode van Snake geeft aan of deze (head) in de aangegeven richting kan bewegen
 *
 * @param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
 *
 * @return {boolean} true if the head of snake can move, false otherwise  
 */

function canMove(direction) {
    switch(direction) {
        case UP:
          return head().y >= PlayAreaLimits.minY + STEP;
        case DOWN:
          return head().y <= PlayAreaLimits.maxY - STEP;
        case LEFT:
          return head().x >= PlayAreaLimits.minX + STEP;
        case RIGHT:
          return head().x <= PlayAreaLimits.maxX - STEP;
        default:
            return false;
    };
}


/**
 * @function doMove
 * @desc methode van Snake, beweegt de slang over het veld en eet het food volgens het onderstaande algoritme:
 * 
 * - 1: creëer een nieuwe head -> moveTo 
 * - 2: Case 1: Het veld waar naar toe bewogen wordt is vrij -> slice
 *      Case 2: Het veld waar naar toe bewogen wordt is bevat food -> eat
 * - 3: kleur de huidige kop van de slang als de rest 
 * - 4: voeg de nieuwe head toe -> concat
 *
 * @param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT) waar naar toe bewogen wordt 
 */
function doMove(direction) {
    var newHead = moveTo(direction);
    if (collidesWithOneOf(newHead, state.snake)) { 
        clearInterval(id);
        game.result(false);
        stats();
        alert("You've lossed the game");
    }
    else { 
        if (!(collidesWithOneOf(newHead, state.food))) { 
            state.snake = state.snake.slice(1,state.snake.length);
        }
        else {
            eat(newHead.x, newHead.y);
            updatePoints(NUMFOODS*1000-state.food.length*1000);
            if (state.food.length === 0) {
                clearInterval(id);
                game.result(true);
                stats();
                alert("You're a winner darling!");
            }
        }
    }
    head().color=SNAKE;
    state.snake = state.snake.concat(newHead); 
    draw();
  
}  

/**
 * @function eat
 * @desc verwijder food met deze (x,y)- coordinaten uit state.food
 * @param {number} x x-coördinaat middelpunt
 * @param {number} y y-coördinaat middelpunt
 */
function eat(x,y) {
    state.food = state.food.filter(food => !(food.x === x && food.y === y));
}    

/**
 * @function head
 * @desc methode om het head segment op te vragen van Snake
 *
 * @param {Element[]} snake een collectie van elementen
 * @return {Element} het head segment
 */
 function head() { return state.snake[state.snake.length-1]; }

 /**
  *@function moveTo
  *@desc creates a new element at the desired position
  *
  *@param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
  * 
  *@return {Element} nieuw element
  */
function moveTo(direction) { 
  switch(direction) {
      case UP:
        return { radius: R, x: head().x, y: head().y - STEP, color: HEAD };
        break;
      case DOWN:
        return { radius: R, x: head().x, y: head().y + STEP, color: HEAD };
        break;
      case LEFT:
        return { radius: R, x: head().x - STEP, y: head().y, color: HEAD };
        break;
      case RIGHT:
        return { radius: R, x: head().x + STEP, y: head().y, color: HEAD };
        break;       
    };  
} 

/**
 * @function updatePoints
 * @desc updates the points won in the game
 */
function updatePoints(points){
    $("#score").html("Score: " + points);
}

/**
 * @function collidesWithOneOf
 * @desc controleert of één van de elementen dezelfde (x,y)-coordinaten heeft als element waarop de functie wordt aangeroepen.
 *
 * @param {Element} el een element
 * @param {Element[]} elements een Array van elementen objecten
 *
 * @return {boolean} false if there are no collisions, true otherwise 
 *
 */
function collidesWithOneOf(el, elements) { return elements.map(element => el.x === element.x && el.y === element.y).some(bool => bool===true); }

/**
 * @function createElement 
 * @desc creates an element
 * 
 * @param {number} r radius of the element
 * @param {number} xcor x-coordinate of the element
 * @param {number} ycor y-coordinate of the element 
 * @param {color } col the color of the element 
 *
 * @return {Element}  
 */
function createElement(r, xcor, ycor, col) {
    return { radius: r, x: xcor, y: ycor, color: col }
}

/**
 * @function createSnake 
 * @desc creates a snake which ois defined as an array of adjacent elements of a particular color
 *
 * @return {Element[]} the snake
 */
function createSnake(){
    return [createElement(R, PlayArea.width/2 + R, PlayArea.height/2 + R, SNAKE), createElement(R, PlayArea.width/2 + R, PlayArea.height/2 - R, HEAD)];
}

/**
 * @function getRandomInt helper functie
 * @desc creëren van random geheel getal in de interval [min, max] 
 *
 * @param {number} min een geheel getal als onderste grenswaarde
 * @param {number} max een geheel getal als bovenste grenswaarde (max > min)
 *
 * @return {number} een random geheel getal x waarvoor geldt: min <= x <= max
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @function createFoods
 * @desc creëert random voedsel elementen 
 *
 *@param {number} num het aantal voedsel elementen 
 *@param {array } foods een accumulator initieel leeg
 * 
 * @return {Element[]} foods een array van voedsel elementen 
 */
function createFoods(num, foods) { 
    //base case
    if (num === 0 ) { return foods; }
    // recursive step 
    else {
        var food =  createElement(R, R + getRandomInt(0, (PlayArea.width / STEP-1)) * STEP, R + getRandomInt(0, (PlayArea.width / STEP-1)) * STEP, "Olive");
        if (!collidesWithOneOf(food, state.snake) && !collidesWithOneOf(food, foods)) {
            foods = foods.concat(food);
            return createFoods(num-1, foods);
        }
        else { 
            return createFoods(num, foods);
        }
    }
}

/**
 * @function drawElement
 * @desc Een voedsel of snake element tekenen 
 *
 * @param {Element} element een element object (food/snake)
 * @param {canvas} dom object canvas (is het tekenveld)
 */
function drawElement(element, canvas) {
    canvas.drawArc({
        draggable: false,
        fillStyle: element.color,
        x: element.x,
        y: element.y,
        radius: element.radius
    });
}

$(document).ready(() => {
    $("#startSnake").click(init);
    $("#stopSnake").click(stop);
    $("#loadSnake").click(load)
    $("#saveSnake").click(save);
    $(document).keydown(arrowKeyMove);
});



