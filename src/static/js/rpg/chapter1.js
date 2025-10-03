document.addEventListener('DOMContentLoaded', function() {
  const chest_items = ['herb', 'rope', 'slave_key', 'lucky_amulet', 'coin@50', 'godness_dice'];
  const current_enemys = ['thieves_brothers', 'werewolf', 'bee', 'normal_orcish', 'sorceress', 'aphrodisiac_plant'];
  const map_blocks = {
    0: {
      type: 'start',
      parent: null,
      children: [0],
      x: 47.30,
      y: 88.40,
    },
    1: {
      type: 'battle',
      parent: 0,
      children: [2],
      x: 47.30,
      y: 82.00,
    },
    2: {
      type: 'random_event',
      parent: 1,
      children: [3],
      x: 47.05,
      y: 75.00,
    },
    3: {
      type: 'battle',
      parent: 2,
      children: [4, 5],
    },
    4: {
      type: 'random_event',
      parent: 3,
      children: [6],
    },
    5: {
      type: 'battle',
      parent: 3,
      children: [7],
    },
  }

  // 创建地图控制器实例
  const mapController = new MapController();
  mapController.addMarker({
    x: 46.9,
    y: 84.9,
    id: 'block1',
    type: 'battle',
  })
  const player_marker = mapController.addMarker({
    x: 47.00,
    y: 75.00,
    id: 'player',
    type: 'pin',
  })
  
  let x;
  let save = {};
  if (x = getValue('save')) {
    save = JSON.parse(x);
  }
  const setSave = () => {
    setValue('save', JSON.stringify(save))
  }
  
  function updateStatus() {
    const r = race_info[save.race_key];
    $('.player_status').classList.add('show');
    $('.player_status .race_image').src = `/static/images/rpg/race_${save.race_key}.jpg`;
    $('.player_status .race_name_box').classList.add('color_camp' + save.camp)
    $('.player_status .race_name').innerText = r.name;
    $('.player_status .race_details').innerHTML = `<p>${r.desc}</p>`;
    $('.player_status .hp').innerText = `${save.player.hp} / ${r.hp}`;
    $('.player_status .atk').innerText = save.player.atk;
    
    $('.player_status .effects').innerHTML = '';
    // 服饰信息
    $('.player_status .effects').appendChild(tag('div', {
      class: 'tooltip effect color_clothes',
      children: [
        tag('span', {
          innerText: '[' + r.clothes.name + ']',
        }),
        tag('div', {
          class: 'tooltip-box',
          innerHTML: `<div class="image_box" style="width: 150px; margin: 0 auto"><img src="/static/images/rpg/race_${save.race_key}_clothes.jpg"></div><p>${r.clothes.desc}</p><br><p class="color_task">${r.clothes.task}</p>`
        })
      ]
    }));
    // 被动技能
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
    $('#raceok .color_clothes').innerText = `[${r.clothes.name}]`;
    $('#raceok img').src = `/static/images/rpg/race_${save.race_key}_clothes.jpg`;
    $('#raceok p').innerText = r.clothes.desc;
    $('#raceok p.color_task').innerText = r.clothes.task;
    $('#raceok').style.display = '';
    
    updateStatus()
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
  /**
   * 显示物品栏
   */
  function showInventory() {
    $('#inventory .items').innerHTML = '<div style="color: #a1a1a1; margin: 20px auto">你的背包空空如也...</div>'
    $('#inventory').showModal();
  }
  
  /**
   * 点击事件
   */
  document.addEventListener('click', (e) => {
    let t;
    // 行动
    if (e.target.id.startsWith('action')) {
      let action = e.target.id.slice(6);
      switch (action) {
        case '0-1':
          showProgress(1);
          break;
      }
      return;
    }
    if (e.target.closest('#show_inventory')) {
      showInventory();
      return;
    }
    if (e.target.closest('#show_options')) {
      $('#options').showModal();
      return;
    }
    if (e.target.closest('.switch_part')) {
      const id = e.target.getAttribute('data-part');
      $('.part:first-child').classList.toggle('show');
      $('#' + id).classList.toggle('show');
    }
  });
  
  document.addEventListener('dice', (e) => {
    e.target.classList.add('disabled');
    if (e.target.id.startsWith('diceAction')) {
      let action = e.target.id.slice(10);
      switch (action) {
        case '1-1':
          $('#enemy1-1').innerText = enemys[current_enemys[e.detail.dice - 1]].name;
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