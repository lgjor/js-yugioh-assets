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
const victoryPhrases = [    
    "Essa foi fácil, né?",
    "Droga, a sorte não estava do meu lado dessa vez.",
    "Você ativou minha carta armadilha... o azar!",
    "Eu subestimei o coração das cartas... do meu oponente.",
    "O duelo foi seu, dessa vez.",
    "Acho que preciso de um novo baralho... ou de mais prática no Jokenpô!",
    "Game over... pra mim!",
    "Prepare-se, a revanche virá!",
    "Meu Kaiba interior não está feliz com isso.",
    "A próxima é minha, pode apostar!",
    "Bem jogado! Não pense que vai ser sempre assim."    
]

const losePhrases = [
    "Meu destino foi selado!",
    "O duelo é meu!",
    "O coração das cartas estava comigo!",
    "Eu invoco a vitória!",
    "Você ativou minha carta armadilha... Eu Venci!",
    "É hora do d-d-d-duelo... e da minha vitória!",
    "Game over!",
    "A supremacia é minha!",
    "Não subestime um mestre do Jokenpô!"
]

const drawPhrases = [
    "Empate! O duelo continua...",
    "Nenhum vencedor, por enquanto.",
    "O jogo está empatado, mas a batalha ainda não acabou.",
    "Um empate digno de um duelo épico!",
    "O destino decidiu que hoje não há vencedores.",
    "Empate! Vamos para a próxima rodada.",
    "O duelo termina em empate, mas a guerra continua.",
    "Nenhum vencedor, mas muitos desafios pela frente."
];

const typeMap = {
    "Paper": { WinOf: ["Rock"], LoseOf: ["Scissors"] },
    "Rock": { WinOf: ["Scissors"], LoseOf: ["Paper"] },
    "Scissors": { WinOf: ["Paper"], LoseOf: ["Rock"] },
};

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
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
    },
    {
        id: 3,
        name: "Red-eyes B. Dragon",
        type: "Scissors",
        img: `${pathImages}reddragon.png`,
    },
    {
        id: 4,
        name: "Battle Steer",
        type: "Rock",
        img: `${pathImages}battlesteer.png`,
    },
    {
        id: 5,
        name: "Droll Bird",
        type: "Paper",
        img: `${pathImages}drollbird.png`,
    },

];

// Preenche WinOf e LoseOf com base no type
cardData.forEach(card => {
    card.WinOf = cardData
        .filter(otherCard => typeMap[card.type]?.WinOf.includes(otherCard.type))
        .map(otherCard => otherCard.id);
    card.LoseOf = cardData
        .filter(otherCard => typeMap[card.type]?.LoseOf.includes(otherCard.type))
        .map(otherCard => otherCard.id);
});

let distributedCards = [];
// Modificado para que as cartas não sejam repetidas
async function getRandomCardId() {
    if (distributedCards.length === cardData.length) {
        distributedCards = []; // Reinicia a lista se todas as cartas foram usadas
    }

    let randomIndex = Math.floor(Math.random() * cardData.length);
    while (distributedCards.includes(randomIndex)) {
        randomIndex = Math.floor(Math.random() * cardData.length); // Sorteia novamente se a carta já foi distribuída
    }

    distributedCards.push(randomIndex);
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

async function printFinalPhrases(duelResults){
    if (duelResults === "Win") {
        state.cardSprites.type.innerText = victoryPhrases[Math.floor(Math.random() * victoryPhrases.length)];
    } else if (duelResults === "Lose") {
        state.cardSprites.type.innerText = losePhrases[Math.floor(Math.random() * losePhrases.length)];
    } else {
        state.cardSprites.type.innerText = "Empate!";
    }
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
    await printFinalPhrases(duelResults);
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
    state.cardSprites.name.innerText = "Selecione";
    state.cardSprites.type.innerText = "uma carta";

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
    const bgm = document.getElementById('bgm');
    bgm.volume = 0.3; // Set volume to 30%
    bgm.play();
}

init();