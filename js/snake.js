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

$(document).ready(function () {
    $("#startSnake").click(init);
    $("#stopSnake").click(stop);
    $("#show-menu").click(function () {
      toggleMenu();
    });
    $(window).resize(function () {
      toggleMenuOnResize();
    });
});

/*************************************************************************************************
 **                                            UI                                               **
 *************************************************************************************************/
/**
* @function toggleMenu() -> void
* @desc Laat menu tonen of weghalen aan de hand van de huidige status van het menu.
*/
function toggleMenu() {
    var isClicked = $("#show-menu").hasClass("clicked");
    if (!isClicked) {
      $(".menu").css("display", "block");
    } else {
      $(".menu").css("display", "none");
    }
    $("#show-menu").toggleClass("clicked");
}

/**
* @function toggleMenuOnResize() -> void
* @desc Laat menu tonen aan de hand van resize; in het geval van een kleiner scherm én niet eerder
*       op de "toon-menu-knop" gedrukt, dan wordt het menu niet getoond.
*/
function toggleMenuOnResize() {
    if (window.innerWidth >= 641) {
        $(".menu").css("display", "block");
    }
    if (window.innerWidth <= 640) {
        var isClicked = $("#show-menu").hasClass("clicked");
        if (!isClicked) {
            $(".menu").css("display", "none");
        }
    }
}


/*************************************************************************************************
 **                                    Nieuwe code                                              **
 *************************************************************************************************/

 /***************************************************************************
 **                 Constructors                                          **
 ***************************************************************************/
 /***************************************************************************
 **                 Hulpfuncties                                          **
 ***************************************************************************/
 /*************************************************************************************************
 **                                    Gegeven code                                              **
 *************************************************************************************************/
/***************************************************************************
 **                 Commando's voor de gebruiker                          **
 ***************************************************************************/
/**
 * @function init() -> void
 * @desc Haal eventueel bestaand voedsel en een bestaande slang weg, creëer een slang, genereer voedsel, en teken alles
*/
function init() {
    stop();
    createStartSnake();
    createFoods();
    draw();
}

/**
  @function stop() -> void
  @desc Laat slang en voedsel verdwijnen, en teken leeg veld
*/
function stop() {
    snake = null;
    foods = [];
    $("#mySnakeCanvas").clearCanvas();
}

/**
  @function move(direction) -> void
  @desc Beweeg slang in aangegeven richting tenzij slang uit canvas zou verdwijnen
  @param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
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
  @function draw() -> void
  @desc Teken de slang en het voedsel
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
   @constructor Snake
   @param {[Element]} segments een array met aaneengesloten slangsegmenten
                   Het laatste element van segments wordt de kop van de slang
*/
function Snake(segments) {
    this.segments = segments;
    segments[segments.length-1].color=HEAD;
}
 

/**
   @constructor Element
   @param radius straal
   @param {number} x x-coordinaat middelpunt
   @param {number} y y-coordinaat middelpunt
   @param {string} color kleur van het element
*/
function Element(radius, x, y, color) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = color;
}

/**
  @method collidesWithOneOf() -> boolean
  @desc Retourneert true als één van de elementen dezelfde (x,y)-coordinaten heeft als element waarop de functie aangeroepen wordt.
  @param {[Element]} elements een array van elementen
  @return boolean false if there are no collisions otherwise true
*/
Element.prototype.collidesWithOneOf = function (elements) {
    return elements.map(element => this.x === element.x && this.y === element.y).some(bool => bool===true);
};

/** 
 * @method canMove(direction) -> boolean
 * @desc methode van Snake geeft aan of deze (head) in de aangegeven richting kan bewegen
 * 
 * @param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
 * @return boolean true if the head of snake can move otherwise false 
 */

Snake.prototype.canMove = function(direction) {
    
    switch(direction) {
        case UP:
          return (this.head().y >= YMIN + STEP); 
          break;
        case DOWN:
          return this.head().y <= YMAX - STEP;
          break;
        case LEFT:
          return this.head().x >= XMIN + STEP;
          break;
        case RIGHT:
          return this.head().x <= XMAX - STEP;
          break;
        default:
            return false;        
    };
}

/**
 * @method doMove(direction) -> void 
 * @desc methode van Snake beweegt de slang over het veld en eet het food
 *
 * stap 1: creeer een nieuwe head -> moveTo
 * stap 2: Case 1: Het veld waar naar toe bewogen wordt is vrij -> pop het eerste element van de lijst 
 *         Case 2: Het veld waar naar toe bewogen wordt is bevat food -> eat(x,y)
 * Stap 3: kleur de huidige kop van de slang als de rest 
 * Stap 4: voeg de nieuwe head toe
 * Stap 5: creeer een nieuw snake object
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
 * @method head() -> last element of snake element 
 * @desc methode om het head element op te vragen van Snake
 * @return {Element} het head element
 */
 Snake.prototype.head = function () { return this.segments[this.segments.length-1]; }
 

/***************************************************************************
 **                 Hulpfuncties                                          **
 ***************************************************************************/

 /**
  *@function moveTo -> element
  *@desc creates a new element at the desired position
  *
  *@param {Element} head the head of the snake
  *@param {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
  * 
  *@return {Element} nieuw element
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
 * @function eat(x,y) -> void
 * @desc eat the food with this x-coordinate and y-coordinate
 *
 * @param {int} x-coordinate
 * @param {int} y-coordinate
 */
function eat(x,y) {
    foods = foods.filter(food => !(food.x === x && food.y === y));
}    

/**
  @function createStartSnake() -> Snake
  @desc Slang creëren, bestaande uit twee segmenten, 
        in het midden van het veld
  @return: slang volgens specificaties
*/
function createStartSnake() {
    var segments   = [createSegment(R + WIDTH/2, R + WIDTH/2), 
                   createSegment(R + WIDTH/2, WIDTH/2 - R)];
    snake = new Snake(segments);
}
/**
  @function createSegment(x,y) -> Element
  @desc Slangsegment creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color SNAKE
*/
function createSegment(x, y) {
    return new Element(R, x, y, SNAKE);
}
/**
  @function createFood(x,y) -> Element
  @desc Voedselelement creeren op een bepaalde plaats
  @param {number} x x-coordinaat middelpunt
  @param {number} y y-coordinaart middelpunt
  @return: {Element} met straal R en color FOOD
*/
function createFood(x, y) {
    return new Element(R, x, y, FOOD);
}
/**
  @function drawElement(element, canvas) -> void
  @desc Een element tekenen 
  @param {Element} element een Element object
  @param  {dom object} canvas het tekenveld
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
  @function getRandomInt(min: number, max: number) -> number
  @desc Creeren van random geheel getal in het interval [min, max] 
  @param {number} min een geheel getal als onderste grenswaarde
  @param {number} max een geheel getal als bovenste grenswaarde (max > min)
  @return {number} een random geheel getal x waarvoor geldt: min <= x <= max
*/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
  @function createFoods() -> array met food
  @desc [Element] array van random verdeelde voedselpartikelen
  @return [Element] array met food
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