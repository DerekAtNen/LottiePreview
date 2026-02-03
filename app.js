// Version code for tracking deployments
const APP_VERSION = "0.0.1";

let currentUrl = null;
let playerEl = null;

const upload = document.getElementById("upload");
const rendererSelect = document.getElementById("rendererSelect");
const preview = document.getElementById("preview");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const loopChk = document.getElementById("loopChk");

const dropzone = document.getElementById("dropzone");

// --- File handling logic ---
async function handleFile(file) {
  if (!file) return;

  if (!file.name.toLowerCase().endsWith(".json")) {
    alert("Please upload a .json Lottie file.");
    return;
  }

  let text = await file.text();

  // ✅ Strip UTF-8 BOM if present
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  try {
    JSON.parse(text); // validate JSON

    currentUrl = URL.createObjectURL(
      new Blob([text], { type: "application/json" })
    );

    createPlayer();
  } catch (err) {
    console.error(err);
    alert("Invalid JSON file.");
  }
}

// --- Upload input ---
upload.addEventListener("change", (e) => {
  handleFile(e.target.files[0]);
});

// --- Drag & Drop events ---
// Prevent browser default drag behavior on the entire document
document.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
});

document.addEventListener("drop", (e) => {
  e.preventDefault();
});

// Handle drag & drop on dropzone
dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  if (e.dataTransfer.files.length > 0) {
    handleFile(e.dataTransfer.files[0]);
  }
});

// --- Create or update player ---
function createPlayer() {
  if (!currentUrl) return;

  // Remove previous player
  if (playerEl) {
    playerEl.remove();
    playerEl = null;
  }

  // Create new player
  playerEl = document.createElement("lottie-player");
  playerEl.setAttribute("src", currentUrl);
  playerEl.setAttribute("renderer", rendererSelect.value);
  playerEl.setAttribute("background", "transparent");
  playerEl.setAttribute("autoplay", "false");
  playerEl.setAttribute("loop", loopChk.checked ? "" : "false");

  preview.appendChild(playerEl);

  playerEl.play();
}

// --- Renderer change ---
rendererSelect.addEventListener("change", () => {
  if (!playerEl) return;
  playerEl.setAttribute("renderer", rendererSelect.value);
  playerEl.stop();
  playerEl.play();
});

// --- Play/Pause controls ---
playBtn.addEventListener("click", () => {
  if (playerEl) playerEl.play();
});

pauseBtn.addEventListener("click", () => {
  if (playerEl) playerEl.pause();
});

// --- Loop toggle ---
loopChk.addEventListener("change", () => {
  if (!playerEl) return;
  if (loopChk.checked) playerEl.setAttribute("loop", "");
  else playerEl.setAttribute("loop", "false");
});

// --- Set version display ---
const versionEl = document.getElementById("version");
if (versionEl) {
  versionEl.textContent = APP_VERSION;
}
