"use strict";

const R        = 10,            // straal van een element
      STEP     = 2*R,           // stapgrootte
      WIDTH    = 360,           // breedte veld 
      HEIGHT   = 360,           // hoogte veld 
                                // er moet gelden: WIDTH = HEIGHT
      MAX      = WIDTH/STEP-1,  // netto veldbreedte   
      LEFT     = "left",        // bewegingsrichtingen 
      RIGHT    = "right",
      UP       = "up",
      DOWN     = "down",

      NUMFOODS = 15,            // aantal voedselelementen       

      XMIN     = R,             // minimale x waarde 
      YMIN     = R,             // minimale y waarde 
      XMAX     = WIDTH - R,     // maximale x waarde 
      YMAX     = HEIGHT - R,    // maximale y waarde 

      SNAKE   = "DarkRed" ,     // kleur van een slangsegment
      FOOD    = "Olive",        // kleur van voedsel
	    HEAD    = "DarkOrange";   // kleur van de kop van de slang

var snake,
    foods = [];                                // voedsel voor de slang

$(document).ready(function() {
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
 if(!isClicked) {
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
   if(!isClicked) {
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
  @function init() -> void
  @desc Haal eventueel bestaand voedsel en een bestaande slang weg, creëer een slang, genereer voedsel, en teken alles
*/
function init() {
  // Verwijder bestaand voedsel en huidige slang
  stop();
  // Creëer nieuwe slang
  createStartSnake();
  // Voeg niuw voedsel toe
  createFoods();
  // Teken alles op het scherm
  draw();
}

/**
  @function stop() -> void
  @desc Laat slang en voedsel verdwijnen, en teken leeg veld
*/
function stop() {
}

/**
  @function move(direction) -> void
  @desc Beweeg slang in aangegeven richting
        tenzij slang uit canvas zou verdwijnen  
  @param   {string} direction de richting (een van de constanten UP, DOWN, LEFT of RIGHT)
*/
function move(direction) {
  if (snake.canMove(direction)) {
    snake.doMove(direction);
    draw();
  }
  else {
    console.log("snake cannot move " + direction);
  }
}

/**
  @function draw() -> void
  @desc Teken de slang en het voedsel
*/
function draw() {
  var canvas = $("#mySnakeCanvas").clearCanvas();
  // Teken slang
  drawElement(snake, canvas);
  // Teken voedsel
  foods.forEach(function (food) {
    drawElement(food, canvas);
  });
}
/***************************************************************************
 **                 Constructors                                          **
 ***************************************************************************/
/**
   @constructor Snake
   @param {[Element] segments een array met aaneengesloten slangsegmenten
                   Het laatste element van segments wordt de kop van de slang 
*/
function Snake(segments) {
  /* in te vullen */
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
  @function collidesWithOneOf -> boolean
  @param {[Element] elements een array met elementen waarvoor bekeken moet worden of deze
  met elkaar conflicteren
*/
Element.prototype.collidesWithOneOf = function (elements) {
  if(elements === undefined) { return false; }

  for(var i = 0; i < elements.length ; i++) {
    var currentElement = elements[i];
    for(var j = i+1 ; j < elements.length ; j++) {
      var foundElement = elements[j];
      if(foundElement.x == currentElement.x && foundElement.y == currentElement.y) {
        return true;
      }
    }
  }
  return false;
}
/***************************************************************************
 **                 Hulpfuncties                                          **
 ***************************************************************************/

/**
  @function createStartSnake() -> Snake
  @desc Slang creëren, bestaande uit  twee segmenten, 
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
    draggable : false,
    fillStyle : element.color,
    x : element.x,
    y : element.y,
    radius : element.radius
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
   var  i,    
        food;
   i = 0; 
   //we gebruiken een while omdat we, om een arraymethode te gebruiken, eerst een nieuw array zouden moeten creëren (met NUMFOODS elementen)
   while (i < NUMFOODS ) {
     food = createFood(XMIN + getRandomInt(0, MAX)*STEP, YMIN + getRandomInt(0, MAX)*STEP);
     if (!food.collidesWithOneOf(snake.segments) && !food.collidesWithOneOf(foods) ) {
       foods.push(food);
       i++
     }
   }  
}

