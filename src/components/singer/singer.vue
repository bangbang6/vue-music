<!--  -->
<template>
  <div class="singer" ref="singer">
    <list-view  :data="singers" ref="list" v-show='singers.length' @select='selectSinger' ></list-view>
    <router-view></router-view>
  </div>
</template>

<script>

import {getSingers} from 'api/singers.js'
import Singer from 'common/js/singer.js'
import listView from 'base/listview/listview'
import {mapMutations,mapState} from 'vuex'
import {playmini} from 'common/js/mixin'
export default {
  mixins:[playmini],
  data () {
    return {
      singers:[]
    };
  },

  components: {
    listView,
  },

  computed: {},

  mounted: function(){
     this.init()
      
  },

  methods: {
      handlePlaylist(playlist){
      const bottom = playlist.length >0 ?'60px':'' 
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
      init(){
        var that = this
       getSingers().then(res=>{
         console.log(res)
         that.normalizeSingers(res.singerList.data.singerlist)
       })
      
      },
       selectSinger(item){
         this.setSinger(item);
         this.$router.push({
           path:`singer/${item.id}`
         })
       } ,
      normalizeSingers(singers){
        /* var arr = {
          'title':[]
        } */
        var arr = {}
        singers.forEach((i)=>{
            if(!arr[i.country]){
               arr[i.country] = []
            }
            arr[i.country].push(i)
        })
        console.log(arr)
        var singers = []
        
        for(var key in arr){
          var singer = {}
         
            singer.title = key
             singer.items = []
            // console.log(arr[key])
             arr[key].forEach(item=>{
               //console.log('item',item)
               singer.items.push(new Singer(item.singer_id,item.singer_pic.replace(/webp/,'jpg'),item.singer_name,item.singer_mid))
             })
           singers.push(singer)
          
        }
        console.log(singers)
        this.singers = singers
      },
      ...mapMutations({
        setSinger:'SET_SINGER'
      })
  }
}

</script>
<style lang='stylus' scoped>
.singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>