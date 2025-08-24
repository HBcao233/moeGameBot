window.addEventListener('load', () => {
  let tab = 0;
  let page = 1;
  let pcount = 1;
  let tasks = [[], [], [], [], []];
  
  const types = ['常规', '轮盘'];
  const difficultys = ['简单', '普通', '困难', '地狱'];
  const times = ['3 h', '12 h', '24 h', '48 h'];
  const create_task = (task) => {
    return tag('div', {
      class: 'task',
      attrs: {
        'data-id': task.id
      },
      children: [
        tag('div', {
          class: 'row',
          children: [
            tag('div', {
              class: 'id',
              innerText: '#' + task.id,
            }),
            tag('div', {
              class: 'title',
              innerText: task.title,
            }),
            tag('div', {
              class: `star${task.is_star === true ? ' starred': ''}`,
              style: `display: ${task.delete_time > 0 ? 'none' : ''}`
            }),
          ]
        }),
        tag('div', {
          class: 'content',
          innerText: task.content.replaceAll('\n', ' '),
        }),
        tag('div', {
          class: 'row',
          children: [
            tag('div', {
              class: 'type',
              attrs: {
                'data-index': task.type,
              },
              innerText: types[task.type],
            }),
            tag('div', {
              class: 'difficulty',
              attrs: {
                'data-index': task.difficulty,
              },
              innerText: difficultys[task.difficulty],
            }),
            tag('div', {
              class: 'time',
              innerText: times[task.time],
            }),
          ],
        }, (t) => {
          if (tab != 1) t.appendChild(tag('div', {
            class: 'creator',
            children: [
              tag('div', {
                class: 'avatar-box',
                children: [
                  tag('img', {
                    class: 'avatar',
                    attrs: {
                      src: task.creator.photo_url
                    },
                  }, (t) => {
                    t.onerror = function() {
                      this.src = '/static/images/b65b5ae0595439920e46e80daf47512a.jpg'
                    }
                  })
                ],
              }),
              tag('div', {
                class: 'name',
                innerText: task.creator.nickname
              }),
            ],
          }));
        }),
        
      ]
    })
  }
  const add_tasks = (tab, page) => {
    // console.log('tasks', tasks)
    for (let i = (page-1) * 10; i < page * 10; i++) {
      let task = tasks[tab][i];
      if (!task) break;
      $(`.tab-content[data-index="${tab}"] .tasks`).appendChild(create_task(task))
    }
  }
  const get_task = (id) => {
    return new Promise((resolve, reject) => {
      MoeApp.apiGet('tasks/get', {
        id: id,
        _auth: MoeApp.initData,
      }).then((res) => {
        // console.log('res', res)
        if (res.code == 0) {
          resolve(res.data);
        } else {
          alert(res.message)
          reject()
        }
      })
    });
  };
  const get_tasks = (tab, page) => {
    if (!page) page = 1;
    MoeApp.apiGet('tasks/list', {
      type: tab,
      page: page,
      _auth: MoeApp.initData,
    }).then((res) => {
      // console.log('res', res)
      if (res.code == 0) {
        pcount = res.data.count;
        if (pcount == 0) {
          $(`.tab-content[data-index="${tab}"] .tasks`).innerHTML = '<div class="none">无</div>';
        }
        for (let i = 0; i < res.data.data.length; i++) {
          tasks[tab].push(res.data.data[i]);
        }
        add_tasks(tab, page);
        
      } else {
        alert(res.message)
      }
    });
  }
  const switch_tab = (index) => {
    tab = index;
    let t;
    if (t = $('.tab-switch.active')) t.classList.remove('active');
    if (t = $('.tab-content.active')) t.classList.remove('active');
    
    $(`.tab-switch[data-index="${index}"]`).classList.add('active');
    $(`.tab-content[data-index="${index}"]`).classList.add('active');
    page = 1;
    pcount = 1;
    if (pcount > tasks[tab].length) {
      get_tasks(tab, 1);
    }
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('tab', index);
    history.replaceState({}, '', newUrl);
  }
  const show_task = (task) => {
    let t;
    if (task.uid != MoeApp.user.id) {
      $('.popup .edit_task').disabled = true;
      $('.popup .delete_task').disabled = true;
    } else {
      $('.popup .edit_task').disabled = false;
      $('.popup .delete_task').disabled = false;
    }
    $('.popup').setAttribute('data-id', task.id);
    $('.popup .id').innerText = task.id;
    if (task.is_star === true) $('.popup .star').classList.add('starred');
    else $('.popup .star').classList.remove('starred');
    $('.popup .title').innerText = task.title;
    $('.popup .type').innerText = types[task.type];
    $('.popup .type').setAttribute('data-index', task.type);
    if (t = $(`.popup .difficulty.active`)) t.classList.remove('active');
    $(`.popup .difficulty[data-index="${task.difficulty}"]`).classList.add('active');
    $('.popup .time').innerText = times[task.time];
    $('.popup .visability').innerText = ['私有', '公开'][task.visability];
    $('.popup .creator .avatar').src = task.creator.photo_url;
    $('.popup .creator .name').innerText = task.creator.nickname;
    if (task.type == 0) {
      $('.contentrow .name').innerText = '内容';
      $('.contentrow .name').innerText = '介绍';
    }
    $('.popup .content').innerText = task.content;
    if ((t = task.edit_time) == 0) {
      t = task.create_time;
    }
    if (task.delete_time > 0) {
      t = task.delete_time;
    }
    $('.popup .edit_time').innerText = formatDateTime(parseInt(t) * 1000);
    if (task.delete_time > 0) {
      $('.popup .delete_task').classList.add('recover');
      $('.popup .delete_task').innerText = '恢复';
      $('.popup .edit_task').disabled = true;
      $('.popup .start_task').disabled = true;
      $('.popup .star').style.display = 'none';
      $('.popup .edit_time_name').innerText = '删除时间';
    } else {
      $('.popup .delete_task').classList.remove('recover');
      $('.popup .delete_task').innerText = '删除';
      $('.popup .edit_task').disabled = false;
      $('.popup .start_task').disabled = false;
      $('.popup .star').style.display = '';
      $('.popup .edit_time_name').innerText = '修改时间';
    }
    
    $('dialog').showModal();
    let rect = $('dialog .popup');
    $('dialog').style.left = ((window.innerWidth - rect.clientWidth) / 2) + 'px';
    $('dialog').style.top = ((window.innerHeight - rect.clientHeight) / 2 - 30) + 'px';
  }
  const find_task_index = (tab, id) => {
    for (let i = 0; i < tasks[tab].length; i++) {
      if (tasks[tab][i].id == id) {
        return i
      }
    }
    return null;
  }
  const find_task = (tab, id) => {
    for (const i of tasks[tab]) {
      if (i.id == id) {
        return i;
      }
    }
    return null;
  }
  const refresh_tab = (tab) => {
    page = 1;
    pcount = 1;
    tasks[tab] = [];
    $(`.tab-content[data-index="${tab}"] .tasks`).innerHTML = ''
    get_tasks(tab, 1);
  }
  
  
  const searchParams = new URLSearchParams(window.location.search);
  let _tab = parseInt(searchParams.get('tab') || '0');
  switch_tab(_tab)
  let show = parseInt(searchParams.get('show') || '0');
  if (show > 0) {
    get_task(show).then((task) => {
      show_task(task);
    }).catch();
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
  
  document.addEventListener('click', (e) => {
    let t, id, task;
    let _tab = tab;
    switch (true) {
      case e.target.classList.contains('tab-switch'):
        if (e.target.classList.contains('active')) return;
        let index = parseInt(e.target.getAttribute('data-index'));
        switch_tab(index)
        break;
      case e.target.classList.contains('refresh'):
        refresh_tab(tab);
        break;
        
      case e.target.tagName == 'DIALOG':
        $('dialog').close();
        break;
        
      case e.target.classList.contains('star'):
        if (MoeApp.initData == '') return;
        let flag = true;
        t = e.target.closest('.task');
        if (!t) {
          t = e.target.closest('.popup');
          flag = false;
        }
        id = parseInt(t.getAttribute('data-id'));
        star = !e.target.classList.contains('starred')
        MoeApp.showConfirm(`确定${!star ? '取消' : ''}收藏？`, (ok) => {
          if (!ok) return;
          MoeApp.apiRequest('tasks/star', {
            task_id: id,
            star: star,
          }, (res) => {
            if (res.code != 0) return alert(res.message);
            if (star) {
              e.target.classList.add('starred');
              (flag ? $(`.popup .star`): $('.task .star')).classList.add('starred');
            } else {
              e.target.classList.remove('starred');
              (flag ? $(`.popup .star`): $('.task .star')).classList.remove('starred');
            }
            index = find_task_index(_tab, id)
            tasks[_tab][index].is_star = star;
          });
        });
        break;
      case !!(t = e.target.closest('.task')):
        id = parseInt(t.getAttribute('data-id'));
        for (const i of tasks[tab]) {
          if (i.id == id) {
            task = i;
            break;
          }
        }
        show_task(task);
        break;
      
      case e.target.classList.contains('recover'):
        if (MoeApp.initData == '') return;
        t = e.target.closest('.popup');
        id = parseInt(t.getAttribute('data-id'))
        task = find_task(_tab, id);
        if (task.uid != MoeApp.user.id) return alert('不能修改别人的任务')
        
        MoeApp.showConfirm('确定恢复？', (ok) => {
          if (!ok) return;
          MoeApp.apiRequest('tasks/recover', {
            id: id,
          }, (res) => {
            if (res.code != 0) {
              alert(`恢复失败: ${res.message}`)
              return 
            }
            let index = find_task_index(_tab, id);
            tasks[_tab].splice(index, 1);
            if (t = $(`.tab-content[data-index="${_tab}"] .task[data-id="${id}"]`)) {
              t.remove();
              if (tasks[_tab].length == 0) t.innerHTML = '<div class="none">无</div>';
            }
            $('dialog').close()
          })
        })
        break;
      
      case e.target.classList.contains('delete_task'):
        if (MoeApp.initData == '') return;
        t = e.target.closest('.popup');
        id = parseInt(t.getAttribute('data-id'))
        task = find_task(_tab, id);
        if (task.uid != MoeApp.user.id) return alert('不能删除别人的任务')
        
        MoeApp.showConfirm('确定删除？', (ok) => {
          if (!ok) return;
          MoeApp.apiRequest('tasks/delete', {
            id: id,
          }, (res) => {
            if (res.code != 0) {
              alert(`删除失败: ${res.message}`)
              return
            }  
            let index = find_task_index(_tab, id);
            tasks[_tab].splice(index, 1);
            if (t = $(`.tab-content[data-index="${_tab}"] .task[data-id="${id}"]`)) {
              t.remove();
              if (tasks[_tab].length == 0) t.innerHTML = '<div class="none">无</div>'
            }
            $('dialog').close()
          })
        })
        break;
        
      case e.target.classList.contains('edit_task') || e.target.classList.contains('preview_task'):
        t = e.target.closest('.popup');
        id = parseInt(t.getAttribute('data-id'))
        task = find_task(_tab, id);
        let p = gz64_encode(JSON.stringify(task));
        if (e.target.classList.contains('edit_task')) {
          window.location.href = `edit/?task=${p}`;
        } else if (e.target.classList.contains('preview_task')) {
          window.location.href = `ongoing/?preview=${p}`;
        }
        
        break;
      
      
    }
  });
  $$('.tasks').forEach((t) => {
    t.addEventListener('scroll', (e) => {
      if ((e.target.scrollTop + e.target.clientHeight) / e.target.scrollHeight > 0.8) {
        if (pcount > tasks[tab].length) {
          page += 1;
          get_tasks(tab, page);
        }
      }
    });
  });
});
