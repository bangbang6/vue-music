<!--  -->
<template>
   <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" 
             @getY="scroll"
             class="list"
              ref="list"
              :probe-type='probeType'
              :can-listen='canListen'
              >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @selectSong='selectSong' :rank='rank'></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>

import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import songList from 'base/songList/songList'
import {prefix} from 'common/js/dom.js'
import {mapMutations,mapActions} from 'vuex'
import {playmini} from 'common/js/mixin'
const MAXHEIGHT = 40
const MAXPULL =   40
export default {
  mixins:[playmini],
    props:{
     title:{
         type:String,
         default:''
     },
     songs:{
         type:Array,
         default:()=>[]
     },
     bgImage:{
         type:String,
         default:''
     },
     rank:{
       type:Boolean,
       default:false
     }
    },
  data () {
    return {
      pageY:-1
    };
  },
  created(){
    this.probeType=3
    this.canListen=true
  },
  components: {
    loading,
    songList,
    scroll
  },

  computed: {
    bgStyle(){
      return `background-image:url(${this.bgImage})`
    }
  },

  mounted: function(){
    this.height = this.$refs.bgImage.clientHeight
    console.log(this.$refs.bgImage.clientHeight)
      this.$refs.list.$el.style.top = `${this.height}px`
  },

  methods: {
    handlePlaylist(playlist){
      const bottom = playlist.length >0 ?'60px':'' 
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
      back(){
          this.$router.push({
              path:'/recommand'
          })
      },
      _setHeight(){
       
      },
      random(){
      this.randomPlay(this.songs)
      },
      scroll(page){
         this.pageY  = page.y
        // console.log('scroll suc')
      },
      selectSong(item,index){
       this.selectItem({list:this.songs,index})
      },
      ...mapActions(['selectItem','randomPlay'])
     
  },
  watch:{
    pageY(newY){
       let Y = Math.min(-newY,(this.height - MAXHEIGHT))
       console.log(Y)
       if(newY < 0){
         console.log('上画')
         this.$refs.layer.style[prefix('transform')] = `translate3d(0,${-Y}px,0)`
         if(-newY > this.height - MAXHEIGHT) {
           this.$refs.bgImage.style.paddingTop=0
           this.$refs.bgImage.style.height = `${MAXHEIGHT}px`;
           this.$refs.bgImage.style.zIndex=3
           this.$refs.playBtn.style.display = 'none'
           
         }else{
            this.$refs.playBtn.style.display =''
            this.$refs.bgImage.style.paddingTop='70%'
           this.$refs.bgImage.style.height = 0;
           this.$refs.bgImage.style.zIndex=1
         }
       }
       if(newY>0&&newY<MAXPULL){
        // console.log('scale init')
          let percent = newY / this.height
          let newP = percent+1
          this.$refs.bgImage.style[prefix('transform')] = `scale(${newP})` 
          this.$refs.bgImage.style.zIndex = 3
       }
    }
  }
}

</script>
<style lang='stylus' scoped>
@import "~common/stylus/variable"
  @import "~common/stylus/mixin"
.music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      z-index:1
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      z-index:2
      position: relative
      height: 100%
      background: $color-background
      
    .list
      z-index:2
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>