<!--  -->
<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from '../musicList/musicList'
import {mapGetters} from 'vuex'
import {getAllList} from 'api/topList.js'
import Song from 'common/js/musicData.js'
export default {
  data () {
    return {
        songs:[],
        rank:true
    };
  },

  components: {
      MusicList
  },

  computed: {
     
     title(){
         return this.topItem.name
     },
     bgImage(){
        return this.topItem.pic
     },
     ...mapGetters(['topItem'])
},

  mounted: function(){
      this._getAllList(this.topItem.id)
  },

  methods: {
      _getAllList(topid){
          getAllList(topid).then(res=>{
              console.log(res.data.songlist)
              this.songs = this.normal(res.data.songlist)
          })
      },
      normal(arr){
          var ret  =[]
          arr.forEach(item => {
              ret.push(new Song(item.data.albumname,item.data.albummid,item.data.interval,item.data.singer,item.data.songid,item.data.songmid,item.data.songname))
          });
          return ret
      }
  }
}

</script>
<style lang='stylus' scoped>
.slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>