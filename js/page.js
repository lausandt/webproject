"use strict";

$(document).ready(function () {
    $("#show-menu").click(function () { toggleMenu(); });
    $(window).resize(function() { toggleMenuOnResize(); });
});

/*************************************************************************************************
 **                                            UI                                               **
 *************************************************************************************************/

 /**
  * @function showMenu() -> void
  * @desc Zet het CSS-attribuut "display" op "block" waardoor het menu getoond wordt.
  */
function showMenu() {
    $(".menu").css("display", "block");
}

/**
  * @function showMenu() -> void
  * @desc Zet het CSS-attribuut "display" op "none" waardoor het menu verstopt wordt.
  */
function hideMenu() {
    $(".menu").css("display", "none");
}

/**
* @function toggleMenu() -> void
* @desc Laat menu tonen of verstoppen aan de hand van de huidige status van het menu.
*/
function toggleMenu() {
    var isShowing = $("#show-menu").hasClass("clicked");
    if (!isShowing) {
      showMenu();
    } else {
      hideMenu();
    }
    $("#show-menu").toggleClass("clicked");
    $(".menu").toggleClass("shown");
}


/**
* @function toggleMenuOnResize() -> void
* @desc Laat menu tonen aan de hand van resize; in het geval van een kleiner scherm én niet eerder
*       op de "toon-menu-knop" gedrukt, dan wordt het menu niet getoond.
*/
function toggleMenuOnResize() {
    if (window.innerWidth >= 641) {
        showMenu();
    }
    if (window.innerWidth <= 640) {
        var isShowing = $("#show-menu").hasClass("clicked");
        if (!isShowing) {
            hideMenu();
        }
    }
}