window['$'] = document.querySelector.bind(document);

document.addEventListener('DOMContentLoaded', function() {
  // 掷骰子
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dice')) return;
    const dice = e.target.closest('.dice');
    const sides = parseInt(dice.getAttribute('data-dice'))
    if (dice.rolling) return;
    dice.rolling = true;
    let timer = setInterval(() => {
      const count = Math.floor(Math.random() * sides) + 1;
      if (sides > 6) {
        dice.innerText = count;
      } else {
        dice.classList.remove('d1', 'd2', 'd3', 'd4', 'd5', 'd6');
        dice.classList.add('d' + count);
      }
    }, 100);
    
    const result = Math.floor(Math.random() * sides) + 1;
    const duration = 1500 + Math.random() * 500;
    setTimeout(() => {
      clearInterval(timer);
      if (sides > 6) {
        dice.innerText = result;
      } else {dice.classList.remove('d1', 'd2', 'd3', 'd4', 'd5', 'd6');
        dice.classList.add('d' + result);
      } 
      dice.rolling = false;
    }, duration);
  });
  
});