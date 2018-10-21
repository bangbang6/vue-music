<!--  -->
<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from './../musicList/musicList'
 import {mapGetters} from "vuex";
 import {getRecommandList} from 'api/recommand.js'
 import Song from 'common/js/musicData.js'
export default {
 
  data () {
    return {
        songs:[]
    };
  },

  components: {
      MusicList
  },

  computed: {
      ...mapGetters(['recommandItem']),
      title(){
          return this.recommandItem.songListDesc
      },
      bgImage(){
          return this.recommandItem.picUrl
      },
  },

  mounted: function(){
      console.log(this.recommandItem)
      this._getRecommandList(this.recommandItem.id)
  },

  methods: {
      _getRecommandList(disstid){
       getRecommandList(disstid).then(res=>{
           console.log(res.cdlist[0].songlist)
           this.songs = this.normalLize(res.cdlist[0].songlist)
       })
      },
      normalLize(arr){
          var ret = []
          arr.forEach(item => {
              ret.push(new Song(item.album.name,item.album.id,item.interval,item.singer,item.id,item.mid,item.name))
          });
          return ret
      }
  }
}

</script>
<style lang='stylus' scoped>
.slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
