
document.addEventListener('DOMContentLoaded', function() {
  
  (() => {
    const imgBoxDom = $('.map1')
    // 记录move前的图片位置, 在ontouchesstart和ontouchesmove有使用到
    let dingwei = { x: 0, y: 0 }
    // 计算双指之间的距离
    const getDistance = (start, stop) => {
      return Math.sqrt(Math.pow(stop.x - start.x, 2) + Math.pow(stop.y - start.y, 2))
    }
    const distance = { 
      start: 1, 
      stop: 1,
    };
    let scale = 1
    // 图片开始移动位置
    let trans;
    let isOne = true
    imgBoxDom.ontouchstart = (e) => {
      e.preventDefault()
      if (e.touches.length == 1) {
        // 是单指触摸, 保存一下现在的位置
        isOne = true
        dingwei = { 
          x: e.changedTouches[0].pageX, 
          y: e.changedTouches[0].pageY,
        }
        trans = e.target.style.transform
        if (trans.indexOf('matrix') == 0) {
          trans = trans.split('(')
          trans = trans[1].split(',')
        } else {
          trans = [1, 0, 0, 1, 0, 0]
        }
      } else if (e.touches.length == 2) {
        // 双指就保存一下现在的双指距离
        isOne = false
        distance.start = getDistance(
          {
            x: e.touches[0].screenX,
            y: e.touches[0].screenY,
          },
          {
            x: e.touches[1].screenX,
            y: e.touches[1].screenY,
          }
        )
      }
    }
    imgBoxDom.ontouchmove = (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.touches.length == 1) {
        // 开始移动, 防止双指放大之后离开一指导致图片跳动, 更新一下图片位置
        if (!isOne) {
          isOne = true
          dingwei = { 
            x: e.changedTouches[0].pageX, 
            y: e.changedTouches[0].pageY,
          }
        }
        // 计算现在的单指移动位置
        const moveX = e.changedTouches[0].pageX - dingwei.x;
        const moveY = e.changedTouches[0].pageY - dingwei.y;
        let x = parseFloat(trans[4]) + moveX / scale;
        let y = parseFloat(trans[5]) + moveY / scale;
        if (x > 0) x = 0;
        if (y > 0) y = 0;
        // if (x < - )
        console.log(x, y)
        e.target.style.transform = `matrix(1,0,0,1,${x},${y})`
      } else if (e.touches.length == 2) {
        // 计算一下现在放大倍数
        distance.stop = getDistance(
          {
            x: e.touches[0].screenX,
            y: e.touches[0].screenY,
          },
          {
            x: e.touches[1].screenX,
            y: e.touches[1].screenY,
          }
        )
        const big = distance.stop / distance.start
        scale = big - 1 + scale
        if (scale < 1) scale = 1;
        if (scale > 3) scale = 3;
        imgBoxDom.style.transform = `matrix(${scale},0,0,${scale},0,0)`
      }
    }

  })();

  $('.map1').addEventListener('wheel', (e) => {
    e.preventDefault();
    let scale = e.target.scale || 1;
    if (event.deltaY > 0) { 
      scale /= 1.1;
    } else { 
      scale *= 1.1;
    }
    e.target.scale = scale;
    e.target.style.transform = `scale(${scale})`;
  });

  
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