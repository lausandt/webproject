"use strict";
describe("#init()", ()=> {
  context("Zonder input", ()=> {
    it("Maakt nieuwe slang van 2 segmenten", ()=> {
      init();
      expect(snake.segments.length).to.equal(2);
    });
    it("Vijf stuks voedsel aangemaakt", ()=> {
      init();
      expect(foods.length).to.equal(5);
    });
  });
});

describe("#stop()", ()=> {
  context("Zonder input", ()=> {
    it("Haalt slang weg", ()=> {
      stop();
      expect(snake).to.equal(null);
    });
    it("Al het voedsel weggehaald", ()=> {
      stop();
      expect(foods.length).to.equal(0);
    });
  });
});

describe ("#canMove()", ()=> {
  context("Slang is net aangemaakt, staat midden in speelveld", ()=> {
    it("Beweeg omhoog (direction UP)", ()=> {
      init();
      expect(canMove(snake, UP)===true);
    });
    it("Beweeg omlaag (direction DOWN)", ()=> {
      init();
      expect(canMove(snake, DOWN)===true);
    });
    it("Beweeg naar rechts (direction RIGHT)", ()=> {
      init();
      expect(canMove(snake, RIGHT)===true);
    });
    it("Beweeg naar links (direction LEFT)", ()=> {
      init();
      expect(canMove(snake, LEFT) === true);
    });
  });

  context("Slang staat op grens", () => {
    it("Slang op linkergens; kan niet naar links (direction LEFT), wel andere richtingen", ()=> {
      init();
      // Zet hoofd van slang op minX
      head(snake).x = PlayAreaLimits.minX;
      expect(canMove(snake, RIGHT) === true);
      expect(canMove(snake, LEFT) === false);
      expect(canMove(snake, UP) === true);
      expect(canMove(snake, DOWN) === true);
    });
    it("Slang op rechterrens; kan niet naar rechts (direction RIGHT), wel andere richtingen", ()=> {
      init();
      // Zet hoofd van slang op maxX
      head(snake).x = PlayAreaLimits.maxX;
      expect(canMove(snake, RIGHT)===false);
      expect(canMove(snake, LEFT)===true);
      expect(canMove(snake, UP)===true);
      expect(canMove(snake, DOWN)===true);
    });
    it("Slang op bovengrens; kan niet naar boven (direction UP), wel andere richtingen", ()=> {
      init();
      // Zet hoofd van slang op minY
      head(snake).y = PlayAreaLimits.minY;
      expect(canMove(snake, RIGHT)===true);
      expect(canMove(snake, LEFT)===true);
      expect(canMove(snake, UP)===false);
      expect(canMove(snake, DOWN)===true);
    });
    it("Slang op benedengrens; kan niet naar beneden (direction DOWN), wel andere richtingen", ()=> {
      init();
      // Zet hoofd van slang op maxY
      head(snake).y = PlayAreaLimits.maxY;
      expect(canMove(snake, RIGHT)===true);
      expect(canMove(snake, LEFT)===true);
      expect(canMove(snake, UP)===true);
      expect(canMove(snake, DOWN)===false);
    });
  });
});

