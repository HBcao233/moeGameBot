document.addEventListener('DOMContentLoaded', function() {

  document.addEventListener('click', (e) => {
    switch(true) {
      case !!e.target.closest('.mainmenu_btn.start'):
        $('#section-mainmenu').style.display = 'none';
        $('#section-0').style.display = 'block';
        setTimeout(() => {
          $('.p2').style.display = 'block';
        }, 1000)
        break;
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