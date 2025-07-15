let currentSlot = null;

function selectSlot(slotIndex) {
  currentSlot = slotIndex;
  loadGame();
  document.getElementById('slot-select').style.display = 'none';
  document.getElementById('game').style.display = 'block';
}

function getSaveKey() {
  return `dinoSaveSlot${currentSlot}`;
}

function saveGame() {
  const saveData = {
    clicks,
    clickPower,
    pet,
    boss,
    achievements,
    leaderboardScores
  };
  localStorage.setItem(getSaveKey(), JSON.stringify(saveData));
  alert(`Game saved to Slot ${currentSlot + 1}!`);
}

function loadGame() {
  const data = JSON.parse(localStorage.getItem(getSaveKey()));
  if (data) {
    clicks = data.clicks || 0;
    clickPower = data.clickPower || 1;
    pet = data.pet || null;
    boss = data.boss || null;
    achievements = data.achievements || [];
    leaderboardScores = data.leaderboardScores || [];
  } else {
    clicks = 0;
    clickPower = 1;
    pet = null;
    boss = null;
    achievements = [];
    leaderboardScores = [];
  }
  updateUI();
}
function resetSlot() {
  if (confirm("Reset this slot?")) {
    localStorage.removeItem(getSaveKey());
    clicks = 0;
    clickPower = 1;
    pet = null;
    boss = null;
    achievements = [];
    leaderboardScores = [];
    updateUI();
  }
}
