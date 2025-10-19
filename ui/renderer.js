import { store } from "../state/store.js";

const elements = {
    startBtn: document.getElementById("start-btn"),
    modeBtn: document.getElementById("mode-btn"),
    categoryBtn: document.getElementById("category-btn"),
    gridItems: document.querySelectorAll(".grid-item"),
    nextBtn: document.getElementById("next"),
    spotifyBtn: document.getElementById("spotify-btn"),
    expertModeContainer: document.getElementById("expert-mode"),
    questionText: document.querySelector(".question-text"),
    questionImg: document.getElementById("question-img"),
    guessInput: document.getElementById("guess-input"),
    tryAgainButton: document.getElementById("try-again"),
    score: document.getElementById("score"),
    lives: document.getElementById("lives"),
};

store.addEventListener("state-changed", (e) => {
    render(e.detail);
});

function render(state) {
    renderCategory(state.category);
    renderMode(state.mode);
    renderScore(state.score);
    renderLives(state.lives);
}

function renderCategory(category) {
    elements.categoryBtn.textContent = `Category: ${category}`;
}

function renderMode(mode) {
    elements.modeBtn.textContent = `Mode: ${mode}`;
    elements.expertModeContainer.style.display = mode !== "expert" ? "none" : "block";
}

function renderScore(score) {
    elements.score.textContent = `Score: ${score}`;
}

function renderLives(lives) {
    elements.lives.textContent = `Lives: ${lives}`;
}

export function updateQuestionUI(answer, mode) {
    if (mode === "easy") {
        elements.questionText.textContent = `Who is ${answer.name}?`;
        elements.questionImg.style.display = "none";
    } else {
        elements.questionText.textContent = `Who is this?`;
        elements.questionImg.src = answer.images[0].url;
        elements.questionImg.style.display = "block";
    }
}

export function populateGridUI(randomArray, filteredOptions, mode) {
    randomArray.forEach((optionIndex, i) => {
        const img = elements.gridItems[i].querySelector("img");
        const name = elements.gridItems[i].querySelector("p");
        const option = filteredOptions[optionIndex];

        if (mode === "easy") {
            img.setAttribute("src", option.images[0].url);
            img.classList.add("secondary-button-img");
            img.dataset.index = optionIndex;
            name.style.display = "none";
        } else if (mode === "normal") {
            name.textContent = `${option.name}`;
            name.dataset.index = optionIndex;
            img.classList.remove("secondary-button-img");
        } else {
            name.style.display = "none";
            img.classList.remove("secondary-button-img");
        }
    });
}

export function resetGrid() {
    elements.gridItems.forEach((item) => item.classList.remove("correct-answer"));
    elements.gridItems.forEach((gridItem) => {
        const img = gridItem.querySelector("img");
        img.style.pointerEvents = "auto";
    });
}

export function disableGrid() {
    elements.gridItems.forEach((gridItem) => {
        const img = gridItem.querySelector("img");
        img.style.pointerEvents = "none";
    });
}

export function getGuess() {
    return elements.guessInput.value;
}

export function clearGuess() {
    elements.guessInput.value = "";
}

export function initUI(callbacks) {
    elements.startBtn.addEventListener("click", callbacks.onStart);
    elements.modeBtn.addEventListener("click", callbacks.onSwitchMode);
    elements.categoryBtn.addEventListener("click", callbacks.onSwitchCategory);
    elements.nextBtn.addEventListener("click", callbacks.onNext);
    elements.spotifyBtn.addEventListener("click", callbacks.onLogin);
    elements.tryAgainButton.addEventListener("click", () => location.reload());

    elements.gridItems.forEach((gridItem) => {
        gridItem.addEventListener("click", (event) => {
            const target = event.target;
            const guessIndex = parseInt(target.dataset.index);

            if (!isNaN(guessIndex)) {
                gridItem.classList.remove("gelatine");
                void gridItem.offsetWidth;
                gridItem.classList.add("gelatine");
                callbacks.onGuess(guessIndex);
            }
        });
    });
}
