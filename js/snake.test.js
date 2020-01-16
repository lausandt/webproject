"use strict";
describe("#init()", function() {
  context("Zonder input", function() {
    it("Maakt nieuwe slang van 2 segmenten", function() {
      init();
      expect(snake.segments.length).to.equal(2);
    });
    it("Vijf stuks voedsel aangemaakt", function() {
      init();
      expect(foods.length).to.equal(5);
    });
  });
});

describe("#stop()", function() {
  context("Zonder input", function() {
    it("Haalt slang weg", function() {
      stop();
      expect(snake).to.equal(null);
    });
    it("Al het voedsel weggehaald", function() {
      stop();
      expect(foods.length).to.equal(0);
    });
  });
});

describe ("#canMove()", function() {
  context("Slang is net aangemaakt, staat midden in speelveld", function() {
    it("Beweeg omhoog (direction UP)", function() {
      init();
      expect(snake.canMove(UP)).to.equal(true);
    });
    it("Beweeg omlaag (direction DOWN)", function() {
      init();
      expect(snake.canMove(DOWN)).to.equal(true);
    });
    it("Beweeg naar rechts (direction RIGHT)", function() {
      init();
      expect(snake.canMove(RIGHT)).to.equal(true);
    });
    it("Beweeg naar links (direction LEFT)", function() {
      init();
      expect(snake.canMove(LEFT)).to.equal(true);
    });
  });

  context("Slang staat op grens", function() {
    it("Slang op linkergens; kan niet naar links (direction LEFT), wel andere richtingen", function() {
      init();
      // Zet hoofd van slang op XMIN
      snake.head().x = XMIN;
      expect(snake.canMove(RIGHT)).to.equal(true);
      expect(snake.canMove(LEFT)).to.equal(false);
      expect(snake.canMove(UP)).to.equal(true);
      expect(snake.canMove(DOWN)).to.equal(true);
    });
    it("Slang op rechterrens; kan niet naar rechts (direction RIGHT), wel andere richtingen", function() {
      init();
      // Zet hoofd van slang op XMAX
      snake.head().x = XMAX;
      expect(snake.canMove(RIGHT)).to.equal(false);
      expect(snake.canMove(LEFT)).to.equal(true);
      expect(snake.canMove(UP)).to.equal(true);
      expect(snake.canMove(DOWN)).to.equal(true);
    });
    it("Slang op bovengrens; kan niet naar boven (direction UP), wel andere richtingen", function() {
      init();
      // Zet hoofd van slang op YMIN
      snake.head().y = YMIN;
      expect(snake.canMove(RIGHT)).to.equal(true);
      expect(snake.canMove(LEFT)).to.equal(true);
      expect(snake.canMove(UP)).to.equal(false);
      expect(snake.canMove(DOWN)).to.equal(true);
    });
    it("Slang op benedengrens; kan niet naar beneden (direction DOWN), wel andere richtingen", function() {
      init();
      // Zet hoofd van slang op YMAX
      snake.head().y = YMAX;
      expect(snake.canMove(RIGHT)).to.equal(true);
      expect(snake.canMove(LEFT)).to.equal(true);
      expect(snake.canMove(UP)).to.equal(true);
      expect(snake.canMove(DOWN)).to.equal(false);
    });
  });
});

