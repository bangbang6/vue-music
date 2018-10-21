<!--  -->
<template>
  <div class="player" v-if="playList.length>0">
    <transition name='normal'  
    @enter='enter'
    @after-enter='afterEnter'
    @leave='leave'
    @after-leave='afterLeave'
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.songname"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent='middleTouchStart'
             @touchmove.prevent='middleTouchMove'
             @touchend='middleTouchEnd'
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
             
              <div class="playing-lyric">{{playingLyric}}</div>
            
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current': currentLineNum ===index}"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @onProgressBarChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.interval)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" :class='disableCls'  @click="changeMode">
              <i :class="iconMode"  ></i>
            </div>
            <div class="icon i-left" :class='disableCls' >
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class='disableCls'>
              <i @click="togglePlaying" :class='playIcon'></i>
            </div>
            <div class="icon i-right" :class='disableCls' >
              <i @click="next" class="icon-next"></i>
            </div>
            
          </div>
        </div>
      </div>
    </transition>
    <transition name='mini'>
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img  :class="cdCls" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.songname"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
   </transition>
   <play-list ref='playlist' @click='showPlaylist'></play-list>
    <audio ref="audio"  :src="currentSong.url"  @play="ready" @error="error" @timeupdate="updateTime"
           @ended="end"></audio>
  </div>
</template>

<script>
import {mapMutations,mapGetters,mapActions} from 'vuex'
import animations from 'create-keyframe-animation'
import ProgressBar from 'base/progressBar/progressBar' 
import progressCircle from 'base/process-circle/process-circle'
import PlayList from '../playlist/playlist'
import {shifter} from 'common/js/util'

