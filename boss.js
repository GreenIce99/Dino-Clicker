// boss.js

const bossContainer = document.getElementById('boss-container');
const bossHealthP = document.getElementById('boss-health');

function bossHitAnimation() {
  bossContainer.style.transition = 'background-color 0.2s';
  bossContainer.style.backgroundColor = '#d32f2f'; // flash red
  setTimeout(() => {
    bossContainer.style.backgroundColor = '';
  }, 200);
}

function bossTimerAnimation(timeLeft) {
  const bossTimerP = document.getElementById('boss-timer');
  bossTimerP.style.transition = 'color 0.5s';
  if (timeLeft <= 5) {
    // Flash red when time is running out
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