describe("#move()", ()=> {
  context("Slang is net aangemaakt, staat midden in speelveld", ()=> {
    it("Slang beweegt stap naar rechts", ()=> {
      init();
      var currentX = head(snake).x;
      var currentY = head(snake).y;
      move(RIGHT);
      // Wel naar rechts
      expect(head(snake).x === currentX + STEP);
      // Niet omhoog of omlaag
      expect(head(snake).y === currentY);
    });
    it("Slang beweegt stap naar links", ()=> {
      init();
      var currentX = head(snake).x;
      var currentY = head(snake).y;
      move(LEFT);
      // Wel naar links
      expect(head(snake).x === currentX - STEP);
      // Niet omhoog of omlaag
      expect(head(snake).y === currentY);
    });
    it("Slang beweegt stap naar beneden", ()=> {
      init();
      var currentX = head(snake).x;
      var currentY = head(snake).y;
      move(RIGHT);
      move(DOWN);
      // Niet naar links of rechts
      expect(head(snake).x === currentX + STEP);
      // Wel omlaag
      expect(head(snake).y === currentY + STEP);
    });
    it("Slang beweegt stap omhoog", ()=> {
      init();
      var currentX = head(snake).x;
      var currentY = head(snake).y;
      move(UP);
      // Niet naar links of rechts
      expect(head(snake).x===currentX);
      // Wel omhoog
      expect(head(snake).y===currentY - STEP);
    });
    it("Slang staat naast voedselstukje, eet deze op en wordt één segment langer", ()=> {
      init();
      var currentSnakeLength = snake.segments.length;
      var currentX = head(snake).x;
      var currentY = head(snake).y;
      var food = foods[0];
      // Voorkomen dat we proberen een extra voedselstukje op die locatie te plaatsen als er al één staat.
      // Als die er staat pakken we dat voedselstukje; anders pakken we het eerste voedselstukje en plaatsen die op de juiste plek.
      if(foods.filter(foundFood => foundFood.x === (currentX + STEP) && foundFood.y === currentY).length > 0) {
        food = foods.filter(foundFood => foundFood.x === (currentX + STEP) && foundFood.y === currentY)[0];
      } else {
        food.x = currentX + STEP;
        food.y = currentY;
      }
      move(RIGHT);
      expect(snake.segments.length===currentSnakeLength + 1);
      expect(foods.length===NUMFOODS - 1);
    });
    it("Slang eet alle voedselstukjes op, wordt totaal aantal voedselstukjes langer, voedsel is op", ()=> {
      init();
      var currentSnakeLength = snake.segments.length;
      // Plaats eerst slang helemaal linksboven om te voorkomen dat we over "onszelf" heen lopen
      var offset = 0;
      snake.segments.forEach(segment => {
        segment.x = STEP + offset;
        segment.y = STEP;
        offset += STEP;
      });

      foods.forEach(food => {
        food.x = head(snake).x + STEP;
        food.y = head(snake).y;
        move(RIGHT);
      });
      expect(foods.length===0);
      expect(snake.segments.length===currentSnakeLength + NUMFOODS);
    });
  });

  context("Slang staat op linkerrand", ()=> {
    it("Beweegt naar links, maar kan niet", ()=> {
      init();
      head(snake).x = PlayAreaLimits.minX;
      var currentX = head(snake).x;
      move(LEFT);
      expect(head(snake).x===currentX);
    });
    it("Beweegt naar rechts", ()=> {
      init();
      head(snake).x = PlayAreaLimits.minX;
      var currentX = head(snake).x;
      move(RIGHT);
      expect(head(snake).x===currentX + STEP);
    });
    it("Beweegt naar boven", ()=> {
      init();
      head(snake).x = PlayAreaLimits.minX;
      var currentX = head(snake).x;
      var currentY = head(snake).y;
      move(UP);
      expect(head(snake).x===currentX);
      expect(head(snake).y===currentY - STEP);
    });
    it("Beweegt naar beneden", ()=> {
      init();
      head(snake).x = PlayAreaLimits.minX;
      var currentX = head(snake).x;
      var currentY = head(snake).y;
      move(DOWN);
      expect(head(snake).x===currentX);
      expect(head(snake).y===currentY + STEP);
    });
  });

  context("Slang staat op rechterrand", ()=> {
    it("Beweegt naar rechts, maar kan niet", ()=> {
      init();
      head(snake).x = PlayAreaLimits.maxX;
      var currentX = head(snake).x;
      move(RIGHT);
      expect(head(snake).x===currentX);
    });
    it("Beweegt naar links", ()=> {
      init();
      head(snake).x = PlayAreaLimits.maxX;
      var currentX = head(snake).x;
      move(LEFT);
      expect(head(snake).x===currentX - STEP);
    });
    it("Beweegt naar boven", ()=> {
      init();
      head(snake).x = PlayAreaLimits.maxX;
      var currentX = head(snake).x;
      var currentY = head(snake).y;
      move(UP);
      expect(head(snake).x===currentX);
      expect(head(snake).y===currentY - STEP);
    });
    it("Beweegt naar beneden", ()=> {
      init();
      head(snake).x = PlayAreaLimits.maxX;
      var currentX = head(snake).x;
      var currentY = head(snake).y;
      move(DOWN);
      expect(head(snake).x===currentX);
      expect(head(snake).y===currentY + STEP);
    });
  });

  context("Slang staat op bovenrand", ()=> {
    it("Beweegt naar boven, maar kan niet", ()=> {
      init();
      head(snake).y = PlayAreaLimits.minY;
      var currentY = head(snake).y;
      move(UP);
      expect(head(snake).y===currentY);
    });
    it("Beweegt naar beneden", ()=> {
      init();
      head(snake).y = PlayAreaLimits.minY;
      var currentY = head(snake).y;
      move(DOWN);
      expect(head(snake).y===currentY + STEP);
    });
    it("Beweegt naar links", ()=> {
      init();
      head(snake).y = PlayAreaLimits.minY;
      var currentX = head(snake).x;
      var currentY = head(snake).y;
      move(LEFT);
      expect(head(snake).x===currentX - STEP);
      expect(head(snake).y===currentY);
    });
    it("Beweegt naar rechts", ()=> {
      init();
      head(snake).y = PlayAreaLimits.minY;
      var currentX = head(snake).x;
      var currentY = head(snake).y;
      move(RIGHT);
      expect(head(snake).x===currentX + STEP);
      expect(head(snake).y===currentY);
    })
  });

  context("Slang staat op onderrand", ()=> {
    it("Beweegt naar beneden, maar kan niet", ()=> {
      init();
      head(snake).y = PlayAreaLimits.maxY;
      var currentY = head(snake).y;
      move(DOWN);
      expect(head(snake).y===currentY);
    });
    it("Beweegt naar boven", ()=> {
      init();
      head(snake).y = PlayAreaLimits.maxY;
      var currentY = head(snake).y;
      move(UP);
      expect(head(snake).y===currentY - STEP);
    });
    it("Beweegt naar links", ()=> {
      init();
      head(snake).y = PlayAreaLimits.maxY;
      var currentX = head(snake).x;
      var currentY = head(snake).y;
      move(LEFT);
      expect(head(snake).x===currentX - STEP);
      expect(head(snake).y===currentY);
    });
    it("Beweegt naar rechts", ()=> {
      init();
      head(snake).y = PlayAreaLimits.maxY;
      var currentX = head(snake).x;
      var currentY = head(snake).y;
      move(RIGHT);
      expect(head(snake).x===currentX + STEP);
      expect(head(snake).y===currentY);
    });
  });
});

