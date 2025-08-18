window.addEventListener('load', () => {
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
  
  console.log(Telegram.WebApp.version, Telegram.WebApp.platfor);
  
  MoeApp.login().then(() => {
    Telegram.WebApp.ready();
    if ('nickname' in MoeApp.user) {
      document.querySelector('.nickname').innerText = MoeApp.user.nickname;
      document.querySelector('.avatar').src = MoeApp.user.photo_url;
      document.querySelector('.description').innerText = MoeApp.user.description;
      if (MoeApp.user.role != 0) document.querySelector(`.role .item[data-index="${MoeApp.user.role}"]`).style.display = '';
      if (MoeApp.user.sex != 0) document.querySelector(`.sex .item[data-index="${MoeApp.user.sex}"]`).style.display = '';
      document.body.style.visibility = '';
    }
  }).catch(() => {
  })
  
  document.addEventListener('visibilitychange', function(event) {
    if (document.visibilityState) console.log('page show')
  });
  Telegram.WebApp.BackButton.hide()
})