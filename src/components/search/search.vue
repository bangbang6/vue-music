<!--  -->
<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query='queryChange' ></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" >
      <scroll  ref="shortcut" class="shortcut" :data='shortcut'>
        <div>
          <div class="hot-key" v-show='!query'>
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" @click.stop='selectHot(item)'  v-for="item in hotkey">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show='!query'>
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click='jump'>
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @selectHistory='selectHistory' @deleteHistory='deleteHistory' :searches='searchHistory'></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result"  ref="searchResult" v-show='query'>
      <suggest :query='query' ref="suggest" v-show='query' @blur='blur' @selectItem='selectItem' :showSinger="showsinger"> </suggest>
    </div>
     <confirm ref="confirm" @confirm="clear" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
     <router-view></router-view>
  </div>
</template>

<script>
import {searchHotkey} from 'api/search.js'
import {playmini,listMixin} from 'common/js/mixin.js'
import Singer from 'common/js/singer'
import Scroll from 'base/scroll/scroll'
import SearchBox from 'base/searchBox/searchBox'
import Suggest from 'base/suggest/suggest'
import Confirm from 'base/confirm/confirm'
import SearchList from 'base/searchList/searchList'
import {mapMutations,mapActions,mapGetters} from 'vuex'

export default {
  mixins:[playmini,listMixin],
  data () {
    return {
      hotkey:[],
      searchResult:{},
      
     result:[],
showsinger:true
     
     
    };
  },

  components: {
    Scroll,
    SearchBox,
    Suggest,
    SearchList,
    Confirm
  },

  computed: {
    ...mapGetters(['searchHistory']),
    shortcut(){
      return this.hotkey.concat(this.searchHistory)
    }
  },

  mounted: function(){
    this._searchHotkey()
    
  },

  methods: {
    jump(){
         this.$refs.confirm.show()
    },
    handlePlaylist(playlist){
      let bottom = playlist.length>0?'60px':''
     this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
    },
    /* selectItem(item){
      if(item.type && item.type== 2){
        this.$router.push({
          path:`search/${item.singerid}`
        })
        let singer = new Singer(item.singerid,'',item.singername,item.singermid)
       this.setSinger(singer)
      }else{
        
        this.insertSong(item)
      }
      //console.log('query',this.query)
      this.store(this.query)
    }, */
    _searchHotkey(){
      searchHotkey().then(res=>{
        console.log(res)
        this.hotkey = res.data.data.hotkey.slice(0,5)
      })
    },
    /* queryChange(query){
        this.query = query
    },
   blur(){
     this.$refs.searchBox.blur()
   }, */
   selectHot(item){
      console.log('init')
        this.query = item.k;
        this.$refs.searchBox.setQuery(this.query) 
    },
    /* ...mapMutations({
      setSinger:'SET_SINGER'
    }), */
    clear(){
     this.clearHistory()
    },
    selectHistory(item){
       this.query = item
       this.$refs.searchBox.setQuery(item) 
    },
   /*  deleteHistory(item){
        this.deleteOneHistory(item)
    }, */
    ...mapActions(['insertSong','clearHistory','deleteOneHistory','store'])
  },
 
}

</script>
<style lang='stylus' scoped>
@import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>