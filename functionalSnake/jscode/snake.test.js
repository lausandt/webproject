"use strict";
describe("#init()", ()=> {
  context("Zonder input", ()=> {
    it("Maakt nieuwe slang van 2 segmenten", ()=> {
      init();
      expect(state.snake.length).to.equal(2);
    });
    it("Vijf stuks voedsel aangemaakt", ()=> {
      init();
      expect(state.food.length).to.equal(5);
    });
  });
});

describe("#stop()", ()=> {
  context("Zonder input", ()=> {
    it("Haalt slang weg", ()=> {
      stop();
      expect(state.snake.length).to.equal(0);
    });
    it("Al het voedsel weggehaald", ()=> {
      stop();
      expect(state.food.length).to.equal(0);
    });
  });
});

describe ("#canMove()", ()=> {
  context("Slang is net aangemaakt, staat midden in speelveld", ()=> {
    it("Beweeg omhoog (direction UP)", ()=> {
      init();
      expect(canMove(state.snake, UP)===true);
    });
    it("Beweeg omlaag (direction DOWN)", ()=> {
      init();
      expect(canMove(state.snake, DOWN)===true);
    });
    it("Beweeg naar rechts (direction RIGHT)", ()=> {
      init();
      expect(canMove(state.snake, RIGHT)===true);
    });
    it("Beweeg naar links (direction LEFT)", ()=> {
      init();
      expect(canMove(state.snake, LEFT) === true);
    });
  });

  context("Slang staat op grens", () => {
    it("Slang op linkergens; kan niet naar links (direction LEFT), wel andere richtingen", ()=> {
      init();
      // Zet hoofd van slang op minX
      head(state.snake).x = PlayAreaLimits.minX;
      expect(canMove(state.snake, RIGHT) === true);
      expect(canMove(state.snake, LEFT) === false);
      expect(canMove(state.snake, UP) === true);
      expect(canMove(state.snake, DOWN) === true);
    });
    it("Slang op rechterrens; kan niet naar rechts (direction RIGHT), wel andere richtingen", ()=> {
      init();
      // Zet hoofd van slang op maxX
      head(state.snake).x = PlayAreaLimits.maxX;
      expect(canMove(state.snake, RIGHT)===false);
      expect(canMove(state.snake, LEFT)===true);
      expect(canMove(state.snake, UP)===true);
      expect(canMove(state.snake, DOWN)===true);
    });
    it("Slang op bovengrens; kan niet naar boven (direction UP), wel andere richtingen", ()=> {
      init();
      // Zet hoofd van slang op minY
      head(state.snake).y = PlayAreaLimits.minY;
      expect(canMove(state.snake, RIGHT)===true);
      expect(canMove(state.snake, LEFT)===true);
      expect(canMove(state.snake, UP)===false);
      expect(canMove(state.snake, DOWN)===true);
    });
    it("Slang op benedengrens; kan niet naar beneden (direction DOWN), wel andere richtingen", ()=> {
      init();
      // Zet hoofd van slang op maxY
      head(state.snake).y = PlayAreaLimits.maxY;
      expect(canMove(state.snake, RIGHT)===true);
      expect(canMove(state.snake, LEFT)===true);
      expect(canMove(state.snake, UP)===true);
      expect(canMove(state.snake, DOWN)===false);
    });
  });
});

