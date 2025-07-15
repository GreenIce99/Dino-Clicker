// pets.js

const petElement = document.createElement('div');
petElement.id = 'pet-animation';
petElement.style.fontSize = '3rem';
petElement.style.transition = 'transform 0.3s ease';
petElement.style.userSelect = 'none';

document.getElementById('pet-section').appendChild(petElement);

function updatePetAnimation(level) {
  // Change pet emoji based on level
  let petEmoji = '🐣'; // egg by default
  if (level === 1) petEmoji = '🦕';
  else if (level === 2) petEmoji = '🦖';
  else if (level >= 3) petEmoji = '🐲';

  petElement.textContent = petEmoji;

  // Wobble animation on update
  petElement.style.transform = 'rotate(15deg)';
  setTimeout(() => {
    petElement.style.transform = 'rotate(-15deg)';
    setTimeout(() => {
      petElement.style.transform = 'rotate(0deg)';
    }, 150);
  }, 150);
}

function petBonusEffect() {
  // Sparkle effect when collecting bonus
  const sparkle = document.createElement('span');
  sparkle.textContent = '✨';
  sparkle.style.position = 'absolute';
  sparkle.style.fontSize = '1.5rem';
  sparkle.style.animation = 'sparkle 1s forwards';
  sparkle.style.left = petElement.getBoundingClientRect().left + 'px';
  sparkle.style.top = petElement.getBoundingClientRect().top + 'px';
  document.body.appendChild(sparkle);

  setTimeout(() => {
    sparkle.remove();
  }, 1000);
}

// CSS Animation for sparkle (inject this style)
const style = document.createElement('style');
style.textContent = `
@keyframes sparkle {
  0% {opacity: 1; transform: translateY(0);}
  100% {opacity: 0; transform: translateY(-30px);}
}
`;
document.head.appendChild(style);
