
document.addEventListener('DOMContentLoaded', function() {

  // 创建地图控制器实例
  const mapController = new MapController();
  
  let camp, race, x;
  if ((x = getValue('camp')) && parseInt(x)) {
    camp = parseInt(x);
  }
  if ((x = getValue('race')) && parseInt(x)) {
    race = parseInt(x);
  }
  if (camp && race) {
    $('#norace').style.display = 'none';
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