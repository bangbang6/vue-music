<!--  -->
<template>
  <transition name="list-fade">
    <div class="playlist" @click="hide" v-show="showFlag">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll ref="listContent" :data="sequenceList" class="list-content" :refreshDelay="refreshDelay">
          <transition-group ref="list" name="list" tag="ul">
            <li :key="item.songid" ref='item' class="item" v-for="(item,index) in sequenceList"
                @click="selectItem(item,index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.songname}}</span>
              <span @click.stop="toggleFavorite(item)" class="like">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span @click.stop="deleteOne(item)" class="delete">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div @click="addSong" class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import AddSong from '../add-song/add-song'
import Confirm from 'base/confirm/confirm'
import {mapActions,mapGetters} from 'vuex'
import {playlistMixin} from 'common/js/mixin.js'
export default {
    mixins:[playlistMixin],
  data () {
    return {
        showFlag:false,
        refreshDelay:100
    };
  },

  components: {
      Scroll,
      AddSong,
      Confirm
  },

  computed: {
      ...mapGetters(['playing','currentSong','mode','sequenceList','currentIndex']),
      modeText(){
          return this.mode == 0?'顺序播放':this.mode == 1?'单曲循环':'随机播放'
      }
  },

  mounted: function(){
     
  },

  methods: {
      hide(){
          this.showFlag = false
      },
      show(){
         this.showFlag = true
         setTimeout(()=>{
           this.$refs.listContent.refresh()
           this._scrollToCurrent()
         },20)
      },
      showConfirm(){
          this.$refs.confirm.show()
      },
      selectItem(item,index){
         if(!this.playing) this.playing = true
         this.selectOnePlay(item)
         this._scrollToCurrent()
      },
      getCurrentIcon(item){
          if(item.songid === this.currentSong.songid){
              return 'icon-play'
          }else{
              return ''
          }
      },
      addSong(){
         this.$refs.addSong.show()
      },
     
      deleteOne(item){
          this.deleteOnePlay(item)
      },
      confirmClear(){
         this.clearPlayList()
      },
      _scrollToCurrent(){
          let songs = this.$refs.item
          let index = this.currentIndex
          if(this.mode == 2){
            index = this.sequenceList.findIndex((item)=>{
                 return item.songid == this.currentSong.songid
             })
          }

        this.$refs.listContent.scrollToElement(songs[index])
      },
      ...mapActions(['deleteOnePlay','clearPlayList','selectOnePlay'])
  }
}

</script>
<style lang='stylus' scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>