describe("#move()", function() {
  context("Slang is net aangemaakt, staat midden in speelveld", function() {
    it("Slang beweegt stap naar rechts", function() {
      init();
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      move(RIGHT);
      // Wel naar rechts
      expect(snake.head().x).to.equal(currentX + STEP);
      // Niet omhoog of omlaag
      expect(snake.head().y).to.equal(currentY);
    });
    it("Slang beweegt stap naar links", function() {
      init();
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      move(LEFT);
      // Wel naar links
      expect(snake.head().x).to.equal(currentX - STEP);
      // Niet omhoog of omlaag
      expect(snake.head().y).to.equal(currentY);
    });
    it("Slang beweegt stap naar beneden", function() {
      init();
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      move(RIGHT);
      move(DOWN);
      // Niet naar links of rechts
      expect(snake.head().x).to.equal(currentX + STEP);
      // Wel omlaag
      expect(snake.head().y).to.equal(currentY + STEP);
    });
    it("Slang beweegt stap omhoog", function() {
      init();
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      move(UP);
      // Niet naar links of rechts
      expect(snake.head().x).to.equal(currentX);
      // Wel omhoog
      expect(snake.head().y).to.equal(currentY - STEP);
    });
    it("Slang staat naast voedselstukje, eet deze op en wordt één segment langer", function() {
      init();
      var currentSnakeLength = snake.segments.length;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
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
      expect(snake.segments.length).to.equal(currentSnakeLength + 1);
      expect(foods.length).to.equal(NUMFOODS - 1);
    });
    it("Slang eet alle voedselstukjes op, wordt totaal aantal voedselstukjes langer, voedsel is op", function() {
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
        food.x = snake.head().x + STEP;
        food.y = snake.head().y;
        move(RIGHT);
      });
      expect(foods.length).to.equal(0);
      expect(snake.segments.length).to.equal(currentSnakeLength + NUMFOODS);
    });
  });

  context("Slang staat op linkerrand", function() {
    it("Beweegt naar links, maar kan niet", function() {
      init();
      snake.head().x = XMIN;
      var currentX = snake.head().x;
      move(LEFT);
      expect(snake.head().x).to.equal(currentX);
    });
    it("Beweegt naar rechts", function() {
      init();
      snake.head().x = XMIN;
      var currentX = snake.head().x;
      move(RIGHT);
      expect(snake.head().x).to.equal(currentX + STEP);
    });
    it("Beweegt naar boven", function() {
      init();
      snake.head().x = XMIN;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      move(UP);
      expect(snake.head().x).to.equal(currentX);
      expect(snake.head().y).to.equal(currentY - STEP);
    });
    it("Beweegt naar beneden", function() {
      init();
      snake.head().x = XMIN;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      move(DOWN);
      expect(snake.head().x).to.equal(currentX);
      expect(snake.head().y).to.equal(currentY + STEP);
    });
  });

  context("Slang staat op rechterrand", function() {
    it("Beweegt naar rechts, maar kan niet", function() {
      init();
      snake.head().x = XMAX;
      var currentX = snake.head().x;
      move(RIGHT);
      expect(snake.head().x).to.equal(currentX);
    });
    it("Beweegt naar links", function() {
      init();
      snake.head().x = XMAX;
      var currentX = snake.head().x;
      move(LEFT);
      expect(snake.head().x).to.equal(currentX - STEP);
    });
    it("Beweegt naar boven", function() {
      init();
      snake.head().x = XMAX;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      move(UP);
      expect(snake.head().x).to.equal(currentX);
      expect(snake.head().y).to.equal(currentY - STEP);
    });
    it("Beweegt naar beneden", function() {
      init();
      snake.head().x = XMAX;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      move(DOWN);
      expect(snake.head().x).to.equal(currentX);
      expect(snake.head().y).to.equal(currentY + STEP);
    });
  });

  context("Slang staat op bovenrand", function() {
    it("Beweegt naar boven, maar kan niet", function() {
      init();
      snake.head().y = YMIN;
      var currentY = snake.head().y;
      move(UP);
      expect(snake.head().y).to.equal(currentY);
    });
    it("Beweegt naar beneden", function() {
      init();
      snake.head().y = YMIN;
      var currentY = snake.head().y;
      move(DOWN);
      expect(snake.head().y).to.equal(currentY + STEP);
    });
    it("Beweegt naar links", function() {
      init();
      snake.head().y = YMIN;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      move(LEFT);
      expect(snake.head().x).to.equal(currentX - STEP);
      expect(snake.head().y).to.equal(currentY);
    });
    it("Beweegt naar rechts", function() {
      init();
      snake.head().y = YMIN;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      move(RIGHT);
      expect(snake.head().x).to.equal(currentX + STEP);
      expect(snake.head().y).to.equal(currentY);
    })
  });

  context("Slang staat op onderrand", function() {
    it("Beweegt naar beneden, maar kan niet", function() {
      init();
      snake.head().y = YMAX;
      var currentY = snake.head().y;
      move(DOWN);
      expect(snake.head().y).to.equal(currentY);
    });
    it("Beweegt naar boven", function() {
      init();
      snake.head().y = YMAX;
      var currentY = snake.head().y;
      move(UP);
      expect(snake.head().y).to.equal(currentY - STEP);
    });
    it("Beweegt naar links", function() {
      init();
      snake.head().y = YMAX;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      move(LEFT);
      expect(snake.head().x).to.equal(currentX - STEP);
      expect(snake.head().y).to.equal(currentY);
    });
    it("Beweegt naar rechts", function() {
      init();
      snake.head().y = YMAX;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      move(RIGHT);
      expect(snake.head().x).to.equal(currentX + STEP);
      expect(snake.head().y).to.equal(currentY);
    });
  });
});

