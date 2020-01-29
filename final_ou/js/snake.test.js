"use strict";
describe("#snake.init()", ()=> {
  context("Zonder input", ()=> {
    it("Maakt nieuwe slang van 2 segmenten", ()=> {
      snake.init();
      expect(model.state.snake.length).to.equal(2);
    });
    it("Vijf stuks voedsel aangemaakt", ()=> {
      snake.init();
      expect(model.state.food.length).to.equal(5);
    });
  });
});

describe("#snake.stop()", ()=> {
  context("Zonder input", ()=> {
    it("Haalt slang weg", ()=> {
      snake.stop();
      expect(model.state.snake.length).to.equal(0);
    });
    it("Al het voedsel weggehaald", ()=> {
      snake.stop();
      expect(model.state.food.length).to.equal(0);
    });
  });
});

describe ("#snake.canMove()", ()=> {
  context("Slang is net aangemaakt, staat midden in speelveld", ()=> {
    it("Beweeg omhoog (direction UP)", ()=> {
      snake.init();
      expect(snake.canMove(model.state.snake, snake.UP)===true);
    });
    it("Beweeg omlaag (direction DOWN)", ()=> {
      snake.init();
      expect(snake.canMove(model.state.snake, snake.DOWN)===true);
    });
    it("Beweeg naar rechts (direction RIGHT)", ()=> {
      snake.init();
      expect(snake.canMove(model.state.snake, snake.RIGHT)===true);
    });
    it("Beweeg naar links (direction LEFT)", ()=> {
      snake.init();
      expect(snake.canMove(model.state.snake, snake.LEFT)===true);
    });
  });

  context("Slang staat op grens", () => {
    it("Slang op linkergens; kan niet naar links (direction LEFT), wel andere richtingen", ()=> {
      snake.init();
      // Zet hoofd van slang op minX
      snake.head().x = snake.minX;
      expect(snake.canMove(model.state.snake, snake.RIGHT) === true);
      expect(snake.canMove(model.state.snake, snake.LEFT)===false);
      expect(snake.canMove(model.state.snake, snake.UP) === true);
      expect(snake.canMove(model.state.snake, snake.DOWN) === true);
    });
    it("Slang op rechterrens; kan niet naar rechts (direction RIGHT), wel andere richtingen", ()=> {
      snake.init();
      // Zet hoofd van slang op maxX
      snake.head().x = snake.maxX;
      expect(snake.canMove(model.state.snake, snake.RIGHT) === false);
      expect(snake.canMove(model.state.snake, snake.LEFT)===true);
      expect(snake.canMove(model.state.snake, snake.UP) === true);
      expect(snake.canMove(model.state.snake, snake.DOWN) === true);
    });
    it("Slang op bovengrens; kan niet naar boven (direction UP), wel andere richtingen", ()=> {
      snake.init();
      // Zet hoofd van slang op minY
      snake.head().y = snake.minY;
      expect(snake.canMove(model.state.snake, snake.RIGHT)===true);
      expect(snake.canMove(model.state.snake, snake.LEFT)===true);
      expect(snake.canMove(model.state.snake, snake.UP)===false);
      expect(snake.canMove(model.state.snake, snake.DOWN)===true);
    });
    it("Slang op benedengrens; kan niet naar beneden (direction DOWN), wel andere richtingen", ()=> {
      snake.init();
      // Zet hoofd van slang op maxY
      snake.head().y = snake.maxY;
      expect(snake.canMove(model.state.snake, snake.RIGHT)===true);
      expect(snake.canMove(model.state.snake, snake.LEFT)===true);
      expect(snake.canMove(model.state.snake, snake.UP)===true);
      expect(snake.canMove(model.state.snake, snake.DOWN)===false);
    });
  });
});

