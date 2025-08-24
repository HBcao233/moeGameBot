window.addEventListener('load', () => {
  const get_task = (id) => {
    return new Promise((resolve, reject) => {
      if (!page) page = 1;
      MoeApp.apiGet('tasks/list', {
        type: tab,
        page: page,
        _auth: MoeApp.initData,
      }).then((res) => {
        // console.log('res', res)
        if (res.code == 0) {
          pcount = res.data.count;
          for (let i = 0; i < res.data.data.length; i++) {
            tasks[tab].push(res.data.data[i]);
          }
          add_tasks(tab, page);
          resolve();
        } else {
          reject(res.message)
        }
      })
    });
  }
  const times = [3, 12, 24, 48];
  const show_task = (task) => {
    $('.task .title').innerText = task.title;
    $('.task .content').innerText = task.content;
    $('.task .time').innerText = formatTime(times[task.time] * 3600)
  }
  
  const searchParams = new URLSearchParams(window.location.search);
  let preview = searchParams.get('preview');
  if (preview) {
    preview = JSON.parse(gz64_decode(preview));
    show_task(preview);
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
  
});