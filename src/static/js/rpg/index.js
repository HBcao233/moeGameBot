document.addEventListener('DOMContentLoaded', function() {
  let x, camp, race;
  let selection = false;
  
  const enterSelection = () => {
    $('.selection').classList.add('active');
    $('.reincarnate_step1').innerText = '请先选择你的阵营';
    $('.reincarnate_step2').innerText = '请选择一颗骰子决定你的种族';
    $('.reincarnate_dice1').style.display = 'none';
    $('.reincarnate_dice2').innerHTML = '<div class="dice disabled d1" data-sides="6"></div><div class="dice disabled d2" data-sides="6"></div><div class="dice disabled d3" data-sides="6"></div><div class="dice disabled d4" data-sides="6"></div><div class="dice disabled d5" data-sides="6"></div><div class="dice disabled d6" data-sides="6"></div>';
    if (camp) $(`.camp${camp}`).classList.add('active');
    if (race) $(`.reincarnate_dice2 .d${race}`).classList.add('active');
  }
  const leaveSelection = () => {
    $('.selection').classList.remove('active');
    $('.reincarnate_step1').innerText = '请先投一颗骰子决定你的阵营';
    $('.reincarnate_step2').innerText = '请再投一颗骰子决定你的种族';
    $('.reincarnate_dice1').style.display = 'flex';
    $('#dice_camp').classList.remove('d1', 'd2', 'd3', 'd4', 'd5', 'd6');
    $('#dice_camp').classList.add(`d${camp * 3 - 2}`);
    $('.reincarnate_dice2').innerHTML = `<div id="dice_race" class="dice d${race || 6}" data-sides="6"></div>`;
  }
  
  if ((x = getValue('camp')) && parseInt(x)) {
    camp = parseInt(x);

    $('#camp' + camp).classList.add('active');
    $('#dice_camp').classList.remove('d1', 'd2', 'd3', 'd4', 'd5', 'd6');
    $('#dice_camp').classList.add('d' + (camp * 3 - 2));
  } else {
    $('#dice_race').classList.add('disabled');
    $('.next').classList.add('disabled');
  }
  if ((x = getValue('race')) && parseInt(x)) {
    race = parseInt(x);

    $(`#camp${camp}-race${race}`).classList.add('active');
    $('#dice_race').classList.remove('d6');
    $('#dice_race').classList.add('d' + race);
  } else {
    $('.next').classList.add('disabled');
  }
  
  if (x = getValue('selection') && parseInt(x)) {
    selection = Boolean(parseInt(x));
    if (selection) {
      enterSelection()
    }
  }
  
  // 点击事件
  document.addEventListener('click', (e) => {
    let t;
    switch (true) {
      // 自选按钮
      case !!e.target.closest('.selection'):
        if (!e.target.classList.contains('active')) {
          selection = true;
          enterSelection();
        } else {
          selection = false;
          leaveSelection()
        }
        setValue('selection', parseInt(selection))
        break;
        
      // 选择阵营
      case selection && !!(t = e.target.closest('.camp')):
        t.classList.add('active');
        if (t.classList.contains('camp1')) {
          camp = 1;
          $('#camp2').classList.remove('active');
        } else {
          camp = 2;
          $('#camp1').classList.remove('active');
        }
        setValue('camp', camp);
        if (t = $('.race.active')) t.classList.remove('active');
        if (race) $(`#camp${camp}-race${race}`).classList.add('active');
        break

      // 选择种族
      case selection && !!e.target.closest('.reincarnate_dice2 .dice'):
        if (t = $('.reincarnate_dice2 .dice.active')) t.classList.remove('active');
        e.target.classList.add('active');
        switch (true) {
          case e.target.classList.contains('d1'):
            race = 1;
            break;
          case e.target.classList.contains('d2'):
            race = 2;
            break;
          case e.target.classList.contains('d3'):
            race = 3;
            break;
          case e.target.classList.contains('d4'):
            race = 4;
            break;
          case e.target.classList.contains('d5'):
            race = 5;
            break;
          case e.target.classList.contains('d6'):
            race = 6;
            break;
        }
        setValue('race', race);
        if (t = $('.race.active')) t.classList.remove('active');
        $(`#camp${camp}-race${race}`).classList.add('active');
        break
      
      // 掷骰子
      case !!e.target.closest('.dice'):
        if (e.target.classList.contains('disabled')) return;
        const dice = e.target.closest('.dice');
        const sides = parseInt(dice.getAttribute('data-sides'))
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
          let event = new CustomEvent('dice', {
            bubbles: true,
            detail: { dice: result },
          });
          e.target.dispatchEvent(event);
          e.target.setAttribute('data-dice', result)
    
          if (sides > 6) {
            dice.innerText = result;
          } else {dice.classList.remove('d1', 'd2', 'd3', 'd4', 'd5', 'd6');
            dice.classList.add('d' + result);
          } 
          dice.rolling = false;
        }, duration);
        break
    }

  });
  
  // 骰子事件
  document.addEventListener('dice', (e) => {
    let t;
    switch (true) {
      case !!e.target.closest('#dice_camp'):
        // e.target.setAttribute('disabled', '');
        if (e.detail.dice <= 3) {
          camp = 1;
          $('#camp1').classList.add('active');
          $('#camp2').classList.remove('active');
        } else {
          camp = 2;
          $('#camp1').classList.remove('active');
          $('#camp2').classList.add('active');
        }
        setValue('camp', camp);
        $('#dice_race').classList.remove('disabled');
        break;
      case !!e.target.closest('#dice_race'):
        race = e.detail.dice;
        if (t = $('.race.active')) t.classList.remove('active');
        $(`#camp${camp}-race${race}`).classList.add('active');
        setValue('race', race);
        break;
    }

  })
  
  MoeApp.login().then(() => {
    Telegram.WebApp.ready();
    Telegram.WebApp.BackButton.onClick(function () {
      if (window.history.length > 1) window.history.back()
      else window.location.href = '/';
    })
    Telegram.WebApp.BackButton.show()
  }).catch(() => {
  });
});