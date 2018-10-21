<!--  -->
<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="queryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <!-- 播放列表 -->
          <scroll ref="songList" v-if="currentIndex===0" class="list-scroll" :data="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @selectSong="selectSong">
              </song-list>
            </div>
          </scroll>
          <scroll :refreshDelay="refreshDelay" ref="searchList" v-if="currentIndex===1" class="list-scroll"
                  :data="searchHistory">
                  <!-- 搜索列表 -->
            <div class="list-inner">
              <search-list @selectHistory='selectHistory' @deleteHistory='deleteHistory' :searches='searchHistory'></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
       <suggest :query='query' ref="suggest" v-show='query' @blur='blur' @selectItem='selectItem' :showSinger='showsinger'> </suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import Switches from 'base/switch/switch'
import Suggest from 'base/suggest/suggest'
import Scroll from 'base/scroll/scroll'
import songList from 'base/songList/songList'
import SearchList from 'base/searchList/searchList'
import topTip from 'base/toptip/toptip'
import searchBox from 'base/searchBox/searchBox'
import {mapGetters,mapActions} from 'vuex'
import {listMixin} from 'common/js/mixin'
import Song from 'common/js/musicData'
export default {
  mixins:[listMixin],
  data () {
    return {
        showFlag:false,
        query:'',
        currentIndex:0,
        refreshDelay:100,
        showsinger:false,
          switches: [
          {
            name: '最近播放'
          },
          {
            name: '搜索历史'
          }
        ]
    };
  },

  components: {
    Suggest,
    Switches,
    Scroll,
    SearchList,
    songList,
    topTip,
    searchBox
  },

  computed: {
    ...mapGetters(['searchHistory','playHistory'])
  },

  mounted: function(){},

  methods: {
      show(){
          this.showFlag = true
          setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songList.refresh()
          } else {
            this.$refs.searchList.refresh()
          }
        }, 20)
      },
      hide(){
          this.showFlag = false
      },
      selectSong(song, index) {
        console.log(song) 
      
          this.insertSong(song)
          this.$refs.topTip.show()
        
      },
      switchItem(index){
     this.currentIndex = index

      },
      
      ...mapActions(['insertSong','store'])
  }
}

</script>
<style lang='stylus' scoped>
 @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>