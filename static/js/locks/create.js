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
  const setDefault = () => {
    newlock = {
      name: '',
      visability: 0,
      cost: 0,
      min: 3600,
      max: 3600,
      limit: 0,
      limit_time: 0,
      public: false,
      public_add: 600,
      public_remove: 600,
      hidden_time: false,
      hidden: 600,
      temporary_open: false,
      temporary_interval: 86400,
      temporary_time: 1800,
      temporary_punish: 600,
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
        content: '',
        point: '',
        remove_time: 3600,
      }],
    }
  }
  const save_newlock = () => {
    window.localStorage.setItem('newlock', JSON.stringify(newlock))
  }
  if (!newlock) {
    setDefault()
  } else {
    newlock = JSON.parse(newlock)
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
  
  document.addEventListener('click', (e) => {
    if (e.target.nodeName == 'INPUT') {
      let name = e.target.name;
      let value = e.target.value;
      let checked = e.target.checked;
      let t;
      switch (true) {
        case e.target.classList.contains('switch-input'):
          t = $(`.srow .content.${name}`);
          if (checked) t.style.display = 'block';
          else t.style.display = 'none';
          break;
        
        case e.target.classList.contains('create'):
          
          break;
      }
      return
    }
    switch (true) {
      case e.target.classList.contains('clean'):
        setDefault()
        save_newlock()
        fill_newlock()
        break;
      case e.target.classList.contains('delete'):
        let parent = e.target.parentElement;
        let index = parseInt(parent.getAttribute('data-index'));
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
        } else {
          value = 3600
        }
        newlock['wheel_lists'].push({ type, value })
        save_newlock()
        fill_wheel_lists()
        break;
      case e.target.classList.contains('tasks-add'):
        newlock['tasks_lists'].push({
          content: '',
          point: '',
          remove_time: 3600,
        })
        save_newlock()
        fill_tasks_lists()
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
        newlock[k] = v;
        save_newlock()
      }
      // console.log(newlock)
    } else {
      if (e.target.type == 'checkbox') {
        newlock[name] = checked;
      } else {
        newlock[name] = value;
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
})