/**
 * 地图控制器类
 * @class MapController
 * @description 管理地图的移动和缩放功能
 */
class MapController {
  constructor() {
    /** @type {HTMLElement} 地图容器元素 */
    this.container = $('.map_box');
    /** @type {HTMLImageElement} 地图图片元素 */
    this.image = $('.map_box .map');
    /** @type {HTMLElement} 缩放信息显示元素 */
    this.zoomInfo = $('.map_box .zoom_info');
    
    /** @type {number} 当前缩放比例 */
    this.scale = 1;
    /** @type {number} 最小缩放比例 */
    this.minScale = 1;
    /** @type {number} 最大缩放比例 */
    this.maxScale = 3;
    /** @type {number} 缩放速度 */
    this.zoomSpeed = 0.1;
    
    /** @type {number} X轴位置 */
    this.posX = 0;
    /** @type {number} Y轴位置 */
    this.posY = 0;
    
    /** @type {boolean} 是否正在拖动 */
    this.isDragging = false;
    /** @type {number} 拖动起始X坐标 */
    this.startX = 0;
    /** @type {number} 拖动起始Y坐标 */
    this.startY = 0;
    /** @type {number} 拖动起始时的X位置 */
    this.startPosX = 0;
    /** @type {number} 拖动起始时的Y位置 */
    this.startPosY = 0;
    
    /** @type {number} 双指触摸的初始距离 */
    this.initialPinchDistance = 0;
    /** @type {number} 双指触摸的初始缩放比例 */
    this.initialScale = 1;
    
    /** @type {number|null} 缩放信息隐藏定时器 */
    this.zoomInfoTimer = null;
    
    /** @type {number|null} 双击检测定时器 */
    this.tapTimeout = null;
    /** @type {number} 上次点击时间 */
    this.lastTapTime = 0;
    /** @type {number} 双击时间阈值（毫秒） */
    this.doubleTapDelay = 300;
    
    this.init();
  }

  /**
   * 初始化事件监听器
   * @description 绑定鼠标和触摸事件
   */
  init() {
    // 鼠标事件
    this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.container.addEventListener('wheel', this.handleWheel.bind(this));
    
    // 双击事件
    this.container.addEventListener('dblclick', this.handleDoubleClick.bind(this));
    
    // 触摸事件
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.container.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    // 阻止右键菜单
    this.container.addEventListener('contextmenu', e => e.preventDefault());
    
    // 按钮
    $('.map_box .zoomIn').addEventListener('click', this.zoomIn.bind(this));
    $('.map_box .zoomOut').addEventListener('click', this.zoomOut.bind(this));
  }

  /**
   * 处理鼠标按下事件
   * @param {MouseEvent} e - 鼠标事件对象
   */
  handleMouseDown(e) {
    this.isDragging = true;
    this.container.classList.add('grabbing');
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startPosX = this.posX;
    this.startPosY = this.posY;
  }

  /**
   * 处理鼠标移动事件
   * @param {MouseEvent} e - 鼠标事件对象
   */
  handleMouseMove(e) {
    if (!this.isDragging) return;
    
    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;
    
    this.posX = this.startPosX + deltaX;
    this.posY = this.startPosY + deltaY;
    
    this.updateTransform();
  }

  /**
   * 处理鼠标释放事件
   * @param {MouseEvent} e - 鼠标事件对象
   */
  handleMouseUp(e) {
    this.isDragging = false;
    this.container.classList.remove('grabbing');
  }

