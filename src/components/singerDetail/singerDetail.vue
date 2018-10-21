<!--  -->
<template>
  <transition name="slide">
     <music-list :title="title" :bg-image="bgImage" :songs="songs" v-if='songs.length'  ref="musicList"></music-list> 
  </transition>
</template>

<script>
import musicList from './../musicList/musicList'
import {getSingerDetail} from 'api/singers.js'
import {mapGetters} from 'vuex'
import Song from 'common/js/musicData'
export default {
  data () {
    return {
        songs:[],
       
    };
  },

  components: {
      musicList
  },

  computed: {
      ...mapGetters(['singer']),
      title(){
          return this.singer.name
      },
      bgImage(){
          return   'https://y.gtimg.cn/music/photo_new/T001R150x150M000'+this.singer.mid+'.jpg'}
          
      
  },

  mounted: function(){
    
    
 this._getSongs(this.singer.id)
     
     
  },

  methods: {
      _getSongs(id){
          console.log('init')
          if(JSON.stringify(this.singer) !== '{}'){
            getSingerDetail(id).then((res)=>{
             console.log(res)
           
           
             this.songs = this.normalLizeDetail(res.data.list)
            })
          }
        
        
      },
      
      normalLizeDetail(arr){
          var ret = []
          var that = this
        arr.forEach(item => {
            ret.push(new Song(item.musicData.albumname,item.musicData.albummid,item.musicData.interval,item.musicData.singer,item.musicData.songid,item.musicData.songmid,item.musicData.songname))
        });
        console.log(ret)
        return ret
      },
     
  }
}

</script>
<style lang='stylus' scoped>
.slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>