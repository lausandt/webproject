"use strict";
describe("#init()", function() {
  context("Zonder input", function() {
    it("Maakt nieuwe slang van 2 segmenten", function() {
      init();
      expect(snake.segments.length).to.equal(2);
    });
    it("Vijftien stuks voedsel aangemaakt", function() {
      init();
      expect(foods.length).to.equal(15);
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
      move(DOWN);
      // Niet naar links of rechts
      expect(snake.head().x).to.equal(currentX);
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
      food.x = currentX + STEP;
      food.y = currentY;
      move(RIGHT);
      expect(snake.segments.length).to.equal(currentSnakeLength + 1);
      expect(foods.length).to.equal(NUMFOODS - 1);
    });
    it("Slang eet alle voedselstukjes op, wordt totaal aantal voedselstukjes langer, voedsel is op", function() {
      init();
      //TODO: Fix probleem met slang die over zichzelf heen beweegt.
      //      Probleem ontstaat wanneer we collision tussen head en slang bouwen.
      var currentSnakeLength = snake.segments.length;
      foods.forEach(food => {
        food.x = snake.head().x + STEP;
        food.y = snake.head().y;
        move(RIGHT);
        move(LEFT);
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
    it("Beweegt naar boven en beneden", function() {
      init();
      snake.head().x = XMIN;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      move(UP);
      expect(snake.head().x).to.equal(currentX);
      expect(snake.head().y).to.equal(currentY - STEP);
      move(DOWN);
      expect(snake.head().x).to.equal(currentX);
      expect(snake.head().y).to.equal(currentY);
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
    it("Beweegt naar boven en beneden", function() {
      init();
      snake.head().x = XMIN;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      move(UP);
      expect(snake.head().x).to.equal(currentX);
      expect(snake.head().y).to.equal(currentY - STEP);
      move(DOWN);
      expect(snake.head().x).to.equal(currentX);
      expect(snake.head().y).to.equal(currentY);
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
    it("Beweegt naar boven en beneden", function() {
      init();
      snake.head().y = YMIN;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      move(LEFT);
      expect(snake.head().x).to.equal(currentX - STEP);
      expect(snake.head().y).to.equal(currentY);
      move(RIGHT);
      expect(snake.head().x).to.equal(currentX);
      expect(snake.head().y).to.equal(currentY);
    });
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
    it("Beweegt naar boven en beneden", function() {
      init();
      snake.head().y = YMAX;
      var currentX = snake.head().x;
      var currentY = snake.head().y;
      move(LEFT);
      expect(snake.head().x).to.equal(currentX - STEP);
      expect(snake.head().y).to.equal(currentY);
      move(RIGHT);
      expect(snake.head().x).to.equal(currentX);
      expect(snake.head().y).to.equal(currentY);
    });
  });
});

describe("#Element.prototype.collidesWithOneOf", function() {
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
  });
});