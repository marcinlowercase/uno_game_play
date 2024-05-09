
let newColor;


//Tell the library which element to use for the table
cards.init({table:'#room'});

//Create a new deck of cards
deck = new cards.Deck();
//By default it's in the middle of the container, put it slightly to the side
deck.x -= 50;

//cards.all contains all cards, put them all in the deck
deck.addCards(cards.all);
//No animation here, just get the deck onto the table.
deck.render({immediate:true});

//Now lets create a couple of hands, one face down, one face up.
upperhand = new cards.Hand({faceUp:false, y:60});
lowerHand = new cards.Hand({faceUp:true,  y:700})
// lowerLeftHand = new cards.Hand({faceUp:false,  y:700, x: 200})
// lowestLeftHand = new cards.Hand({faceUp:false,  y:490, x: 200})
// upperLeftHand = new cards.Hand({faceUp:false,  y:280, x: 200})




//Lets add a discard pile
discardPile = new cards.Deck({faceUp:true});
discardPile.x += 50;


//Let's deal when the Deal button is pressed:
$('#deal').click(function() {
	//Deck has a built-in method to deal to hands.
	$('#deal').hide();
	deck.deal(7, [upperhand, lowerHand], 50, function() {
		//This is a callback function, called when the dealing
		//is done.
		discardPile.addCard(deck.topCard());
		discardPile.render();
		while (discardPile.topCard().type == -1){
			deck.addCard(discardPile.topCard());
			cards.shuffle(deck);
			discardPile.addCard(deck.topCard());
			discardPile.render();
		}
		setColor(discardPile.topCard().color);
	});
});


//When you click on the top card of a deck, a card is added
//to your hand
deck.click(function(card){
	if (card === deck.topCard()) {
		lowerHand.addCard(deck.topCard());
		lowerHand.render();
	}
});

//Finally, when you click a card in your hand, if it's
//the same suit or rank as the top card of the discard pile
//then it's added to it


lowerHand.click(function(card){



	if (card.color === discardPile.topCard().color
		|| card.type === discardPile.topCard().type
		|| card.type === -1
		|| card.color === newColor) {
		newColor = '';

		setColor(card.color);


		discardPile.addCard(card);
		discardPile.render();
		lowerHand.render();

		if (card.type === 10) {
			upperhand.addCard(deck.topCard());
			// Next Player
			upperhand.addCard(deck.topCard());
			upperhand.render();
		} else if (card.type === -1){
			if (card.color == 'p4'){
				upperhand.addCard(deck.topCard());
				upperhand.addCard(deck.topCard());
				upperhand.addCard(deck.topCard());
				upperhand.addCard(deck.topCard());
				// Next Player
				upperhand.render();
				openPopup();

			} else if (card.color = 'w') {
				openPopup();
			}
		}

	}

});

// Pick Color
function openPopup() {
	document.getElementById("color-popup").classList.remove("hidden");
}

document.getElementById("red").onclick = function (){
	setColor('r');
	document.getElementById("color-popup").classList.add("hidden");
};
document.getElementById("blue").onclick = function (){
	setColor('b');
	document.getElementById("color-popup").classList.add("hidden");
};
document.getElementById("green").onclick = function (){
	setColor('g');
	document.getElementById("color-popup").classList.add("hidden");
};
document.getElementById("yellow").onclick = function (){
	setColor('y');
	document.getElementById("color-popup").classList.add("hidden");
};

function setColor(color){
	switch (color){
		case 'r':
			newColor = 'r';
			document.getElementById("card-table").style.border = "solid 40px #D72600";
			break;
		case 'b':
			newColor = 'b';
			document.getElementById("card-table").style.border = "solid 40px #0956BF";
			break;
		case 'g':
			newColor = 'g';
			document.getElementById("card-table").style.border = "solid 40px #379711";
			break;
		case 'y':
			newColor = 'y';
			document.getElementById("card-table").style.border = "solid 40px #ECD407";
			break
	}
}

