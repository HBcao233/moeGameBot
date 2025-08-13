window.addEventListener('load', () => {
  const set_default = () => {
    newtask = {
      title: '',
      difficulty: 0,
      time: 3,
      visability: 0,
      type: 0,
      content: '',
      data: [],
    }
  }
  let newtask = window.localStorage.getItem('newtask');
  if (newtask) {
    newtask = JSON.parse(newtask);
  } else {
    set_default()
  }
  const fill_task = (task) => {
    for (const k of Object.keys(task)) {
      let v = task[k];
      let t = $(`input[name="${k}"]`);
      if (t) {
        if (t.type == 'radio') {
          t = $(`input[name="${k}"][value="${v}"]`);
          if (t) t.checked = true;
        } else if (t.type == 'text'){
          t.value = v
        }
      }
      t = $(`textarea[name="${k}"]`);
      if (t) {
        t.value = v
      }
    };
    if (task['type'] == 1) {
      $('.content').classList.remove('column')
      $('.content .name').innerText = '介绍';
      $('.row.wheel').style.display = '';
      $('.data').style.display = '';
    } else {
      $('.content').classList.add('column')
      $('.content .name').innerText = '内容';
      $('.row.wheel').style.display = 'none';
      $('.data').style.display = 'none';
    }
  }
  const save_newtask = () => {
    window.localStorage.setItem('newtask', JSON.stringify(newtask))
  }
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get('id'); 
  if (!id) {
    fill_task(newtask);
  }
  
  MoeApp.login().then(() => {
    Telegram.WebApp.ready();
    Telegram.WebApp.BackButton.onClick(function () {
      if (window.history.length > 1) window.history.back()
      else window.location.href = '/';
    })
    Telegram.WebApp.BackButton.show()
  }).catch(() => {
  });
  
  const add_task = () => {
    console.log(newtask)
    MoeApp.apiRequest('tasks/add', {
      title: newtask.title,
      difficulty: newtask.difficulty,
      time: newtask.time,
      visability: newtask.visability,
      type: newtask.type,
      content: newtask.content,
      data: ''
    }, (res) => {
      if (res.error) {
        alert(res.error)
        return
      }
      if (res.code == 0) {
        alert('创建成功！');
        set_default()
        fill_task(newtask);
        window.history.back();
      } else {
        alert(res.message)
      }
    })
  }
  
  document.addEventListener('click', (e) => {
    switch (true) {
      case !!e.target.closest('.btn.save'):
        if (MoeApp.initData == '') {
          alert('未登录');
          return;
        }
        if (!id) add_task();
        break;
    }
  })
  
  document.addEventListener('change', (e) => {
    let name = e.target.name;
    let value = e.target.value;
    let checked = e.target.checked;
    if (!id) {
    if (e.target.nodeName == 'TEXTAREA' || e.target.type == 'text' || e.target.type == 'radio') {
      newtask[name] = value;
      save_newtask()
    }}
    switch (name) {
      case 'type':
        if (value == 1) {
          $('.content').classList.remove('column')
          $('.content .name').innerText = '介绍';
        } else {
          $('.content').classList.add('column')
          $('.content .name').innerText = '内容';
        }
        break;
    }
  });
});