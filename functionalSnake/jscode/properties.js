"use strict";
const
    R = 10,
    STEP = 2 * R,
    
    LEFT = "left",              // bewegingsrichtingen
    RIGHT = "right",
    UP = "up",
    DOWN = "down",
    

    NUMFOODS = 5,               // aantal voedselelementen

    SNAKE = "DarkRed",          // kleur van een slangsegment
    FOOD = "Olive",             // kleur van voedsel
    HEAD = "DarkOrange";        // kleur van de kop van de slang
    

/**
 * @desc Bevat waarden van het speelveld; hoogte, breedte en functionaliteit om
 * bijbehorende zaken te berekenen
 */
const PlayArea = {
    height: $("#mySnakeCanvas").height(),
    width: $("#mySnakeCanvas").width()
};

/**
 * @desc Bevat waarden van de uitersten van het speelveld, bijvoorbeeld de minimale en 
 * maximale coördinaat van de X- of Y-as.
 */
const PlayAreaLimits = {
    minX: R,
    minY: R,
    maxX: PlayArea.width - R,
    maxY: PlayArea.height - R
};