describe("#snake.move(snake.)", ()=> {
  context("Slang is net aangemaakt, staat midden in speelveld", ()=> {
    it("Slang beweegt stap naar rechts", ()=> {
      snake.init();
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      snake.move(snake.RIGHT);
      // Wel naar rechts
      expect(snake.head().x === currentX + snake.STEP);
      // Niet omhoog of omlaag
      expect(snake.head().y === currentY);
    });
    it("Slang beweegt stap naar links", ()=> {
      snake.init();
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      snake.move(snake.LEFT);
      // Wel naar links
      expect(snake.head().x === currentX - snake.STEP);
      // Niet omhoog of omlaag
      expect(snake.head().y === currentY);
    });
    it("Slang beweegt stap naar beneden", ()=> {
      snake.init();
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      snake.move(snake.RIGHT);
      snake.move(snake.DOWN);
      // Niet naar links of rechts
      expect(snake.head().x === currentX + snake.STEP);
      // Wel omlaag
      expect(snake.head().y === currentY + snake.STEP);
    });
    it("Slang beweegt stap omhoog", ()=> {
      snake.init();
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      snake.move(snake.UP);
      // Niet naar links of rechts
      expect(snake.head().x===currentX);
      // Wel omhoog
      expect(snake.head().y===currentY - snake.STEP);
    });
    it("Slang staat naast voedselstukje, eet deze op en wordt één segment langer", ()=> {
      snake.init();
      var currentSnakeLength = model.state.snake.length;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      var food = model.state.food[0];
      // Voorkomen dat we proberen een extra voedselstukje op die locatie te plaatsen als er al één staat.
      // Als die er staat pakken we dat voedselstukje; anders pakken we het eerste voedselstukje en plaatsen die op de juiste plek.
      if(model.state.food.filter(foundFood => foundFood.x === (currentX + snake.STEP) && foundFood.y === currentY).length > 0) {
        food = model.state.food.filter(foundFood => foundFood.x === (currentX + snake.STEP) && foundFood.y === currentY)[0];
      } else {
        food.x = currentX + snake.STEP;
        food.y = currentY;
      }
      snake.move(snake.RIGHT);
      expect(model.state.snake.length===currentSnakeLength + 1);
      expect(model.state.food.length===snake.NUMFOODS - 1);
    });
    it("Slang eet alle voedselstukjes op, wordt totaal aantal voedselstukjes langer, voedsel is op", ()=> {
      snake.init();
      var currentSnakeLength = model.state.snake.length;
      // Plaats eerst slang helemaal linksboven om te voorkomen dat we over "onszelf" heen lopen
      var offset = 0;
      model.state.snake.forEach(segment => {
        segment.x = snake.STEP + offset;
        segment.y = snake.STEP;
        offset += snake.STEP;
      });

      model.state.food.forEach(food => {
        food.x = snake.head().x + snake.STEP;
        food.y = snake.head().y;
        snake.move(snake.RIGHT);
      });
      expect(model.state.food.length===0);
      expect(model.state.snake.length===currentSnakeLength + snake.NUMFOODS);
    });
  });

  context("Slang staat op linkerrand", ()=> {
    it("Beweegt naar links, maar kan niet", ()=> {
      snake.init();
      snake.head().x = snake.minX;
      var currentX = snake.head().x;
      snake.move(snake.LEFT);
      expect(snake.head().x===currentX);
    });
    it("Beweegt naar rechts", ()=> {
      snake.init();
      snake.head().x = snake.minX;
      var currentX = snake.head().x;
      snake.move(snake.RIGHT);
      expect(snake.head().x===currentX + snake.STEP);
    });
    it("Beweegt naar boven", ()=> {
      snake.init();
      snake.head().x = snake.minX;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      snake.move(snake.UP);
      expect(snake.head().x===currentX);
      expect(snake.head().y===currentY - snake.STEP);
    });
    it("Beweegt naar beneden", ()=> {
      snake.init();
      snake.head().x = snake.minX;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      snake.move(snake.DOWN);
      expect(snake.head().x===currentX);
      expect(snake.head().y===currentY + snake.STEP);
    });
  });

  context("Slang staat op rechterrand", ()=> {
    it("Beweegt naar rechts, maar kan niet", ()=> {
      snake.init();
      snake.head().x = snake.maxX;
      var currentX = snake.head().x;
      snake.move(snake.RIGHT);
      expect(snake.head().x===currentX);
    });
    it("Beweegt naar links", ()=> {
      snake.init();
      snake.head().x = snake.maxX;
      var currentX = snake.head().x;
      snake.move(snake.LEFT);
      expect(snake.head().x===currentX - snake.STEP);
    });
    it("Beweegt naar boven", ()=> {
      snake.init();
      snake.head().x = snake.maxX;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      snake.move(snake.UP);
      expect(snake.head().x===currentX);
      expect(snake.head().y===currentY - snake.STEP);
    });
    it("Beweegt naar beneden", ()=> {
      snake.init();
      snake.head().x = snake.maxX;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      snake.move(snake.DOWN);
      expect(snake.head().x===currentX);
      expect(snake.head().y===currentY + snake.STEP);
    });
  });

  context("Slang staat op bovenrand", ()=> {
    it("Beweegt naar boven, maar kan niet", ()=> {
      snake.init();
      snake.head().y = snake.minY;
      var currentY = snake.head().y;
      snake.move(snake.UP);
      expect(snake.head().y===currentY);
    });
    it("Beweegt naar beneden", ()=> {
      snake.init();
      snake.head().y = snake.minY;
      var currentY = snake.head().y;
      snake.move(snake.DOWN);
      expect(snake.head().y===currentY + snake.STEP);
    });
    it("Beweegt naar links", ()=> {
      snake.init();
      snake.head().y = snake.minY;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      snake.move(snake.LEFT);
      expect(snake.head().x===currentX - snake.STEP);
      expect(snake.head().y===currentY);
    });
    it("Beweegt naar rechts", ()=> {
      snake.init();
      snake.head().y = snake.minY;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      snake.move(snake.RIGHT);
      expect(snake.head().x===currentX + snake.STEP);
      expect(snake.head().y===currentY);
    })
  });

  context("Slang staat op onderrand", ()=> {
    it("Beweegt naar beneden, maar kan niet", ()=> {
      snake.init();
      snake.head().y = snake.maxY;
      var currentY = snake.head().y;
      snake.move(snake.DOWN);
      expect(snake.head().y===currentY);
    });
    it("Beweegt naar boven", ()=> {
      snake.init();
      snake.head().y = snake.maxY;
      var currentY = snake.head().y;
      snake.move(snake.UP);
      expect(snake.head().y===currentY - snake.STEP);
    });
    it("Beweegt naar links", ()=> {
      snake.init();
      snake.head().y = snake.maxY;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      snake.move(snake.LEFT);
      expect(snake.head().x===currentX - snake.STEP);
      expect(snake.head().y===currentY);
    });
    it("Beweegt naar rechts", ()=> {
      snake.init();
      snake.head().y = snake.maxY;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      snake.move(snake.RIGHT);
      expect(snake.head().x===currentX + snake.STEP);
      expect(snake.head().y===currentY);
    });
  });
});

