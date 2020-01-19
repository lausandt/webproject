"use strict";

const 
    R = 10,                     // straal van een element
    STEP = 2 * R,               // stapgrootte
    WIDTH = 360,                // breedte veld
    HEIGHT = 360,               // hoogte veld
                                // er moet gelden: WIDTH = HEIGHT
    MAX = WIDTH / STEP - 1,     // netto veldbreedte
    LEFT = "left",              // bewegingsrichtingen
    RIGHT = "right",
    UP = "up",
    DOWN = "down",

    NUMFOODS = 5,               // aantal voedselelementen

    XMIN = R,                   // minimale x waarde
    YMIN = R,                   // minimale y waarde
    XMAX = WIDTH - R,           // maximale x waarde
    YMAX = HEIGHT - R,          // maximale y waarde

    SNAKE = "DarkRed",          // kleur van een slangsegment
    FOOD = "Olive",             // kleur van voedsel
    HEAD = "DarkOrange",        // kleur van de kop van de slang

    SERVER_URL = "http://localhost/game/snake",
    USE_SERVER = false,         // Maken we gebruik van de server (==true) of localstorage (==false) voor opslag van game?
    USER = "user",              // Username voor onze "server"
    PASSWORD = "password";      // Wachtwoord voor onze "server"

var snake,
    id,
    points = 0,
    foods = [];                 // voedsel voor de slang

var game = new Game();          // Bijhouden welke game dit is en wat de score is.

$(document).ready(function() {
    $("#startSnake").click(init);
    $("#stopSnake").click(stop);
    $(document).keydown(arrowKeyMove);
    $("#saveGame").click(function() {
        game.save();
    });
    $("#loadGame").click(function() {
        game.load();
    });
});


/***************************************************************************
 **                 Commando's voor de gebruiker                          **
 ***************************************************************************/
/**
 * @function init
 * @desc Haal eventueel bestaand voedsel en een bestaande slang weg, creëer een slang, genereer voedsel, en teken alles
 */
function init() {
    stop();
    createStartSnake();
    createFoods();
    draw();
    game.plays++;
    game.update();
}

/**
 * @function stop
 * @desc Laat slang en voedsel verdwijnen, en teken leeg veld (verwijder alle elementen)
 */
function stop() {
    snake = null;
    foods = [];
    points = 0;
    updatePoints();
    $("#mySnakeCanvas").clearCanvas();
}
/**
 * @function arrowKeyMove
 * @desc an eventhandler that makes a move if one of the arrow keys is pressed
 * @param { event } event a keyboardEvent
 */
 function arrowKeyMove(event) { 
    clearInterval(id); // is getest en noodzakelijk 
    switch(event.key) {
        case "ArrowLeft": // left
            id = setInterval(move, $("#myRange").val(), snake, LEFT);
            break;
        case "ArrowUp": // up
            id = setInterval(move, $("#myRange").val(), snake, UP);
            break;
        case "ArrowRight": // right
            id = setInterval(move, $("#myRange").val(), snake, RIGHT);
            break;
        case "ArrowDown": // down
            id = setInterval(move, $("#myRange").val(), snake, DOWN);
            break;
        default: return; // exit this handler for other keys
    }
    event.preventDefault(); // prevent the default action (scroll / move caret)
 }
/**
 * @function move
 * @desc Beweeg slang in aangegeven richting tenzij slang uit canvas zou verdwijnen
 *
 * @param {Element[]} snake de slang
 * @param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
 */
function move(snake, direction) {
    if (canMove(snake, direction)) {
        doMove(snake, direction);
        draw();
    } else {
        console.log("snake cannot move " + direction);
    }
}

/**
 * @function draw
 * @desc Teken de slang en het voedsel
 */
function draw() {
    var canvas = $("#mySnakeCanvas").clearCanvas();
    snake.segments.forEach(seg => drawElement(seg, canvas));
    foods.forEach(bite => drawElement(bite, canvas));
}
/***************************************************************************
 **                 Constructors                                          **
 ***************************************************************************/

/**
 * @constructor Game
 * @desc creëert een spelobject waar we de naam, het aantal maal gespeeld, het aantal wins en het aantal losses in opslaan. 
 * Ook de naam van de speler slaan we op.
 */
 function Game() {
    this.name = "";
    this.plays = 0;
    this.wins = 0;
    this.losses = 0;
}

