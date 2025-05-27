const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points'),
    },
    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    actions: {
        button: document.getElementById('next-duel'),
    },
};

const playersSides = {
    player1: "player-field-card",
    computer: "computer-field-card",
}


const pathImages = "src/assets/icons/"

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
];

async function drawCards(cardNumbers, fieldSide) {
    for (card of cardNumbers) {
        const radomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(radomIdCard, fieldSide);

        Document.getElementById(fieldSide).appendChild(cardImage);
    }
}

function init(){
    drawCards(5, playersSides.player1);
    drawCards(5, playersSides.computer);

}

init();