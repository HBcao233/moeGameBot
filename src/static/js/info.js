document.addEventListener('DOMContentLoaded', () => {
  let changed = false;
  let count = 0;
  let tags = 0;
  function count1Bits(n) {
    let count = 0;
    while (n !== 0) {
      n &= (n - 1);
      count++;
    }
    return count;
  }
  
  MoeApp.login().then(() => {
    Telegram.WebApp.ready();
    Telegram.WebApp.BackButton.onClick(function () {
      if (changed) {
        MoeApp.showConfirm('退出将丢失当前修改.', (ok) => {
          if (ok) window.history.back();
        })
        return;
      }
      window.history.back()
    })
    Telegram.WebApp.BackButton.show()
    
    if (window.localStorage.getItem('user')) {
      MoeApp.user = JSON.parse(window.localStorage.getItem('user'));
      document.querySelector('.nickname').value = MoeApp.user.nickname;
      document.querySelector('.avatar').src = MoeApp.user.photo_url;
      document.querySelector('.description').value = MoeApp.user.description;
      document.querySelector('.sex').value = MoeApp.user.sex;
      document.querySelector('.role').value = MoeApp.user.role;
      
      tags = MoeApp.user.tags;
      count = count1Bits(MoeApp.user.tags)
      for (let i = 0; i < 12; i++) {
        let j = (tags >> i) & 1
        document.querySelector(`.tags button[data-index="${i+1}"]`).removeAttribute('select')
        if (j) document.querySelector(`.tags button[data-index="${i+1}"]`).setAttribute('select', '')
      }
    }
    
    document.addEventListener('click', (e) => {
      let index = e.target.getAttribute('data-index');
      if (e.target.closest('.tags button')) {
        if (!e.target.hasAttribute('select')) {
          if (count >= 3) {
            alert('最多选择3个')
            return
          }
          
          tags |= 1 << (index - 1)
          count += 1;
          e.target.setAttribute('select', 'select')
        } else {
          tags &= ~(1 << (index - 1));
          count -= 1;
          e.target.removeAttribute('select')
        }
        
      } else if (e.target.closest('#save')) {
        if (!changed) {
          alert('无修改')
          return
        }
        e.target.innerText = '请等待'
        e.target.disabled = true;
        let nickname = document.querySelector('.nickname').value;
        let description = document.querySelector('.description').value;
        let sex = parseInt(document.querySelector('.sex').value);
        let role = parseInt(document.querySelector('.role').value);
        
        MoeApp.apiRequest('user/edit', {
          nickname: nickname,
          description: description,
          sex: sex,
          role: role,
          tags: tags,
        }, (res) => {
          // alert(JSON.stringify(res))
          e.target.innerText = '保存设置'
          e.target.disabled = false;
          if (res.code == 0) {
            alert('修改成功！')
            MoeApp.user.nickname = nickname;
            MoeApp.user.description = description;
            MoeApp.user.sex = sex;
            MoeApp.user.role = role;
            MoeApp.user.tags = tags;
            window.localStorage.setItem('user', JSON.stringify(MoeApp.user))
            changed = false;
          } else {
            alert(`错误: ${res.message}`)
          }
        })
      }
    })
    
    document.querySelector('.nickname').addEventListener('change', () => {
      changed = true;
    })
    document.querySelector('.description').addEventListener('change', () => {
      changed = true;
    })
    document.querySelector('.sex').addEventListener('change', () => {
      changed = true;
    })
    document.querySelector('.role').addEventListener('change', () => {
      changed = true;
    })
    
  }).catch(() => {
  });
})