/**
 * @constructor Snake
 * @desc creëert een slang, Het laatste element van segments wordt de kop van de slang
 *
 * @param {Element[]} segments een array met aaneengesloten slangsegmenten
 */
function Snake(segments) {
    this.segments = segments;
    segments[segments.length-1].color=HEAD;
}

/**
 * @constructor Element
 * @desc creeert een element
 *
 * @param {number} radius straal van het element
 * @param {number} x x-coordinaat op het canvas
 * @param {number} y y-coordinaat op het canvas
 * @param {string} color kleur van het element
 */
function Element(radius, x, y, color) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = color;
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
 * @function canMove
 * @desc methode van Snake geeft aan of deze (head) in de aangegeven richting kan bewegen
 *
 * @param {Element[]} snake de slang
 * @param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
 *
 * @return {boolean} true if the head of snake can move, false otherwise  
 */

function canMove(snake, direction) {
    
    switch(direction) {
        case UP:
          return head(snake).y >= YMIN + STEP; 
        case DOWN:
          return head(snake).y <= ($("#mySnakeCanvas").height() - R) - STEP;
        case LEFT:
          return head(snake).x >= XMIN + STEP;
        case RIGHT:
          return head(snake).x <= ($("#mySnakeCanvas").width() - R) - STEP;
        default:
            return false;        
    };
}
/**
 * @function doMove
 * @desc methode van Snake, beweegt de slang over het veld en eet het food volgens het onderstaande algoritme:
 * 
 * - 1: creëer een nieuwe head -> moveTo 
 * - 2: Case 1: Het veld waar naar toe bewogen wordt is vrij -> shift
 *      Case 2: Het veld waar naar toe bewogen wordt is bevat food -> eat
 * - 3: kleur de huidige kop van de slang als de rest 
 * - 4: voeg de nieuwe head toe -> push
 * - 5: creëer een nieuw snake object -> Snake
 *
 * @param {Element[]} snake de slang
 * @param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT) waar naar toe bewogen wordt 
 */
function doMove(snake, direction) {
    var newHead = moveTo(head(snake), direction);
    if (collidesWithOneOf(newHead, snake.segments)) { 
        alert("LOOSER");
        //we probably want to call some function here
        clearInterval(id);
        }
    else { 
        if (!(collidesWithOneOf(newHead, foods))) { 
            snake.segments = snake.segments.slice(1,snake.segments.length); // instead of shift use slice which returns a new array 
            }
        else {
            eat(newHead.x, newHead.y);
            points = points + 1000;
            updatePoints();
            if (foods.length === 0) { 
                alert("WINNER"); 
                clearInterval(id);
                }
            }
    }
    head(snake).color=SNAKE;
    snake.segments = snake.segments.concat(newHead);  // use concat
    snake = new Snake(snake.segments);
    
}  
/**
 * @function updatePoints
 * @desc updates the points won in the game
 */
function updatePoints(){
    $(".score").html(points);
}


/**
 * @function head
 * @desc methode om het head segment op te vragen van Snake
 *
 * @param {Element[]} snake een collectie van elementen
 * @return {Element} het head segment
 */
 function head(snake) { return snake.segments[snake.segments.length-1]; }


 /**
  * @method lose
  * @desc methode die kan worden uitgevoerd als aan de voorwaarden voor het verliezen van het spel wordt voldaan.
  */
 Game.prototype.lose = function() {
    console.log("VERLOREN!!!");
    this.losses++;
    this.update();
    // Sla de spelstand ook op op de server
    this.save();
    // TODO: Stop de slang hier! Bv. snake.stop();
 }

 /**
  * @method win
  * @desc methode die kan worden uitgevoerd als aan de voorwaarden voor het winnen van het spel wordt voldaan.
  */
 Game.prototype.win = function() {
    console.log("GEWONNEN!!!");
    this.wins++;
    this.update();
    // Sla de spelstand ook op op de server
    this.save();
    // TODO: Stop de slang hier! Bv. snake.stop();
 }

 /**
  * @method update
  * @desc methode om het scorebord opnieuw te vullen met de nieuwste status
  */
 Game.prototype.update = function() {
    $("#gamesPlayed").text(game.plays);
    $("#gamesWon").text(game.wins);
    $("#gamesLost").text(game.losses);
 }

 /**
  * @method save
  * @desc methode om een spel op te slaan op basis van de naam van de speler.
  */
 Game.prototype.save = function() {
    this.name = $('#name').val();
    if(this.name === "") {
        this.name = prompt("Voer een naam in");
        $('#name').val(this.name);
    }
    if(USE_SERVER === true) {
        // Save game via Ajax
        $.ajax(SERVER_URL,
        {
            type: POST,
            username: USER,
            password: PASSWORD,
            data: JSON.stringify(this)
        }
    );
    } else {
        // Save game naar local storage
        localStorage.setItem(this.name, JSON.stringify(this));
    }
 }

 /**
  * @method load
  * @desc methode om een voorheen opgeslagen spel opnieuw in te laden op basis van de naam van de speler.
  */
 Game.prototype.load = function() {
    stop();
    this.name = $('#name').val();
    if(this.name === "") {
        this.name = prompt("Voer een naam in");
        $('#name').val(this.name);
    }
    var response;
    if(USE_SERVER === true) {
        // Laad game via Ajax
        response = JSON.parse($.ajax(SERVER_URL + "/" + this.name,
        {
            type: GET,
            username: USER,
            password: PASSWORD
        }
    ));
    } else {
        // Laad game uit local storage
        var foundItem = localStorage.getItem(this.name);
        if(foundItem !== null) {
            response = JSON.parse(foundItem);
        }
    }
    if(response !== undefined) {
        this.name = response.name;
        this.wins = response.wins;
        this.losses = response.losses;
        this.plays = response.plays;
        this.update();
    } else {
        alert("Geen opgeslagen spel gevonden voor de naam " + this.name);
    }
 }

