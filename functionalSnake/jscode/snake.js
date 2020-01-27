"use strict";

/**
 * @module snake
 * @desc the controller for the snake game.
 */
var snake = (function() {

const R = 10,
      STEP = 2 * R,
      // bewegingsrichtingen
      LEFT = "left",              
      RIGHT = "right",
      UP = "up",
      DOWN = "down",
    
      // aantal voedselelementen
      NUMFOODS = 5,               
      // kleuren
      SNAKE = "DarkRed",          
      FOOD = "Olive",             
      HEAD = "DarkOrange";        
      //spel dimensies
const WIDTH = $("#mySnakeCanvas").width();
const HEIGHT = $("#mySnakeCanvas").height();
const minX = R;
const minY = R;
const maxX = WIDTH - R;
const maxY = HEIGHT - R;
      
var id;

/**
 * @function init
 * @desc creëer een slang, genereer voedsel, en teken alles
 */
function init() {
    model.state.snake = createSnake();
    model.state.food = createFoods(NUMFOODS,[]);
    draw();
}

/**
 * @function stop
 * @desc Laat slang en voedsel verdwijnen, en teken leeg veld (verwijder alle elementen)
 */
function stop() {
    model.state.food = [];
    model.state.snake = [];
    updatePoints(0);
    clearInterval(id);
    $("#mySnakeCanvas").clearCanvas();
}

/**
 * @function save 
 * @desc saves an existing game 
 */
function save() {
    game.save(model.state);
    stop();
    }

/**
 * @function load 
 * @desc loads a saved game 
 */
function load() {
    game.load();
    draw();
    }

/**
 * @function stats
 * @desc updates the view with the stats
 */
function stats() {
    $("#statssheet").html("Played: " + game.stats().played + ", Wins: " +  game.stats().wins + ", Losses: " + (game.stats().played - game.stats().wins) );
}
/**
 * @function draw
 * @desc Teken de slang en het voedsel
 */
function draw() {
    var canvas = $("#mySnakeCanvas").clearCanvas();
    model.state.snake.forEach(seg => drawElement(seg, canvas));
    model.state.food.forEach(bite => drawElement(bite, canvas));
}

/**
 * @function arrowKeyMove
 * @desc Verandert de richting van de slang aan de hand van toetsenbordinteracties (UP/DOWN/RIGHT/LEFT)
 * @param { event } event a keyboardEvent
 */
 function arrowKeyMove(event) {
        switch(event.key) {
            case "ArrowLeft": // left
                clearInterval(id); // clearInterval moet hier staan anders stopt de slang als een andere gedrukt wordt
                id = setInterval(move, $("#myRange").val(), LEFT);
                break;
            case "ArrowUp": // up
                clearInterval(id);
                id = setInterval(move, $("#myRange").val(), UP);
                break;
            case "ArrowRight": // right
                clearInterval(id);
                id = setInterval(move, $("#myRange").val(), RIGHT);
                break;
            case "ArrowDown": // down
                clearInterval(id);
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
          return head().y >= minY + STEP;
        case DOWN:
          return head().y <= maxY - STEP;
        case LEFT:
          return head().x >= minX + STEP;
        case RIGHT:
          return head().x <= maxX - STEP;
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
 * - 5: teken de verandering
 *
 * @param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT) waar naar toe bewogen wordt
 */
function doMove(direction) {
    var newHead = moveTo(direction);
    if (collidesWithOneOf(newHead, model.state.snake)) {
        clearInterval(id);
        game.result(false);
        console.log("VERLOREN!!!");
         $("#winlose").html("You've lossed the game");
        stats();
    }
    else {
        if (!(collidesWithOneOf(newHead, model.state.food))) {
            model.state.snake = model.state.snake.slice(1,model.state.snake.length);
        }
        else {
            eat(newHead.x, newHead.y);
            updatePoints(NUMFOODS*1000-model.state.food.length*1000);
            if (model.state.food.length === 0) {
                clearInterval(id);
                game.result(true);
                console.log("GEWONNEN!!!");
                $("#winlose").html("You're a winner darling!");
                stats();
            }
        }
    }
    head().color=SNAKE;
    model.state.snake = model.state.snake.concat(newHead);
    draw();
}

/**
 * @function eat
 * @desc verwijder food met deze (x,y)- coordinaten uit state.food
 * @param {number} x x-coördinaat middelpunt
 * @param {number} y y-coördinaat middelpunt
 */
function eat(x,y) {
    model.state.food = model.state.food.filter(food => !(food.x === x && food.y === y));
}

/**
 * @function head
 * @desc methode om het head segment op te vragen van Snake
 *
 * @param {Element[]} snake een collectie van elementen
 * @return {Element} het head segment
 */
 function head() { return model.state.snake[model.state.snake.length-1]; }

 /**
  *@function moveTo
  *@desc Maakt een nieuw element op de volgende locatie in de aangegeven richting
  *
  *@param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
  *
  *@return {Element} nieuw element
  */
function moveTo(direction) {
  switch(direction) {
      case UP:
        return { radius: R, x: head().x, y: head().y - STEP, color: HEAD };
      case DOWN:
        return { radius: R, x: head().x, y: head().y + STEP, color: HEAD };
      case LEFT:
        return { radius: R, x: head().x - STEP, y: head().y, color: HEAD };
      case RIGHT:
        return { radius: R, x: head().x + STEP, y: head().y, color: HEAD };
    };
}

/**
 * @function updatePoints
 * @desc Stuurt een update naar de score (punten) van de game
 */
function updatePoints(points){
    $("#score").html("Score: " + points);
}


/**
 * @function collidesWithOneOf
 * @desc controleert of één van de elementen dezelfde (x,y)-coordinaten heeft als element waarop de functie wordt aangeroepen.
 *
 * @param {Element} el een element
 * @param {Element[]} elements een array van Element-objecten
 *
 * @return {boolean} false als geen collisions, anders true
 *
 */
function collidesWithOneOf(el, elements) { return elements.map(element => el.x === element.x && el.y === element.y).some(bool => bool===true); }

/**
 * @function createElement
 * @desc Maakt een element aan
 *
 * @param {number} r radius van het element
 * @param {number} xcor x-coördinaat van het element
 * @param {number} ycor y-coördinaat van het element
 * @param {color } col de kleur van het element
 *
 * @return {Element}
 */
function createElement(r, xcor, ycor, col) {
    return { radius: r, x: xcor, y: ycor, color: col }
}

/**
 * @function createSnake
 * @desc Maakt een slang aan op de startpositie
 *
 * @return {Element[]} de slang
 */
function createSnake(){
    return [createElement(R, WIDTH/2 + R, HEIGHT/2 + R, SNAKE), createElement(R, WIDTH/2 + R, HEIGHT/2 - R, HEAD)];
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
        var food =  createElement(R, R + getRandomInt(0, (WIDTH / STEP-1)) * STEP, R + getRandomInt(0, (WIDTH / STEP-1)) * STEP, FOOD);
        if (!collidesWithOneOf(food, model.state.snake) && !collidesWithOneOf(food, foods)) {
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

return { 
    init: init,
    stop: stop,
    load: load,
    save: save,
    arrowKeyMove: arrowKeyMove
};

}());

$(document).ready(() => {
    $("#startSnake").click(snake.init);
    $("#stopSnake").click(snake.stop);
    $("#loadSnake").click(snake.load)
    $("#saveSnake").click(snake.save);
    $(document).keydown(snake.arrowKeyMove);
    
});