describe("#snake.collidesWithOneOf(element, elements)", ()=> {
  context("Slang is net aangemaakt, staat midden in speelveld", ()=> {
    it("Slang heeft geen collision met voedselelementen", ()=> {
      snake.init();
      model.state.food.forEach(food => expect(snake.collidesWithOneOf(food, model.state.snake) === false));
    });
    it("Voedselelementen hebben geen collisions onderling", ()=> {
      snake.init();
      while(model.state.food.length > 0) {
        expect(snake.collidesWithOneOf(model.state.food.pop(), model.state.food) === false);
      }
    });
    it("Slang raakt zichzelf niet, game gaat door", ()=> {
      snake.init();
      var currentLosses = game.losses;
      snake.move(snake.RIGHT);
      snake.move(snake.UP);
      snake.move(snake.LEFT);
      expect(game.losses).to.equal(currentLosses);
    })
  });
});

describe("#snake.eat()", ()=> {
  context("Spel is net geïnitaliseerd, vijftien stuks voedsel beschikbaar", ()=> {
    it("Voedsel wordt gegeten, voedsel niet langer beschikbaar", ()=> {
      snake.init();
      var foodToEat = model.state.food[0];
      snake.eat(foodToEat.x, foodToEat.y);
      expect(model.state.food.filter(food => food.x === foodToEat.x && food.y === foodToEat.y).length).to.equal(0);
    });
    it("Voedsel wordt gegeten, aantal voedselstukken is verlaagd naar 14", ()=> {
      snake.init();
      var foodToEat = model.state.food[0];
      snake.eat(foodToEat.x, foodToEat.y);
      expect(model.state.food.length === snake.NUMFOODS-1);
    });
    it("Alle voedsel wordt gegeten, aantal voedselstukken is verlaagd naar 0", ()=> {
      snake.init();
      model.state.food.forEach(food => snake.eat(food.x, food.y));
      expect(model.state.food.length === 0);
    });
    it("Alle voedselstukjes zijn opgegeten, game heeft één win verkregen", ()=> {
      snake.init();
      var currentWins = model.stats.wins;
      var currentLosses = model.stats.played - model.stats.wins;
      var currentPlays = model.stats.played;

      // Plaats eerst slang helemaal linksboven om te voorkomen dat we over "onszelf" heen lopen
      var offset = 0;
      model.state.snake.forEach(segment => {
        segment.x = snake.STEP + offset;
        segment.y = snake.STEP;
        offset += snake.STEP;
      });

      model.state.food.forEach(food => {
        food.x = snake.head().x + snake.STEP;
        food.y = snake.head().y;
        snake.move(snake.RIGHT);
      });

      // Vanwege de "snelheid" van de slang moeten we even wachten voor resultaat
      setTimeout(1000, () => {
        expect(model.stats.wins).to.equal(currentWins+1);
        expect(model.stats.played - model.stats.wins).to.equal(currentLosses);
        expect(model.stats.played).to.equal(currentPlays);
      });
    });
  });
});