describe("#move()", ()=> {
  context("Slang is net aangemaakt, staat midden in speelveld", ()=> {
    it("Slang beweegt stap naar rechts", ()=> {
      init();
      var currentX = head(state.snake).x;
      var currentY = head(state.snake).y;
      move(RIGHT);
      // Wel naar rechts
      expect(head(state.snake).x === currentX + STEP);
      // Niet omhoog of omlaag
      expect(head(state.snake).y === currentY);
    });
    it("Slang beweegt stap naar links", ()=> {
      init();
      var currentX = head(state.snake).x;
      var currentY = head(state.snake).y;
      move(LEFT);
      // Wel naar links
      expect(head(state.snake).x === currentX - STEP);
      // Niet omhoog of omlaag
      expect(head(state.snake).y === currentY);
    });
    it("Slang beweegt stap naar beneden", ()=> {
      init();
      var currentX = head(state.snake).x;
      var currentY = head(state.snake).y;
      move(RIGHT);
      move(DOWN);
      // Niet naar links of rechts
      expect(head(state.snake).x === currentX + STEP);
      // Wel omlaag
      expect(head(state.snake).y === currentY + STEP);
    });
    it("Slang beweegt stap omhoog", ()=> {
      init();
      var currentX = head(state.snake).x;
      var currentY = head(state.snake).y;
      move(UP);
      // Niet naar links of rechts
      expect(head(state.snake).x===currentX);
      // Wel omhoog
      expect(head(state.snake).y===currentY - STEP);
    });
    it("Slang staat naast voedselstukje, eet deze op en wordt één segment langer", ()=> {
      init();
      var currentSnakeLength = state.snake.length;
      var currentX = head(state.snake).x;
      var currentY = head(state.snake).y;
      var food = state.food[0];
      // Voorkomen dat we proberen een extra voedselstukje op die locatie te plaatsen als er al één staat.
      // Als die er staat pakken we dat voedselstukje; anders pakken we het eerste voedselstukje en plaatsen die op de juiste plek.
      if(state.food.filter(foundFood => foundFood.x === (currentX + STEP) && foundFood.y === currentY).length > 0) {
        food = state.food.filter(foundFood => foundFood.x === (currentX + STEP) && foundFood.y === currentY)[0];
      } else {
        food.x = currentX + STEP;
        food.y = currentY;
      }
      move(RIGHT);
      expect(state.snake.length===currentSnakeLength + 1);
      expect(state.food.length===NUMFOODS - 1);
    });
    it("Slang eet alle voedselstukjes op, wordt totaal aantal voedselstukjes langer, voedsel is op", ()=> {
      init();
      var currentSnakeLength = state.snake.length;
      // Plaats eerst slang helemaal linksboven om te voorkomen dat we over "onszelf" heen lopen
      var offset = 0;
      state.snake.forEach(segment => {
        segment.x = STEP + offset;
        segment.y = STEP;
        offset += STEP;
      });

      state.food.forEach(food => {
        food.x = head(state.snake).x + STEP;
        food.y = head(state.snake).y;
        move(RIGHT);
      });
      expect(state.food.length===0);
      expect(state.snake.length===currentSnakeLength + NUMFOODS);
    });
  });

  context("Slang staat op linkerrand", ()=> {
    it("Beweegt naar links, maar kan niet", ()=> {
      init();
      head(state.snake).x = PlayAreaLimits.minX;
      var currentX = head(state.snake).x;
      move(LEFT);
      expect(head(state.snake).x===currentX);
    });
    it("Beweegt naar rechts", ()=> {
      init();
      head(state.snake).x = PlayAreaLimits.minX;
      var currentX = head(state.snake).x;
      move(RIGHT);
      expect(head(state.snake).x===currentX + STEP);
    });
    it("Beweegt naar boven", ()=> {
      init();
      head(state.snake).x = PlayAreaLimits.minX;
      var currentX = head(state.snake).x;
      var currentY = head(state.snake).y;
      move(UP);
      expect(head(state.snake).x===currentX);
      expect(head(state.snake).y===currentY - STEP);
    });
    it("Beweegt naar beneden", ()=> {
      init();
      head(state.snake).x = PlayAreaLimits.minX;
      var currentX = head(state.snake).x;
      var currentY = head(state.snake).y;
      move(DOWN);
      expect(head(state.snake).x===currentX);
      expect(head(state.snake).y===currentY + STEP);
    });
  });

  context("Slang staat op rechterrand", ()=> {
    it("Beweegt naar rechts, maar kan niet", ()=> {
      init();
      head(state.snake).x = PlayAreaLimits.maxX;
      var currentX = head(state.snake).x;
      move(RIGHT);
      expect(head(state.snake).x===currentX);
    });
    it("Beweegt naar links", ()=> {
      init();
      head(state.snake).x = PlayAreaLimits.maxX;
      var currentX = head(state.snake).x;
      move(LEFT);
      expect(head(state.snake).x===currentX - STEP);
    });
    it("Beweegt naar boven", ()=> {
      init();
      head(state.snake).x = PlayAreaLimits.maxX;
      var currentX = head(state.snake).x;
      var currentY = head(state.snake).y;
      move(UP);
      expect(head(state.snake).x===currentX);
      expect(head(state.snake).y===currentY - STEP);
    });
    it("Beweegt naar beneden", ()=> {
      init();
      head(state.snake).x = PlayAreaLimits.maxX;
      var currentX = head(state.snake).x;
      var currentY = head(state.snake).y;
      move(DOWN);
      expect(head(state.snake).x===currentX);
      expect(head(state.snake).y===currentY + STEP);
    });
  });

  context("Slang staat op bovenrand", ()=> {
    it("Beweegt naar boven, maar kan niet", ()=> {
      init();
      head(state.snake).y = PlayAreaLimits.minY;
      var currentY = head(state.snake).y;
      move(UP);
      expect(head(state.snake).y===currentY);
    });
    it("Beweegt naar beneden", ()=> {
      init();
      head(state.snake).y = PlayAreaLimits.minY;
      var currentY = head(state.snake).y;
      move(DOWN);
      expect(head(state.snake).y===currentY + STEP);
    });
    it("Beweegt naar links", ()=> {
      init();
      head(state.snake).y = PlayAreaLimits.minY;
      var currentX = head(state.snake).x;
      var currentY = head(state.snake).y;
      move(LEFT);
      expect(head(state.snake).x===currentX - STEP);
      expect(head(state.snake).y===currentY);
    });
    it("Beweegt naar rechts", ()=> {
      init();
      head(state.snake).y = PlayAreaLimits.minY;
      var currentX = head(state.snake).x;
      var currentY = head(state.snake).y;
      move(RIGHT);
      expect(head(state.snake).x===currentX + STEP);
      expect(head(state.snake).y===currentY);
    })
  });

  context("Slang staat op onderrand", ()=> {
    it("Beweegt naar beneden, maar kan niet", ()=> {
      init();
      head(state.snake).y = PlayAreaLimits.maxY;
      var currentY = head(state.snake).y;
      move(DOWN);
      expect(head(state.snake).y===currentY);
    });
    it("Beweegt naar boven", ()=> {
      init();
      head(state.snake).y = PlayAreaLimits.maxY;
      var currentY = head(state.snake).y;
      move(UP);
      expect(head(state.snake).y===currentY - STEP);
    });
    it("Beweegt naar links", ()=> {
      init();
      head(state.snake).y = PlayAreaLimits.maxY;
      var currentX = head(state.snake).x;
      var currentY = head(state.snake).y;
      move(LEFT);
      expect(head(state.snake).x===currentX - STEP);
      expect(head(state.snake).y===currentY);
    });
    it("Beweegt naar rechts", ()=> {
      init();
      head(state.snake).y = PlayAreaLimits.maxY;
      var currentX = head(state.snake).x;
      var currentY = head(state.snake).y;
      move(RIGHT);
      expect(head(state.snake).x===currentX + STEP);
      expect(head(state.snake).y===currentY);
    });
  });
});

