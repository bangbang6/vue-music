<!--  -->
<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li @click="selectItem(item)" class="item" v-for="item in topList">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.pic"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songlist">
              <span>{{index + 1}}</span>
              <span>{{song.track_name}}-{{song.singer_name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {getTopList} from 'api/topList.js'
import Scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import {mapMutations} from 'vuex'
export default {
  data () {
    return {
      topList : []
    };
  },

  components: {
    Scroll,
    loading
  },

  computed: {},

  mounted: function(){
    this._getTopList()
  },

  methods: {
    _getTopList(){
       getTopList().then(result=>{
  console.log('result',result)
      this.topList = result.data.toplist.data.group_list[0].list   
      });
       
    },
    selectItem(item){
       this.setTopItem(item)
       this.$router.push({
         path:`/rank/${item.id}`
       })
    },
    ...mapMutations({
      setTopItem:'SET_TOPITEM'
    })
  }
}

</script>
<style lang='stylus' scoped>
 @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>