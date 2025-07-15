// app.js code - full code as previously given
let clicks = 0;
let clickPower = 1;
let pet = null;
let boss = null;
let achievements = [];
let leaderboardScores = [];

let currentSlot = null;

const clickBtn = document.getElementById('dino-button');
const clickCountSpan = document.getElementById('click-count');
const clickPowerSpan = document.getElementById('click-power');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const musicToggle = document.getElementById('music-toggle');
const soundToggle = document.getElementById('sound-toggle');
const submitScoreBtn = document.getElementById('submit-score-btn');
const playerNameInput = document.getElementById('player-name');
const petNameInput = document.getElementById('pet-name-input');

const bossContainer = document.getElementById('boss-container');
const bossHealthP = document.getElementById('boss-health');
const bossTimerP = document.getElementById('boss-timer');
const bossMessageP = document.getElementById('boss-message');
const attackBossBtn = document.getElementById('attack-boss-btn');

const petAnimationDiv = document.getElementById('pet-animation');
const petStatus = document.getElementById('pet-status');
const collectPetBonusBtn = document.getElementById('collect-pet-bonus');

const bgMusic = document.getElementById('bg-music');
const soundClick = document.getElementById('sound-click');
const soundUpgrade = document.getElementById('sound-upgrade');
const soundAchievement = document.getElementById('sound-achievement');
const soundPet = document.getElementById('sound-pet');
const soundBossHit = document.getElementById('sound-boss-hit');
const soundBossDefeat = document.getElementById('sound-boss-defeat');

function playSound(sound) {
  if (!soundToggle.checked) return;
  sound.currentTime = 0;
  sound.play();
}

function toggleMusic() {
  if (musicToggle.checked) {
    bgMusic.play();
  } else {
    bgMusic.pause();
  }
}

function selectSlot(slotIndex) {
  currentSlot = slotIndex;
  loadGame();
  document.getElementById('slot-select').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  toggleMusic();
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
  playSound(soundUpgrade);
}

