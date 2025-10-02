document.addEventListener('DOMContentLoaded', function() {
  const chest_items = ['herb', 'rope', 'slave_key', 'lucky_amulet', 'coin@50', 'godness_dice'];
  const current_enemys = ['thieves_brothers', 'werewolf', 'bee', 'normal_orcish', 'sorceress', 'aphrodisiac_plant'];

  // 创建地图控制器实例
  const mapController = new MapController();
  mapController.addMarker({
    x: 47.30,
    y: 88.40,
    id: 'player',
  })
  
  let x;
  let save = {};
  if (x = getValue('save')) {
    save = JSON.parse(x);
  }
  const setSave = () => {
    setValue('save', JSON.stringify(save))
  }
  /** 
   * 选择了种族
   */
  if (save.race) {
    $('#norace').style.display = 'none';
    const r = race_info[save.race_key];
    if (save.player === undefined) {
      save.player = {
        race: save.race_key,
        hp: r.hp,
        atk: r.atk,
      }
      setSave();
    }
    $('.player_status .race_image').src = `/static/images/rpg/race_${save.race_key}.jpg`;
    $('.player_status .race_name_box').classList.add('color_camp' + save.camp)
    $('.player_status .race_name').innerText = r.name;
    $('.player_status .race_details').innerHTML = `<p>${r.desc}</p>`;
    $('.player_status .hp').innerText = `${save.player.hp} / ${r.hp}`;
    $('.player_status .atk').innerText = save.player.atk;
    
    $('.player_status .effects').innerHTML = '';
    for (const i of r.passive_skill) {
      $('.player_status .effects').appendChild(tag('div', {
        class: 'tooltip effect color_passive',
        children: [
          tag('span', {
            innerText: i.name,
          }),
          tag('div', {
            class: 'tooltip-box',
            innerHTML: `<p>${i.desc}</p><br><p class="color_task">${i.task}</p>`
          })
        ]
      }));
    }
  }
  if (save.progress === undefined) save.progress = 0;
  showProgress(save.progress);
  
  function showProgress(id) {
    let t;
    if (t = $('.progress.active')) t.classList.remove('active');
    $(`#progress${id}`).classList.add('active');
    $('.progress-container').style.height = ($(`#progress${id}`).getBoundingClientRect().height) + 'px';
    save.progress = id;
    setSave();
  }
  function showStep(step) {
    $(`#step${save.progress}-${step}`).classList.add('active');
  }
  function showBattle(dice) {
    
  }
  
  document.addEventListener('click', (e) => {
    let t;
    if (e.target.id.startsWith('action')) {
      let action = e.target.id.slice(6);
      switch (action) {
        case '0-1':
          showProgress(1);
          break;
      }
      return;
    }
    if (e.target.closest('.tooltip')) {
      
      return;
    }
    if(t = $('.tooltip.active')) t.classList.remove();
  });
  
  document.addEventListener('dice', (e) => {
    e.target.classList.add('disabled');
    if (e.target.id.startsWith('diceAction')) {
      let action = e.target.id.slice(10);
      switch (action) {
        case '1-1':
          $('#enemy1-1').innerText = enemys[current_enemys[e.detail.dice]].name;
          showStep(1);
          break;
      }
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