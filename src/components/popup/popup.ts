// import styles from './popup.css' 全局操作
// 一种node 的commonjs方式，一种es6 的css module方式
// import es6 引入方式,ts根本不认识它
// 需要申明文件 类似于popup.css.d.ts

import styles  from './popup.css'


// 传参组件业务规范-注意可选参数设置
interface Ipopup{
  width?: string;
  height?: string;
  title?: string;
  pos?: string;
  mask?:boolean;
  content?: (content: HTMLElement) => void;
}
// 组件开发相关接口
interface Icomponent {
  temContainer: HTMLElement;
  init: () => void; // 初始函数
  template: () => void; //渲染
  handle: ()=> void; //
}

function popup (options:Ipopup) {
  return new Popup(options);
}
class Popup implements Icomponent{
  temContainer;
  mask;
  constructor(private settings: Ipopup) {
    //设置初始化默认值
    this.settings = Object.assign({
      width: '100%',
      height: '100%',
      title: '',
      pos: 'center',
      mask: true,
      content: function(){}
    }, this.settings)
    this.init()
  }
  // 初始化
  init() {
    this.template()
    this.settings.mask && this.createMask()
    this.handle()
    this.contentCallbak()
  }
  // 创建模板
  template() {
    this.temContainer = document.createElement('div')
    this.temContainer.style.width = this.settings.width
    this.temContainer.style.height = this.settings.height
    this.temContainer.className = styles.popup
    this.temContainer.innerHTML = `
    <div class="${styles['popup-title']}">
        <h3>${this.settings.title}</h3>
        <i class="iconfont icon-guanbi"></i>
    </div>
    <div class="${styles['popup-content']}"></div>
    `
    document.body.appendChild(this.temContainer)
    if (this.settings.pos === 'left') {
      this.temContainer.style.left = 0
      this.temContainer.style.top = (window.innerHeight - this.temContainer.offsetHeight) + 'px'
    }
    else if (this.settings.pos === 'right') {
      this.temContainer.style.right = 0
      this.temContainer.style.top = (window.innerHeight - this.temContainer.offsetHeight) + 'px'
    }
    else {
      this.temContainer.style.right = (window.innerWidth - this.temContainer.offsetWidth)/2 + 'px'
      this.temContainer.style.top = (window.innerHeight - this.temContainer.offsetHeight)/2 + 'px'
    }
  }
  //事件操作
  handle () {
    let popupClose = this.temContainer.querySelector(`.${styles['popup-title']} i`);
    let _this = this //主意保存指针
    popupClose.addEventListener('click', function () {
      // this ->点击的DOM节点 -关闭icon
      // _this -> popup对象
      document.body.removeChild(_this.temContainer);
      _this.settings.mask && document.body.removeChild(_this.mask)
    })

  }
  createMask () {
    this.mask = document.createElement('div')
    this.mask.className = styles.mask;
    // this.mask.style.height = document.body.offsetHeight + 'px'; 存在问题
    // this.mask.style.height = window.innerHeight + 'px'; 不会随窗口高度自适应需要监听
    // this.mask.style.height = '100%'; //直接使用style的样式正常
    document.body.appendChild(this.mask);
  }
  contentCallbak (){
    let popupContent = this.temContainer.querySelector(`.${styles['popup-content']}`);
    this.settings.content(popupContent);
  }


}

export default popup