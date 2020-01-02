Opmerkingen mbt de code.

Waar mogelijk hebben we de code geschreven in een functionele stijl. Voor ons houdt dat de volgende zaken in:

Functies doen zo veel mogelijk één ding. Als een functie meerdere zaken moet uitvoeren dan brengen we de benodigde functionaliteit zoveel mogelijk onder in hulpfuncties. 

Variabelen worden zoveel mogelijk vermeden, en alleen gebruikt om de code duidelijker te maken voor de lezer.

Het gebruik van var result wordt dan ook vermeden (dit itt jullie voorkeur). Het hebben van 1 resultaat verduidelijk wat ons betreft de code niet. Wij zijn van mening dat dit de cause/effect relatie eerder vertroebelt en gaan
voor een Haskell-achtige oplossing. Ter verduidelijking van ons argument de volgende Haskell interpratie van canMove, elke keuze heeft zijn eigen gevolg. 

canMove :: String -> Bool
canMove xs | xs == UP    = heady >= YMIN
           | xs == DOWN  = heady <= YMAX
           | xs == LEFT  = headx >= XMIN
           | xs == RIGHT = headx <= XMAX
           | otherwise   = False 

In JavaScript is de keuze voor switch/case met deze redenering in gedachte gauw gemaakt.

Waar mogelijk worden lambda's (=>) gebruikt ipv anonieme functies. 

- Het gebruik van lambda's is in onze opinie zuiverder dan anonieme functies want ipv de interpreter te vertellen hoe iets te doen, vertellen we wat gedaan moet worden en laten we hoe over aan de interpreter
- Tevens lost het gebruik van lambda's jullie aandachtspunt met this.color op (zie pagina 7 van de projectomschrijving). Bv in onze oplossing:

Element.prototype.collidesWithOneOf = function (elements) {
    return elements.map(element => this.x === element.x && this.y === element.y).some(bool => bool===true);
};

Waar mogelijk worden functies zoals map, filter, en reduce (ism lambda's) gebruikt om de code in te korten en leesbaar te houden. 

Het spreekt voor zich dat het compleet functioneel maken van snake.js een andere datastructuur vergt dan de huidige. Omdat dit verandering van jullie code vergt is dat natuurlijk niet gedaan. 

Wel hebben we de vrijheid genomen om jullie JSDOC aan te passen deze geeft errors ({[Element]} zou moeten zijn {Element[]}) en geeft aan dingen te retourneren terwijl dit niet het geval is. (Zie doc createFoods()) Opvallend is dat summations (bullits)  niet werken in JSDOC die gemaakt wordt met node.js (dit zou wel werken als gemaakt binnen eclipse maar is niet getest)  
 
Tests
Bij de tests hebben we gebruik gemaakt van Mocha en Chai. Er is gekeken naar de functionaliteiten die we hebben opgeleverd en elke functionaliteit wordt op meerdere manieren getest.
Waar we beginnen met een "happy flow"-test, gaan we daarna door naar tests die edge-cases afhandelen (Word je tegengehouden bij de rand van het canvas? Kan je nog een andere kant op als je op één van de randen staat?).
Tevens zijn er tests opgenomen die op dit moment nog werken maar zullen vervallen als we meer functionaliteit gaan toevoegen (denk hierbij aan collision tussen hoofd van slang en lichaam van slang).

Elke testcase bouwt zijn eigen state op om zodoende geen last te hebben van voorgaande tests; bijna overal wordt een init() uitgevoerd om het spel opnieuw te beginnen en alle onderdelen op een initiele staat te zetten, waarna we b.v. het snake-object verplaatsen voor de rest van de test.
De tests kunnen worden opgeroepen door test.html te openen. Deze maakt gebruik van snake.test.js om zodoende alle tests uit te voeren.