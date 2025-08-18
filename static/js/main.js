window.addEventListener('error', function(e) {
  if (e.error === undefined) return;
  const msg = `${e.error}, at ${e.filename}:${e.lineno}:${e.colno}, ${JSON.stringify(e.cause)}`;
  console.error(msg);
  alert(msg);
}, true);

window['$'] = document.querySelector.bind(document);
window['$$'] = document.querySelectorAll.bind(document);

const isNumber = s => Object.prototype.toString.call(s) === "[object Number]";
const isString = s => Object.prototype.toString.call(s) === "[object String]";
const isArrayLike = s => s != null && typeof s[Symbol.iterator] === 'function';
function formatDateTime(d) {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
  return formatter.format(d).replaceAll('/', '-')
}
function formatTime(t) {
  let s = Math.floor(t % 60);
  if (s < 10) s = '0' + s;
  let m = Math.floor(t / 60 % 60);
  if (m < 10) m = '0' + m;
  let h = Math.floor(t / 3600);
  if (h < 10) h = '0' + h;
  if (h > 0) return h + ':' + m + ':' + s;
  return m + ':' + s;
}
/**
 * 创建 Element
 * @param {String} tagName 
 * @param {Object} options 
 * @param {function} func 
 * @returns {SVGElement | HTMLElement}
 */
