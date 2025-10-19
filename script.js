import { roundGenerator } from "./utils/roundGenerator.js";
import { handleClickGuess, handleExpertGuess } from "./utils/guessHandler.js";
import { initAnimations } from "./ui/animations.js";
import { showGameScreen, showGameOverScreen } from "./ui/screens.js";
import { getState, addSeenArtist, setAnswerIndex, setCategory, setMode, setCurrentRoundArtists } from "./state/store.js";
import { loginWithSpotify } from "./auth/supabase.js";
import { filterArtists } from "./categories/customCategories.js";
import { initUI, disableGrid, getGuess, clearGuess } from "./ui/renderer.js";

await initAnimations(); // preload JSONs

let categories = ["DJ"];


document.addEventListener("categories-ready", (e) => {
    console.log("Categories ready: ", e.detail);
    categories = e.detail.filter(cat => cat !== 'DJ'); // Remove DJ
    setCategory("Top Artists");
});

function switchCategory() {
    const currentIndex = categories.indexOf(getState().category);
    const nextIndex = (currentIndex + 1) % categories.length;
    setCategory(categories[nextIndex]);
}

function startGame() {
    setTimeout(() => {
        showGameScreen();
        const availableArtists = filterArtists();
        setCurrentRoundArtists(availableArtists);
        setAnswerIndex(roundGenerator(availableArtists, getState().mode));
    }, 500);
}

const modes = ["easy", "normal", "expert"];

function switchMode() {
    const currentIndex = modes.indexOf(getState().mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
}

function handleNext() {
    if (getState().mode === "expert") {
        checkExpertGuess();
    }

    const availableArtists = filterArtists();
    setCurrentRoundArtists(availableArtists);
    setAnswerIndex(roundGenerator(availableArtists, getState().mode));
}

function handleGameOver() {
    showGameOverScreen();
}

function checkExpertGuess() {
    const userGuess = getGuess();
    const correctAnswer = getState().currentRoundArtists[getState().answerIndex].name;
    const isCorrect = handleExpertGuess(userGuess, correctAnswer);

    if (isCorrect) {
        addSeenArtist(getState().currentRoundArtists[getState().answerIndex].id);
    }

    if (getState().lives === 0) {
        handleGameOver();
    }

    clearGuess();
}

function handleGuess(guessIndex) {
    disableGrid();
    handleClickGuess(guessIndex, getState().answerIndex);
    addSeenArtist(getState().currentRoundArtists[getState().answerIndex].id);

    if (getState().lives === 0) {
        handleGameOver();
    } else {
        setTimeout(handleNext, 1000);
    }
}

initUI({
    onStart: startGame,
    onSwitchMode: switchMode,
    onSwitchCategory: switchCategory,
    onNext: handleNext,
    onLogin: loginWithSpotify,
    onGuess: handleGuess,
});