describe("#Element.prototype.collidesWithOneOf(elements)", function() {
  context("Slang is net aangemaakt, staat midden in speelveld", function() {
    it("Slang heeft geen collision met voedselelementen", function() {
      init();
      foods.forEach(food => expect(food.collidesWithOneOf(snake.segments)).to.equal(false));
    });
    it("Voedselelementen hebben geen collisions onderling", function() {
      init();
      while(foods.length > 0) {
        var poppedFood = foods.pop();
        expect(poppedFood.collidesWithOneOf(foods)).to.equal(false);
      }
    });
    it("Slang raakt zichzelf, één loss meer dan hiervoor", function() {
      init();
      var currentLosses = game.losses;
      move(DOWN);
      expect(game.losses).to.equal(currentLosses + 1);
    });
    it("Slang raakt zichzelf niet, game gaat door", function() {
      init();
      var currentLosses = game.losses;
      move(RIGHT);
      move(UP);
      move(LEFT);
      expect(game.losses).to.equal(currentLosses);
    })
  });
});

describe("#eat()", function() {
  context("Spel is net geïnitaliseerd, vijftien stuks voedsel beschikbaar", function() {
    it("Voedsel wordt gegeten, voedsel niet langer beschikbaar", function() {
      init();
      var foodToEat = foods[0];
      eat(foodToEat.x, foodToEat.y);
      expect(foods.filter(food => food.x === foodToEat.x && food.y === foodToEat.y).length).to.equal(0);
    });
    it("Voedsel wordt gegeten, aantal voedselstukken is verlaagd naar 14", function() {
      init();
      var foodToEat = foods[0];
      eat(foodToEat.x, foodToEat.y);
      expect(foods.length).to.equal(NUMFOODS-1);
    });
    it("Alle voedsel wordt gegeten, aantal voedselstukken is verlaagd naar 0", function() {
      init();
      foods.forEach(food => eat(food.x, food.y));
      expect(foods.length).to.equal(0);
    });
    it("Alle voedselstukjes zijn opgegeten, game heeft één win verkregen", function() {
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
        food.x = snake.head().x + STEP;
        food.y = snake.head().y;
        move(RIGHT);
      });

      expect(game.wins).to.equal(currentWins+1);
      expect(game.losses).to.equal(currentLosses);
      expect(game.plays).to.equal(currentPlays);
    });
  });
});

describe("#Game.protoytype.win()", function() {
  context("Spel is net geïnitialiseerd, game is nog leeg.", function() {
    it("Game wordt gewonnen, aantal wins gaat met één omhoog", function() {
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
describe("#Game.prototype.lose()", function() {
  context("Spel is net geïnitaliseerd, game is nog leeg", function() {
   it("Game wordt verloren, aantal losses gaat met één omhoog", function() {
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
});

describe("#Game.prototype.save() & #Game.prototype.load()", function() {
  context("Spel is al een tijdje bezig, er zijn wat wins, losses en plays genoteerd.", function() {
    it("Game wordt opgeslagen, game wordt opnieuw geïnitaliseerd en daarna geladen. Gamestatus moet gelijk zijn aan voor het opslaan.", function() {
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