  /**
   * 处理鼠标滚轮事件
   * @param {WheelEvent} e - 滚轮事件对象
   */
  handleWheel(e) {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -this.zoomSpeed : this.zoomSpeed;
    const oldScale = this.scale;
    const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale + delta));
    
    if (newScale !== this.scale) {
      // 计算鼠标位置相对于容器的坐标
      const rect = this.container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // 调整位置以保持鼠标下的点不动
      const scaleRatio = newScale / oldScale;
      this.posX = x - (x - this.posX) * scaleRatio;
      this.posY = y - (y - this.posY) * scaleRatio;
      
      this.scale = newScale;
      this.updateTransform();
    }
  }

  /**
   * 处理触摸开始事件
   * @param {TouchEvent} e - 触摸事件对象
   */
  handleTouchStart(e) {
    // e.preventDefault();
    
    if (e.touches.length === 1) {
      // 单指触摸 - 拖动
      this.isDragging = true;
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.startPosX = this.posX;
      this.startPosY = this.posY;
    } else if (e.touches.length === 2) {
      // 双指触摸 - 缩放
      this.isDragging = false;
      this.initialPinchDistance = this.getPinchDistance(e.touches);
      this.initialScale = this.scale;
    }
  }

  /**
   * 处理触摸移动事件
   * @param {TouchEvent} e - 触摸事件对象
   */
  handleTouchMove(e) {
    e.preventDefault();
    
    if (e.touches.length === 1 && this.isDragging) {
      // 单指移动
      const deltaX = e.touches[0].clientX - this.startX;
      const deltaY = e.touches[0].clientY - this.startY;
      
      this.posX = this.startPosX + deltaX;
      this.posY = this.startPosY + deltaY;
      
      this.updateTransform();
    } else if (e.touches.length === 2) {
      // 双指缩放
      const currentDistance = this.getPinchDistance(e.touches);
      const scale = currentDistance / this.initialPinchDistance;
      
      this.scale = Math.max(this.minScale, Math.min(this.maxScale, this.initialScale * scale));
      this.updateTransform();
    }
  }

  /**
   * 处理触摸结束事件
   * @param {TouchEvent} e - 触摸事件对象
   */
  handleTouchEnd(e) {
    if (e.touches.length === 0) {
      this.isDragging = false;
      // 检测双击
      const currentTime = Date.now();
      const tapLength = currentTime - this.lastTapTime;
      
      if (tapLength >= this.doubleTapDelay || tapLength <= 0) {
        this.lastTapTime = currentTime;
      } else {
        // 双击检测成功
        e.preventDefault();
        
        // 获取最后一个触摸点的位置
        const touch = e.changedTouches[0];
        const rect = this.container.getBoundingClientRect();
        const x = touch.clientX - rect.left - rect.width / 2;
        const y = touch.clientY - rect.top - rect.height / 2;
        
        this.toggleZoom(x, y);
        this.lastTapTime = 0; // 重置时间
      }
    } else if (e.touches.length === 1) {
      // 从双指变为单指，重新初始化拖动
      this.isDragging = true;
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.startPosX = this.posX;
      this.startPosY = this.posY;
    }
  }

  /**
   * 计算两个触摸点之间的距离
   * @param {TouchList} touches - 触摸点列表
   * @returns {number} 两点之间的距离
   */
  getPinchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  /**
   * 处理双击事件
   * @param {MouseEvent} e - 鼠标事件对象
   */
  handleDoubleClick(e) {
    e.preventDefault();
    
    // 获取点击位置相对于容器中心的坐标
    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    this.toggleZoom(x, y);
  }
  
  /**
   * 切换缩放状态
   * @param {number} centerX - 缩放中心X坐标
   * @param {number} centerY - 缩放中心Y坐标
   */
  toggleZoom(centerX = 0, centerY = 0) {
    const targetScale = this.scale === 1 ? 2 : 1;
    const scaleRatio = targetScale / this.scale;
    
    // 调整位置以保持点击位置不动
    if (targetScale === 2) {
      this.posX = centerX - (centerX - this.posX) * scaleRatio;
      this.posY = centerY - (centerY - this.posY) * scaleRatio;
    } else {
      // 恢复到100%时居中
      this.posX = 0;
      this.posY = 0;
    }
    
    this.scale = targetScale;
    this.animateTransform();
  }
  
  /**
   * 带动画的变换更新
   * @description 平滑过渡缩放和位置变化
   */
  animateTransform() {
    this.image.style.transition = 'transform .3s ease-in-out';
    this.updateTransform();
    
    // 动画结束后移除过渡效果
    setTimeout(() => {
      this.image.style.transition = 'none';
    }, 300);
  }

  /**
   * 限制拖动范围，防止出现空白
   * @description 根据当前缩放比例计算并限制位置
   */
  limitPosition() {
    const containerRect = this.container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // 计算缩放后的图片尺寸
    const scaledWidth = containerWidth * this.scale;
    const scaledHeight = containerHeight * this.scale;
    
    // 计算最大可移动距离
    const maxX = Math.max(0, (scaledWidth - containerWidth) / 2);
    const maxY = Math.max(0, (scaledHeight - containerHeight) / 2);
    
    // 限制位置在边界内
    this.posX = Math.max(-maxX, Math.min(maxX, this.posX));
    this.posY = Math.max(-maxY, Math.min(maxY, this.posY));
  }

  /**
   * 更新图片的变换属性
   * @description 应用当前的缩放和位置到图片元素
   */
  updateTransform() {
    this.limitPosition(); // 在更新前限制位置
    this.image.style.transform = `translate(${this.posX}px, ${this.posY}px) scale(${this.scale})`;
    this.zoomInfo.textContent = `${Math.round(this.scale * 100)}%`;
    this.showZoomInfo()
  }
  
  /**
   * 显示缩放信息并在3秒后自动隐藏
   * @description 显示当前缩放百分比，3秒后淡出
   */
  showZoomInfo() {
    // 清除之前的定时器
    if (this.zoomInfoTimer) {
      clearTimeout(this.zoomInfoTimer);
    }
    
    // 显示缩放信息
    this.zoomInfo.classList.add('show');
    
    // 3秒后隐藏
    this.zoomInfoTimer = setTimeout(() => {
      this.zoomInfo.classList.remove('show');
      this.zoomInfoTimer = null;
    }, 3000);
  }

  /**
   * 放大地图
   * @description 增加缩放比例
   */
  zoomIn() {
    this.scale = Math.min(this.maxScale, this.scale + this.zoomSpeed * 2);
    this.updateTransform();
  }

  /**
   * 缩小地图
   * @description 减少缩放比例
   */
  zoomOut() {
    this.scale = Math.max(this.minScale, this.scale - this.zoomSpeed * 2);
    this.updateTransform();
  }

  /**
   * 重置视图
   * @description 将地图恢复到初始位置和缩放
   */
  resetView() {
    this.scale = 1;
    this.posX = 0;
    this.posY = 0;
    this.updateTransform();
  }
}
