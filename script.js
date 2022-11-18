const gameContainer = document.getElementById("game");
const cards = document.querySelectorAll(".card");
let numCards = cards.length;
let c1 = null; // The Current flipped cards
let c2 = null;
let m1 = null; // The Current flipped cards
let m2 = null;
let matches = 0; // Count of matches (pairs)
let currentScore = 0;
let lowScore = localStorage.getItem("low-score");
let start = document.getElementById("start-page");

const mods = ['autopilot', 'autoplay', 'doubletime', 'easy', 'flashlight', 'halftime', 'hardrock', 'hidden', 'nightcore', 'nofail', 'perfect', 'relax', 'spunout', 'suddendeath', 'target'];

if(lowScore){
	document.getElementById("high-score").innerText = lowScore;
}else{
	document.getElementById("high-score").innerText = "-";
}

for(let card of cards){
	card.addEventListener("click", handleCardClick);
}

const startButton = document.getElementById("start-button");
startButton.addEventListener("click", startGame)

function shuffle(array) {
	let counter = array.length;
	while (counter > 0) {
		let index = Math.floor(Math.random() * counter);
		counter--;

		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}
	return array;
}

function handleCardClick(event) {
	if((c1 != null) && (c2 != null)){return};
	if(event.target.classList.contains("flipped")){return};
	let card = event.target.parentNode.parentNode;
	let currMod = card.children[1].children[0];
	event.target.classList.toggle("flipped");
	currMod.classList.toggle("flipped");
	if(c1 === null){
		c1 = card;
		m1 = currMod;
	}else{
		c2 = card;
		m2 = currMod;
		setScore(++currentScore);
	}
	if((c1 != null) && (c2 != null)){
		if(m1.classList[0] == m2.classList[0]){
			c1.removeEventListener("click", handleCardClick);
			c2.removeEventListener("click", handleCardClick);
			c1 = null;
			c2 = null;
			matches++;
		}else{
			setTimeout(function(){
				c1.children[0].children[0].classList.toggle("flipped");
				c2.children[0].children[0].classList.toggle("flipped");
				m1.classList.toggle("flipped");
				m2.classList.toggle("flipped");
				c1 = null;
				c2 = null;
			}, 1000);
		}
	}
	if(matches == cards.length / 2){endGame()};
}

function setScore(score){
	currentScore = score;
	document.getElementById("current-score").innerText = score;
}

function startGame(){
	setScore(currentScore);
	start.classList.add("playing");
	let idxs = [];
	for(let i = 0; i < numCards / 2; i++){
		idxs.push(i.toString());
	}
	let pairs = shuffle(idxs.concat(idxs));

	for(let i = 0; i < cards.length; i++) {
		let path = `imgs/selection-mod-${mods[pairs[i]]}.png`;
		cards[i].children[1].children[0].src = path;
		cards[i].children[1].children[0].classList = mods[pairs[i]];
	}
}

function endGame(){
	let end = document.getElementById("end");
	let scoreH2 = end.children[1];
	if(currentScore <= lowScore || lowScore == null){
		scoreH2.innerText = `Score: ${currentScore} - NEW HIGH SCORE!`;
		localStorage.setItem("low-score", currentScore);
	}else{
		scoreH2.innerText = `Score: ${currentScore}`;
	}
	end.classList.toggle("game-over");
	let playAgain = document.getElementById("play-again");
	playAgain.addEventListener("click", function(){location.href='index.html'});
}
