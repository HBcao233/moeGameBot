window.addEventListener('load', () => {
  let groups = [
    {
      name: '性爱',
      questions: [
        '用手自慰',
        '口交',
        '口爆',
        '吞精',
        '颜射',
        '足交',
        '肛交',
        '阴道内射',
        '肛门内射',
        '潮吹失禁',
        '情趣用品折磨',
        '强制连续高潮',
        '公共场所做爱',
        '主人面前侍奉他人',
        '主人不在侍奉他人',
        '强奸',
        '轮奸',
        '多处被插入',
        '同性多人性行为',
        '异性多人性行为',
        '4P以上',
        '多奴/多主',
        '四爱',
        '乱伦',
      ]
    },
    {
      name: '性玩具',
      questions: [
        '角色扮演',
        '制服诱惑',
        '挑选/训练奴隶',
        '模特/人偶装扮',
        '作为女仆（伺候）',
        '作为家具',
        '放置',
        '租赁/交易',
      ],
    },
    {
      name: '宠物',
      questions: [
        '摸头',
        '恋物',
        '尾巴穿戴',
        '爬行',
        '项圈',
        '喂食',
        '叼衣物',
        '闻气味',
        '学叫声',
        '踩踏',
        '户外暴露',
        '户外调教',
        '户外裸体',
        '户外流放',
        '骑乘',
        '囚禁关押',
        '圈养',
      ],
    },
    {
      name: '羞辱',
      questions: [
        '远程指令',
        '不穿内衣',
        '羞耻视频照片拍摄',
        '窥阴癖',
        '剃毛',
        '舔足',
        '视觉性骚扰',
        '言语管教',
        '言语羞辱（自身）',
        '淫妻/淫夫癖',
        '自慰展示',
        '女/男体盛（裸体做餐具）',
        '内窥镜研究',
        '分享羞耻视频照片',
        '出轨/绿帽',
        '异装癖',
        '网络公调',
        '露出（朋友）',
        '露出（陌生人）',
        '公共场合暴露',
        '公共场合调教',
        '公开场合项圈',
        '公开场合捆绑（衣内）',
        '公开场合器具（衣内）',
        '言语羞辱（他人）',
      ],
    },
    {
      name: '拘束',
      questions: [
        '剥夺听觉',
        '剥夺视觉',
        '禁言',
        '禁欲',
        '高潮后强制刺激',
        '绳艺',
        '金属束缚',
        '拘束衣',
        '寸止/边缘（TD）',
        '贞操带',
        '思想控制',
        '憋尿',
        '空吊/倒挂',
        '强制排泄',
        '监禁（多日）',
      ],
    },
    {
      name: '生物',
      questions: [
        '触手/异星人（Cosplsy）',
        '生物塞入',
        '兽交',
        '群兽轮交',
        '人兽同交',
        '昆虫爬身',
      ],
    },
    {
      name: '刑罚',
      questions: [
        '挠痒',
        '轻咬',
        '打屁股',
        '身上写字',
        '滴蜡',
        '打耳光',
        '拉扯头发',
        '鞭子',
        '板拍',
        '鼻钩',
        '走绳',
        '冰刑',
        '坐脸',
        '舔肛',
        '虐乳',
        '体罚',
        '水刑',
        '火刑',
        '三角木马',
        '灌肠（保持一定时间）',
        '虐阴/阳',
        '异物涂抹',
        '异物灌/塞入（阴道）',
        '异物灌/塞入（膀胱）',
        '异物灌/塞入（肛门）',
        '皮肤磨损',
        '踢踹',
        '性窒息',
        '电击',
      ],
    },
    {
      name: '体液',
      questions: [
        '唾液',
        '汗水',
        '饮尿',
        '饮经血',
        '尿浴',
        '粪浴',
        '食粪',
      ],
    },
    {
      name: '身体改造',
      questions: [
        '阴道扩张',
        '尿道扩张',
        '肛门扩张',
        '刺青/纹身',
        '催乳',
        '尿道刺激',
        '穿刺',
        '穿环',
        '疤痕',
        '烙印',
        '拳交',
        '药物（如激素）',
      ],
    },
    {
      name: '其他',
      questions: [
        '多主/奴调教',
        'ATM',
        '紫评表',
        '阅读《虐恋亚文化》',
      ],
    },
  ];
  let form = document.getElementById('form');
  for (let i = 0; i < groups.length; i++) {
    let $box = tag('div', { class: 'box group' });
    let name = groups[i].name;
    let questions = groups[i].questions;
    $box.appendChild(tag('h2', { innerText: name }));
    let $questions = tag('div', { class: 'questions' })
    for (let j = 0; j < questions.length; j++) {
      let q = questions[j];
      let qname = `${i+1}-${j+1}`;
      let $question = tag('div', {
        class: 'question',
        innerHTML: `<div class="name">${q}</div>
          <div class="options">
            <label class="option"><input type="radio" name="${qname}" value="no" /><span style="top: 4px; left: 7px">✕</span></label>
            <label class="option"><input type="radio" name="${qname}" value="?" /><span>?</span></label>
            <label class="option"><input type="radio" name="${qname}" value="ok" /><span>√</span></label>
            <label class="option"><input type="radio" name="${qname}" value="1" /><span>1</span></label>
            <label class="option"><input type="radio" name="${qname}" value="2" /><span>2</span></label>
            <label class="option"><input type="radio" name="${qname}" value="3" /><span>3</span></label>
        </div>`
      });
      $questions.appendChild($question)
    }
    $box.appendChild($questions);
    form.appendChild($box);
  }
  
  let formdata = (window.localStorage.getItem('formdata') && JSON.parse(window.localStorage.getItem('formdata'))) || {};
  const searchParams = new URLSearchParams(window.location.search);
  let result;
  let flag = false;
  const init = () => {
    if (Object.keys(formdata).length <= 0) {
      if (result = searchParams.get('result')) {
        try {
          result = JSON.parse(gz64_decode(result));
          formdata['nickname'] = result.shift()
          formdata['role'] = result.shift()
          for (let i=0; i < groups.length; i++) {
          let questions = groups[i].questions;
          for (let j=0; j < questions.length; j++) {
            formdata[`${i+1}-${j+1}`] = result.shift();
          }
        }
          flag = true;
        } catch (e) {
          console.warn(e)
        }
      }
    }
    for (const i of Object.keys(formdata)) {
      // console.log(i, formdata[i])
      document.querySelector('.progress').style.width = (Object.keys(formdata).length / 149 * 100) + 'vw';
      try {
        let t = document.querySelector(`input[name="${i}"]`);
        if (t && t.type == 'text') {
          t.value = formdata[i];
        } else if (t && t.type == 'radio') {
          t = document.querySelector(`input[name="${i}"][value="${formdata[i]}"]`);
          if (t) t.checked = true;
        }
        if (flag) {
          for (const tt of document.querySelectorAll('input')) tt.disabled = true;
        }
      } catch(e) {
        console.warn(e)
      }
    }
  }
  if (Object.keys(formdata).length <= 0 || searchParams.get('uid')) {
    let uid = searchParams.get('uid') || MoeApp.initDataUnsafe.user.id || 0;
    MoeApp.apiGet('tests/get', {
      test: 'bdsm', 
      uid: uid,
    }, (res) => {
      if (res.code == 0 && Object.keys(res.data).length > 0) {
        formdata = res.data;
        if (searchParams.get('uid')) flag = true;
        else window.localStorage.setItem('formdata', JSON.parse(formdata));
      }
      init();
    })
  } else {
    init()
  }
  
  MoeApp.login().then(() => {
    Telegram.WebApp.ready();
    Telegram.WebApp.BackButton.onClick(function () {
      if (window.history.length > 1) window.history.back()
      else window.location.href = '/';
    })
    Telegram.WebApp.BackButton.show()
    if (!searchParams.get('uid')) {
      let t = document.querySelector('input[name="nickname"]');
      t.value = MoeApp.user.nickname;
      formdata['nickname'] = MoeApp.user.nickname;
      t.disabled = true;
    }
    document.querySelector('.btn.genimage').innerText = '保存图片';
  }).catch(() => {
  })
  if (MoeApp.initData == '') {
    document.querySelector('.btn.link1').style.display = 'none';
  }
  document.addEventListener('change', (e) => {
    if (e.target.nodeName == 'INPUT') {
      formdata[e.target.name] = e.target.value;
      if ('test' in formdata) delete formdata['test'];
      
      document.querySelector('.progress').style.width = (Object.keys(formdata).length / 149 * 100) + 'vw';
      
      if (!flag) window.localStorage.setItem('formdata', JSON.stringify(formdata))
      if (MoeApp.initData != '' && Object.keys(formdata).length >= 149) {
        MoeApp.apiRequest('tests/add', {
          test: 'bdsm',
          result: JSON.stringify(formdata),
        }, (res) => {
          if (res.code == 0) {
          } else {
            alert('上传失败')
          }
        })
      }
    }
  });
  
  const get_result = () => {
    let result = [formdata['nickname'], formdata['role']];
    for (let i=0; i < groups.length; i++) {
      let questions = groups[i].questions;
      for (let j=0; j < questions.length; j++) {
        result.push(formdata[`${i+1}-${j+1}`]);
      }
    }
    result = gz64_encode(JSON.stringify(result));
    return result;
  }
  
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn.link')) {
      if (Object.keys(formdata).length < 149) {
        alert('还没填完呢 ' + Object.keys(formdata).length + ' / 149')
        return;
      }
      let url;
      if (e.target.closest('.btn.link1')) {
        url = `https://t.me/moeGameBot?start=tests_bdsm_uid_${searchParams.get('uid') || MoeApp.user.id}`;
      } else if (e.target.closest('.btn.link2')) {
        let result = get_result()
        url = `https://hbcaodog--moe-f.modal.run/tests/bdsm/?result=${result}`;
      }
      copyToClipboard(url);
      let text = e.target.innerText;
      e.target.innerText = '已复制到剪贴板'
      setTimeout(() => {
        e.target.innerText = text;
      }, 3000);
    
    } else if (e.target.closest('.btn.top')) {
      window.scrollTo(0, 0)
      
    } else if (e.target.closest('.btn.genimage')) {
      if (Object.keys(formdata).length < 149) {
        alert('还没填完呢 ' + Object.keys(formdata).length + ' / 149')
        return;
      }
      
      let result = get_result();
      const filename = `BDSM紫评表_${formdata['nickname']}_${new Date().valueOf()}.png`;
      if (MoeApp.initData != '') {
        Telegram.WebApp.downloadFile({
          'url': `https://hbcaodog--mtgbot-f.modal.run/api/tests/bdsm-genImage?v=${new Date().valueOf()}&image=1&result=${result}`,
          'file_name': filename,
        });
        return 
      } 
      e.target.disabled = true;
      let text = e.target.innerText;
      e.target.innerText = '生成中...'
      let start = Date.now();
      MoeApp.apiGet('tests/bdsm-genImage', {
        result: result,
      }, (res) => {
        if (res.code == 0) {
          e.target.innerText = `生成成功 ${(Date.now() - start) / 1000}s`;
          downloadFile(res.data, filename)
        } else {
          e.target.innerText = '生成失败'
        }
        e.target.disabled = false;
        setTimeout(() => {
          e.target.innerText = text;
        }, 3000);
      })
      
    }
    
  })
})