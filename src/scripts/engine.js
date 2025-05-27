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
const pathAudio = "src/assets/audios/"

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

    await showCardFieldsImages();

    await hiddenCardDetails();

    state.fieldCards.player.setAttribute("data-id", cardId);

    await drawCardsInFields(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore(duelResults);
    await drawButton(duelResults);
}

async function drawCardsInFields(cardId, computerCardId){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showCardFieldsImages(){
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
}

async function hiddenCardDetails(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Draw";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "Win";
        state.score.playerScore++;
    }
    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "Lose";
        state.score.computerScore++;
    }
    await playAudio(duelResults.toLowerCase());
    return duelResults;
}

async function drawButton(duelResults) {
    state.actions.button.innerText = duelResults;
    state.actions.button.style.display = "block";
}

async function updateScore(duelResults) {
    state.score.scoreBox.innerText = 
        `Win: ${state.score.playerScore} - Lose: ${state.score.computerScore}`;
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

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(audioFile) {

    const audio = new Audio(`${pathAudio}${audioFile}.wav`);
    audio.volume = 0.3; // Set volume to 50%
    audio.play().catch(error => {
        console.error("Error playing audio:", error);
    });
}

function init(){
    drawCards(5, state.playersSides.player1);
    drawCards(5, state.playersSides.computer);
}

init();