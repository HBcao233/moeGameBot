window.addEventListener('load', () => {
  let user_lock = window.localStorage.getItem('new_user_lock');
  const set_default = () =>{
    user_lock = {
      method: 0,
      password: '',
      keyholder: 0,
      desc: '',
    }
  }
  const save_user_lock = () => {
    window.localStorage.setItem('new_user_lock', JSON.stringify(user_lock))
  }
  const fill_user_lock = () => {
    for (const k of Object.keys(user_lock)) {
      let v = user_lock[k];
      let t = $(`input[name="${k}"]`);
      if (t) {
        if (t.type == 'radio') {
          t = $(`input[name="${k}"][value="${v}"]`);
          if (t) {
            t.checked = true;
          }
        } else if (t.type == 'text'){
          t.value = v
        }
      }
      t = $(`textarea[name="${k}"]`);
      if (t) {
        t.value = v
      }
    };
    $('.passrow').style.display =  (user_lock['method'] == 1 ? '' : 'none');
  }
  if (!user_lock) set_default();
  else user_lock = JSON.parse(user_lock);
  fill_user_lock();
  
  const start_lock = () => {
    MoeApp.apiRequest('locks/start', {
      lock_id: lock_info.id,
      method: parseInt(user_lock['method']),
      password: user_lock['password'],
      keyholder: parseInt(user_lock['keyholder']),
      desc: user_lock['desc'],
    }, (res) => {
      if (res.code != 0) {
        alert(res.message)
        return
      }
      alert('创建成功！');
      set_default()
      save_user_lock();
      window.history.replaceState(null, null, '/locks/')
      window.history.go(0);
      fill_user_lock();
    })
  }
  
  const searchParams = new URLSearchParams(window.location.search);
  let lock = searchParams.get('lock');
  let lock_info = JSON.parse(gz64_decode(lock));
  if (lock_info.id === undefined) {
    alert('加载失败')
  } else {
    $('.title').innerText = `#${lock_info.id} ${lock_info.name}`;
    $('.init_time').innerText = (lock_info.min == lock_info.max ? formatTime(lock_info.min) : `${formatTime(lock_info.min)} ~ ${formatTime(lock_info.max)}`);
    $('.limit_time').innerText = (lock_info.is_limit ? formatTime(lock_info.limit_time): '∞')
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
  
  document.addEventListener('change', (e) => {
    let name = e.target.name;
    let value = e.target.value;
    user_lock[name] = value;
    save_user_lock();
    if (name == 'method') {
      $('.passrow').style.display = (value == 1 ? '':'none');
      $('.method_tip').style.display = (value == 1 ? '':'none');
    }
  });
  document.addEventListener('click' , (e) => {
    switch (true) {
      case e.target.classList.contains('start_lock'):
        start_lock()
        break
    }
  })
});