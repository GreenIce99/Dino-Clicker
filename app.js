let clicks = 0;
let clickPower = 1;
let pet = null;
let boss = null;
let achievements = [];
let leaderboardScores = [];

const clickBtn = document.getElementById('dino-button');
const clickCountSpan = document.getElementById('click-count');
const clickPowerSpan = document.getElementById('click-power');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const submitScoreBtn = document.getElementById('submit-score-btn');
const playerNameInput = document.getElementById('player-name');

clickBtn.addEventListener('click', () => {
  clicks += clickPower;
  if (pet) {
    pet.progress += clickPower;
    checkPetEvolution();
  }
  checkBossSpawn();
  updateUI();
});

submitScoreBtn.addEventListener('click', () => {
  const name = playerNameInput.value.trim();
  if (!name) {
    alert('Please enter your name to submit score.');
    return;
  }
  submitScore(name, clicks);
});

function updateUI() {
  clickCountSpan.textContent = clicks;
  clickPowerSpan.textContent = clickPower;
  loadDarkMode();
  updateLeaderboardUI();
  updatePetUI();
  updateBossUI();
}

// DARK MODE
darkModeToggle.addEventListener('change', () => {
  const enabled = darkModeToggle.checked;
  document.body.classList.toggle('dark-mode', enabled);
  localStorage.setItem('darkMode', enabled ? '1' : '0');
});

function loadDarkMode() {
  const enabled = localStorage.getItem('darkMode') === '1';
  darkModeToggle.checked = enabled;
  document.body.classList.toggle('dark-mode', enabled);
}

// PETS RELATED
function checkPetEvolution() {
  if (!pet) return;
  if (pet.progress >= pet.evolveThreshold) {
    pet.level++;
    pet.progress = 0;
    pet.evolveThreshold = Math.floor(pet.evolveThreshold * 1.5);
    clickPower += pet.bonusPower;
    alert(`Your pet evolved to level ${pet.level}! Click power increased!`);
  }
}

function updatePetUI() {
  const petStatus = document.getElementById('pet-status');
  const collectBtn = document.getElementById('collect-pet-bonus');
  if (!pet) {
    petStatus.textContent = 'No pet yet. Keep clicking to hatch!';
    collectBtn.disabled = true;
  } else {
    petStatus.textContent = `Pet Level: ${pet.level} - Progress: ${pet.progress}/${pet.evolveThreshold}`;
    collectBtn.disabled = false;
  }
}

document.getElementById('collect-pet-bonus').addEventListener('click', () => {
  if (pet) {
    clicks += pet.bonusPower * pet.level;
    alert(`Collected ${pet.bonusPower * pet.level} bonus clicks from your pet!`);
    updateUI();
  }
});

// BOSS RELATED
function checkBossSpawn() {
  if (!boss && clicks >= 1000) {
    boss = {
      health: 100,
      maxHealth: 100,
      timer: 30,
      active: true
    };
    showBoss();
  }
}

function showBoss() {
  const bossContainer = document.getElementById('boss-container');
  bossContainer.style.display = 'block';
  updateBossUI();
  startBossTimer();
}

const bossHealthP = document.getElementById('boss-health');
const bossTimerP = document.getElementById('boss-timer');
const bossMessageP = document.getElementById('boss-message');
const attackBossBtn = document.getElementById('attack-boss-btn');

attackBossBtn.addEventListener('click', () => {
  if (!boss || !boss.active) return;
  boss.health -= clickPower * 5;
  if (boss.health <= 0) {
    boss.health = 0;
    boss.active = false;
    bossMessageP.textContent = 'You defeated the boss! 🎉 Click power +10!';
    clickPower += 10;
    bossContainer.style.display = 'none';
  }
  updateBossUI();
});

function updateBossUI() {
  if (!boss) return;
  bossHealthP.textContent = `Boss Health: ${boss.health} / ${boss.maxHealth}`;
  bossTimerP.textContent = `Time Left: ${boss.timer}s`;
  if (!boss.active) bossMessageP.textContent = 'Boss defeated!';
}

let bossInterval;

function startBossTimer() {
  if (bossInterval) clearInterval(bossInterval);
  bossInterval = setInterval(() => {
    if (!boss || !boss.active) {
      clearInterval(bossInterval);
      return;
    }
    boss.timer--;
    if (boss.timer <= 0) {
      boss.active = false;
      bossMessageP.textContent = 'Boss escaped! Try again later.';
      document.getElementById('boss-container').style.display = 'none';
      clearInterval(bossInterval);
    }
    updateBossUI();
  }, 1000);
}

// LEADERBOARD (local simulation)
function submitScore(name, score) {
  leaderboardScores.push({ name, score });
  leaderboardScores.sort((a, b) => b.score - a.score);
  leaderboardScores = leaderboardScores.slice(0, 10); // Top 10
  alert('Score submitted!');
  updateLeaderboardUI();
}

function updateLeaderboardUI() {
  const list = document.getElementById('leaderboard-list');
  list.innerHTML = '';
  leaderboardScores.forEach((entry, idx) => {
    const li = document.createElement('li');
    li.textContent = `${idx + 1}. ${entry.name} - ${entry.score}`;
    list.appendChild(li);
  });
}

// INITIAL LOAD
loadGame();
updateUI();
loadDarkMode();
