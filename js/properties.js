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
    height: document.getElementById("mySnakeCanvas").height,
    width: document.getElementById("mySnakeCanvas").width
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

/**
 * @desc Bevat de gegevens zoals de URL, username en password van de server
 */
const Server = {
    serverURl: "http://localhost/game/snake",
    useServer: false,                             // Maken we gebruik van de server (==true) of localstorage (==false) voor opslag van game?
    user: "user",                                 // Username voor onze "server"
    password: "password"                          // Wachtwoord voor onze "server"
};