import Lyric from 'lyric-parser'
import scroll from 'base/scroll/scroll' 
import { clearTimeout } from 'timers';
export default {
  data () {
    return {
      songReady:false,
        playingLyric:'',//正在播放的歌词,cd界面
        
        currentShow:'cd',
        radius:32,
        currentLineNum:'',
       currentTime:0,
       touch:{},
        currentLyric:{}
       
      
    };
  },

  components: {
     ProgressBar,
     progressCircle,
     scroll,
     PlayList
  },

  computed: {
     ...mapGetters(['fullScreen','currentSong','currentIndex','playList','playing','mode','sequenceList']),
     cdCls(){
       return this.playing ? 'play':'play pause'
     },
     percent(){
          return this.currentTime / this.currentSong.interval
     },
     miniIcon(){
       return  this.playing ? 'icon-pause' :'icon-play'
     },
     playIcon(){
       return this.playing ? 'icon-pause' :'icon-play'
     },
     iconMode(){
       return this.mode == 0 ? 'icon-sequence' : this.mode == 1 ? 'icon-loop':'icon-random'
     },
     disableCls(){
       return this.songReady ? '':'disabled'
     }
  },

  mounted: function(){
    
  
  },

  methods: {
      //js 动画 
      enter(el,done){
        let {x,y,scale} = this._getpos()
        let animation = {
          0:{
            transform:`translate3d(${x}px,${y}px,0) scale(${scale})` 
          },
          60:{
             transform:`scale(1.1)` 
          },
          100:{
             transform:`translate3d(0,0,0) scale(1)`
          }
        }
        animations.registerAnimation({
          name:'move',
          animation,
          presets:{
            duration:400,
            easing:'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper,'move',done)
      },
      afterEnter(el,done){
        animations.unregisterAnimation('move'),
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el,done){
        let {x,y,scale} = this._getpos()
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        this.$refs.cdWrapper.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
       this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave(){
         this.$refs.cdWrapper.style.transition=''
         this.$refs.cdWrapper.style.transform=''
      },
      
      //滑动事件
      middleTouchStart(e){
        this.touch = {}
        this.touch.init = false
        this.touch.x=e.touches[0].pageX
        this.touch.y=e.touches[0].pageY
        
      },
      middleTouchMove(e){
        this.touch.init = true
        if(this.touch.init){
          let deltaY = e.touches[0].pageY - this.touch.y
          let deltaX = e.touches[0].pageX - this.touch.x
          if(Math.abs(deltaY) - Math.abs(deltaX) > 0){
            return
          }
          console.log('lyric scroll init')
          var width = window.innerWidth
          this.touch.width = width
          this.touch.deltaY =deltaY
          this.touch.deltaX = deltaX
              var opacity = Math.min(1,1 + deltaX/width)
          if(this.currentShow == 'cd' && deltaX <0){
              this.$refs.lyricList.$el.style.transform =`translate3d(${deltaX}px,0,0)`
                this.$refs.middleL.style.opacity = `${opacity}`
          }else if(this.currentShow == 'lyric' && deltaX >0){
            opacity = Math.min(1,deltaX/width)
        this.$refs.middleL.style.opacity = `${opacity}`
            console.log(' you int')
            var offset = width - deltaX
            this.$refs.lyricList.$el.style.transform =`translate3d(-${offset}px,0,0)`
          }
         
      
        
        }
      },
      middleTouchEnd(e){
        this.touch.init = false
        //第一左化,第二右化
        if(this.currentShow == 'cd' && -this.touch.deltaX/this.touch.width > 0.1){
          console.log('suc')
            this.$refs.lyricList.$el.style.transform =`translate3d(-${this.touch.width}px,0,0)`
         this.$refs.middleL.style.opacity = 0
         this.currentShow = 'lyric'
        }else if(this.currentShow == 'lyric'){
            if(this.touch.deltaX >0){
              console.log('优化 suc')
                       this.$refs.lyricList.$el.style.transform =`translate3d(${this.touch.width}px,0,0)`
                      this.$refs.middleL.style.opacity = 1
                      this.currentShow = 'cd'
            }

        }
      },
      
      //audio事件
      ready(){
        this.songReady = true
      },
      error(){
        this.songReady = true
      },
      updateTime(e){
      
        this.currentTime = e.target.currentTime
      
      },
      end(){
        if (this.mode ===1) {
          this.loop()
        } else {
          this.next()
        }
      },
     loop(){
        this.$refs.audio.currentTime = 0
        
        this.setPlaying(true)
       
        this.$refs.audio.play()
        if(JSON.stringify(this.currentLyric)!='{}'){
          this.currentLyric.seek(0)
        }
          
     },
     prev(){
       if(!this.songReady) return
       if(this.playList.length == 1) {this.loop();return}
        if(!this.playing) this.setPlaying(true)
      let index =  this.currentIndex 
      if( this.mode == 1){
       this.loop()
       return
      }else{
        index = index - 1
      if(index <0){
        index = this.playList.length - 1
      }
       this.setCurrentIndex(index)
      }
    
      this.songReady = false
     },
     next(){
       console.log(this.songReady)
       if(!this.songReady) return
       if(this.playList.length == 1) {this.loop(); return}
         if(!this.playing) this.setPlaying(true)
       let index =  this.currentIndex 
       if(this.mode == 1){
        this.loop()
        return
       }else{
        index = index + 1
       if(index == this.playList.length){
        index = 0
        }
       this.setCurrentIndex(index)
       } 
     
        this.songReady = false
     },
     format(interval){
       var interval = interval | 0
       var minite = ~~(interval/60)
       var seconds = this._pad(interval%60)
       return `${minite}:${seconds}`
     },
     _pad(num,n=2){
       
      let len = num.toString().length
      while(len <n){
        num = '0'+num
        len++
      }
      return num
     },
     open(){
       this.setFullScreen(true)
     },
     back() {
        this.setFullScreen(false)
     },
   
     
     onProgressBarChange(percent){
       console.log('per change  ')
       this.currentTime = percent * this.currentSong.interval
        this.$refs.audio.currentTime = this.currentTime
         if (!this.playing) {
          this.togglePlaying()
        }
         if(JSON.stringify(this.currentLyric)!='{}'){
          this.currentLyric.seek(this.currentTime * 1000)
        }
       
     },
    changeMode(){
      let mode = this.mode;
      mode = (mode + 1)%3;
      if(mode == 2){
      //var newList = Object.assign([],this.sequenceList)
        var list = shifter(this.sequenceList)
      
       var index= list.findIndex(i=>{
         return  i.songid == this.currentSong.songid
        })
          this.setCurrentIndex(index)
          this.setPlayList(list)
      }else{
        
      }
      this.setMode(mode)
    },
    
    
    
    showPlaylist(){
      this.$refs.playlist.show()
    },
    togglePlaying(){

     this.setPlaying(!this.playing)
     if(JSON.stringify(this.currentLyric)!={}) this.currentLyric.togglePlay()
     
    },
    setLyric(){
      console.log('test')
      console.log( this.currentSong)
        this.currentSong.getLyric(this.currentSong.songmid).then(res=>{
          if(this.currentSong.lyric !== res)return
          console.log('res')
          console.log(this.currentSong.lyric)
         this.lyricMes =res
         console.log(  this.lyricMes)
          console.log(this.currentSong.lyric)
         this.currentLyric = new Lyric(this.lyricMes,this.handleLyric)
      
          if(this.playing){
            this.currentLyric.play()
           }else{
             console.log(1)
             this.currentLyric.stop()
           }
       }).catch(e=>{
         this.currentLyric ={}
         this.playingLyric = ''
         this.currentLineNum = 0
         })
     
    },
  // 正在处理的那一行歌词的函数
    handleLyric({lineNum,txt}){
       this.currentLineNum = lineNum
       if(lineNum > 5){
         this.$refs.lyricList.scrollToElement(this.$refs.lyricLine[lineNum - 5],1000)

       }else{
         this.$refs.lyricList.scrollToElement(0,0,1000)

       }
       this.playingLyric = txt
    },

    _getpos(){
      let targetX = 40
      let jiluY = 30
      let offsetY = window.innerHeight-(80 + 128) - jiluY
      let offsetX = -(window.innerWidth / 2  - targetX)
      return {
        x:offsetX,
        y:offsetY,
        scale:40/256
      }
    },
     ...mapMutations({
         setFullScreen:'SET_FULL_SCREEN',
         setPlaying:'SET_PLAYING',
         setCurrentIndex:'SET_CURRENT_INDEX',
         setMode:"SET_MODE",
         setPlayList:"SET_PLAY_LIST",
         
     }),
     ...mapActions(['insertOnePlayHistory'])
  },
  watch:{
    currentSong(newSong,oldSong){
     
      console.log(this.currentLyric)
      if(JSON.stringify(this.currentLyric)!='{}'){
         this.currentLyric.stop()
      }
      
      
      let timer = setTimeout(()=>{
        if(this.$refs.audio){
          this.insertOnePlayHistory(this.currentSong)
   this.$refs.audio.play()
       this.setLyric()
        }
    
      },1000)
       
    },
    playing(newplaying){
      if(!this.songReady){
        return 
      }
      let audio = this.$refs.audio
      this.$nextTick(() => {
          newplaying ? audio.play() : audio.pause()
        })
    }
   
  }
}

</script>
<style lang='stylus' scoped>
@import "~common/stylus/variable"
  @import "~common/stylus/mixin"
.player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>