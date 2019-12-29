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

    NUMFOODS = 15,              // aantal voedselelementen

    XMIN = R,                   // minimale x waarde
    YMIN = R,                   // minimale y waarde
    XMAX = WIDTH - R,           // maximale x waarde
    YMAX = HEIGHT - R,          // maximale y waarde

    SNAKE = "DarkRed",          // kleur van een slangsegment
    FOOD = "Olive",             // kleur van voedsel
    HEAD = "DarkOrange";        // kleur van de kop van de slang

var snake,
    foods = [];                 // voedsel voor de slang

$(document).ready(function() {
	$("#startSnake").click(init);  
	$("#stopSnake").click(stop);
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
}

/**
 * @function stop
 * @desc Laat slang en voedsel verdwijnen, en teken leeg veld (verwijder alle elementen)
 */
function stop() {
    snake = null;
    foods = [];
    $("#mySnakeCanvas").clearCanvas();
}

/**
 * @function move
 * @desc Beweeg slang in aangegeven richting tenzij slang uit canvas zou verdwijnen
 *
 * @param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
 */
function move(direction) {
    if (snake.canMove(direction)) {
        snake.doMove(direction);
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
/***************************************************************************
 **                 Methoden                                              **
 ***************************************************************************/
/**
 * @method collidesWithOneOf
 * @desc controleert of één van de elementen dezelfde (x,y)-coordinaten heeft als element waarop de functie wordt aangeroepen.
 *
 * @param {Element[]} elements een Array van elementen objecten
 *
 * @return {boolean} false if there are no collisions, true otherwise 
 *
 */
Element.prototype.collidesWithOneOf = function (elements) {
    return elements.map(element => this.x === element.x && this.y === element.y).some(bool => bool===true);
};

/** 
 * @method canMove
 * @desc methode van Snake geeft aan of deze (head) in de aangegeven richting kan bewegen
 *
 * @param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
 *
 * @return {boolean} true if the head of snake can move, false otherwise  
 */

Snake.prototype.canMove = function(direction) {
    
    switch(direction) {
        case UP:
          return this.head().y >= YMIN + STEP; 
        case DOWN:
          return this.head().y <= YMAX - STEP;
        case LEFT:
          return this.head().x >= XMIN + STEP;
        case RIGHT:
          return this.head().x <= XMAX - STEP;
        default:
            return false;        
    };
}

/**
 * @method doMove
 * @desc methode van Snake, beweegt de slang over het veld en eet het food volgens het onderstaande algoritme:
 * 
 * - 1: creëer een nieuwe head -> moveTo 
 * - 2: Case 1: Het veld waar naar toe bewogen wordt is vrij -> shift
 *      Case 2: Het veld waar naar toe bewogen wordt is bevat food -> eat
 * - 3: kleur de huidige kop van de slang als de rest 
 * - 4: voeg de nieuwe head toe -> push
 * - 5: creëer een nieuw snake object -> Snake
 *
 * @param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT) waar naar toe bewogen wordt 
 */
  
Snake.prototype.doMove = function(direction) {
    var newHead = moveTo(this.head(), direction);
    if (!(newHead.collidesWithOneOf(foods))) { 
        this.segments.shift();
        }
    else {
            eat(newHead.x, newHead.y);
    }
    this.head().color=SNAKE;
    this.segments.push(newHead);
    snake = new Snake(this.segments);
}
/**
 * @method head
 * @desc methode om het head segment op te vragen van Snake
 *
 * @return {Element} het head segment
 */
 Snake.prototype.head = function () { return this.segments[this.segments.length-1]; }
 

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
    var segments   = [createSegment(R + WIDTH/2, R + WIDTH/2), 
                   createSegment(R + WIDTH/2, WIDTH/2 - R)];
    snake = new Snake(segments);
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
        food = createFood(XMIN + getRandomInt(0, MAX) * STEP, YMIN + getRandomInt(0, MAX) * STEP);
        if (!food.collidesWithOneOf(snake.segments) && !food.collidesWithOneOf(foods)) {
            foods.push(food);
            i += 1;
        }
    }
}