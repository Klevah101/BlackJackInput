const readline = require('readline');
const rl = readline.createInterface({
    output: process.stdout,
    input: process.stdin
})

const winningScore = 21;
const faceCards = "JQKA"; // maybe move into a deck at last index to keep everything together
const playerCards = []; // move to gamedata
const dealerCards = []; // move to gamedata
const regularDeck = ["Hearts", "Diamonds", "Spades", "Clubs"]
let playerScore = 0; // move to gamedata
let dealerScore = 0; // move to gamedata

let playersTurn = true;

let deck = [];
createDeck(deck, regularDeck);
shuffleDeck(deck);
dealerCards.push(deck.pop(), deck.pop());
playerCards.push(deck.pop(), deck.pop());


let gameData = {
    playerScore: 0,
    dealerScore: 0,
    playersTurn: true
}

playPlayersHand(gameData);

function createDeck(deck, suits) {
    for (let j = 0; j < suits.length; j++) {
        for (let i = 2; i < 11; i++) {
            let obj = {}
            obj.suit = suits[j]
            obj.value = i;
            deck.push(obj);
        }
        for (let i = 0; i < faceCards.length; i++) {
            let obj = {}
            obj.suit = suits[j]
            obj.value = faceCards[i];
            deck.push(obj);
        }
    }
}

function shuffleDeck(deck) {
    for (let i = 0; i < deck.length - 1; i++) {
        randomNum = Math.floor((Math.random() * (deck.length - i))) + i;
        [deck[i], deck[randomNum]] = [deck[randomNum], deck[i]];
    }
}

function dealCard(deck, hand) {
    hand.push(deck.pop());
}

function addScore(cards) {
    let aceCount = 0;
    let aceSum = 0;
    let score = cards.reduce((acc, el) => {
        if (el.value === 'J' || el.value === 'K' || el.value === 'Q') return acc + 10;
        if (typeof el.value === 'number') return acc + el.value;
        return acc;
    }, 0)

    for (let i = 0; i < cards.length; i++) {
        if (cards[i].value === 'A') {
            aceCount++;
        }
    }

    // (╯°□°)╯︵ ┻━┻
    aceSum = aceCount * 11;
    for (let i = 0; i < aceCount; i++) {
        if (score + aceSum > 21) aceSum -= 10;
    }
    return score + aceSum;
}

function playPlayersHand(gameData) {

    gameData.playerScore = addScore(playerCards);
    if (gameData.playerScore > winningScore) {
        console.log(`You went over ${winningScore}!\nYou Lost!!\n(╯°□°)╯︵ ┻━┻`)
        console.log(showHand(playerCards, 'player').join(''))
        console.log(`Your final score was ${gameData.playerScore}...`)
        gameData.gameOver = true
        rl.close();
        return
    }else if(gameData.playerScore === winningScore){
        console.log("***BLACKJACK***")
        console.log("You Win!!!")
        console.log(`Your final score is ${gameData.playerScore}!!!`)
        return
    }
    rl.question(mainMenu(gameData), (input) => {
        if (input === '1') dealCard(deck, playerCards);
        if (input === '2') return playDealersHand(gameData)
        if (input === '3') return getDealerInfo(gameData);
        if (gameData.gameOver) {
            rl.close();
            return
        }
        if (gameData.playersTurn === true) return playPlayersHand(gameData);
        rl.close();
        return
    })
}

function playDealersHand(gameData) {
    gameData.dealerScore = addScore(dealerCards);
    if (gameData.dealerScore <= gameData.playerScore) {
        dealCard(deck, dealerCards);
        return playDealersHand(gameData);
    }
    if (gameData.dealerScore > gameData.playerScore && gameData.dealerScore <= winningScore) {
        console.log(showHand(dealerCards).join(''));
        console.log(`Dealer Wins!!\nFinal score\nDealer: ${gameData.dealerScore}\nPlayer : ${gameData.playerScore}`)
        rl.close();
        return
    }
    if (gameData.dealerScore > winningScore) {
        console.log(showHand(dealerCards).join(''));
        console.log("You Win!!");
        console.log(`Final score\nDealer: ${gameData.dealerScore}\nPlayer : ${gameData.playerScore}`)
        rl.close();
        return
    }
}

function getDealerInfo(gameData) {
    console.log(`The dealer is showing a ${dealerCards[0].value} of ${dealerCards[0].suit}.\n`);
    return playPlayersHand(gameData);
}

function mainMenu(gameData) {
    let array = [];
    array.push(...showHand(playerCards,'player'));
    array.push(`Your score is ${gameData.playerScore}.\n`)
    array.push(`Select your option.\n`)
    array.push(`1. Take a card.\n`);
    array.push(`2. Hold.\n`);
    array.push(`3. Look at dealer's card.\n`);
    return array.join('');
}

function showHand(cards, player) {
    let array = [];
    if (player === 'player') {
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].value === 'A' || cards[i].value === 8) array.push(`You have an ${cards[i].value} of ${cards[i].suit}.\n`)
            else array.push(`You have a ${cards[i].value} of ${cards[i].suit}.\n`)
        }
    } else {
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].value === 'A' || cards[i].value === 8) array.push(`The dealer has an ${cards[i].value} of ${cards[i].suit}.\n`)
            else array.push(`The dealer has a ${cards[i].value} of ${cards[i].suit}.\n`)
        }
    }
    return array;
}