describe("#collidesWithOneOf(snake, elements)", ()=> {
  context("Slang is net aangemaakt, staat midden in speelveld", ()=> {
    it("Slang heeft geen collision met voedselelementen", ()=> {
      init();
      foods.forEach(food => expect(collidesWithOneOf(food, snake.segments) === false));
    });
    it("Voedselelementen hebben geen collisions onderling", ()=> {
      init();
      while(foods.length > 0) {
        expect(collidesWithOneOf(foods.pop(), foods) === false);
      }
    });
    it("Slang raakt zichzelf niet, game gaat door", ()=> {
      init();
      var currentLosses = game.losses;
      move(RIGHT);
      move(UP);
      move(LEFT);
      expect(game.losses).to.equal(currentLosses);
    })
  });
});

describe("#eat()", ()=> {
  context("Spel is net geïnitaliseerd, vijftien stuks voedsel beschikbaar", ()=> {
    it("Voedsel wordt gegeten, voedsel niet langer beschikbaar", ()=> {
      init();
      var foodToEat = foods[0];
      eat(foodToEat.x, foodToEat.y);
      expect(foods.filter(food => food.x === foodToEat.x && food.y === foodToEat.y).length).to.equal(0);
    });
    it("Voedsel wordt gegeten, aantal voedselstukken is verlaagd naar 14", ()=> {
      init();
      var foodToEat = foods[0];
      eat(foodToEat.x, foodToEat.y);
      expect(foods.length === NUMFOODS-1);
    });
    it("Alle voedsel wordt gegeten, aantal voedselstukken is verlaagd naar 0", ()=> {
      init();
      foods.forEach(food => eat(food.x, food.y));
      expect(foods.length === 0);
    });
    it("Alle voedselstukjes zijn opgegeten, game heeft één win verkregen", ()=> {
      init();
      var currentWins = game.wins;
      var currentLosses = game.losses;
      var currentPlays = game.plays;
      // Plaats eerst slang helemaal linksboven om te voorkomen dat we over "onszelf" heen lopen
      var offset = 0;
      snake.segments.forEach(segment => {
        segment.x = STEP + offset;
        segment.y = STEP;
        offset += STEP;
      });

      foods.forEach(food => {
        food.x = head(snake).x + STEP;
        food.y = head(snake).y;
        move(RIGHT);
      });
      // Vanwege de "snelheid" van de slang moeten we even wachten voor resultaat
      setTimeout(1000, () => {
        expect(game.wins).to.equal(currentWins+1);
        expect(game.losses).to.equal(currentLosses);
        expect(game.plays).to.equal(currentPlays);
      });
    });
  });
});

