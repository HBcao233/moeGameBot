window.addEventListener('load', () => {
  let errors = [];
  const add_error = (error) => {
    let flag = true;
    for(const e of errors) {
      if (e.name == error.name) {
        flag = false;
        break
      }
    }
    if (flag) errors.push(error);
    let html = [];
    for (const e of errors) {
      html.push(`<div>${e.value}</div>`)
    }
    $('.errors .content').innerHTML = html.join('');
    $('.errors').style.display = 'block';
  }
  const remove_error = (name) => {
    let j = null;
    for (let i=0; i < errors.length; i++) {
      let e = errors[i]
      if (e.name == name) {
        j = i;
        break;
      }
    }
    if (j !== null) {
      errors.splice(j, 1);
      if (errors.length == 0) {
        $('.errors').style.display = 'none';
      }
    }
  }
  
  let newlock = window.localStorage.getItem('newlock');
  const set_default = () => {
    newlock = {
      name: '',
      difficulty: 0,
      visability: 0,
      cost: 0,
      min: 3600,
      max: 3600,
      limit: 0,
      limit_time: 0,
      twitter: false,
      x_love_add: 3600,
      x_forward_add: 3600,
      x_comment_add: 3600,
      x_follow_add: 3600,
      public: false,
      public_add_min: 3600,
      public_add_max: 3600,
      public_remove_min: 3600,
      public_remove_max: 3600,
      public_votes: 0,
      hidden: false,
      hidden_add: 3600,
      temporary_open: false,
      temporary_interval: 86400,
      temporary_time: 1800,
      temporary_punish: 600,
      verification_picture: false,
      verification_interval: 604800,
      verification_method: 0,
      verification_punish: 3600,
      wheel: false,
      wheel_method: 0,
      wheel_interval: 0,
      wheel_times: 0,
      wheel_lists: [
        {
          type: 'add_time',
          value: 3600,
        },
        {
          type: 'remove_time',
          value: 3600,
        },
      ],
      tasks: false,
      tasks_method: 0,
      tasks_interval: 3600,
      tasks_choose: 0,
      tasks_punish: 3600,
      tasks_points: 0,
      tasks_lists: [{
        content: 0,
        point: '',
        remove_time: 3600,
      }],
      twin_flowers: false,
      framing: false,
    }
  }
  const save_newlock = () => {
    window.localStorage.setItem('newlock', JSON.stringify(newlock))
  }
  if (!newlock) {
    set_default()
  } else {
    newlock = JSON.parse(newlock)
  }
  const searchParams = new URLSearchParams(window.location.search);
  let lock = searchParams.get('lock'); 
  if (lock) {
    newlock = JSON.parse(gz64_decode(lock));
  }
  
  const getTime = (k) => {
    let d = 0, h = 0, m = 0, t;
    if (t = $(`input[name="${k}-day"]`)) d = parseInt(t.value)
    if (t = $(`input[name="${k}-hour"]`)) h = parseInt(t.value)
    if (t = $(`input[name="${k}-minute"]`)) m = parseInt(t.value)
    return 86400 * d + 3600 * h + 60 * m;
  }
  const setTime = (k, v) => {
    let d, h, m, t;
    d = Math.floor(v / 86400);
    h = Math.floor(v % 86400 / 3600);
    m = Math.floor(v % 3600 / 60);
    if (t = $(`input[name="${k}-day"]`)) t.value = d;
    if (t = $(`input[name="${k}-hour"]`)) t.value = h;
    if (t = $(`input[name="${k}-minute"]`)) t.value = m;
  }
  const getOptionTime = (_class, index) => {
    let d = 0, h = 0, m = 0, t;
    if (t = $(`.${_class}[data-index="${index}"] input.day`)) d = parseInt(t.value)
    if (t = $(`.${_class}[data-index="${index}"] input.hour`)) h = parseInt(t.value)
    if (t = $(`.${_class}[data-index="${index}"] input.minute`)) m = parseInt(t.value)
    return 86400 * d + 3600 * h + 60 * m;
  }
  const setOptionTime = (_class, index, v) => {
    let d, h, m, t;
    d = Math.floor(v / 86400);
    h = Math.floor(v % 86400 / 3600);
    m = Math.floor(v % 3600 / 60);
    if (t = $(`.${_class}[data-index="${index}"] input.day`)) t.value = d;
    if (t = $(`.${_class}[data-index="${index}"] input.hour`)) t.value = h;
    if (t = $(`.${_class}[data-index="${index}"] input.minute`)) t.value = m;
  }
  let times = ['min', 'max', 'limit', 'public_add', 'public_remove', 'hidden', 'temporary_interval', 'temporary_time', 'temporary_punish', 'wheel_interval', 'tasks_interval', 'tasks_punish'];
  const fill_newlock = () => {
    for (const k of Object.keys(newlock)) {
      let v = newlock[k];
      if (times.indexOf(k) !== -1 || k.startsWith('wheel_option') || k.startsWith('task_remove')) {
        setTime(k, v)
        continue
      }
      let t = $(`input[name="${k}"]`);
      if (t) {
        if (t.type == 'radio') {
          t = $(`input[name="${k}"][value="${v}"]`);
          if (t) t.checked = true;
        } else if (t.type == 'checkbox'){
          if (v) {
            t.checked = true;
            $(`.srow .content.${t.name}`).style.display = 'block';
          } else {
            t.checked = false;
            $(`.srow .content.${t.name}`).style.display = 'none';
          }
        } else if (t.type == 'text'){
          t.value = v
        }
      }
    };
    if (newlock['visability'] == 1) $('.visability').style.display = 'block';
    else $('.visability').style.display = '';
  }
  const fill_wheel_lists = () => {
    $('.wheel-lists').innerHTML = '';
    for (let i = 0; i < newlock['wheel_lists'].length; i++) {
      let v = newlock['wheel_lists'][i];
      let _type = $(`select.wheel-newoption option[value="${v.type}"]`).innerText;
      let t;
      if (v.type == 'text') {
        t = [
          tag('input', {
            class: 'text',
            attrs: { type: 'text', value: v.value },
          })
        ]
      } else if (v.type == 'task') {
        t = [
          tag('input', {
            class: 'text wheel-task',
            attrs: { 
              type: 'text', 
              value: v.value,
              placeholder: '任务内容...',
              readonly: '',
            },
          })
        ]
      } else {
        t = [
          tag('input', {
            class: 'number day',
            attrs: { type: 'text', value: 0 },
          }),
          tag('span', { innerText: '天' }),
          tag('input', {
            class: 'number hour',
            attrs: { type: 'text',value: 0 },
          }),
          tag('span', { innerText: '时' }),
          tag('input', {
            class: 'number minute',
            attrs: { type: 'text', value: 0 },
          }),
          tag('span', { innerText: '分' }),
        ];
      }
      $('.wheel-lists').appendChild(tag('div', {
        class: 'row wheel-option',
        attrs: {
          'data-type': v.type,
          'data-index': i,
        },
        children: [
          tag('div', {
            class: 'name',
            innerText: _type,
          }),
          tag('div', {
            class: 'value',
            children: t,
          }),
          tag('button', {
            class: 'btn delete wheel-delete',
            attrs: { type: 'button' },
            innerText: '×',
          })
        ],
      }));
      
      if (v.type != 'text') setOptionTime('wheel-option', i, v.value)
    };
  }
  const fill_tasks_lists = () => {
    $('.tasks-lists').innerHTML = '';
    for (let i = 0; i < newlock['tasks_lists'].length; i++) {
      let v = newlock['tasks_lists'][i];
      $('.tasks-lists').append(tag('div', {
        class: 'task',
        attrs: {
          'data-index': i,
        },
        children: [
          tag('div', {
            class: 'row',
            children: [
              tag('input', {
                class: 'text task-content',
                attrs: { 
                  type: 'text',
                  placeholder: '任务内容...',
                  readonly: '',
                },
              }),
              tag('input', {
                class: 'number text task-point',
                attrs: { 
                  type: 'text',
                  placeholder: '点数',
                },
              }),
            ],
          }),
          tag('div', {
            class: 'row',
            children: [
              tag('div', {
                class: 'name',
                innerText: '减少时间',
              }),
              tag('div', {
                class: 'value',
                children: [
                  tag('input', {
                    class: 'number day',
                    attrs: { type: 'text', value: 0 },
                  }),
                  tag('span', { innerText: '天' }),
                  tag('input', {
                    class: 'number hour',
                    attrs: { type: 'text',value: 0 },
                  }),
                  tag('span', { innerText: '时' }),
                  tag('input', {
                    class: 'number minute',
                    attrs: { type: 'text', value: 0 },
                  }),
                  tag('span', { innerText: '分' }),
                ],
              })
            ],
          }),
          tag('button', {
            class: 'btn delete task-delete',
            attrs: { type: 'button' },
            innerText: '×',
          }),
        ],
      }))
      
      setOptionTime('task', i, v.remove_time)
    }
  }
  
  let tab = 0;
  let page = 1;
  let pcount = 1;
  let tasks = [[], [], []];
  const types = ['常规', '轮盘'];
  const difficultys = ['简单', '普通', '困难', '地狱'];
  const task_times = ['3 h', '12 h', '24 h', '48 h'];
  const create_task = (task) => {
    return tag('div', {
      class: 'task',
      attrs: {
        'data-id': task.id
      },
      children: [
        tag('div', {
          class: 'row',
          children: [
            tag('div', {
              class: 'id',
              innerText: '#' + task.id,
            }),
            tag('div', {
              class: 'title',
              innerText: task.title,
            }),
            tag('div', {
              class: `star${task.is_star === true ? ' starred': ''}`,
              style: `display: ${task.delete_time > 0 ? 'none' : ''}`
            }),
          ]
        }),
        tag('div', {
          class: 'content',
          innerText: task.content.replaceAll('\n', ' '),
        }),
        tag('div', {
          class: 'row',
          children: [
            tag('div', {
              class: 'type',
              attrs: {
                'data-index': task.type,
              },
              innerText: types[task.type],
            }),
            tag('div', {
              class: 'difficulty',
              attrs: {
                'data-index': task.difficulty,
              },
              innerText: difficultys[task.difficulty],
            }),
            tag('div', {
              class: 'time',
              innerText: task_times[task.time],
            }),
          ],
        }, (t) => {
          if (tab != 1) t.appendChild(tag('div', {
            class: 'creator',
            children: [
              tag('div', {
                class: 'avatar-box',
                children: [
                  tag('img', {
                    class: 'avatar',
                    attrs: {
                      src: task.creator.photo_url
                    },
                  }, (t) => {
                    t.onerror = function() {
                      this.src = '/static/images/b65b5ae0595439920e46e80daf47512a.jpg'
                    }
                  })
                ],
              }),
              tag('div', {
                class: 'name',
                innerText: task.creator.nickname
              }),
            ],
          }));
        }),
        
      ]
    })
  }
  const add_tasks = (tab, page) => {
    // console.log('tasks', tasks)
    for (let i = (page-1) * 10; i < page * 10; i++) {
      let task = tasks[tab][i];
      if (!task) break;
      $(`.tab-content[data-index="${tab}"] .tasks`).appendChild(create_task(task))
    }
  }
  const get_tasks = (tab, page) => {
    if (!page) page = 1;
    MoeApp.apiGet('tasks/list', {
      type: tab,
      page: page,
      _auth: MoeApp.initData,
    }).then((res) => {
      // console.log('res', res)
      if (res.code == 0) {
        pcount = res.data.count;
        if (pcount == 0) {
          $(`.tab-content[data-index="${tab}"] .tasks`).innerHTML = '<div class="none">无</div>';
        }
        for (let i = 0; i < res.data.data.length; i++) {
          tasks[tab].push(res.data.data[i]);
        }
        add_tasks(tab, page);
        
      } else {
        alert(res.message)
      }
    });
  }
  const switch_tab = (index) => {
    tab = index;
    let t;
    if (t = $('.tab-switch.active')) t.classList.remove('active');
    if (t = $('.tab-content.active')) t.classList.remove('active');
    
    $(`.tab-switch[data-index="${index}"]`).classList.add('active');
    $(`.tab-content[data-index="${index}"]`).classList.add('active');
    page = 1;
    pcount = 1;
    if (pcount > tasks[tab].length) {
      get_tasks(tab, 1);
    }
  }
  const refresh_tab = (tab) => {
    page = 1;
    pcount = 1;
    tasks[tab] = [];
    $(`.tab-content[data-index="${tab}"] .tasks`).innerHTML = ''
    get_tasks(tab, 1);
  }
  
  fill_newlock();
  fill_wheel_lists();
  fill_tasks_lists()
  
  MoeApp.login().then(() => {
    Telegram.WebApp.ready();
    Telegram.WebApp.BackButton.onClick(function () {
      if (window.history.length > 1) window.history.back()
      else window.location.href = '/';
    })
    Telegram.WebApp.BackButton.show()
  }).catch(() => {
  });
  
  const len = (s) => {
    return s.replace(/[\x00-\x7f]/g, '').length + s.replace(/[^\x00-\xff]/g, '').length / 2;
  }
  const create_lock = () => {
    if (len(newlock.name) < 2 || len(newlock.name) > 16) {
      return alert(`名称长度应为2-16个字 (当前: ${len(newlock.name)})`)
    }
    MoeApp.apiRequest('locks/add', {
      name: newlock['name'],
      difficulty: parseInt(newlock['difficulty']),
      visability: parseInt(newlock['visability']),
      cost: parseInt(newlock['cost']),
      min: newlock['min'],
      max: newlock['max'],
      limit: newlock['limit'],
      limit_time: newlock['limit_time'],
      twitter: newlock['twitter'],
      x_love_add: newlock['x_love_add'],
      x_forward_add: newlock['x_forward_add'],
      x_comment_add: newlock['x_comment_add'],
      x_follow_add: newlock['x_follow_add'],
      public: newlock['public'],
      public_add: newlock['public_add'],
      public_remove: newlock['public_remove'],
      hidden: newlock['hidden'],
      hidden_add: newlock['hidden_add'],
      temporary_open: newlock['temporary_open'],
      temporary_interval: newlock['temporary_interval'],
      temporary_time: newlock['temporary_time'],
      temporary_punish: newlock['temporary_punish'],
      verification_picture: newlock['verification_picture'],
      verification_interval: newlock['verification_interval'],
      verification_method: newlock['verification_method'],
      verification_punish: newlock['verification_punish'],
      wheel: newlock['wheel'],
      wheel_method: newlock['wheel_method'],
      wheel_interval: newlock['wheel_interval'],
      wheel_times: newlock['wheel_times'],
      wheel_lists: newlock['wheel_lists'],
      tasks: newlock['tasks'],
      tasks_method: newlock['tasks_method'],
      tasks_interval: newlock['tasks_interval'],
      tasks_choose: newlock['tasks_choose'],
      tasks_punish: newlock['tasks_punish'],
      tasks_points: newlock['tasks_points'],
      tasks_lists: newlock['tasks_lists'],
      twin_flowers: newlock['twin_flowers'],
      framing: newlock['framing'],
    }, (res) => {
      if (res.error) {
        alert(res.error)
        return
      }
      if (res.code == 0) {
        alert('创建成功！');
        set_default()
        save_newlock();
        window.history.back();
        fill_newlock();
      } else {
        alert(res.message)
      }
    })
  }
  
  let task_target = null;
  let task_option = null;
  document.addEventListener('click', (e) => {
    let index;
    let t;
    if (e.target.nodeName == 'INPUT') {
      let name = e.target.name;
      let value = e.target.value;
      let checked = e.target.checked;
      switch (true) {
        case e.target.classList.contains('switch-input'):
          t = $(`.srow .content.${name}`);
          if (checked) t.style.display = 'block';
          else t.style.display = 'none';
          if (checked) {
            if (newlock['tasks'] || newlock['wheel']) {
              if (tasks[0].length == 0) get_tasks(0, 1)
            }
          }
          break;
          
        case e.target.classList.contains('task-content') || e.target.classList.contains('wheel-task'):
          if (tasks[0].length == 0) {
            get_tasks(0, 1)
          }
          
          
          click_task = e.target;
          if (e.target.classList.contains('wheel-task')) {
            t = e.target.closest('.wheel-option')
            index = t.getAttribute('data-index');
            task_lists = newlock['wheel_lists'][index];
          } else {
            t = e.target.closest('.task')
            index = t.getAttribute('data-index');
            task_option = newlock['tasks_lists'][index];
          }
          // console.log(task_option)
          
          $('dialog').showModal()
          let rect = $('dialog .popup');
          $('dialog').style.left = ((window.innerWidth - rect.clientWidth) / 2) + 'px';
          $('dialog').style.top = ((window.innerHeight - rect.clientHeight) / 2 - 30) + 'px';
          break;
      }
      return
    }
    
    switch (true) {
      case e.target.classList.contains('clean'):
        set_default()
        save_newlock()
        fill_newlock()
        break;
      case e.target.classList.contains('delete'):
        let parent = e.target.parentElement;
        index = parseInt(parent.getAttribute('data-index'));
        switch (true) {
          case e.target.classList.contains('wheel-delete'):
            newlock['wheel_lists'].splice(index, 1);
            save_newlock()
            fill_wheel_lists()
            break;
          case e.target.classList.contains('task-delete'):
            break;
        }
        parent.remove();
        break;
    
      case e.target.classList.contains('wheel-add'):
        let type = $('.wheel-newoption').value;
        let value;
        if (type == 'text') {
          value = '';
        } else if (type == 'task') {
          value = 0
        } else {
          value = 3600
        }
        newlock['wheel_lists'].push({ type: type, value: value, _content: '' })
        save_newlock()
        fill_wheel_lists()
        break;
      
      case e.target.classList.contains('tasks-add'):
        newlock['tasks_lists'].push({
          content: 0,
          _content: '',
          point: '',
          remove_time: 3600,
        })
        save_newlock()
        fill_tasks_lists()
        break;
        
      case e.target.classList.contains('create'):
        create_lock()
        break;
      
      case e.target.classList.contains('tab-switch'):
        if (e.target.classList.contains('active')) return;
        index = parseInt(e.target.getAttribute('data-index'));
        switch_tab(index)
        break;
      case e.target.classList.contains('refresh'):
        refresh_tab(tab);
        break;
        
      case !!(t = e.target.closest('.popup .task')):
        index = parseInt(t.getAttribute('data-id'))
        if ('value' in task_option) task_option['value'] = index;
        else task_option['content'] = index;
        click_task.setAttribute('data-task', index)
        let task_title = t.querySelector('.title').innerText;
        task_option['_content'] = 
        click_task.value = `#${index} ${task_title}`
        $('dialog').close()
        break;
    }
    
  })
  
  document.addEventListener('keyup', (e) => {
    if (e.target.closest('input.number')) {
      if (e.target.value == '') return;
      e.target.value = e.target.value
      .replace(/[^0-9]/g, '')
      .replace(/^0+([1-9]\d*|0)/g, '$1');
    }
  });
  document.addEventListener('paste', (e) => {
    if (e.target.closest('input.number')) e.preventDefault();
  });
  document.addEventListener('change', (e) => {
    let name = e.target.name;
    let value = e.target.value;
    let checked = e.target.checked;
    let k, v;
    let flag = true;
    if (name) {
    if (e.target.classList.contains('day') || e.target.classList.contains('hour') || e.target.classList.contains('minute')) {
      k = name.split('-')[0];
      v = getTime(k)
      if (k == 'min') {
        if (newlock['max'] >= v) {
          remove_error('max');
        }
      }
      if (k == 'max') {
        if (v < newlock['min']) {
          add_error({
            name: 'max',
            value: '最大时长不能小于最小时长'
          })
          flag = false;
        } else {
          remove_error('max')
        }
      }
      
      if (flag) {
        setTime(k, v);
        if (k == 'min' && v > newlock['max']) {
          setTime('max', v);
        }
        if (k == 'public_add_min' && v > newlock['public_add_max']) {
          setTime('public_add_max', v);
        }
        if (k == 'public_remove_min' && v > newlock['public_remove_max']) {
          setTime('public_remove_max', v);
        }
        newlock[k] = v;
        save_newlock()
      }
      // console.log(newlock)
    } else {
      if (e.target.type == 'checkbox') {
        newlock[name] = checked;
      } else {
        newlock[name] = value;
        if (name == 'visability' && value == 1) $('.visability').style.display = 'block';
        else $('.visability').style.display = '';
      }
      if (e.target.classList.contains('number')) {
        newlock[name] = parseInt(newlock[name]);
      }
      save_newlock();
    }}
    
    let t;
    switch (true) {
      case e.target.closest('input.number') && value == '':
        e.target.value = 0;
        break
      case !!(t = e.target.closest('.wheel-option')):
        let index = parseInt(t.getAttribute('data-index'));
        let type = t.getAttribute('data-type');
        if (type == 'text') {
          v = $(`.wheel-option[data-index="${index}"] input.text`).value
        } else {
          v = getOptionTime('wheel-option', index)
          setOptionTime('wheel-option', index, v);
        }
        
        newlock['wheel_lists'][index]['value'] = v;
        save_newlock()
        break;
    }
  })
  
  $$('.tasks').forEach((t) => {
    t.addEventListener('scroll', (e) => {
      if ((e.target.scrollTop + e.target.clientHeight) / e.target.scrollHeight > 0.8) {
        if (pcount > tasks[tab].length) {
          page += 1;
          get_tasks(tab, page);
        }
      }
    });
  });
})