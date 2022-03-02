const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE = 'F8-PLAYER'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd=$('.cd') 
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList =$('.playlist')
const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    config: JSON.parse(localStorage.getItem('PLAYER_STORAGE')) || {},
    songs : [
        {
            name : 'Old Town Road',
            singer : 'Lil Nas X',
            path: './assets/music/song-1.mp3',
            img:'./assets/img/music-1.jpg'
        },
        {
            name : 'Astronaut in the ocean',
            singer : 'Masked Wolf',
            path: './assets/music/song-2.mp3',
            img:'./assets/img/music-2.jpg'
        },
        {
            name : '2002',
            singer : 'Anne-Marie',
            path: './assets/music/song-3.mp3',
            img:'./assets/img/music-3.jpg'
        },
        {
            name : 'Hãy Trao Cho Anh',
            singer : 'Sơn Tùng M-TP, Snoop Dogg',
            path: './assets/music/song-4.mp3',
            img:'./assets/img/music-4.jpg'
        },
        {
            name : 'Without me',
            singer : 'Halsey',
            path: './assets/music/song-5.mp3',
            img:'./assets/img/music-5.jpg'
        },
        {
            name : 'Old Town Road',
            singer : 'Lil Nas X',
            path: './assets/music/song-1.mp3',
            img:'./assets/img/music-1.jpg'
        },
        {
            name : 'Astronaut in the ocean',
            singer : 'Masked Wolf',
            path: './assets/music/song-2.mp3',
            img:'./assets/img/music-2.jpg'
        },
        {
            name : '2002',
            singer : 'Anne-Marie',
            path: './assets/music/song-3.mp3',
            img:'./assets/img/music-3.jpg'
        },
        {
            name : 'Hãy Trao Cho Anh',
            singer : 'Sơn Tùng M-TP, Snoop Dogg',
            path: './assets/music/song-4.mp3',
            img:'./assets/img/music-4.jpg'
        },
        {
            name : 'Without me',
            singer : 'Halsey',
            path: './assets/music/song-5.mp3',
            img:'./assets/img/music-5.jpg'
        },
        
    ],
    setConfig : function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE,JSON.stringify(this.config))
    },
    render : function(){
        const htmls = this.songs.map((song,index) =>{
            return `
            <div  class="song ${index === this.currentIndex ? 'active':''}" data-index='${index}'>
                <div class="thumb" style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })
        playList.innerHTML = htmls.join('')
    },
    handleEvent: function(){
        const cdWidth = cd.offsetWidth
        document.onscroll = function(){
            const scrollTop = document.documentElement.scrollTop || window.scrollY
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth +'px' : 0 
            cd.style.opacity = newCdWidth/cdWidth
        }
        //Xử lý cdThumb quay/ dừng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],{
            duration:10000,
            iterations:Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý playing
        playBtn.onclick = function(){
            if(app.isPlaying){
                audio.pause()
            }
            else{
                audio.play()
                
            }
        }
        audio.onplay = function(){
            app.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        audio.onpause = function(){
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }

        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent =  Math.floor((audio.currentTime/audio.duration) *100)
                progress.value = progressPercent
            }
        }
        // Tua 
        progress.onchange = function(e){
            const seekTime= (audio.duration/100 )*(e.target.value)
            audio.currentTime = seekTime
        }

        //Next songs
        nextBtn.onclick = function(){
            if(app.isRandom){
                app.playRandomSong()
            }
            else{
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        prevBtn.onclick = function(){
            if(app.isRandom){
                app.playRandomSong()
            }
            else{
                app.prevSong()
            }
            audio.play()
            app.render()

        }

        randomBtn.onclick = function(e){
            app.isRandom = !app.isRandom
            app.setConfig('isRandom', app.isRandom)
            randomBtn.classList.toggle('active',app.isRandom)
        }

        // Xử lý repeat
        repeatBtn.onclick = function(){
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat', app.isRepeat)
            repeatBtn.classList.toggle('active', app.isRepeat)
            
        }

        //Xử lý next khi end 
        audio.onended = function(){
            if(app.isRandom){
                app.playRandomSong()
            }
            else if(app.isRepeat){
                audio.play()
            }
            else{
                app.nextSong()
            }
            audio.play()
            
        }

        // Click vào playList
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || !e.target.closest('.option')) 
            {
               if(songNode){
                   app.currentIndex = Number(songNode.dataset.index)
                   app.loadCurrentSong()
                   audio.play()
                   app.render()
               }
            }
            if(e.target.closest('.option')){

            }
        }
    },

    nextSong : function(){
        this.currentIndex++;
        if(this.currentIndex >=this.songs.length)
        {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()

    },
    prevSong : function(){
        this.currentIndex--;
        if(this.currentIndex < 0 )
        {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()

    },

    playRandomSong : function(){
        let newIndex 
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong()
    },
    defineProperties : function(){
        Object.defineProperty(this,'currentSong',{
            get : function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong : function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path

    },

    loadConfig : function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    scrollToActiveSong : function(){
        setTimeout(function(){
            const songActive = $('.song.active')
            if(app.currentIndex > 2){
                songActive.scrollIntoView({
                    behavior: 'smooth',
                    block :'nearest'
                })
            }
            else
            {
                songActive.scrollIntoView({
                    behavior: 'smooth',
                    block :'center'
                })
            }
            

        },500)
    },
    start : function(){
        //Gán config vào app
        this.loadConfig()

        //Định nghĩa thuộc tính 
        this.defineProperties();

        //Xử lý event
        this.handleEvent();

        //Load song hiện tại
        this.loadCurrentSong();

        //render song
        this.render();

    }   

}
app.start()
