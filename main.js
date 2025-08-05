function setThemeClass() {
  document.documentElement.className = Telegram.WebApp.colorScheme;
}

Telegram.WebApp.onEvent('themeChanged', setThemeClass);
setThemeClass();

class MoeApp {
  static initData = Telegram.WebApp.initData || ''
  static initDataUnsafe = Telegram.WebApp.initDataUnsafe || {}
  static MainButton = Telegram.WebApp.MainButton
  static SettingsButton = Telegram.WebApp.SettingsButton
  static user = {};
  
  static init(options) {
    if ('nickname' in MoeApp.user) {
      document.querySelector('.nickname').innerText = MoeApp.user.nickname;
      document.querySelector('.avatar').src = MoeApp.user.photo_url;
    }
    document.body.style.visibility = ''
    Telegram.WebApp.ready()
    Telegram.WebApp.BackButton.onClick(function () {
      MoeApp.showAlert('Back button pressed')
    })
    Telegram.WebApp.SettingsButton.onClick(function () {
      MoeApp.showAlert('Settings opened!')
    })
    // MoeApp.BackButton.show();
  }
  
  static close() {
    Telegram.WebApp.close();
  }
  
  static toggleMainButton(el) {
    const mainButton = Telegram.WebApp.MainButton;
    if (mainButton.isVisible) {
      mainButton.hide();
      el.innerHTML = 'Show Main Button';
    } else {
      mainButton.show();
      el.innerHTML = 'Hide Main Button';
    }
  }
  
  static toggleSettingsButton(el) {
    if (MoeApp.SettingsButton.isVisible) {
      MoeApp.SettingsButton.hide();
      el.innerHTML = 'Show Settings Button';
    } else {
      MoeApp.SettingsButton.show();
      el.innerHTML = 'Hide Settings Button';
    }
  }

  // actions
  static login() {
    return new Promise((resolve, reject) => {
      if (window.localStorage.getItem('user')) {
        MoeApp.user = JSON.parse(window.localStorage.getItem('user'))
      }
      if (MoeApp.initData) {
        MoeApp.apiRequest('user/login', {}, function (result) {
          if (result.code == 0) {
            MoeApp.user = result.data;
            window.localStorage.setItem('user', JSON.parse(MoeApp.user))
            resolve();
          } else {
            reject('验证失败')
          }
        });
      } else {
        reject('非telegram访问')
      }
    })
  }
  
  static switchInlineQuery(query, chooseChat) {
    if (chooseChat) {
      const chatTypes = []
      const types = ['users', 'bots', 'groups', 'channels'];
      for (let i = 0; i < types.length; i++) {
        const el = document.getElementById('select-' + types[i]);
        if (el.checked) {
          chatTypes.push(types[i]);
        }
      }

      if (!chooseChatTypes.length) {
        return MoeApp.showAlert('Select chat types!');
      }

      Telegram.WebApp.switchInlineQuery(query, chatTypes)
    }

    Telegram.WebApp.switchInlineQuery(query, false)
  }

  // Alerts
  static showAlert(message) {
    Telegram.WebApp.showAlert(message);
  }
  
  static showConfirm(message) {
    Telegram.WebApp.showConfirm(message);
  }
  
  static requestContact() {
    Telegram.WebApp.requestContact(function (result) {
      if (result) {
        MoeApp.showAlert('Contact granted');
      } else {
        MoeApp.showAlert('Contact denied');
      }
    });
  }
  
  static showPopup() {
    Telegram.WebApp.showPopup({
      title: 'Popup title',
      message: 'Popup message',
      buttons: [
        { id: 'delete', type: 'destructive', text: 'Delete all' },
        { id: 'faq', type: 'default', text: 'Open FAQ' },
        { type: 'cancel' },
      ]
    }, function (buttonId) {
      if (buttonId === 'delete') {
        MoeApp.showAlert("'Delete all' selected");
      } else if (buttonId === 'faq') {
        Telegram.WebApp.openLink('https://telegram.org/faq');
      }
    });
  }
  
  static showScanQrPopup(linksOnly) {
    Telegram.WebApp.showScanQrPopup({
      text: linksOnly ? 'with any link' : 'for test purposes'
    }, function (text) {
      if (linksOnly) {
        const lowerText = text.toString().toLowerCase();
        if (lowerText.substring(0, 7) === 'http://' ||
          lowerText.substring(0, 8) === 'https://'
        ) {
          setTimeout(function () {
            Telegram.WebApp.openLink(text);
          }, 50);

          return true;
        }
      } else {
        MoeApp.showAlert(text);

        return true;
      }
    });
  }

