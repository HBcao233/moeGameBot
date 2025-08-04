function setThemeClass() {
  document.documentElement.className = Telegram.WebApp.colorScheme;
}

Telegram.WebApp.onEvent('themeChanged', setThemeClass);
setThemeClass();

const MoeApp = {
  initData: Telegram.WebApp.initData || '',
  initDataUnsafe: Telegram.WebApp.initDataUnsafe || {},
  MainButton: Telegram.WebApp.MainButton,
  BackButton: Telegram.WebApp.BackButton,
  SettingsButton: Telegram.WebApp.SettingsButton,

  init(options) {
    document.body.style.visibility = ''
    Telegram.WebApp.ready()
    Telegram.WebApp.MainButton.setParams({
      text: 'CLOSE WEBVIEW',
      is_visible: true
    }).onClick(MoeApp.close)
    Telegram.WebApp.BackButton.onClick(function () {
      MoeApp.showAlert('Back button pressed')
    })
    Telegram.WebApp.SettingsButton.onClick(function () {
      MoeApp.showAlert('Settings opened!')
    })
    MoeApp.BackButton.show();
  },
  expand() {
    Telegram.WebApp.expand();
  },
  close() {
    Telegram.WebApp.close();
  },
  toggleMainButton(el) {
    const mainButton = Telegram.WebApp.MainButton;
    if (mainButton.isVisible) {
      mainButton.hide();
      el.innerHTML = 'Show Main Button';
    } else {
      mainButton.show();
      el.innerHTML = 'Hide Main Button';
    }
  },
  toggleSettingsButton(el) {
    if (MoeApp.SettingsButton.isVisible) {
      MoeApp.SettingsButton.hide();
      el.innerHTML = 'Show Settings Button';
    } else {
      MoeApp.SettingsButton.show();
      el.innerHTML = 'Hide Settings Button';
    }
  },
  toggleSwipeBehavior(el) {
    if (Telegram.WebApp.isVerticalSwipesEnabled) {
      Telegram.WebApp.disableVerticalSwipes();
      el.innerHTML = 'Enable Vertical Swypes';
    } else {
      Telegram.WebApp.enableVerticalSwipes();
      el.innerHTML = 'Disable Vertical Swypes';
    }
  },

  // version to string Example: '6.9'
  doesntSupport(version) {
    // console.log("version: " + version);
    // console.log("realVersion: " + this.version());
    // console.log("doesntSupport: " + this.isVersionAtLeast(version));
    if (!this.isVersionAtLeast(version)) {
      Telegram.WebApp.showAlert('This feature is not supported in this version of Telegram', function () {
        Telegram.WebApp.close();
      });
      throw new Error('This feature is not supported in this version of Telegram');
    }
  },

  // actions
  sendMessage(msg_id, with_webview) {
    if (!MoeApp.initDataUnsafe.query_id) {
      alert('WebViewQueryId not defined');
      return;
    }

    document.querySelectorAll('button').forEach((btn) => btn.disabled = true);

    const btn = document.querySelector('#btn_status');
    btn.textContent = 'Sending...';

    MoeApp.apiRequest('sendMessage', {
      msg_id: msg_id || '',
      with_webview: !MoeApp.initDataUnsafe.receiver && with_webview ? 1 : 0
    }, function (result) {
      document.querySelectorAll('button').forEach((btn) => btn.disabled = false);

      if (result.response) {
        if (result.response.ok) {
          btn.textContent = 'Message sent successfully!';
          btn.className = 'ok';
          btn.style.display = 'block';
        } else {
          btn.textContent = result.response.description;
          btn.className = 'err';
          btn.style.display = 'block';
          alert(result.response.description);
        }
      } else if (result.error) {
        btn.textContent = result.error;
        btn.className = 'err';
        btn.style.display = 'block';
        alert(result.error);
      } else {
        btn.textContent = 'Unknown error';
        btn.className = 'err';
        btn.style.display = 'block';
        alert('Unknown error');
      }
    });
  },
  changeMenuButton(close) {
    document.querySelectorAll('button').forEach((btn) => btn.disabled = true);
    const btnStatus = document.querySelector('#btn_status');
    btnStatus.textContent = 'Changing button...';

    MoeApp.apiRequest('changeMenuButton', {}, function (result) {
      document.querySelectorAll('button').forEach((btn) => btn.disabled = false);

      if (result.response) {
        if (result.response.ok) {
          btnStatus.textContent = 'Button changed!';
          btnStatus.className = 'ok';
          btnStatus.style.display = 'block';
          Telegram.WebApp.close();
        } else {
          btnStatus.textContent = result.response.description;
          btnStatus.className = 'err';
          btnStatus.style.display = 'block';
          alert(result.response.description);
        }
      } else if (result.error) {
        btnStatus.textContent = result.error;
        btnStatus.className = 'err';
        btnStatus.style.display = 'block';
        alert(result.error);
      } else {
        btnStatus.textContent = 'Unknown error';
        btnStatus.className = 'err';
        btnStatus.style.display = 'block';
        alert('Unknown error');
      }
    });
    if (close) {
      setTimeout(function () {
        Telegram.WebApp.close();
      }, 50);
    }
  },
  checkInitData() {
    const webViewStatus = document.querySelector('#webview_data_status');
    if (MoeApp.initDataUnsafe.query_id &&
      MoeApp.initData &&
      webViewStatus.classList.contains('status_need')
    ) {
      webViewStatus.classList.remove('status_need');
      MoeApp.apiRequest('checkInitData', {}, function (result) {
        if (result.ok) {
          webViewStatus.textContent = 'Hash is correct (async)';
          webViewStatus.className = 'ok';
        } else {
          webViewStatus.textContent = result.error + ' (async)';
          webViewStatus.className = 'err';
        }
      });
    }
  },
  sendText(spam) {
    const textField = document.querySelector('#text_field');
    const text = textField.value;
    if (!text.length) {
      return textField.focus();
    }
    if (byteLength(text) > 4096) {
      return alert('Text is too long');
    }

    const repeat = spam ? 10 : 1;
    for (let i = 0; i < repeat; i++) {
      Telegram.WebApp.sendData(text);
    }
  },
  sendTime(spam) {
    const repeat = spam ? 10 : 1;
    for (let i = 0; i < repeat; i++) {
      Telegram.WebApp.sendData(new Date().toString());
    }
  },
  switchInlineQuery(query, chooseChat) {
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
  },

  // Alerts
  showAlert(message) {
    Telegram.WebApp.showAlert(message);
  },
  showConfirm(message) {
    Telegram.WebApp.showConfirm(message);
  },
  requestContact() {
    Telegram.WebApp.requestContact(function (result) {
      if (result) {
        MoeApp.showAlert('Contact granted');
      } else {
        MoeApp.showAlert('Contact denied');
      }
    });
  },
  isVersionAtLeast(version) {
    return Telegram.WebApp.isVersionAtLeast(version);
  },
  showPopup() {
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
  },
  showScanQrPopup: function (linksOnly) {
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
  },

  // Permissions
  requestLocation(el) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        el.nextElementSibling.innerHTML = '(' + position.coords.latitude + ', ' + position.coords.longitude + ')';
        el.nextElementSibling.className = 'ok';
      });
    } else {
      el.nextElementSibling.innerHTML = 'Geolocation is not supported in this browser.';
      el.nextElementSibling.className = 'err';
    }
    return false;
  },
  requestVideo(el) {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(function (stream) {
        el.nextElementSibling.innerHTML = '(Access granted)';
      });
    } else {
      el.nextElementSibling.innerHTML = 'Media devices is not supported in this browser.';
      el.nextElementSibling.className = 'err';
    }
    return false;
  },
  requestAudio(el) {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function (stream) {
        el.nextElementSibling.innerHTML = '(Access granted)';
        el.nextElementSibling.className = 'ok';
      });
    } else {
      el.nextElementSibling.innerHTML = 'Media devices is not supported in this browser.';
      el.nextElementSibling.className = 'err';
    }
    return false;
  },
  requestAudioVideo(el) {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function (stream) {
        el.nextElementSibling.innerHTML = '(Access granted)';
        el.nextElementSibling.className = 'ok';
      });
    } else {
      el.nextElementSibling.innerHTML = 'Media devices is not supported in this browser.';
      el.nextElementSibling.className = 'err';
    }
    return false;
  },
  testClipboard(el) {
    Telegram.WebApp.readTextFromClipboard(function (clipText) {
      if (clipText === null) {
        el.nextElementSibling.innerHTML = 'Clipboard text unavailable.';
        el.nextElementSibling.className = 'err';
      } else {
        el.nextElementSibling.innerHTML = '(Read from clipboard: Â«' + clipText + 'Â»)';
        el.nextElementSibling.className = 'ok';
      }
    });
    return false;
  },
  requestWriteAccess(el) {
    Telegram.WebApp.requestWriteAccess(function (allowed) {
      if (allowed) {
        el.nextElementSibling.innerHTML = '(Access granted)'
        el.nextElementSibling.className = 'ok'
      } else {
        el.nextElementSibling.innerHTML = '(User declined this request)'
        el.nextElementSibling.className = 'err'
      }
    })
  },
  requestPhoneNumber(el) {
    Telegram.WebApp.requestContact(function (sent, event) {
      if (sent) {
        el.nextElementSibling.innerHTML = '(Phone number sent to the bot' + (event && event.responseUnsafe && event.responseUnsafe.contact && event.responseUnsafe.contact.phone_number ? ': +' + event.responseUnsafe.contact.phone_number : '') + ')'
        el.nextElementSibling.className = 'ok'
      } else {
        el.nextElementSibling.innerHTML = '(User declined this request)'
        el.nextElementSibling.className = 'err'
      }
    })
  },
  requestServerTime(el) {
    Telegram.WebApp.invokeCustomMethod('getCurrentTime', {}, function (err, time) {
      if (err) {
        el.nextElementSibling.innerHTML = '(' + err + ')'
        el.nextElementSibling.className = 'err'
      } else {
        el.nextElementSibling.innerHTML = '(' + (new Date(time * 1000)).toString() + ')'
        el.nextElementSibling.className = 'ok'
      }
    });
  },

  // cloud storage
  cloudStorageKeys: {},
  cloudStorageItems: {},
  editCloudRow(el, event) {
    event.preventDefault();
    const values = MoeApp.cloudStorageItems
    const key = el.closest('tr').getAttribute('data-key')
    el.form.reset();
    el.form.key.value = key;
    el.form.value.value = values[key];
  },
  deleteCloudRow(el, event) {
    event.preventDefault();
    const key = el.closest('tr').getAttribute('data-key')
    Telegram.WebApp.CloudStorage.removeItem(key, function (err, deleted) {
      if (err) {
        MoeApp.showAlert('Error: ' + err);
      } else {
        if (deleted) {
          const index = MoeApp.cloudStorageKeys.indexOf(key);
          if (index >= 0) {
            MoeApp.cloudStorageKeys.splice(index, 1);
          }
          delete MoeApp.cloudStorageItems[key];
        }
        el.form.reset();
        MoeApp.updateCloudRows();
      }
    });
  },
  saveCloudForm(form, event) {
    event.preventDefault();
    const key = form.key.value
    const value = form.value.value
    Telegram.WebApp.CloudStorage.setItem(key, value, function (err, saved) {
      if (err) {
        MoeApp.showAlert('Error: ' + err);
      } else {
        if (saved) {
          if (typeof MoeApp.cloudStorageItems[key] === 'undefined') {
            MoeApp.cloudStorageKeys.push(key);
          }
          MoeApp.cloudStorageItems[key] = value;
        }
        form.reset();
        MoeApp.updateCloudRows();
      }
    });
  },
  updateCloudRows() {
    let html = '';
    const keys = MoeApp.cloudStorageKeys;
    const values = MoeApp.cloudStorageItems;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      html += '<tr data-key="' + cleanHTML(key) + '"><td>' + cleanHTML(key) + '</td><td>' + cleanHTML(values[key]) + '</td><td><button onclick="MoeApp.editCloudRow(this, event);">Edit</button><button onclick="MoeApp.deleteCloudRow(this, event);">Delete</button></td></tr>';
    }

    document.getElementById('cloud_rows').innerHTML = html
  },
  loadCloudKeys(el) {
    Telegram.WebApp.CloudStorage.getKeys(function (err, keys) {
      if (err) {
        MoeApp.showAlert('Error: ' + err);
      } else {
        if (keys.length > 0) {
          Telegram.WebApp.CloudStorage.getItems(keys, function (err, values) {
            if (err) {
              MoeApp.showAlert('Error: ' + err);
            } else {
              MoeApp.cloudStorageKeys = keys;
              MoeApp.cloudStorageItems = {};
              for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                MoeApp.cloudStorageItems[key] = values[key];
              }
              MoeApp.updateCloudRows();
            }
          });
        }
      }
    });
  },

  // biometrics
  biometricInit(el) {
    const biometricManager = Telegram.WebApp.BiometricManager;
    if (!MoeApp.biometricInited) {
      MoeApp.biometricInited = true;
      Telegram.WebApp.onEvent('biometricManagerUpdated', function () {
        document.getElementById('bm_inited').textContent = biometricManager.isInited ? 'true' : 'false'
        document.getElementById('bm_available').textContent = biometricManager.isBiometricAvailable ? 'true' : 'false'
        document.getElementById('bm_type').textContent = biometricManager.biometricType || ''
        document.getElementById('bm_access_requested').textContent = biometricManager.isAccessRequested ? 'true' : 'false'
        document.getElementById('bm_access_granted').textContent = biometricManager.isAccessGranted ? 'true' : 'false'
        document.getElementById('bm_token_saved').textContent = biometricManager.isBiometricTokenSaved ? 'true' : 'false'
        document.getElementById('bm_device_id').textContent = biometricManager.deviceId || ''
        document.getElementById('bm_settings').style.display = biometricManager.isBiometricAvailable && biometricManager.isAccessRequested && !biometricManager.isAccessGranted ? 'block' : 'none'
      });
    }

    biometricManager.init();
  },
  biometricRequestAccess(el) {
    const biometricManager = Telegram.WebApp.BiometricManager;
    if (!biometricManager.isInited) {
      return MoeApp.showAlert('Biometric not inited yet!');
    }

    biometricManager.requestAccess({ reason: 'The bot uses biometrics for testing purposes.' }, function (access_granted) {
      if (access_granted) {
        el.nextElementSibling.innerHTML = '(Access granted)';
        el.nextElementSibling.className = 'ok';
      } else {
        el.nextElementSibling.innerHTML = '(Request declined)';
        el.nextElementSibling.className = 'err';
      }
    });
  },
  biometricRequestAuth(el) {
    const biometricManager = Telegram.WebApp.BiometricManager;
    if (!biometricManager.isInited) {
      return MoeApp.showAlert('Biometric not inited yet!');
    }

    el.nextElementSibling.innerHTML = '';
    el.nextElementSibling.classList.remove('ok', 'err')

    biometricManager.authenticate({ reason: 'The bot requests biometrics for testing purposes.' }, function (success, token) {
      if (success) {
        el.nextElementSibling.innerHTML = '(Success, token: ' + token + ')';
        el.nextElementSibling.className = 'ok';
      } else {
        el.nextElementSibling.innerHTML = '(Failed)';
        el.nextElementSibling.className = 'err';
      }
    });
  },
  biometricOpenSettings(el) {
    const biometricManager = Telegram.WebApp.BiometricManager;
    if (!biometricManager.isInited) {
      return MoeApp.showAlert('Biometric not inited yet!');
    }

    if (!biometricManager.isBiometricAvailable ||
      !biometricManager.isAccessRequested ||
      biometricManager.isAccessGranted) {
      return false;
    }

    biometricManager.openSettings();
  },
  biometricSetToken(el) {
    const biometricManager = Telegram.WebApp.BiometricManager;
    if (!biometricManager.isInited) {
      return MoeApp.showAlert('Biometric not inited yet!');
    }

    const token = parseInt(Math.random().toString().substring(2)).toString(16);
    biometricManager.updateBiometricToken(token, function (updated) {
      if (updated) {
        document.getElementById('bm_token_saved').textContent = biometricManager.isBiometricTokenSaved ? 'true' : 'false'
        el.nextElementSibling.innerHTML = '(Updated: ' + token + ')'
        el.nextElementSibling.className = 'ok'
      } else {
        el.nextElementSibling.innerHTML = '(Failed)'
        el.nextElementSibling.className = 'err'
      }
    });
  },
  biometricRemoveToken(el) {
    const biometricManager = Telegram.WebApp.BiometricManager;
    if (!biometricManager.isInited) {
      return MoeApp.showAlert('Biometric not inited yet!');
    }

    biometricManager.updateBiometricToken('', function (updated) {
      if (updated) {
        document.getElementById('bm_token_saved').textContent = biometricManager.isBiometricTokenSaved ? 'true' : 'false'
        el.nextElementSibling.innerHTML = '(Removed)'
        el.nextElementSibling.className = 'ok'
      } else {
        el.nextElementSibling.innerHTML = '(Failed)'
        el.nextElementSibling.className = 'err'
      }
    });
  },

  // Other
  apiRequest(method, data, onCallback) {
    // DISABLE BACKEND FOR FRONTEND DEMO
    // YOU CAN USE YOUR OWN REQUESTS TO YOUR OWN BACKEND
    // CHANGE THIS CODE TO YOUR OWN
    return onCallback && onCallback({ error: 'This function (' + method + ') should send requests to your backend. Please, change this code to your own.' });

    const authData = MoeApp.initData || '';
    fetch('/demo/api', {
      method: 'POST',
      body: JSON.stringify(Object.assign(data, {
        _auth: authData,
        method: method,
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

const MoeAppMenu = {
  init() {
    MoeApp.init();
    document.body.classList.add('gray');
    Telegram.WebApp.setHeaderColor('secondary_bg_color');
  }
};

const MoeAppInitData = {
  init() {
    MoeApp.init();
    Telegram.WebApp.onEvent('themeChanged', function () {
      document.getElementById('theme_data').innerHTML = JSON.stringify(Telegram.WebApp.themeParams, null, 2);
    });
    
    // document.getElementById('theme_data').innerHTML = JSON.stringify(Telegram.WebApp.themeParams, null, 2);
    MoeApp.checkInitData();
  }
};

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
  /*
   * This part of code is used to initialize the demo app and set up the event handlers we need.
   */
  
  /*
  Telegram.WebApp.onEvent('themeChanged', function () {
    document.getElementById('theme_data').innerHTML = JSON.stringify(Telegram.WebApp.themeParams, null, 2);
  });*/

  if (MoeApp.initDataUnsafe.query_id) {
    document.getElementById('main_btn').style.display = 'block';
  }
  // document.getElementById('with_webview_btn').style.display = !!MoeApp.initDataUnsafe.query_id && !MoeApp.initDataUnsafe.receiver ? 'block' : 'none';
  

  // document.getElementById('theme_data').innerHTML = JSON.stringify(Telegram.WebApp.themeParams, null, 2);
  document.getElementById('regular_link').setAttribute('href', document.getElementById('regular_link').getAttribute('href') + location.hash);
  document.getElementById('text_field').focus();
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

  if (MoeApp.initDataUnsafe.receiver) {
    document.getElementById('peer_wrap').style.display = 'block';
    document.getElementById('peer_name').innerHTML = MoeApp.initDataUnsafe.receiver.first_name + ' ' + MoeApp.initDataUnsafe.receiver.last_name;
    if (MoeApp.initDataUnsafe.receiver.photo_url) {
      document.getElementById('peer_photo').setAttribute('src', MoeApp.initDataUnsafe.receiver.photo_url);
    } else {
      document.getElementById('peer_photo').style.display = 'none';
    }
  } else if (MoeApp.initDataUnsafe.chat) {
    document.getElementById('peer_wrap').style.display = 'block';
    document.getElementById('peer_name').innerHTML = MoeApp.initDataUnsafe.chat.title;
    if (MoeApp.initDataUnsafe.chat.photo_url) {
      document.getElementById('peer_photo').setAttribute('src', MoeApp.initDataUnsafe.chat.photo_url);
    } else {
      document.getElementById('peer_photo').style.display = 'none';
    }
  }

  MoeApp.checkInitData();
  MoeApp.init();
  alert(JSON.stringify(Telegram.WebApp.initData))
  alert(JSON.stringify(Telegram.WebApp.initDataUnsafe))

  Telegram.WebApp.setHeaderColor('secondary_bg_color');
  // Telegram.WebApp.onEvent('viewportChanged', setViewportData);
  
  let prevBgColorVal = document.getElementById('bg_color_sel').value;
  const bgColorInput = document.getElementById('bg_color_input');
  const headerColorSel = document.getElementById('header_color_sel');

  bgColorInput.value = Telegram.WebApp.backgroundColor;
  document.body.setAttribute('style', '--bg-color:' + Telegram.WebApp.backgroundColor);
  headerColorSel.value = 'secondary_bg_color';
  headerColorSel.addEventListener('change', function (e) {
    const colorKey = e.target.value;
    document.getElementById('top_sect').classList.toggle('second', colorKey === 'secondary_bg_color');
    Telegram.WebApp.setHeaderColor(colorKey);
    document.body.setAttribute('style', '--bg-color:' + Telegram.WebApp.backgroundColor);
  });
  bgColorInput.addEventListener('change', function (e) {
    const color = e.target.value;
    document.getElementById('bg_color_val').textContent = color;
    headerColorSel.value = 'custom';
    prevBgColorVal = document.getElementById('bg_color_sel').value;
    Telegram.WebApp.setBackgroundColor(color);
    document.body.setAttribute('style', '--bg-color:' + Telegram.WebApp.backgroundColor);
  });
  headerColorSel.addEventListener('change', function (e) {
    const colorKey = e.target.value;
    if (colorKey === 'custom') {
      headerColorSel.value = prevBgColorVal;
      bgColorInput.focus();
    } else {
      document.getElementById('bg_color_val').textContent = 'custom...';
      Telegram.WebApp.setBackgroundColor(colorKey);
      document.body.setAttribute('style', '--bg-color:' + Telegram.WebApp.backgroundColor);
      bgColorInput.value = Telegram.WebApp.backgroundColor;
      prevBgColorVal = headerColorSel.value;
    }
  });

  Telegram.WebApp.onEvent('themeChanged', function () {
    bgColorInput.value = Telegram.WebApp.backgroundColor;
    document.body.setAttribute('style', '--bg-color:' + Telegram.WebApp.backgroundColor);
  });

  try {
    MoeApp.testClipboard(document.getElementById('clipboard_test'));
  } catch (e) { }

  try {
    MoeApp.loadCloudKeys();
  } catch (e) { }

  try {
    MoeApp.biometricInit();
  } catch (e) { }
})