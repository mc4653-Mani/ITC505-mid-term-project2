/* Branching adventure with images for each node and unique endings */

const MAX_DEPTH = 5;

// Story fragments for each depth
const STORY_PARTS = {
  1: [
    "You wake beside your crashed pod. To your left is a glowing cave; to your right, a smoking ship hull.",
    "You stand in a desert wasteland. Left leads to strange footprints; right toward shimmering lights."
  ],
  2: [
    "You enter a misty canyon. Left echoes with whispers; right glows with blue moss.",
    "You climb a cliff. Left path shows a waterfall; right shows ancient carvings."
  ],
  3: [
    "A forked bridge appears — left creaks, right hums with energy.",
    "You find two gates — left iron, right gold."
  ],
  4: [
    "You cross a field of floating stones. Left drifts higher; right sinks lower.",
    "A strange monument blocks your way. Left circles around; right goes through a tunnel."
  ],
  5: [
    "You reach the final chamber. The air crackles with power.",
    "You stand before the ancient reactor core, pulsing with energy."
  ]
};

// Unique endings for depth = MAX_DEPTH
const ENDINGS = [
  "You find a peaceful alien village that welcomes you.",
  "You fall into a glowing crystal cavern and gain strange powers.",
  "You reach a deserted ship filled with ancient treasures.",
  "You encounter a mysterious AI that offers you immortality.",
  "You unlock a portal to another galaxy and vanish into the stars.",
  "You awaken — it was all a simulation test run.",
  "You find a ruined city whispering your name.",
  "You reach the center of the planet and meet its ancient heart."
];

// --- Helper functions ---
function uniqueIndex(path) {
  let sum = 0;
  for (let i = 0; i < path.length; i++) sum += path.charCodeAt(i);
  return sum % 2; // 0 = Left story, 1 = Right story
}

function pickEnding(path) {
  let sum = 0;
  for (let i = 0; i < path.length; i++) sum += path.charCodeAt(i);
  return ENDINGS[sum % ENDINGS.length];
}

function getImage(depth, choice) {
  // Handle the very first screen separately
  if (depth === 1 && path === "") {
    return "Images/Node1LR.jpeg";
  }

  // Return correct image path from your folder
  if (depth > MAX_DEPTH) depth = MAX_DEPTH;
  return `Images/Node${depth}${choice}.jpeg`;
}

// --- DOM elements ---
const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");
const imgEl = document.getElementById("sceneImage");
const metaEl = document.getElementById("meta");

// Game state
let path = "";
let depth = 1;

// --- Modal for Game Over ---
const modal = document.createElement("div");
modal.id = "gameOverModal";
modal.style.cssText = `
  position:fixed;top:0;left:0;width:100%;height:100%;
  background:rgba(0,0,0,0.8);display:none;justify-content:center;align-items:center;z-index:1000;
`;
const modalBox = document.createElement("div");
modalBox.style.cssText = `
  background:#0e2130;padding:30px;border-radius:12px;text-align:center;
  box-shadow:0 0 20px rgba(255,0,0,0.4);max-width:400px;
`;
modalBox.innerHTML = `
  <h2 style="color:#ff5a5a;">GAME OVER</h2>
  <p id="endingText" style="color:#d0d0d0;margin-bottom:15px;"></p>
  <button id="restartBtn" style="background:#08d1c6;border:none;padding:10px 20px;border-radius:10px;cursor:pointer;font-weight:600;">Start New Game</button>
`;
modal.appendChild(modalBox);
document.body.appendChild(modal);

document.getElementById("restartBtn")?.addEventListener("click", restart);

function showModal(ending) {
  document.getElementById("endingText").textContent = ending;
  modal.style.display = "flex";
}

function hideModal() {
  modal.style.display = "none";
}

// --- Render game ---
function render() {
  let text = "";
  let title = `Node ${depth} — Path: ${path || "Start"}`;

  if (depth < MAX_DEPTH) {
    const variant = uniqueIndex(path);
    text = STORY_PARTS[depth]?.[variant] || "The path grows uncertain.";
  } else {
    text = pickEnding(path);
  }

  // Determine correct image
  const currentChoice = path.slice(-1) || "LR"; // Show Node1LR on load
  const img = getImage(depth, currentChoice);
  imgEl.src = img;

  textEl.textContent = `${title}\n\n${text}`;
  metaEl.textContent = `Depth: ${depth} · Path: ${path || "Start"} · Max depth: ${MAX_DEPTH}`;
  choicesEl.innerHTML = "";

  if (depth < MAX_DEPTH) {
    const left = document.createElement("button");
    left.className = "choice-btn";
    left.textContent = "Left (L)";
    left.onclick = () => choose("L");

    const right = document.createElement("button");
    right.className = "choice-btn";
    right.textContent = "Right (R)";
    right.onclick = () => choose("R");

    choicesEl.appendChild(left);
    choicesEl.appendChild(right);
  } else {
    showModal(text);
  }
}

// --- Choices ---
function choose(direction) {
  if (depth >= MAX_DEPTH) {
    return showModal(pickEnding(path));
  }
  path += direction;
  depth += 1;
  render();
}

function restart() {
  hideModal();
  path = "";
  depth = 1;
  render();
}

// --- Start game ---
window.addEventListener("load", restart);