  // Permissions
  
  static requestVideo(el) {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(function (stream) {
        el.nextElementSibling.innerHTML = '(Access granted)';
      });
    } else {
      el.nextElementSibling.innerHTML = 'Media devices is not supported in this browser.';
      el.nextElementSibling.className = 'err';
    }
    return false;
  }
  
  static requestWriteAccess(el) {
    Telegram.WebApp.requestWriteAccess(function (allowed) {
      if (allowed) {
        el.nextElementSibling.innerHTML = '(Access granted)'
        el.nextElementSibling.className = 'ok'
      } else {
        el.nextElementSibling.innerHTML = '(User declined this request)'
        el.nextElementSibling.className = 'err'
      }
    })
  }
  
  static requestServerTime(el) {
    Telegram.WebApp.invokeCustomMethod('getCurrentTime', {}, function (err, time) {
      if (err) {
        el.nextElementSibling.innerHTML = '(' + err + ')'
        el.nextElementSibling.className = 'err'
      } else {
        el.nextElementSibling.innerHTML = '(' + (new Date(time * 1000)).toString() + ')'
        el.nextElementSibling.className = 'ok'
      }
    });
  }

  // Other
  static apiRequest(method, data, onCallback) {
    console.log('fetch', method, data)
    const authData = MoeApp.initData || '';
    fetch(`https://hbcaodog--mtgbot-f.modal.run/api/${method}`, {
      method: 'POST',
      body: JSON.stringify(Object.assign(data, {
        _auth: authData,
      })),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      onCallback && onCallback(result);
    }).catch(function (error) {
      onCallback && onCallback({ error: 'Server error' });
    });
  }
}

function cleanHTML(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br/>')
}

function byteLength(str) {
  if (window.Blob) {
    try {
      return new Blob([str]).size;
    } catch (e) {
    }
  }

  let s = str.length;
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) {
      s++;
    } else if (code > 0x7ff && code <= 0xffff) {
      s += 2;
    }

    if (code >= 0xDC00 && code <= 0xDFFF) {
      i--;
    }
  }
  return s;
}

function round(val, d) {
  const k = Math.pow(10, d || 0);
  return Math.round(val * k) / k;
}


window.addEventListener('load', () => {
  try {

    document.getElementById('regular_link').setAttribute('href', document.getElementById('regular_link').getAttribute('href') + location.hash);
    // document.getElementById('text_field').focus();
    document.getElementById('regular_field').addEventListener('input', function (e) {
      const val = this.value.toLowerCase();
      if (val.indexOf('progress') >= 0) {
        Telegram.WebApp.MainButton.showProgress();
      } else {
        Telegram.WebApp.MainButton.hideProgress();
      }
    });
  
    document.getElementById('ver').innerHTML = Telegram.WebApp.version;
    document.getElementById('platform').innerHTML = Telegram.WebApp.platform;
    
    if ('user' in MoeApp.initDataUnsafe) {
      document.getElementById('peer_wrap').style.display = 'block';
      document.getElementById('peer_name').innerHTML = MoeApp.initDataUnsafe.user.first_name + ' ' + MoeApp.initDataUnsafe.user.last_name;
      if (MoeApp.initDataUnsafe.user.photo_url) {
        document.getElementById('peer_photo').setAttribute('src', MoeApp.initDataUnsafe.user.photo_url);
      } else {
        document.getElementById('peer_photo').style.display = 'none';
      }
    } else if ('chat' in MoeApp.initDataUnsafe) {
      document.getElementById('peer_wrap').style.display = 'block';
      document.getElementById('peer_name').innerHTML = MoeApp.initDataUnsafe.chat.title;
      if (MoeApp.initDataUnsafe.chat.photo_url) {
        document.getElementById('peer_photo').setAttribute('src', MoeApp.initDataUnsafe.chat.photo_url);
      } else {
        document.getElementById('peer_photo').style.display = 'none';
      }
    }
    
    MoeApp.login().then(MoeApp.init).catch((e) => {
      alert(`初始化失败: ${e}`)
    })
    
    Telegram.WebApp.setHeaderColor('secondary_bg_color');
    // Telegram.WebApp.onEvent('viewportChanged', setViewportData);
    
    document.body.setAttribute('style', '--bg-color:' + Telegram.WebApp.backgroundColor);
    Telegram.WebApp.onEvent('themeChanged', function () {
      document.body.setAttribute('style', '--bg-color:' + Telegram.WebApp.backgroundColor);
    });
  } catch (e) {
    alert(str(e))
  }
})