function tag(tagName, options, func) {
  options = options || {};
  var svgTags = ['svg', 'g', 'path', 'filter', 'animate', 'marker', 'line', 'polyline', 'rect', 'circle', 'ellipse', 'polygon'];
  let newElement;
  if (svgTags.indexOf(tagName) >= 0) {
    newElement = document.createElementNS("http://www.w3.org/2000/svg", tagName);
  } else {
    newElement = document.createElement(tagName);
  }
  if (options.id) newElement.id = options.id;
  if (options.class) {
    if (!Array.isArray(options.class)) options.class = options.class.split(' ');
    for (const e of options.class) {
      if (e) newElement.classList.add(e);
    }
  }
  if (options.innerHTML) newElement.innerHTML = options.innerHTML;
  else if (options.innerText) newElement.innerText = options.innerText;
  if (options.children) {
    if (!isArrayLike(options.children)) options.children = [options.children];
    for (const e of options.children) {
      if (isString(e) || isNumber(e)) e = document.createTextNode(e);
      newElement.appendChild(e);
    }
  }
  if (options.style) newElement.style.cssText = options.style
  if (options.attrs) {
    for (const [k, v] of Object.entries(options.attrs)) {
      newElement.setAttribute(k, v)
    }
  }
  func && func(newElement)
  return newElement;
}
class Base64 {
  /**
   * 代码来自https://github.com/haochuan9421/base64-pro/
   */
   _lookup;
  _revLookup;
  _encodeChunkSize = 16383;
  constructor() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    this._lookup = [...alphabet].filter((char, i, arr) => arr.indexOf(char) === i && char.charCodeAt(0) < 128);
    this._revLookup = this._lookup.reduce(
      (map, char, i) => {
        map[char.charCodeAt(0)] = i;
        return map;
      },
      { 43: 62, 47: 63, 45: 62, 95: 63 }
    );
  }
  
  bufferToBase64(value, padding) {
    let arrayBuffer; // 底层的二进制数据
    let byteOffset; // 开始编码的位置
    let totalBytes; // 需要编码的字节总数
    if (ArrayBuffer.isView(value)) {
      arrayBuffer = value.buffer;
      byteOffset = value.byteOffset;
      totalBytes = value.byteLength;
    } else if (value instanceof ArrayBuffer) {
      arrayBuffer = value;
      byteOffset = 0;
      totalBytes = value.byteLength;
    } else {
      throw new Error("encode value can only be arrayBuffer or typedArray or dataView");
    }

    // 3个字节为一组进行处理，多出来的1个或2个字节最后单独处理
    const extraBytes = totalBytes % 3;
    const unit3Bytes = totalBytes - extraBytes;
    // 创建 Uint8Array 视图用于读取字节内容
    const view = new Uint8Array(arrayBuffer, byteOffset, totalBytes);

    // 字符串频繁拼接会比较慢，所以先分块保存，最后再一次性 join 成一个完整的字符串返回
    let chunks = [];
    for (let i = 0; i < unit3Bytes; i += this._encodeChunkSize) {
      let chunk = [];
      for (let j = i, chunkEnd = Math.min(unit3Bytes, i + this._encodeChunkSize); j < chunkEnd; j += 3) {
        // 把三个字节拼接成一个完整的 24 bit 数字
        const $24bitsNum = (view[j] << 16) | (view[j + 1] << 8) | view[j + 2];
        // 以 6 bit 为一个单元进行读取
        chunk.push(
          this._lookup[$24bitsNum >> 18] +
            this._lookup[($24bitsNum >> 12) & 0b111111] + // "& 0b111111" 是为了只保留最后面的6个字节
            this._lookup[($24bitsNum >> 6) & 0b111111] +
            this._lookup[$24bitsNum & 0b111111]
        );
      }
      chunks.push(chunk.join(""));
    }
    // 处理多出来的1个或2个字节
    if (extraBytes === 1) {
      const $8bitsNum = view[totalBytes - 1];
      chunks.push(this._lookup[$8bitsNum >> 2]);
      chunks.push(this._lookup[($8bitsNum << 4) & 0b111111]);
      padding && chunks.push("==");
    } else if (extraBytes === 2) {
      const $16bitsNum = (view[totalBytes - 2] << 8) | view[totalBytes - 1];
      chunks.push(this._lookup[$16bitsNum >> 10]);
      chunks.push(this._lookup[($16bitsNum >> 4) & 0b111111]);
      chunks.push(this._lookup[($16bitsNum << 2) & 0b111111]);
      padding && chunks.push("=");
    }

    return chunks.join("");
  }
  
  base64ToBuffer(base64Str) {
    if (typeof base64Str !== "string") {
      throw new Error("the first argument must be string");
    }
    // 去除尾部的 padding
    base64Str = base64Str.replace(/==?$/, "");
    
    // 4 个字符为一组进行处理，多出来的2个或3个字符最后单独处理
    let totalChars = base64Str.length;
    const extraChars = totalChars % 4;
    const unit4Chars = totalChars - extraChars;
    // 创建 arrayBuffer，每4个字符需要3个字节，如果最后多出来2个字符额外需要1个字节，如果最后多出来3个字符额外需要2个字节
    const arrayBuffer = new ArrayBuffer((unit4Chars / 4) * 3 + (extraChars === 0 ? 0 : extraChars - 1));
    // 创建 DataView 视图用于修改字节内容
    const view = new Uint8Array(arrayBuffer);

    let byteOffset = 0;
    for (let i = 0; i < unit4Chars; i += 4) {
      // 把4个字符对应的 code pointer 还原成3字节的数字
      const $24bitsNum =
        (this._revLookup[base64Str.charCodeAt(i)] << 18) |
        (this._revLookup[base64Str.charCodeAt(i + 1)] << 12) |
        (this._revLookup[base64Str.charCodeAt(i + 2)] << 6) |
        this._revLookup[base64Str.charCodeAt(i + 3)];

      // 以 8 bit 为一个单元修改 arrayBuffer 3次
      view[byteOffset++] = $24bitsNum >>> 16;
      view[byteOffset++] = ($24bitsNum >>> 8) & 0b11111111;
      view[byteOffset++] = $24bitsNum & 0b11111111;
    }
    
    // 处理多出来的2个或3个字符
    if (extraChars === 2) {
      const $8bitNum = (this._revLookup[base64Str.charCodeAt(totalChars - 2)] << 2) | (this._revLookup[base64Str.charCodeAt(totalChars - 1)] >>> 4);
      view[byteOffset++] = $8bitNum;
    } else if (extraChars === 3) {
      const $16bitNum =
        (this._revLookup[base64Str.charCodeAt(totalChars - 3)] << 10) |
        (this._revLookup[base64Str.charCodeAt(totalChars - 2)] << 4) |
        (this._revLookup[base64Str.charCodeAt(totalChars - 1)] >> 2);
      view[byteOffset++] = $16bitNum >>> 8;
      view[byteOffset++] = $16bitNum & 0b11111111;
    }
    return arrayBuffer;
  }
  
  encode(str) {
    const encoder = new TextEncoder();
    let buffer = encoder.encode(str);
    return this.bufferToBase64(buffer);
  }
  
  decode(str) {
    const decoder = new TextDecoder("utf-8");
    let buffer = this.base64ToBuffer(str)
    if (buffer === false) return false;
    return decoder.decode(buffer);
  }
}
let b64 = new Base64();

