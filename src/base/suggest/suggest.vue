<!--  -->
<template>
  <scroll ref="suggest"
          class="suggest"
          :data="result"
          :pullup='pullup'
           @scrollToEnd='loadMore'
          :beforeScroll='beforeScroll'
          :blur='blur'
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <!-- <no-result title="抱歉，暂无搜索结果"></no-result> -->
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {debounce} from 'common/js/util'
import {searchMessage} from 'api/search'
import Loading from 'base/loading/loading'
import Song from 'common/js/musicData'
import Singer from 'common/js/singer'
export default {
  props:{
  query:{
    type:String,
    default:'',
  },
  showSinger:{
    type:Boolean,
    default:true
  }
 
},
  data () {
    return {
        pullup:true,
         page:1,
        hasMore:false,
        result:[],
        page :1,
        totalNum:0,
        beforeScroll:true
    };
  },

  components: {
      Scroll,
      Loading
  },

  computed: {},

  mounted: function(){
   
  },

  methods: {
    
     
      selectItem(item){
         this.$emit('selectItem',item)
      },
      getIconCls(item){
       if(item.type && item.type == 2){
         return 'icon-mine'
       }else{
         return 'icon-music'
       }
      },
      getDisplayName(item){
         if(item.type && item.type == 2){
         return item.singername
       }else{
        return `${item.songname}-${item.singer}`
       }
      },
       normalLize(data){
        let ret = [];
        
        let songs =  data.song.list.map(item => {
          return new Song(item.albumname,item.albummid,item.interval,item.singer,item.songid,item.songmid,item.songname)
        });
      if(data.zhida.type && data.zhida.type == 2){
        console.log('zhida',data.zhida)
        console.log(songs)
         ret = [{...data.zhida}].concat(songs)
          console.log(ret)
          return ret
      }
       
        return songs
     },
     refresh(){
   this.$refs.suggest.refresh()
     },
     loadMore(){
       this.hasMore = true
       this.page ++
       
       if(this.page * 20 >= this.totalNum){
         this.hasMore = false
         return
        }
      debounce(searchMessage(this.query,this.showSinger,this.page).then(res=>{
             console.log(res)
             this.result = this.result.concat(this.normalLize(res.data.data))
               this.hasMore = false
        }),20)
     },
     blur(){
       this.$emit('blur')
     }
  },
   watch:{
    query(newQ){
         console.log(newQ)
        
       if(newQ != ''){
         this.page =1
         this.$refs.suggest.scrollTo(0,0)
           debounce(searchMessage(newQ,this.showSinger,this.page).then(res=>{
             console.log(res)
             this.result = this.normalLize(res.data.data)
             this.totalNum = res.data.data.song.totalnum
        }),20)
       }
      
    }
  }
  

}

</script>
<style lang='stylus' scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>