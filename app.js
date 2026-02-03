let currentAnim = null;
let currentData = null;

const upload = document.getElementById("upload");
const rendererSelect = document.getElementById("rendererSelect");
const preview = document.getElementById("preview");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const loopChk = document.getElementById("loopChk");

upload.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const text = await file.text();
  try {
    currentData = JSON.parse(text);
    loadLottie();
  } catch (err) {
    alert("Invalid JSON file");
  }
});

function loadLottie() {
  // destroy previous animation
  if (currentAnim) {
    currentAnim.destroy();
    preview.innerHTML = "";
  }

  currentAnim = lottie.loadAnimation({
    container: preview,
    animationData: currentData,
    renderer: rendererSelect.value,
    loop: loopChk.checked,
    autoplay: true
  });
}

rendererSelect.addEventListener("change", () => {
  if (currentData) loadLottie();
});

playBtn.addEventListener("click", () => {
  if (currentAnim) currentAnim.play();
});

pauseBtn.addEventListener("click", () => {
  if (currentAnim) currentAnim.pause();
});

loopChk.addEventListener("change", () => {
  if (currentAnim) currentAnim.loop = loopChk.checked;
});
