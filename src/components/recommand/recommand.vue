<!--  -->
<template>
  <div class="recommend" ref="recommend">
  <scroll ref="scroll" class="recommend-content" :data="musicList">
      <div>
         <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">

          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImg"   v-lazy="item.picUrl">
              </a>
            </div>
          </slider>
        </div>

         <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li  v-for="item in musicList" class="item" style='display:flex' @click='selectItem(item)'>
              <div class="icon">
                <img width="60" height="60" :src="item.picUrl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.songListDesc"></h2>
                <p class="desc" v-html="item.songListAuthor"></p>
              </div>
            </li>
          </ul>
        </div>
        </div>
        <div class="loading-container" v-show="!musicList.length">
          <loading></loading>
        </div>
    </scroll> 
   <router-view></router-view>
  </div>
</template>

<script>
import {getRecommand} from 'api/recommand.js'
import {getMusicList} from 'api/musicList.js'
import {Ok} from 'api/config.js'
import slider from 'base/slider/slider'
import {playmini} from 'common/js/mixin'
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import {mapMutations} from 'vuex'
export default {
  mixins:[playmini],
  data () {
    return {
        recommends:[],
        musicList:[],
        checkLoad:false
    };
  },

  components: {
    slider,
    scroll,
    loading
  },

  computed: {},

  mounted: function(){
      
       this._getCommand();
    
      
      this._getMusicList()
  },

  methods: {
      handlePlaylist(playlist){
      const bottom = playlist.length >0 ?'60px':'' 
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
      _getCommand(){
          console.log('init')
          getRecommand().then((res)=>{
            console.log(res)
            if(res.code == Ok){
                this.recommends=res.data.slider
            }
          })
      },
        _getMusicList(){
          console.log('init')
          getMusicList().then((res)=>{
            console.log(res)
            if(res.code == Ok){
                this.musicList = res.data.songList
            }
          })
      },
      loadImg(){
        if(!this.checkLoad){
            this.checkLoad = true
            this.$refs.scroll.refresh()
        }
      },
      selectItem(item){
        console.log('recommand',item)
        this.$router.push({
          path:`/recommand/${item.id}`
        })
        this.setRecommandItem(item)
      },
      ...mapMutations({
        setRecommandItem:'SET_RECOMMAND_ITEM'
      })
  }
}

</script>
<style lang='scss' lang='stylus' scoped>
  @import "~common/stylus/variable"
.recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-small
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>