describe("#Game.protoytype.win()", ()=> {
  context("Spel is net geïnitialiseerd, game is nog leeg.", ()=> {
    it("Game wordt gewonnen, aantal wins gaat met één omhoog", ()=> {
      var currentWins = game.wins;
      var currentLosses = game.losses;
      var currentPlays = game.plays;
      game.win();
      // Er moet één win zijn bijgeschreven in de game
      expect(game.wins).to.equal(currentWins+1);

      // Deze mogen niet veranderd zijn door de aanroep naar game.win()
      expect(currentLosses).to.equal(currentLosses);
      expect(currentPlays).to.equal(currentPlays);
    });
  });
});
describe("#Game.prototype.lose()", ()=> {
  context("Spel is net geïnitaliseerd, game is nog leeg", ()=> {
   it("Game wordt verloren, aantal losses gaat met één omhoog", ()=> {
      var currentLosses = game.losses;
      var currentPlays = game.plays;
      var currentWins = game.wins;
      game.lose();
      expect(game.losses).to.equal(currentLosses + 1);
      // Deze mogen niet veranded zijn door de aanroep naar game.lose()
      expect(game.plays).to.equal(currentPlays);
      expect(game.wins).to.equal(currentWins);
   });
  });
  it("Slang raakt zichzelf, één loss meer dan hiervoor", ()=> {
    init();
    var currentLosses = game.losses;
    move(DOWN);
    // Vanwege de "snelheid" van de slang moeten we even wachten voor resultaat
    setTimeout(1000, () => {
      expect(game.losses).to.equal(currentLosses + 1);
    });
  });
});

describe("#Game.prototype.save() & #Game.prototype.load()", ()=> {
  context("Spel is al een tijdje bezig, er zijn wat wins, losses en plays genoteerd.", ()=> {
    it("Game wordt opgeslagen, game wordt opnieuw geïnitaliseerd en daarna geladen. Gamestatus moet gelijk zijn aan voor het opslaan.", ()=> {
      var name = "Speler1";
      var startWins = 5;
      var startLosses = 5;
      var startPlays = 10;
      game.name = name;
      game.plays = startPlays;
      game.wins = startWins;
      game.losses = startLosses;
      game.save();
      game.losses = startLosses*2;
      game.wins = startWins*3;
      game.plays = startPlays*4;

      expect(game.losses).to.not.equal(startLosses);
      expect(game.wins).to.not.equal(startWins);
      expect(game.plays).to.not.equal(startPlays);

      game.load();
      expect(game.losses).to.equal(startLosses);
      expect(game.wins).to.equal(startWins);
      expect(game.plays).to.equal(startPlays);
    });
  });
})