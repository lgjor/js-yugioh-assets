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
    playersSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById('next-duel'),
    },
};




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

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(cardId, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", cardId);
    cardImage.classList.add("card");

    if (fieldSide === state.playersSides.player1) {
        cardImage.addEventListener("mouseover", () => {
        drawSelectedCard(cardId);
        });
        
        cardImage.addEventListener('click', () =>{
            setCardsField(cardImage.getAttribute("data-id"));
        });    
    }
        return cardImage;    
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore(duelResults);
    await drawButton(duelResults);

}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "Vitoria";
        state.score.playerScore++;
    }
    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "Derrota";
        state.score.computerScore++;
    }
    return duelResults;
}

async function drawButton(duelResults) {
    state.actions.button.innerText = duelResults;
    state.actions.button.style.display = "block";
}

async function updateScore(duelResults) {
    state.score.scoreBox.innerText = 
        `Win: ${state.score.playerScore} - Lose: ${state.score.computerScore}`;

    if (state.score.playerScore >= 5) {
        alert("Parabens, voce venceu!");
        resetGame();
    } else if (state.score.computerScore >= 5) {
        alert("Que pena, voce perdeu!");
        resetGame();
    }
}


async function removeAllCardsImages(){
    // let cards = computerBOX; cards = player1BOX;
    let { computerBOX, player1BOX } = state.playersSides;

    let imageElements = computerBOX.querySelectorAll("img");
    imageElements.forEach((img) => { img.remove(); });

    
    imageElements = player1BOX.querySelectorAll("img");
    imageElements.forEach((img) => { img.remove(); });
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i=0; i < cardNumbers; i++) {
        const radomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(radomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function drawSelectedCard(IdCard) {
    state.cardSprites.avatar.setAttribute("src", cardData[IdCard].img);
    state.cardSprites.name.innerText = cardData[IdCard].name;
    state.cardSprites.type.innerText = "Atribute: "+cardData[IdCard].type;
}

function init(){
    drawCards(5, state.playersSides.player1);
    drawCards(5, state.playersSides.computer);

}

init();