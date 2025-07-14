const clickButton = document.getElementById('dino-button');
const clickCountSpan = document.getElementById('click-count');
const clickPowerSpan = document.getElementById('click-power');
const upgradesList = document.getElementById('upgrades-list');
const leaderboardList = document.getElementById('leaderboard-list');
const resetButton = document.getElementById('reset-game');

let clicks = 0;
let clickPower = 1;

const upgradesData = [
  { id: 'power1', name: 'Stronger Tap', baseCost: 10, powerIncrease: 1, cost: 10, level: 0 },
  { id: 'auto1', name: 'Auto Clicker', baseCost: 100, powerIncrease: 0, cost: 100, level: 0, autoClicksPerSec: 1 },
  { id: 'power2', name: 'Mega Tap', baseCost: 500, powerIncrease: 5, cost: 500, level: 0 },
  { id: 'auto2', name: 'Turbo Auto Clicker', baseCost: 2000, powerIncrease: 0, cost: 2000, level: 0, autoClicksPerSec: 5 },
];

let leaderboard = [];

function saveGame() {
  const saveData = {
    clicks,
    clickPower,
    upgrades: upgradesData,
    leaderboard,
  };
  localStorage.setItem('dinoClickerSave', JSON.stringify(saveData));
}

function loadGame() {
  const saveStr = localStorage.getItem('dinoClickerSave');
  if (!saveStr) return;
  try {
    const saveData = JSON.parse(saveStr);
    clicks = saveData.clicks || 0;
    clickPower = saveData.clickPower || 1;
    leaderboard = saveData.leaderboard || [];
    if (saveData.upgrades && Array.isArray(saveData.upgrades)) {
      for (const u of upgradesData) {
        const saved = saveData.upgrades.find(s => s.id === u.id);
        if (saved) {
          u.level = saved.level || 0;
          u.cost = saved.cost || u.baseCost;
        }
      }
    }
  } catch (e) {
    console.error('Failed to load save:', e);
  }
}

function updateUI() {
  clickCountSpan.textContent = clicks.toLocaleString();
  clickPowerSpan.textContent = clickPower.toLocaleString();

  upgradesList.innerHTML = '';
  for (const upgrade of upgradesData) {
    const div = document.createElement('div');
    div.className = 'upgrade';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = `${upgrade.name} (Level ${upgrade.level}) - Cost: ${upgrade.cost.toLocaleString()}`;
    div.appendChild(nameSpan);

    const buyBtn = document.createElement('button');
    buyBtn.textContent = 'Buy';
    buyBtn.disabled = clicks < upgrade.cost;
    buyBtn.onclick = () => buyUpgrade(upgrade.id);
    div.appendChild(buyBtn);

    upgradesList.appendChild(div);
  }

  updateLeaderboardUI();
}

function buyUpgrade(id) {
  const upgrade = upgradesData.find(u => u.id === id);
  if (!upgrade) return;
  if (clicks < upgrade.cost) return;

  clicks -= upgrade.cost;
  upgrade.level++;
  upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level));

  if (upgrade.powerIncrease) {
    clickPower += upgrade.powerIncrease;
  }

  saveGame();
  updateUI();
}

function updateLeaderboardUI() {
  leaderboardList.innerHTML = '';
  leaderboard.slice(0, 5).forEach((entry, i) => {
    const li = document.createElement('li');
    li.textContent = `${entry.date}: ${entry.score.toLocaleString()} clicks`;
    leaderboardList.appendChild(li);
  });
}

function addScoreToLeaderboard(score) {
  const date = new Date().toLocaleDateString();
  leaderboard.push({ date, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);
  saveGame();
  updateLeaderboardUI();
}

clickButton.addEventListener('click', () => {
  clicks += clickPower;
  updateUI();
  saveGame();
});

resetButton.addEventListener('click', () => {
  if (confirm('Are you sure you want to reset the game? Your progress will be lost.')) {
    addScoreToLeaderboard(clicks);
    clicks = 0;
    clickPower = 1;
    upgradesData.forEach(u => {
      u.level = 0;
      u.cost = u.baseCost;
    });
    saveGame();
    updateUI();
  }
});

// Auto clickers logic
setInterval(() => {
  let autoClicks = 0;
  for (const u of upgradesData) {
    if (u.autoClicksPerSec && u.level > 0) {
      autoClicks += u.autoClicksPerSec * u.level;
    }
  }
  clicks += autoClicks;
  if (autoClicks > 0) {
    updateUI();
    saveGame();
  }
}, 1000);

window.onload = () => {
  loadGame();
  updateUI();
};
