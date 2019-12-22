"use strict";

$(document).ready(function () {
    $("#show-menu").click(toggleMenu());
    $(window).resize(toggleMenuOnResize());
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