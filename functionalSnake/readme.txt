readme

Uitgangspunten voor het programmeren van Snake:

We programmeren volgens een functionele stijl daarbij houden we wel rekening met het feit dat JavaScript functionele mogelijkheden heeft, maar niet functioneel is.

Hoewel we via een library als immutable en ramda zouden kunnen gebruiken, zonder gebruik te maken van statisch typeren is JavaScript nooit puur functioneel 

Puur functioneel zou betekenen dat we moeten programmeren in een combinatie van typescript/rambda en dat is een stap te ver.

Wat betekent dan programmeren in de functionele stijl voor ons?

- Functies zijn zelfstandige entiteiten.  

- Alles is eigenlijk een functie, een first class citizen. 

- Hoewel JS geen ADT's kent, gebruiken we object literals als ADT. Met het voorgaande in gedachte hebben onze object literals geen gedrag. Oftewel geen methodes.

- Hoewel we geen immutables datastructuren gebruiken (maar de simpele array) behandelen we die wel als immutable, door bv slice en concat te gebruiken ipv shift en push.

- We streven totaliteit na in het schrijven van de functies en strooien niet met errors. bv als we een functie schrijven zevenGedeeldDoor dan kan hij niet het functietype int -> int hebben
  Maar iets als int -> (belofte van een int) 
  
- Er zijn geen decoratiefuncties als createSegment. Onze voorkeur gaat uit naar één functie waarbij een eventueel verschil als parameter wordt meegeven. BV createElement(r, x, y, color) 

- Waar mogelijk maken gebruik van chaining om nieuwe functie te schrijven

- We gebruiken lambda's ipv anonieme functies lambda's hebben geen this en ook geen this conflicten dus

- We gebruiken recursion ipv iterators voor alle functies waarvoor geldt: maximale recursiediepte <10000 (limiet JavaScript/node) 

Als een logische conclusie van het bovenstaande hebben wij jullie functie createFoods danig verbouwd. Enkele andere functies hebben wij laten vallen. 

Daarmee is snake 15% gereduceerd in function count, waarvan wij zeggen dat dit ten goede komt aan de onderhoudbaarheid. 



Uitgangspunten voor het spel Snake:

Het spel Snake is in essentie niet meer dan het manipuleren van twee lijsten van het type Element.

Elementen onderscheiden zich alleen maar via kleur of het elementen van lijst food zijn of van lijst snake

De lijsten onderscheiden zich alleen maar door dat de lijst snake elementen bevat die aaneengesloten zijn 

Een lijst kan ook leeg zijn. 

Omdat we programmeren in een functionele stijl maar niet puur functioneel houden we MVC aan. 

We hebben onderzoek naar het SAM patroon gedaan zijn wij niet helemaal overtuigd dat dit een oplossing is voor het scheiden van concerns in een puur functioneel geprogrammeerd project.

Wat we wel meenemen is het idee van een view als een pure functie View = Model(Controller(action))

Een concept dat ook in REACT wordt uitgewerkt. 

Met dat concept in gedachte is Snake niet meer dan een state. Elke keer als het model verandert, verandert de state, de view laat die verandering zien.

Er is wat discussie mogelijk over wat MVC nu eigenlijk is, een eenduidige definitie (recept) ontbreekt wat ons betreft. Wij gaan uit van Wikipedia (het model update de view, doet dit niet rechtstreeks)



  







