Opmerkingen mbt de code.

Waar mogelijk hebben we de code geschreven in een functionele stijl. Voor ons houdt dat de volgende zaken in:

Functies doen zo veel mogelijk één ding. Als een functie meerdere zaken moet uitvoeren dan brengen we de benodigde functionaliteit zoveel mogelijk onder in hulpfuncties

Variabelen worden zoveel mogelijk vermeden, en alleen gebruikt om de code duidelijker te maken voor de lezer.

Het gebruik van var result wordt dan ook vermeden (dit itt jullie voorkeur). Het hebben van 1 resultaat verduidelijk wat ons betreft de code niet. Wij zijn van mening dat dit de cause/effect relatie eerder vertroebelt en gaan
voor een Haskell-achtige oplossing. Ter verduidelijking van ons argument de volgende Haskell interpratie van canMove, elke keuze heeft zijn eigen gevolg. 

canMove :: String -> Bool
canMove xs | xs == UP    = heady >= YMIN
           | xs == DOWN  = heady <= YMAX
           | xs == LEFT  = headx >= XMIN
           | xs == RIGHT = headx <= XMAX
           | otherwise   = False        

Waar mogelijk worden lambda's (=>) gebruikt ipv anonieme functies. 

- Het gebruik van lambda's is in onze opinie zuiverder dan anonieme functies want ipv de interpreter te vertellen hoe het iets moet doen, vertellen we het wat gedaan moet worden
- Tevens lost het gebruik van lambda's jullie aandachtspunt met this.color op (zie pagina 7 van de projectomschrijving) bv in onze oplossing:

Element.prototype.collidesWithOneOf = function (elements) {
    return elements.map(element => this.x === element.x && this.y === element.y).some(bool => bool===true);
};

Waar mogelijk worden functies zoals map, filter, en reduce (ism lambda's) gebruikt om de code in te korten en leesbaar te houden. 

 





