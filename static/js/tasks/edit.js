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
    if (task.id) {
      $('.idrow').style.display = '';
      $$('input[name="type"]').forEach(i => i.disabled = true);
    } else {
      $('.idrow').style.display = 'none';
      $$('input[name="type"]').forEach(i => i.disabled = false);
    }
    window.scroll(0, 0)
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
  let task = searchParams.get('task'); 
  if (!task) {
    fill_task(newtask);
  } else {
    task = JSON.parse(gz64_decode(task));
    fill_task(task)
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
  
  const len = (s) => {
    return s.replace(/[\x00-\x7f]/g, '').length + s.replace(/[^\x00-\xff]/g, '').length / 2;
  }
  
  const add_task = () => {
    if (len(newtask.title) < 2 || len(newtask.title) > 16) {
      return alert(`标题长度应为2-16个字 (当前: ${len(newtask.title)})`)
    }
    if (len(newtask.content) < 5 || len(newtask.content) > 300) {
      return alert(`内容长度应为5-300个字 (当前: ${len(newtask.content)})`)
    }
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
        save_newtask();
        fill_task(newtask);
        window.location.replace(`/html/tasks/?tab=1&show=${res.data.id}`);
      } else {
        alert(res.message)
      }
    })
  }
  const edit_task = () => {
    if (len(task.title) < 2 || len(task.title) > 16) {
      return alert(`标题长度应为2-16个字 (当前: ${len(task.title)})`)
    }
    if (len(task.content) < 5 || len(task.content) > 300) {
      return alert(`内容长度应为5-300个字 (当前: ${len(task.content)})`)
    }
    MoeApp.apiRequest('tasks/edit', {
      id: task.id,
      task: {
        title: task.title,
        difficulty: task.difficulty,
        time: task.time,
        visability: task.visability,
        content: task.content,
        data: '',
      },
    }, (res) => {
      if (res.error) {
        alert(res.error)
        return
      }
      if (res.code == 0) {
        alert('修改成功！');
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
        if (!task) add_task();
        else edit_task();
        break;
    }
  })
  
  document.addEventListener('change', (e) => {
    let name = e.target.name;
    let value = e.target.value;
    let checked = e.target.checked;
    if (!task) {
      if (e.target.nodeName == 'TEXTAREA' || e.target.type == 'text' || e.target.type == 'radio') {
        newtask[name] = value;
        if (e.target.type == 'radio') newtask[name] = parseInt(newtask[name])
        save_newtask()
      }
    } else {
      if (e.target.nodeName == 'TEXTAREA' || e.target.type == 'text' || e.target.type == 'radio') {
        task[name] = value;
        if (e.target.type == 'radio') task[name] = parseInt(task[name])
      }
    }
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