function loadGame() {
  const data = JSON.parse(localStorage.getItem(getSaveKey()));
  if (data) {
    clicks = data.clicks || 0;
    clickPower = data.clickPower || 1;
    pet = data.pet || null;
    if(pet && !pet.evolveThreshold) pet.evolveThreshold = 100;
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

musicToggle.addEventListener('change', toggleMusic);
soundToggle.addEventListener('change', () => {
  if (!soundToggle.checked) {
    bgMusic.pause();
  } else {
    toggleMusic();
  }
});

clickBtn.addEventListener('click', () => {
  clicks += clickPower;
  playSound(soundClick);

  if (pet) {
    pet.progress = (pet.progress || 0) + clickPower;
    checkPetEvolution();
    updatePetAnimation(pet.level);
  }

  if (boss && boss.active) {
    bossHitAnimation();
    playSound(soundBossHit);
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

collectPetBonusBtn.addEventListener('click', () => {
  if (pet) {
    const bonus = (pet.bonusPower || 1) * (pet.level || 1);
    clicks += bonus;
    petBonusEffect();
    alert(`Collected ${bonus} bonus clicks from your pet!`);
    playSound(soundPet);
    updateUI();
  }
});

attackBossBtn.addEventListener('click', () => {
  if (!boss || !boss.active) return;
  boss.health -= clickPower * 5;
  bossHitAnimation();
  if (boss.health <= 0) {
    boss.health = 0;
    boss.active = false;
    bossMessageP.textContent = 'You defeated the boss! 🎉 Click power +10!';
    clickPower += 10;
    bossContainer.style.display = 'none';
    playSound(soundBossDefeat);
  }
  updateBossUI();
});

function checkPetEvolution() {
  if (!pet) return;
  if (!pet.evolveThreshold) pet.evolveThreshold = 100;
  if (!pet.bonusPower) pet.bonusPower = 5;
  if (!pet.level) pet.level = 1;
  if (pet.progress >= pet.evolveThreshold) {
    pet.level++;
    pet.progress = 0;
    pet.evolveThreshold = Math.floor(pet.evolveThreshold * 1.5);
    clickPower += pet.bonusPower;
    alert(`Your pet evolved to level ${pet.level}! Click power increased!`);
    playSound(soundPet);
  }
}

function updatePetUI() {
  if (!pet) {
    petStatus.textContent = 'No pet yet. Keep clicking to hatch!';
    collectPetBonusBtn.disabled = true;
    petAnimationDiv.textContent = '';
  } else {
    petStatus.textContent = `Pet Level: ${pet.level} - Progress: ${pet.progress}/${pet.evolveThreshold}`;
    collectPetBonusBtn.disabled = false;
  }
}

function updatePetAnimation(level) {
  let petEmoji = '🐣';
  if (level === 1) petEmoji = '🦕';
  else if (level === 2) petEmoji = '🦖';
  else if (level >= 3) petEmoji = '🐲';

  petAnimationDiv.textContent = petEmoji;

  petAnimationDiv.style.transform = 'rotate(15deg)';
  setTimeout(() => {
    petAnimationDiv.style.transform = 'rotate(-15deg)';
    setTimeout(() => {
      petAnimationDiv.style.transform = 'rotate(0deg)';
    }, 150);
  }, 150);
}

function petBonusEffect() {
  const sparkle = document.createElement('span');
  sparkle.textContent = '✨';
  sparkle.className = 'sparkle';
  const rect = petAnimationDiv.getBoundingClientRect();
  sparkle.style.left = rect.left + 'px';
  sparkle.style.top = rect.top + 'px';
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 1000);
}

petNameInput.addEventListener('change', () => {
  if (!pet) return;
  pet.name = petNameInput.value.trim().substring(0, 12);
  updatePetUI();
});

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
  bossContainer.style.display = 'block';
  updateBossUI();
  startBossTimer();
}

function updateBossUI() {
  if (!boss) return;
  bossHealthP.textContent = `Boss Health: ${boss.health} / ${boss.maxHealth}`;
  bossTimerP.textContent = `Time Left: ${boss.timer}s`;
  bossTimerAnimation(boss.timer);
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
      bossEscapeEffect();
      clearInterval(bossInterval);
    }
    updateBossUI();
  }, 1000);
}

function bossHitAnimation() {
  bossContainer.style.transition = 'background-color 0.2s';
  bossContainer.style.backgroundColor = '#d32f2f';
  setTimeout(() => {
    bossContainer.style.backgroundColor = '';
  }, 200);
}

function bossTimerAnimation(timeLeft) {
  bossTimerP.style.transition = 'color 0.5s';
  if (timeLeft <= 5) {
    bossTimerP.style.color = timeLeft % 2 === 0 ? '#d32f2f' : '#000';
  } else {
    bossTimerP.style.color = '#000';
  }
}

function bossEscapeEffect() {
  bossContainer.style.transition = 'opacity 1s';
  bossContainer.style.opacity = '0';
  setTimeout(() => {
    bossContainer.style.display = 'none';
    bossContainer.style.opacity = '1';
  }, 1000);
}

function submitScore(name, score) {
  leaderboardScores.push({ name, score });
  leaderboardScores.sort((a, b) => b.score - a.score);
  leaderboardScores = leaderboardScores.slice(0, 10);
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

function updateUI() {
  clickCountSpan.textContent = clicks;
  clickPowerSpan.textContent = clickPower;
  loadDarkMode();
  updateLeaderboardUI();
  updatePetUI();
  updateBossUI();

  if (pet && pet.name) {
    petNameInput.value = pet.name;
  } else {
    petNameInput.value = '';
  }
}

// Load game on page load if slot selected
window.addEventListener('load', () => {
  // Default no slot selected
  document.getElementById('slot-select').style.display = 'block';
  document.getElementById('game').style.display = 'none';

  // Load dark mode from previous
  loadDarkMode();

  // Auto-play music if allowed
  if (musicToggle.checked) {
    bgMusic.play().catch(() => {});
  }
});
