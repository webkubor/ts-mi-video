let styles = require('./video.css');

interface IVideo {
    url: string;
    elem: string | HTMLElement;
    width?: string;
    height?: string;
    autoplay?: boolean;
}

interface Icomponent {
    temContainer: HTMLElement;
    init: () => void;
    template: () => void;
    handle: () => void;
}

function video(options: IVideo) {
    return new Video(options)
}

class Video implements Icomponent {
    temContainer;

    constructor(private settings: IVideo) {
        this.settings = Object.assign({
            width: '100%',
            height: '100%',
            autoplay: false
        }, this.settings)
        this.init()
    }

    init() {
        this.template()
        this.handle()
    }

    template() {
        this.temContainer = document.createElement('div')
        this.temContainer.className = styles.video
        this.temContainer.style.width = this.settings.width
        this.temContainer.style.height = this.settings.height
        this.temContainer.innerHTML = `
        <video class="${styles['video-content']}" src="${this.settings.url}"></video>
        <div class="${styles['video-controls']}" >
            <div class="${styles['video-progress']}">
                <div class="${styles['video-progress-now']}"></div>
                <div class="${styles['video-progress-suc']}"></div>
                <div class="${styles['video-progress-bar']}"></div>
            </div>
            <div class="${styles['video-play']}">
                <i class="iconfont icon-bofang1"></i>
            </div>
             <div class="${styles['video-time']}">
                <span>00:00</span>/<span>00:00</span>
            </div>
             <div class="${styles['video-full']}">
                 <i class="iconfont icon-quanping"></i>
            </div>
             <div class="${styles['video-volume']}" >
                   <i class="iconfont icon-yinliang"></i>
                <div  class="${styles['video-volprogress']}">
                    <div class="${styles['video-volprogress-now']}"></div>
                    <div class="${styles['video-volprogress-bar']}"></div>
                </div>
            </div>
        </div>
        `
        if (typeof this.settings.elem === 'object') {
            this.settings.elem.appendChild(this.temContainer)
        } else {
            document.querySelector(`${this.settings.elem}`).appendChild(this.temContainer)
        }
    }

    handle() {
        let videoContent:HTMLVideoElement = this.temContainer.querySelector(`.${styles['video-content']}`)
        let videoControls = this.temContainer.querySelector(`.${styles['video-controls']}`)
        let videoPLay = this.temContainer.querySelector(`.${styles['video-controls']} i`)
        let videoTimes = this.temContainer.querySelectorAll(`.${styles['video-time']} span`)
        let videoFull = this.temContainer.querySelector(`.${styles['video-full']} i`)
        let videoProgress = this.temContainer.querySelectorAll(`.${styles['video-progress']} div`)
        let videoVolProgress = this.temContainer.querySelectorAll(`.${styles['video-volprogress']} div`)
        let timer

        videoContent.volume = 0.5 //设定初始音量
        
        if (this.settings.autoplay) {
            timer = setInterval(playing, 1000)
            videoContent.play()
        }

        //mouseenter不会让子元素触发,监听鼠标移入
        this.temContainer.addEventListener('mouseenter', () => {
            videoControls.style.bottom = 0
        })
        // 监听鼠标移出
        this.temContainer.addEventListener('mouseleave', () => {
            videoControls.style.bottom = '-50px'
        })
        // 全屏事件
        videoFull.addEventListener('click', ()=> {
            videoContent.requestFullscreen();
        })

        //视频进度条
        videoProgress[2].addEventListener('mousedown', function (ev:MouseEvent) {
            let downX = ev.pageX
            let downL = this.offsetLeft
            document.onmousemove = (ev:MouseEvent) => {
                let scale = (ev.pageX -downX + downL + 8) / this.parentNode.offsetWidth
                if (scale < 0 ) scale = 0
                if (scale > 1 ) scale = 1
                videoProgress[0].style.width = scale * 100 + '%'
                videoProgress[1].style.width = scale * 100 + '%'
                videoContent.currentTime = scale * videoContent.duration
                this.style.left = scale * 100 + '%'
            }
            //同步鼠标抬起事件
            document.onmouseup = (ev:MouseEvent) => {
                document.onmousemove=document.onmouseup = null
            }
            ev.preventDefault() // 阻止默认行为
        })

        //音频进度条
        videoVolProgress[1].addEventListener('mousedown', function (ev:MouseEvent) {
            let downX = ev.pageX
            let downL = this.offsetLeft
            document.onmousemove = (ev:MouseEvent) => {
                let scale = (ev.pageX -downX + downL + 8) / this.parentNode.offsetWidth
                if (scale < 0 ) scale = 0
                if (scale > 1 ) scale = 1
                videoVolProgress[0].style.width = scale * 100 + '%'
                this.style.left = scale * 100 + '%'
                videoContent.volume = scale
            }
            //同步鼠标抬起事件
            document.onmouseup = (ev:MouseEvent) => {
                document.onmousemove=document.onmouseup = null
            }
            ev.preventDefault() // 阻止默认行为
        })

        // 视频是否加载完毕
        videoContent.addEventListener('canplay', () => {
            console.log('视频加载完毕')
            videoTimes[1].innerHTML = formatTime(videoContent.duration)
        })

        // 视频播放
        videoContent.addEventListener('play', () => {
            videoPLay.className = 'iconfont icon-zanting1'
            timer = setInterval(playing, 1000)
        })

        // 视频暂停
        videoContent.addEventListener('pause', () => {
            videoPLay.className = 'iconfont  icon-bofang1'
            clearInterval(timer)
        })

        // 视频点击事件
        videoPLay.addEventListener('click', () => {
            if (videoContent.paused) {
                videoContent.play()
            } else {
                videoContent.pause()
            }
        })

        //播放中
        function playing () {
            let scale = videoContent.currentTime / videoContent.duration 
            let scaleSuc = videoContent.buffered.end(0)/ videoContent.duration //缓存节点比例
            videoTimes[0].innerHTML = formatTime(videoContent.currentTime);
            videoProgress[0].style.width = scale * 100 + '%'
            videoProgress[1].style.width = scaleSuc * 100 + '%'
            videoProgress[2].style.left = scale * 100 + '%'
        }


        function formatTime(number:number):string{
             number =Math.round(number)
             let min = Math.floor(number/60)
             let sec =  number % 60
             return setZero(min) + ':' + setZero(sec)
        }
        function setZero (number:number):string {
            if (number < 10) {
                return '0' + number
            } else {
                return '' + number
            }
        }


    }

}

export default video