import './main.css';
import popup from './components/popup/popup'
import video from './components/video/video'

let listItem = document.querySelectorAll("#list li")
for(let i = 0; i< listItem.length; i++) {
    listItem[i].addEventListener('click', function() {
        let url:any = this.dataset.url;
        let title:any = this.dataset.title;
        popup({
            width: '880px',
            height: '555px',
            title: title,
            pos: 'center',
            content(elem) {
                console.log(elem)
                video({
                    url,
                    elem,
                    autoplay:true
                })
            }
        });
    })
}
