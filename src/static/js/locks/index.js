window.addEventListener('load', () => {
  let user_lock = {};
  let timer = null;
  let update_timer = null;
  let locks = [];
  const difficultys = ['简单', '普通', '困难', '地狱'];
  const get_user_lock = (uid) => {
    MoeApp.apiGet('locks/get_locked', {
      uid: uid || MoeApp.user.id,
    }).then((res) => {
      // console.log('res', res)
      if (res.code != 0) {
        alert(res.message)
      } else {
        user_lock = res.data
      }
      if (user_lock.id !== undefined) {
        $('.unlocked_mine').style.display = 'none';
        show_user_lock();
      } else {
        $('.unlocked_mine').style.display = '';
        get_tasks();
      }
    });
  }
  const update = () => {
    MoeApp.apiGet('locks/end_time', {
      id: user_lock.id
    }, (res) => {
      if (res.code == 0) {
        user_lock.end_time = end_time
      }
    })
  }
  const get_tags = (lock) => {
    return [
      lock.twitter ? tag('div', {
        class: 'tag tag1',
        innerText: '推特加时',
      }) : null,
      lock.public ? tag('div', {
        class: 'tag tag2',
        innerText: '公开投票',
      }) : null,
      lock.hidden ? tag('div', {
        class: 'tag tag3',
        innerText: '隐藏时间',
      }) : null,
      lock.temporary_open ? tag('div', {
        class: 'tag tag4',
        innerText: '临时开锁',
      }) : null,
      lock.verification_picture ? tag('div', {
        class: 'tag tag5',
        innerText: '验证照片',
      }) : null,
      lock.wheel ? tag('div', {
        class: 'tag tag6',
        innerText: '幸运转盘',
      }) : null,
      lock.tasks ? tag('div', {
        class: 'tag tag7',
        innerText: '任务',
      }) : null,
      locks.twin_flowers ? tag('div', {
        class: 'tag tag8',
        innerText: '双生花',
      }) : null,
      locks.framing ? tag('div', {
        class: 'tag tag9',
        innerText: '嫁祸',
      }) : null,
    ]
  }
  const show_user_lock = () => {
    let lock = user_lock.lock_info;
    $('.user_info').style.display = '';
    $('.lock_info').style.display = '';
    $('.locked_mine').style.display = '';
    $('.lock_status').innerText = user_lock.id > 0 ? '已上锁': '预览中';
    $('.lock_status').classList.remove('unlocked');
    $('.lock_status').classList.add('locked');
    
    if (user_lock.uid == MoeApp.user.id) {
      $('.unlock').disabled = false;
      $('.manage').disabled = false;
    }
    $('.nickname').innerText = user_lock.user_info.nickname;
    $('.avatar').src = user_lock.user_info.photo_url;
    
    $('.title').innerText = lock.name;
    for (const i of ['twitter', 'public', 'hidden', 'temporary_open', 'verification_picture', 'wheel', 'tasks', 'twin_flowers', 'framing']) {
      $(`.lock_info .tags .${i}`).style.display = lock[i] ? '' : 'none';
    }
    
    $('.create_time').innerText = formatDateTime(user_lock.create_time * 1000);
    $('.desc').innerText = user_lock.desc;
    if (timer) clearInterval(timer)
    const ti = () => {
      let now = Math.floor(Date.now() / 1000);
      $('.locked_time').innerText = formatTime(now - user_lock.create_time);
      if (now >= user_lock.end_time) {
        $('.last_time').classList.add('can_unlock')
        $('.last_time').innerText = '时间已到';
      } else {
        $('.last_time').innerText = formatTime(user_lock.end_time - now);
      }
    }
    ti()
    timer = setInterval(ti, 1000);
    if (user_lock.id > 0) update_timer = setInterval(update, 30000);
  }
  
  const create_lock = (lock) => {
    return tag('div', {
      class: 'lock',
      attrs: {
        'data-id': lock.id
      },
      children: [
        tag('div', {
          class: 'row',
          children: [
            tag('div', {
              class: 'id',
              innerText: '#' + lock.id,
            }),
            tag('div', {
              class: 'title',
              innerText: lock.name,
            }),
            tag('div', {
              class: `star${lock.is_star === true ? ' starred': ''}`,
              style: `display: ${lock.delete_time > 0 ? 'none' : ''}`
            }),
          ]
        }),
        tag('div', {
          class: 'row',
          children: get_tags(lock),
        }),
        tag('div', {
          class: 'row',
          children: [
            tag('div', {
              class: 'difficulty',
              attrs: {
                'data-index': lock.difficulty,
              },
              innerText: difficultys[lock.difficulty],
            }),
            tag('div', {
              class: 'time',
              innerText: (lock.min == lock.max ? formatTime(lock.min) : `${formatTime(lock.min)} ~ ${formatTime(lock.max)}`),
            }),
          ],
        }),
        
      ]
    })
  }
  const add_locks = (page) => {
    // console.log('tasks', tasks)
    for (let i = (page-1) * 10; i < page * 10; i++) {
      let lock = locks[i];
      if (!lock) break;
      $(`.locks`).appendChild(create_lock(lock))
    }
  }
  const get_tasks = (page) => {
    if (!page) page = 1;
    MoeApp.apiGet('locks/list', {
      type: 0,
      page: page,
      _auth: MoeApp.initData,
    }).then((res) => {
      // console.log('res', res)
      if (res.code == 0) {
        pcount = res.data.count;
        if (pcount == 0) {
          $(`.locks`).innerHTML = '<div class="none">无</div>';
        }
        for (let i = 0; i < res.data.data.length; i++) {
          locks.push(res.data.data[i]);
        }
        add_locks(page);
        
      } else {
        alert(res.message)
      }
    });
  }
  const show_lock = (lock) => {
    let t;
    if (lock.uid != MoeApp.user.id) {
      $('.lock_show .delete_lock').disabled = true;
    } else {
      $('.lock_show .delete_lock').disabled = false;
    }
    $('.lock_show').setAttribute('data-id', lock.id);
    $('.lock_show .id').innerText = lock.id;
    if (lock.is_star === true) $('.lock_show .star').classList.add('starred');
    else $('.lock_show .star').classList.remove('starred');
    $('.lock_show .title').innerText = lock.name;
    if (t = $(`.lock_show .difficulty.active`)) t.classList.remove('active');
    $(`.lock_show .difficulty[data-index="${lock.difficulty}"]`).classList.add('active');
    $('.lock_show .time').innerText = (lock.min == lock.max ? formatTime(lock.min) : `${formatTime(lock.min)} ~ ${formatTime(lock.max)}`);
    $('.lock_show .limit').innerText = (lock.is_limit ? formatTime(lock.limit_time): '∞')
    $('.lock_show .tags').innerHTML = '';
    for (const i of get_tags(lock)) {
      if (i !== null) $('.lock_show .tags').appendChild(i);
    }
      
    
    $('.lock_show .visability').innerText = ['私有', '公开'][lock.visability];
    
    t = lock.create_time;
    if (lock.delete_time > 0) {
      t = lock.delete_time;
    }
    $('.lock_show .create_time').innerText = formatDateTime(parseInt(t) * 1000);
    if (lock.delete_time > 0) {
      $('.lock_show .delete_lock').classList.add('recover');
      $('.lock_show .delete_lock').innerText = '恢复';
      $('.lock_show .start_lock').disabled = true;
      $('.lock_show .star').style.display = 'none';
      $('.lock_show .create_time_name').innerText = '删除时间';
    } else {
      $('.lock_show .delete_lock').classList.remove('recover');
      $('.lock_show .delete_lock').innerText = '删除';
      $('.lock_show .start_lock').disabled = false;
      $('.lock_show .star').style.display = '';
      $('.lock_show .create_time_name').innerText = '创建时间';
    }
    if (user_lock.id !== undefined) {
      $('.lock_show .delete_lock').disabled = true;
    }
    
    show_dialog('.lock_show');
  }
  const find_lock_index = (id) => {
    for (let i = 0; i < locks.length; i++) {
      if (locks[i].id == id) {
        return i
      }
    }
    return null;
  }
  const find_lock = (id) => {
    for (const i of locks) {
      if (i.id == id) {
        return i;
      }
    }
    return null;
  }
  
  $('.user_info').style.display = 'none';
  $('.lock_info').style.display = 'none';
  $('.locked_mine').style.display = 'none';
  const searchParams = new URLSearchParams(window.location.search);
  let uid = searchParams.get('uid') || MoeApp.user.id; 
  let preview = searchParams.get('preview');
  alert('x')
  MoeApp.login().then(() => {
    alert('b')
    Telegram.WebApp.ready();
    Telegram.WebApp.BackButton.onClick(function () {
      if (window.history.length > 1) window.history.back()
      else window.location.href = '/';
    })
    Telegram.WebApp.BackButton.show()
    if (MoeApp.initData) {
      if (preview) {
        user_lock = JSON.parse(gz64_decode(preview));
        $('.unlocked_mine').style.display = 'none';
        show_user_lock();
      } else get_user_lock(uid);
    }
  }).catch(() => {
  });
  
  const unlock_success = () => {
    clearInterval(timer);
    clearInterval(update_timer);
    $('.lock_status').classList.remove('locked');
    $('.lock_status').classList.add('unlocked');
    $('.lock_status').innerText = '未上锁';
    $('.unlock').innerText = '已开锁';
    $('.unlock').disabled = true;
    $('.manage').disabled = true;
    $('.locked_time').innerText = formatTime(res.data.delete_time - user_lock.create_time)
    msg = '开锁成功！'
    if (res.data.password) {
      msg += '锁密码: ' + res.data.password;
      $('.passrow').style.display = '';
      $('.password').innerText = res.data.password;
    }
    alert(msg);
  }
  const unlock = () => {
    if (user_lock.id == 0) {
      let now = Math.floor(Date.now() / 1000)
      if (now >= user_lock.end_time) {
        unlock_success()
      } else {
        alert('开锁时间未到')
      }
      return 
    }
    if (MoeApp.initData == '') return;
    if (user_lock.uid != MoeApp.user.id) {
      alert('不能给别人开锁的啦～')
      return
    }
    MoeApp.apiRequest('locks/unlock', {
      id: user_lock.id,
    }, (res) => {
      if (res.code == 0) {
        unlock_success()
      } else {
        user_lock.end_time = res.data.end_time;
        alert(res.message)
      }
    })
  }
  const give_love = () => {
    if (user_lock.id == 0) {
      alert('预览中不可用')
      return;
    }
    if (user_lock.uid == MoeApp.user.id) {
      alert('不能自己给自己赠送爱心啦，太犯规惹～')
      return;
    }
    MoeApp.apiRequest('locks/give_love', {
      id: user_lock.id,
    }, (res) => {
      if (res.code != 0) {
        alert(res.message)
        return;
      }
      alert('赠送成功！')
    })
  }
  
  let new_twitter = window.localStorage.getItem('new_twitter');
  const set_twitter_default = () => {
    new_twitter = {
      username: '',
      name: '',
      start_follow: 0,
      tid: '',
      tid_ok: false,
      tid_username: '',
      deadline: 0,
    }
  }
  if (!new_twitter) set_twitter_default() 
  else new_twitter = JSON.parse(new_twitter)
  const save_twitter = () => {
    window.localStorage.setItem('new_twitter', JSON.stringify(new_twitter))
  }
  const show_twitter = () => {
    $('.x1').innerText = formatTime2(user_lock.lock_info.x_love_add);
    $('.x2').innerText = formatTime2(user_lock.lock_info.x_forward_add);
    $('.x3').innerText = formatTime2(user_lock.lock_info.x_comment_add);
    $('.x4').innerText = formatTime2(user_lock.lock_info.x_follow_add);
    $('.x5').innerText = gz64_encode(user_lock.uid);
    if (user_lock.twitter && user_lock.twitter.id) {
      new_twitter = user_lock.twitter;
      
      $('.start_x').disabled = true;
      if (user_lock.twitter.delete_time) 
        $('.start_x').innerText = '已完成';
      else 
        $('.start_x').innerText = '已开启';
    } else {
      $('.start_x').disabled = false;
      $('.start_x').innerText = '开启';
    }
    fill_twitter();
    show_dialog('dialog.twitter');
  }
  const fill_twitter = () => {
    $('.x_username').value = new_twitter.username;
    $('.x_name').innerText = `用户名: ${new_twitter.name} 当前关注数: ${new_twitter.start_follow}`;
    $('.x6').innerText = new_twitter.start_follow;
    $('input[name="x_url"]').value = new_twitter.tid;
    if (new_twitter.deadline) $('.x_deadline').value = formatDateTime(new_twitter.deadline * 1000);
    if (new_twitter.delete_time) {
      let love_num = new_twitter.love_num, 
        forward_num = new_twitter.forward_num, 
        comment_num = new_twitter.comment_num, 
        follow_num = new_twitter.end_follow - new_twitter.start_follow,
        add_time = new_twitter.add_time;
      show_twitter_data(love_num, forward_num, comment_num, follow_num, add_time);
    } else if (new_twitter.tid_ok) get_tweet();
  }
  const get_twitter_user = () => {
    MoeApp.apiGet('twitter/user_info', {
      username: new_twitter.username,
    }).then(res => {
      if (res.code != 0) {
        alert(res.message)
        return
      }
      new_twitter.username =res.data.screen_name;
      new_twitter.name = res.data.name;
      new_twitter.start_follow = res.data.followers_count;
      save_twitter()
      $('.x_name').innerText = `用户名: ${new_twitter.name} 当前关注数: ${new_twitter.start_follow}`
      $('.x6').innerText = new_twitter.start_follow;
    })
  }
  const show_twitter_data = (love_num, forward_num, comment_num, follow_num, add_time) => {
    $('.xn1').innerText = love_num;
    $('.xn2').innerText = forward_num;
    $('.xn3').innerText = comment_num;
    $('.xn4').innerText = follow_num;
    if (follow_num < 0) follow_num = 0;
    let xm1, xm2, xm3, xm4, xm5;
    xm1 = love_num * user_lock.lock_info.x_love_add,
    xm2 = forward_num * user_lock.lock_info.x_forward_add,
    xm3 = comment_num * user_lock.lock_info.x_comment_add,
    xm4 = follow_num * user_lock.lock_info.x_follow_add,
    if (add_time) xm5 = add_time;
    else xm5 = xm1 + xm2 + xm3 + xm4;
    $('.xm1').innerText = formatTime2(xm1);
    $('.xm2').innerText = formatTime2(xm2);
    $('.xm3').innerText = formatTime2(xm3);
    $('.xm4').innerText = formatTime2(xm4);
    $('.xm5').innerText = formatTime2(xm5);
  }
  const get_tweet = () =>{
    MoeApp.apiGet('twitter/tweet', {
      tid: new_twitter.tid
    }).then(res => {
      if (res.code != 0) {
        alert(res.message)
        new_twitter.tid_ok = false;
        return
      }
      if (res.data.user.screen_name.toLowerCase() != new_twitter.username.toLowerCase()) {
        alert('推文作者与输入用户名不匹配')
        new_twitter.tid_ok = false;
        return;
      }
      new_twitter.tid_username = res.data.user.screen_name;
      new_twitter.tid = res.data.tid;
      new_twitter.tid_ok = true;
      save_twitter()
      let love_num = res.data.favorite_count,
        forward_num = res.data.retweet_count + res.data.quote_count,
        comment_num = res.data.reply_count,
        follow_num = res.data.user.followers_count - new_twitter.start_follow;
      
      show_twitter_data(love_num, forward_num, comment_num, follow_num);
    })
  }
  const start_x = () => {
    if (user_lock.id == 0) {
      return alert('预览中不可用')
    }
    if (!new_twitter.username || !new_twitter.name) {
      return alert('用户名填写错误');
    }
    if (!new_twitter.tid_ok) {
      return alert('推文链接填写错误')
    }
    if (new_twitter.deadline == 0) {
      return alert('截止日期太近啦～你这家伙根本没选吧！')
    }
    let now_1h = new Date(Date.now() + 3600000);
    now_1h = Math.floor(now_1h.getTime() / 1000);
    if (new_twitter.deadline < now_1h) {
      return alert(`截止日期(${formatDateTime(new_twitter.deadline * 1000)})太近啦～至少要一小时吧`)
    }
    MoeApp.apiPost('locks/start_x', {
      user_lock_id: user_lock.id,
      username: new_twitter.username,
      name: new_twitter.name,
      tid: new_twitter.tid,
      deadline: parseInt(new_twitter.deadline),
      start_follow: new_twitter.start_follow,
    }).then(res => {
      if (res.code != 0) {
        return alert(res.message)
      }
      $('.start_x').disabled = true;
      $('.start_x').innerText = '已开启';
      alert('开启成功！');
    })
  }
  
  document.addEventListener('click', (e) => {
    let t, index, lock;
    switch (true) {
      case e.target.tagName == 'DIALOG':
        e.target.close();
        break;
        
      case !!(t = e.target.closest('.lock')):
        index = t.getAttribute('data-id');
        lock = find_lock(index);
        show_lock(lock);
        break;
      
      case e.target.classList.contains('show_lock'):
        if (user_lock.lock_info) show_lock(user_lock.lock_info);
        break;
        
      case e.target.classList.contains('unlock'):
        unlock();
        break;
      case !!e.target.closest('.give_love'):
        give_love();
        break;
      case !!e.target.closest('.manage'):
        show_dialog('.manage_show');
        break;
      case !!e.target.closest('.lock_info .tags .twitter'):
        show_twitter();
        break;
      
      case !!e.target.closest('.x_copy'):
        let text = $('.x_info').innerText;
        // alert(text);
        copyToClipboard(text);
        break;
      case !!e.target.closest('.x_refresh'):
        if (new_twitter.tid_ok) get_tweet();
        else alert('链接输入有误');
        break;
      case !!e.target.closest('.start_x'):
        start_x();
        break;
        
      case e.target.classList.contains('copy_lock') || e.target.classList.contains('preview_lock') || e.target.classList.contains('start_lock'):
        if (user_lock.id !== undefined) {
          lock = user_lock.lock_info;
        } else {
          t = e.target.closest('.lock_show');
          index = t.getAttribute('data-id');
          lock = find_lock(index)
        }
        let p;
        if (e.target.classList.contains('preview_lock')) {
          const init_time = randint(lock.min, lock.max);
          const create_time = Math.floor(Date.now() / 1000)
          const end_time = init_time + create_time;
          let ul = {
            id: 0,
            uid: MoeApp.user.id,
            lock_id: index,
            method: 1,
            password: '123456',
            keyholder: 0,
            desc: '预览',
            init_time: init_time,
            create_time: create_time,
            end_time: end_time,
            lock_info: lock,
            user_info: MoeApp.user,
            twitter: {},
          }
          p = gz64_encode(JSON.stringify(ul));
          window.location.href = `/locks/?preview=${p}`;
          return;
        }
        p = gz64_encode(JSON.stringify(lock));
        if (e.target.classList.contains('copy_lock')) {
          window.location.href = `create/?lock=${p}`;
        } else if (e.target.classList.contains('start_lock')) {
          window.location.href = `start/?lock=${p}`;
        }
        break;
      
      case !!e.target.closest('.x_deadline'):
        DateSelector.show()
        break;
      case !!e.target.closest('.date_select'):
        new_twitter.deadline = DateSelector.time;
        save_twitter();
        $('.x_deadline').value = formatDateTime(new_twitter.deadline * 1000);
        DateSelector.close()
        break;
      
    }
  })
  document.addEventListener('change', (e) => {
    let name = e.target.name;
    let value = e.target.value;
    switch (true) {
      case name == 'x_username':
        if (!value) return;
        new_twitter['username'] = value;
        if (value != new_twitter.tid_username) new_twitter.tid_ok = false;
        else new_twitter.tid_ok = true;
        get_twitter_user();
        break;
      case name == 'x_url':
        if (!value) return;
        let match = value.match(/(?:https?:\/\/)?[a-z]*?(?:twitter|x)\.com\/[a-zA-Z0-9_]+\/status\/(\d{13,20})(?:[^0-9].*)?$/);
        if (!match[1]) {
          alert('输入不是推特链接');
          return;
        }
        new_twitter['tid'] = match[1];
        get_tweet();
        break;
    }
  })
  
  $$('.tasks').forEach((t) => {
    t.addEventListener('scroll', (e) => {
      if ((e.target.scrollTop + e.target.clientHeight) / e.target.scrollHeight > 0.8) {
        if (pcount > locks.length) {
          page += 1;
          get_locks(page);
        }
      }
    });
  });
  document.addEventListener('visibilitychange', function(event) {
    if (document.visibilityState) console.log('page show')
  });
});