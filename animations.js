import lottie from "https://esm.sh/lottie-web";

let lottieInstance;
let animations = {}; // store both JSONs here

// Preload both animations once
export async function initAnimations() {
  const [correct, incorrect] = await Promise.all([
    fetch("./animations/correct.json").then((res) => res.json()),
    fetch("./animations/incorrect.json").then((res) => res.json()),
  ]);
  animations.correct = correct;
  animations.incorrect = incorrect;
}

// Play animation by key ("correct" or "incorrect")
export function playAnimation(type) {
  const container = document.querySelector("#lottie-container");

  if (!animations[type]) {
    console.error(`Animation "${type}" not loaded`);
    return;
  }

  // Destroy any existing animation
  if (lottieInstance) {
    lottieInstance.destroy();
  }

  // Show container
  container.style.display = "flex";

  // Load and play
  lottieInstance = lottie.loadAnimation({
    container,
    renderer: "svg",
    loop: false,
    autoplay: true,
    animationData: animations[type],
  });

  // Hide when done
  lottieInstance.addEventListener("complete", () => {
    container.style.display = "none";
  });
}
