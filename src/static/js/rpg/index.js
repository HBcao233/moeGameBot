document.addEventListener('DOMContentLoaded', function() {
  const sections = {
    0: {
    html: `<div class="box"><div class="title">文字颜色标识</div>
<table class="text_colors">
  <tr>
    <td>剧情文字</td>
    <td>基本的故事文字</td>
  </tr>
  <tr>
    <td class="color_task">任务文字</td>
    <td>你需要在现实里完成的任务</td>
  </tr>
  <tr>
    <td class="color_npc">NPC对话</td>
    <td>故事中出现的人物的台词</td>
  </tr>
  <tr>
    <td class="color_clothes">服装文字</td>
    <td>施述了你必须穿着的服装</td>
  </tr>
  <tr>
    <td class="color_passive">种族被动</td>
    <td>某种族的特定被动任务</td>
  </tr>
  <tr>
    <td class="color_curse">诅咒文字</td>
    <td>和诅咒系统相关的文字</td>
  </tr>
  <tr>
    <td class="color_enemy">敌方种类</td>
    <td>描述敌人种类的文字</td>
  </tr>
  <tr>
    <td class="color_dick">阴茎特征</td>
    <td>需要使用的自慰棒的特征</td>
  </tr>
  <tr>
    <td class="color_key">关键道具</td>
    <td>特殊事件中需要使用到的道具</td>
  </tr>
</table>
</div>`,
    },
    1: {
      html: `<div class="box">
  <p>某一天早上你从床上起来，准备去做日常工作。当你正从家里出来时，一辆大卡车突然出现在路上。瞬间，你的视野陷入一片黑暗……等你清醒过来时，你发现自己并不在医院里，而是在一个像是天堂般的地方，一位穿着花哨的女神正一边笑着一边俯视着你。被那东之国称为“异世界转生”的事件似乎发生在了你的身上。你决定抛弃你的过去，在这个新的幻想世界开始自己新的生活！</p>
</div>`,
    },
    2: {
      html: `<div class="box">
  <div class="title text-center color_enemy">地狱轮盘女神</div>
  <div class="image_box"><img src="/static/images/rpg/hell_goddess.jpg"></div>
  <p>我这个最资深的轮盘女神会监督你的旅程。你在路上可能会遇到我的姐妹们，记得代我向她们打声招呼，她们可能会帮一把的! 你要在旅途之中打败恶魔领主。他们用淫秽邪恶的魔法腐蚀了这片大地。我会给你祝福，让你获得特殊的能カ和属性后，重生于那片大地的，库库库。</p>
</div>`,
    },
    3: {
      html: `<div class="box"><div class="title text-center color_enemy">地狱轮盘女神</div><div class="image_box"><img src="/static/images/rpg/hell_goddess.jpg"></div><p>可惜的是，作为轮盘之神，我的力量其实是......随机的。所以你可能会死掉然后又回到我这里来......我好像不小心剧透了......别担心! 不管你死了多少次，我都会把你一次又一次复活 直到你打败恶魔领主的，呐～</p></div>`,
    },
    4: {
      html: `<div class="box"><div class="title text-center color_enemy">地狱轮盘女神</div><div class="image_box"><img src="/static/images/rpg/hell_goddess.jpg"></div><p>前一任恶魔领主死后，一切都变了。一位高阶魅魔取缔了他的位置，这个世界上所有生物都必须遵守的新的视则被制定。现在世界正处于ー片混乱之中，所有人都在像动物一样交配! 听好了，这就是这个世界的规则!</p></div>`,
    },
    5: {
      html: `<div class="box"><div class="title text-center color_enemy">地狱轮盘女神</div><div class="image_box"><img src="/static/images/rpg/hell_goddess.jpg"></div><p>在我们的旅途开始之前，让我先来说明下这个异世界是怎么回事吧。你被赐予了轮盘或者骰子之カ。你投出的点数决定了你接下来的行动。看到下面的<span class="color_random">骰子</span>了吗，试试点击它。</p><br><div class="dice d6" data-sides="6" data-action="show_action" style="margin-left: 2em"></div><p class="action" style="display: none">(1) 继续</p></div>`,
    },
    6: {
      html: `<div class="box"><div class="title text-center color_enemy">地狱轮盘女神</div><div class="image_box"><img src="/static/images/rpg/hell_goddess.jpg"></div><p>好了～现在让我们先来把你重生吧～你需要投两个骰子，一个决定你的阵营，一个决定你的职业。当然你要是想选自己喜欢的角色也是没问题的哦～</p></div>`,
    },
    7: {
      html: `<div class="box" id="转生服务中心">
    <div class="btn selection action" data-action="selection">自选模式</div>
    <div class="title text-center">转生服务中心</div>
    <div class="row center step1">请先投一颗骰子决定你的阵营</div>
    <div class="row center dice1" style="margin-top: 5px">
      <div class="dice d6" data-sides="6" id="dice_camp" data-action="random_camp"></div>
    </div>
    <div class="row center">
      <div class="box camp camp1" id="camp1" data-action="change_camp-1">
        <div class="color_random">骰子点数 1-3</div>
        <div class="color_camp1">英雄阵营</div>
      </div>
      <div class="box camp camp2" id="camp2" data-action="change_camp-2">
        <div class="color_random">骰子点数 4-6</div>
        <div class="color_shadow">暗影阵营</div>
      </div>
    </div>
    <div class="row center step2">请再投一颗骰子决定你的种族</div>
    <div class="row center dice2" style="margin-top: 5px">
      <div id="dice_race" class="dice d6 disabled action" data-sides="6" data-action="random_race"></div>
    </div>
    <div class="row center dice2_selection" style="margin-top: 5px; display: none">
      <div class="dice disabled d1 action" data-sides="6" data-action="change_race-1"></div>
      <div class="dice disabled d2 action" data-sides="6" data-action="change_race-2"></div>
      <div class="dice disabled d3 action" data-sides="6" data-action="change_race-3"></div>
      <div class="dice disabled d4 action" data-sides="6" data-action="change_race-4"></div>
      <div class="dice disabled d5 action" data-sides="6" data-action="change_race-5"></div>
      <div class="dice disabled d6 action" data-sides="6" data-action="change_race-6"></div>
    </div>
  </div><div class="box race"></div>`,
      load: function () {
        if (save.camp) {
          $('#dice_camp').classList.remove('d6');
          $('#dice_camp').classList.add(`d${save.camp * 3}`);
          $(`#camp${save.camp}`).classList.add('active');
          $(`#dice_camp`).classList.add('disabled');
          $(`#dice_race`).classList.remove('disabled');
        }
        if (save.race) {
          $('#dice_race').classList.remove('d6');
          $('#dice_race').classList.add(`d${save.race}`);
          $(`#dice_race`).classList.add('disabled');
          setTimeout(() => showRace(), 10);
        }
        if (save.selection) enterSelection()
      }
    },
    8: {
      html: `<div class="box"><p>你重生在了一座森林的入口处。你的新身体感觉很好，但是还需要适应，你已经迫不及待地要开始你的旅途了，在森林中走了短短几分钟之后，又出现了一个女神，当她似乎与你刚刚在地狱遇到的女神有所不同。她介绍着自己是轮盘文神的第二个姐妹，拥有掌管凡人世界的权力。随后，她向你展示了这座森林的地图。</p></div>`,
    },
    9: {
      html: `<div class="box"><p>你站在淫暗森林的入口，斑驳的阳光透过层层叠叠的枝叶洒下，潮湿的泥土混着草木清香扑面而来，一条隐约的小径蜿蜒向密林深处。</p><br><p class="action">(1) 前进</p></div>`
    },
  };
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
  };
  
  let x;
  let save = {};
  if (x = getValue('save')) {
    save = JSON.parse(x);
  }
  if (getValue('map_show_reverse') == '1') {
    $('#map_show_reverse').checked = true;
    $('.container').classList.add('map_show_reverse');
  }
  if (getValue('status_show_reverse') == '1') {
    $('#status_show_reverse').checked = true;
    $('.wrapper').classList.add('status_show_reverse');
  }
  if (save.section) {
    $('#section-title_screen .btn.start').innerText = '继续';
  }
  const setSave = () => {
    setValue('save', JSON.stringify(save))
  }
  let map;
  function showMap() {
    $('.map_container').classList.add('show');
    map = new MapController();
    map.addMarker({
      x: 46.9,
      y: 84.9,
      id: 'block1',
      type: 'battle',
    })
    const player_marker = map.addMarker({
      x: 47.00,
      y: 75.00,
      id: 'player',
      type: 'pin',
    })
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
      innerHTML: `<span>[${r.clothes.name}]</span><div class="tooltip-box"><div class="image_box" style="width: 150px; margin: 0 auto"><img src="/static/images/rpg/race_${save.race_key}_clothes.jpg"></div><p>${r.clothes.desc}</p><br><p class="color_task">${r.clothes.task}</p></div>`,
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
   * 显示玩家状态
   */
  function showStatus() {
    updateStatus();
    $('.player_status').classList.add('show');
  }
  /**
   * 切换内容
   */
  function switchSection(id) {
    let t;
    if (t = $('dialog[open]')) t.close();
    window.scrollTo(0, 0);
    let x, y;
    if (x = $('section.show')) x.classList.remove('show');
    if (x.id == 'section-title_screen') x = null;
    if (id == 'title_screen') {
      y = $('#section-title_screen');
      $('.map_container').classList.remove('show');
      $('.player_status').classList.remove('show');
    } else {
      let html = '<div class="box">后面还没做了捏亲＾3＾</div>';
      let load = null;
      if (sections[id]) {
        save.section = id;
        setSave();
        html = sections[id].html;
        load = sections[id].load;
      }
      try {
        $('.progress-container').appendChild(y = tag('section', {
          id: 'section-' + id,
          attrs: {
            'data-section': id,
          },
          innerHTML: html,
        }));
      
        load && load.apply(y);
      } catch (e) {
        console.error(`加载section-${id}错误:`, e);
        return;
      }
      if (save.section > 7) {
        showMap();
        showStatus();
      }
    }
    setTimeout(() => {
      y.classList.add('show');
      if (x) y.ontransitionend = function() {
        x.remove();
      }
      $('.progress-container').style.height = ($(`#section-${id}`).getBoundingClientRect().height) + 'px';
    }, 10);
  }
  /**
   * 执行玩家操作
   */
  function executeAction() {
    if (this.classList.contains('disabled')) return;
    [action, arg] = (this.getAttribute('data-action') || '').split('-', 1);
    // console.log('action:', action, 'arg:', arg)
    switch (action) {
      case '':
        if (!this.classList.contains('action')) return;
        arg = parseInt(this.closest('section').getAttribute('data-section')) + 1;
        switchSection(arg);
        break;
      case 'to_section':
        switchSection(arg);
        break;
      
      // 切换自选模式
      case 'selection':
        switchSelection();
        break;
      // 切换阵营
      case 'change_camp':
        change_camp(arg)
        break;
      case 'change_race':
        change_race(arg)
        break;
        
      // 打开物品栏
      case 'show_inventory':
        showInventory();
        break;
      // 打开选项菜单
      case 'show_options':
        showOptions();
        break;
      // 回到标题界面
      case 'title_screen':
        switchSection('title_screen');
        break;
      // 设置
      case 'settings':
        $('#settings').showModal();
        break;
    }
  }
  
  /**
   * 显示种族
   */
  function showRace() {
    $('section[data-section="7"]').appendChild(tag('div', {
      class: 'box',
      innerHTML: '<p class="action">(1) 继续</p>'
    }));
    setTimeout(() => {
      $('.progress-container').style.height = ($('section:last-child').getBoundingClientRect().height) + 'px';
    }, 100)
    const rs = [
      ['princess', 'wizard', 'elf', 'dwarf', 'beastwoman', 'holstaurus'],
      ['witch', 'succubus', 'asceticist', 'zombie', 'corrupted', 'robot'],
    ];
    save.race_key = rs[save.camp-1][save.race-1];
    const r = race_info[save.race_key];
    save.player = {
      hp: r.hp,
      atk: r.atk,
    }
    setSave();
    $('.race').classList.add('show');
    $('.race').classList.add(`camp${save.camp}`);
    $('.race').innerHTML = `<div class="race_header">
  <div class="image_box"><img src="/static/images/rpg/race_${save.race_key}.jpg" /></div>
  <div class="race_name color_camp1">～${r.name}～</div>
  <p class="race_details">${r.desc}</p>
</div>
<div class="race_info race_clothes">
  <div class="header">
    <div class="title">服饰</div>
  </div>
  <div class="image_box">
    <img src="/static/images/rpg/race_${save.race_key}_clothes.jpg" />
  </div>
  <div class="race_info_details">
    <div class="race_info_title color_clothes">[${r.clothes.name}]</div>
    <p>${r.clothes.desc}</p>
    <br>
    <p class="color_task">${r.clothes.task}</p>
  </div>
</div>
<div class="race_info race_passive_skill">
  <div class="header">
    <div class="title">职业被动</div>
  </div>
  <div class="race_skills">
    <div class="race_skill">
      <div class="image_box">
        <img src="/static/images/rpg/race_${save.race_key}_passive_skill1.jpg" />
      </div>
      <div class="race_info_details">
        <div class="race_info_title color_passive">[${r.passive_skill[0].name}]</div>
        <p>${r.passive_skill[0].desc}</p>
        <br>
        <p class="color_task">${r.passive_skill[1].task}</p>
      </div>
    </div>
    <div class="race_skill">
      <div class="image_box">
        <img src="/static/images/rpg/race_${save.race_key}_passive_skill2.jpg" />
      </div>
      <div class="race_info_details">
        <div class="race_info_title color_passive">[${r.passive_skill[1].name}]</div>
        <p>${r.passive_skill[1].desc}</p>
        <br>
        <p class="color_task">${r.passive_skill[1].task}</p>
      </div>
    </div>
  </div>
</div>
<div class="race_info race_active_skill">
  <div class="header">
    <div class="title">攻击技能</div>
  </div>
  <div class="race_skills">
    <div class="race_skill">
      <div class="race_info_details">
        <div class="race_info_title color_bad">[弱击] ${r.active_skill[0].name}</div>
        <p class="color_task">${r.active_skill[0].task}</p>
        <br>
        <div class="race_info_title color_useful">[有效] ${r.active_skill[1].name}</div>
        <p class="color_task">${r.active_skill[1].task}</p>
        <br>
        <div class="race_info_title color_key">[会心] ${r.active_skill[2].name}</div>
        <p class="color_task">${r.active_skill[2].task}</p>
      </div>
    </div>
    <div class="race_skill">
      <div class="image_box">
        <img src="/static/images/rpg/race_${save.race_key}_ult.jpg" />
      </div>
      <div class="race_info_details">
        <div class="race_info_title color_skill">[特殊技能] ${r.ult.name}</div>
        <p>${r.ult.desc}</p>
        <br>
        <p class="color_task">${r.ult.task}</p>
      </div>
    </div>
  </div>
</div>`;
  }
  /**
   * 切换自选模式
   */
  function enterSelection() {
    save.selection = 1;
    setSave();
    $('.selection').classList.add('active');
    $('.step1').innerText = '请先选择你的阵营';
    $('.step2').innerText = '请选择一颗骰子决定你的种族';
    $('.dice1').style.display = 'none';
    $('#camp1').classList.add('action');
    $('#camp2').classList.add('action');
    $('.dice2').style.display = 'none';
    $('.dice2_selection').style.display = '';
    if (save.camp) $(`#camp${save.camp}`).classList.add('active');
    if (save.race) $(`.dice2_selection .d${save.race}`).classList.add('active');
  }
  function leaveSelection() {
    save.selection = 0;
    setSave();
    $('.selection').classList.remove('active');
    $('.step1').innerText = '请先投一颗骰子决定你的阵营';
    $('#camp1').classList.remove('action');
    $('#camp2').classList.remove('action');
    $('.step2').innerText = '请再投一颗骰子决定你的种族';
    $('.dice1').style.display = 'flex';
    if (save.camp) {
      $('#dice_camp').classList.remove('d1', 'd2', 'd3', 'd4', 'd5', 'd6');
      $('#dice_camp').classList.add(`d${save.camp * 3}`);
    }
    if (save.race) {
      $('#dice_race').classList.remove('d1', 'd2', 'd3', 'd4', 'd5', 'd6');
      $('#dice_race').classList.add('d' + save.race);
    }
    $('.dice2').style.display = '';
    $('.dice2_selection').style.display = 'none';
  }
  function switchSelection() {
    if (!save.selection) enterSelection();
    else leaveSelection();
    if (save.camp && save.race) showRace();
  }
  function change_camp(camp) {
    save.camp = parseInt(camp);
    setSave();
    $('#camp1').classList.remove('active');
    $('#camp2').classList.remove('active');
    $(`#camp${camp}`).classList.add('active');
    if (save.race) showRace();
  }
  function change_race(race) {
    save.race = parseInt(race);
    setSave();
    showRace();
    let t;
    if (t = $('.dice2_selection .dice.active')) t.classList.remove('active');
    $(`.dice2_selection .d${save.race}`).classList.add('active');
  }
  /**
   * 显示物品栏
   */
  function showInventory() {
    $('#inventory .items').innerHTML = '<div style="color: #a1a1a1; margin: 20px auto">你的背包空空如也...</div>'
    $('#inventory').showModal();
  }
  function showOptions() {
    $('#options').showModal();
  }

  document.addEventListener('click', (e) => {
    let t, action, arg;
    switch(true) {
      // 开始游戏
      case !!e.target.closest('#section-title_screen .btn.start'):
        if (save.section) switchSection(save.section);
        else switchSection(0);
        return;
      
      // 操作
      case !!(t = e.target.closest('.action, .btn')):
        executeAction.apply(t);
        break;
      
      // 点击 section
      case !!(t = e.target.closest('section')):
        let section = parseInt(t.getAttribute('data-section'));
        if (!t.querySelector('.action, .controls, .dice')) {
          switchSection(section + 1);
        }
        return;
    }
  });
  /**
   * 骰子事件
   */
  document.addEventListener('dice', (e) => {
    let dice = e.detail.dice;
    e.target.classList.add('disabled');
    let action = e.target.getAttribute('data-action');
    switch (action) {
      case 'show_action':
        e.target.parentElement.querySelector('.action').style.display = '';
        break;
      case 'random_camp':
        if (dice <= 3) {
          change_camp(1);
        } else {
          change_camp(2);
        }
        $('#dice_race').classList.remove('disabled');
        if (save.race) showRace();
        break;
      case 'random_race':
        change_race(dice);
        break;
    }
  });
  /**
   * input 改变
   */
  document.addEventListener('change', (e) => {
    if (e.target.id == 'map_show_reverse') {
      if (e.target.checked) {
        setValue('map_show_reverse', '1');
        $('.container').classList.add('map_show_reverse');
      } else {
        setValue('map_show_reverse', '0');
        $('.container').classList.remove('map_show_reverse');
      }
      return;
    }
    if (e.target.id == 'status_show_reverse') {
      if (e.target.checked) {
        setValue('status_show_reverse', '1');
        $('.wrapper').classList.add('status_show_reverse');
      } else {
        setValue('status_show_reverse', '0');
        $('.wrapper').classList.remove('status_show_reverse');
      }
      return;
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