/***************************************************************************
 **                 Hulpfuncties                                          **
 ***************************************************************************/

 /**
  *@function moveTo
  *@desc creates a new segment at the desired position
  *
  *@param {Element} head the head of the snake
  *@param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
  * 
  *@return {Element} nieuw segment
  */
function moveTo(head, direction) { 
  switch(direction) {
      case UP:
        return createSegment(head.x, head.y - STEP);
        break;
      case DOWN:
        return createSegment(head.x, head.y + STEP);
        break;
      case LEFT:
        return createSegment(head.x - STEP, head.y);
        break;
      case RIGHT:
        return createSegment(head.x + STEP, head.y);
        break;       
    };  
} 

/**
 * @function eat
 * @desc verwijder food met deze (x,y)- coordinaten uit var foods
 * @param {number} x x-coördinaat middelpunt
 * @param {number} y y-coördinaat middelpunt
 */
function eat(x,y) {
    foods = foods.filter(food => !(food.x === x && food.y === y));
}    

/**
 * @function createStartSnake
 * @desc Slang creëren, bestaande uit twee segmenten in het midden van het veld
 */
function createStartSnake() {
    snake = new Snake([createSegment(R + $("#mySnakeCanvas").width()/2, R + $("#mySnakeCanvas").width()/2), 
                   createSegment(R + $("#mySnakeCanvas").width()/2, $("#mySnakeCanvas").width()/2 - R)]);
}

/**
 * @function createSegment
 * @desc Slangsegment creeren op een bepaalde plaats
 *
 * @param {number} x x-coördinaat middelpunt
 * @param {number} y y-coördinaat middelpunt
 *
 * @return {Element} element object met straal R en color SNAKE
 */
function createSegment(x, y) {
    return new Element(R, x, y, SNAKE);
}
/**
 * @function createFood
 * @desc Voedselelement creëren op een bepaalde plaats
 *
 * @param {number} x x-coördinaat middelpunt
 * @param {number} y y-coördinaat middelpunt
 *
 * @return {Element} element object met straal R en color FOOD
 */
function createFood(x, y) {
    return new Element(R, x, y, FOOD);
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

/**
 * @function getRandomInt
 * @desc Creeren van random geheel getal in het interval [min, max] 
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
 * @desc pushed random verdeelde voedselelementen op var foods 
 */
function createFoods() {   
    var i, food;
    i = 0;
    //we gebruiken een while omdat we, om een arraymethode te gebruiken, eerst een nieuw array zouden moeten creëren (met NUMFOODS elementen)
    while (i < NUMFOODS) {
        food = createFood(XMIN + getRandomInt(0, ($("#mySnakeCanvas").width()/ STEP-1)) * STEP, YMIN + getRandomInt(0, ($("#mySnakeCanvas").width()/ STEP-1)) * STEP); //MAX = WIDTH / STEP - 1
        if (!collidesWithOneOf(food, snake.segments) && !collidesWithOneOf(food, foods)) {
            foods.push(food);
            i += 1;
        }
    }
}