describe("#collidesWithOneOf(state.snake, elements)", ()=> {
  context("Slang is net aangemaakt, staat midden in speelveld", ()=> {
    it("Slang heeft geen collision met voedselelementen", ()=> {
      init();
      state.food.forEach(food => expect(collidesWithOneOf(food, state.snake) === false));
    });
    it("Voedselelementen hebben geen collisions onderling", ()=> {
      init();
      while(state.food.length > 0) {
        expect(collidesWithOneOf(state.food.pop(), state.food) === false);
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
      var foodToEat = state.food[0];
      eat(foodToEat.x, foodToEat.y);
      expect(state.food.filter(food => food.x === foodToEat.x && food.y === foodToEat.y).length).to.equal(0);
    });
    it("Voedsel wordt gegeten, aantal voedselstukken is verlaagd naar 14", ()=> {
      init();
      var foodToEat = state.food[0];
      eat(foodToEat.x, foodToEat.y);
      expect(state.food.length === NUMFOODS-1);
    });
    it("Alle voedsel wordt gegeten, aantal voedselstukken is verlaagd naar 0", ()=> {
      init();
      state.food.forEach(food => eat(food.x, food.y));
      expect(state.food.length === 0);
    });
    it("Alle voedselstukjes zijn opgegeten, game heeft één win verkregen", ()=> {
      init();
      var currentWins = game.wins;
      var currentLosses = game.losses;
      var currentPlays = game.plays;
      // Plaats eerst slang helemaal linksboven om te voorkomen dat we over "onszelf" heen lopen
      var offset = 0;
      state.snake.forEach(segment => {
        segment.x = STEP + offset;
        segment.y = STEP;
        offset += STEP;
      });

      state.food.forEach(food => {
        food.x = head(state.snake).x + STEP;
        food.y = head(state.snake).y;
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

describe("#game.result(true)", ()=> {
  context("Spel is net geïnitialiseerd, game is nog leeg.", ()=> {
    it("Game wordt gewonnen, aantal wins gaat met één omhoog", ()=> {
      var currentWins = game.stats()[0].wins;
      var currentLosses = game.stats()[0].played - game.stats()[0].wins;
      var currentPlays = game.stats()[0].played;
      game.result(true);
      // Er moet één win zijn bijgeschreven in de game
      expect(game.stats()[0].wins).to.equal(currentWins+1);
      expect(game.stats()[0].played).to.equal(currentPlays + 1);
      // Deze mogen niet veranderd zijn door de aanroep naar game.result(true)
      expect(game.stats()[0].played - game.stats()[0].wins).to.equal(currentLosses);
    });
  });
});
describe("#game.result(false)", ()=> {
  context("Spel is net geïnitaliseerd, game is nog leeg", ()=> {
   it("Game wordt verloren, aantal losses gaat met één omhoog", ()=> {
      var currentWins = game.stats()[0].wins;
      var currentLosses = game.stats()[0].played - game.stats()[0].wins;
      var currentPlays = game.stats()[0].played;
      game.result(false);
      expect(game.stats()[0].played - game.stats()[0].wins).to.equal(currentLosses + 1);
      expect(game.stats()[0].played).to.equal(currentPlays + 1);
      // Deze mogen niet veranded zijn door de aanroep naar game.result(false)
      expect(game.stats()[0].wins).to.equal(currentWins);
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