const gz_encode = function (s) {
  return b64.bufferToBase64(pako.gzip(s));
}
const gz_decode = function (s) {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(pako.ungzip(b64.base64ToBuffer(s)));
}

const gz64_encode = function (s) {
  const encoder = new TextEncoder();
  let buffer = encoder.encode(s);
  if (buffer.length > 140) {
    return gz_encode(s)
  }
  return b64.bufferToBase64(buffer);
}

const gz64_decode = function (s) {
  if (s.startsWith('H4sI')) {
    return gz_decode(s)
  }
  return b64.decode(s)
}

const copyToClipboard = (text) => {
  if (MoeApp.initData == '') {
    let nav = navigator || window.navigator;
    nav.clipboard.writeText(text);
    return
  }
  const tempInput = document.createElement("textarea");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}
/**
 * 下载文件
 */
const downloadFile = (url, filename) => {
  if (!filename) filename = `BDSM紫评表_${new Date().valueOf()}.png`;
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};


class MoeApp {
  static initData = Telegram.WebApp.initData || ''
  static initDataUnsafe = Telegram.WebApp.initDataUnsafe || {}
  static MainButton = Telegram.WebApp.MainButton
  static SettingsButton = Telegram.WebApp.SettingsButton
  static user = {};
  
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
    return new Promise((resolve) => {
      if (window.localStorage.getItem('user')) {
        MoeApp.user = JSON.parse(window.localStorage.getItem('user'));
        resolve()
      } else if (MoeApp.initData) {
        MoeApp.apiRequest('user/login', {}, function (res) {
          if (res.error) {
            alert(`错误: ${res.error}`)
            resolve();
          } else if (result.code === 0) {
            MoeApp.user = result.data;
            window.localStorage.setItem('user', JSON.stringify(MoeApp.user))
            resolve(true)
          } else {
            alert(`登录失败: ${res.message}`)
            resolve();
          }
        });
      } else {
        console.warn('初始化失败: 非telegram访问')
        resolve();
      }
    });
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
  
  static showConfirm(message, callback) {
    Telegram.WebApp.showConfirm(message, (ok) => {
      callback && callback(ok);
    });
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
    if (!authData) return alert('未登录');
    fetch(`https://hbcaodog--mtgbot-f.modal.run/api/${method}`, {
      method: 'POST',
      body: JSON.stringify(Object.assign(data, {
        _auth: authData,
      })),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(async function (r) {
      let res = await r.json();
      onCallback && onCallback(res);
    });
  }
  
  static apiGet(method, data, onCallback) {
    console.log('get', method, data)
    data = (new window.URLSearchParams(data)).toString();
    let url = `https://hbcaodog--mtgbot-f.modal.run/api/${method}`;
    if (data != '') url += '?' + data;
    fetch(url, {
      method: 'GET',
      credentials: 'include',
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      onCallback && onCallback(result);
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