describe("#game.result(true)", ()=> {
  context("Spel is net geïnitialiseerd, game is nog leeg.", ()=> {
    it("Game wordt gewonnen, aantal wins gaat met één omhoog", ()=> {
      var currentWins = model.stats.wins;
      var currentLosses = model.stats.played - model.stats.wins;
      var currentPlays = model.stats.played;
      game.result(true);
      // Ververs de stats na de game.result (die saved naar localStorage/server)
      model.stats = game.stats();
      // Er moet één win zijn bijgeschreven in de game
      expect(model.stats.wins).to.equal(currentWins+1);
      expect(model.stats.played).to.equal(currentPlays + 1);
      // Deze mogen niet veranderd zijn door de aanroep naar game.result(true)
      expect(model.stats.played - model.stats.wins).to.equal(currentLosses);
    });
  });
});
describe("#game.result(false)", ()=> {
  context("Spel is net geïnitaliseerd, game is nog leeg", ()=> {
   it("Game wordt verloren, aantal losses gaat met één omhoog", ()=> {
      var currentWins = model.stats.wins;
      var currentLosses = model.stats.played - model.stats.wins;
      var currentPlays = model.stats.played;
      game.result(false);
      // Ververs de stats na de game.result (die saved naar localStorage/server)
      model.stats = game.stats();
      expect(model.stats.played - model.stats.wins).to.equal(currentLosses + 1);
      expect(model.stats.played).to.equal(currentPlays + 1);
      // Deze mogen niet veranded zijn door de aanroep naar game.result(false)
      expect(model.stats.wins).to.equal(currentWins);
   });
  });
  it("Slang raakt zichzelf, één loss meer dan hiervoor", ()=> {
    snake.init();
    var currentLosses = model.stats.played - model.stats.wins;
    snake.move(snake.DOWN);
    // Vanwege de "snelheid" van de slang moeten we even wachten voor resultaat
    setTimeout(1000, () => {
      expect(model.stats.played - model.stats.wins).to.equal(currentLosses + 1);
    });
  });
});