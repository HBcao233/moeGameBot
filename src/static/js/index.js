const searchParams = new URLSearchParams(window.location.search);
let startapp = searchParams.get('tgWebAppStartParam'); 
if (startapp) {
  let data;
  switch (true) {
    case startapp.startsWith('tests_bdsm_'):
      data = startapp.slice(11);
      data = gz64_decode(data)
      window.location.href = `tests/bdsm/?uid=${data}`;
      break;
    case startapp.startsWith('tests_bdsm'):
      window.location.href = 'tests/bdsm/';
      break;
      
    case startapp.startsWith('lock_'):
      data = startapp.slice(5);
      data = gz64_decode(data)
      window.location.href = `locks/?uid=${data}`;
      break;
    case startapp.startsWith('lock'):
      data = startapp.slice(5);
      data = gz64_decode(data)
      window.location.href = `locks/`;
      break;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let now = new Date();
  const month = now.getMonth() + 1;
  document.querySelector('.calendar .month').innerText = `${month} 月`;
  
  const year = now.getFullYear();
  const daynum = (new Date(year, month, 0)).getDate();
  now.setDate(1);
  const offset = now.getDay();
  let j = 1;
  for (let i = offset; i < offset + daynum; i++) {
    let td = document.querySelector(`.calendar td[data-index="${i}"]`)
    td.setAttribute('data-day', j);
    td.querySelector('.day').innerText = j;
    j++;
  }
  
  const update_love = () => {
    if (!MoeApp.initData) return;
    MoeApp.apiPost('user/love', {}).then(res => {
      if (res.code != 0) {
        alert(res.message)
        return 
      }
      MoeApp.user.love = parseInt(res.data.love || '0');
      $('.love .text').innerText = MoeApp.user.love;
      window.localStorage.setItem('user', JSON.stringify(MoeApp.user))
    })
  }
  
  // console.log(Telegram.WebApp.version, Telegram.WebApp.platfor);
  let user_lock = {};
  let timer = null;
  $('.lock_status').style.display = 'none';
  $('.lockrow').style.display = 'none'
  const get_user_lock = () => {
    if (!MoeApp.initData) return;
    MoeApp.apiGet('locks/is_locked', {
      _auth: MoeApp.initData,
    }).then((res) => {
      // console.log('res', res)
      if (res.code == 0) {
        user_lock = res.data;
        fill_user_lock();
      } else {
        alert(res.message)
      }
    })
  }
  const fill_user_lock = () => {
    if (!user_lock.id) {
      $('.lockrow').style.display = 'none'
      return;
    }
    $('.lock_status').style.display = '';
    const ti = () => {
      const now = Math.floor(Date.now() / 1000);
      $('.lock_time').innerText = (now >= user_lock.end_time ? '时间已到' : formatTime(user_lock.end_time - now));
      if (now >= user_lock.end_time) clearInterval(timer);
    }
    if (timer) clearInterval(timer);
    ti();
    timer = setInterval(ti, 1000);
    
    $('.lockrow').style.display = '';
  }
  
  MoeApp.login().then((res) => {
    Telegram.WebApp.ready();
    if (MoeApp.user.id) {
      get_user_lock();
      if (!res) update_love();
      document.querySelector('.nickname').innerText = MoeApp.user.nickname;
      document.querySelector('.avatar').src = MoeApp.user.photo_url;
      document.querySelector('.description').innerText = MoeApp.user.description;
      if (MoeApp.user.role != 0) document.querySelector(`.role .item[data-index="${MoeApp.user.role}"]`).style.display = '';
      if (MoeApp.user.sex != 0) document.querySelector(`.sex .item[data-index="${MoeApp.user.sex}"]`).style.display = '';
      
      let tags = MoeApp.user.tags;
      $('.tagsrow').style.display = tags > 0 ? '' : 'none';
      for (let i = 0; i < 12; i++) {
        document.querySelector(`.tags[data-index="${i+1}"]`).style.display = (tags >> i) & 1 ? '' : 'none'
      }
      
    }
  }).catch(() => {
  })
  
  document.addEventListener('visibilitychange', function(event) {
    if (document.visibilityState) console.log('page show')
  });
  Telegram.WebApp.BackButton.hide()
})