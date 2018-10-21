
import {mapGetters,mapActions,mapMutations} from 'vuex'
import Singer from 'common/js/singer'
import {shifter} from 'common/js/util'
export const playmini = {
    computed:{
        ...mapGetters(['playList'])
    },
    mouted(){
        this.handlePlaylist(this.playList)
    },
    activated(){
        this.handlePlaylist(this.playList)
    },
    watch:{
        playList(newP){
            this.handlePlaylist(newP)
        }
    },
    methods:{
        handlePlaylist(){
            throw new Error('must have handle')
        }
    }
}

export const playlistMixin = {
    computed:{
        ...mapGetters(['currentSong','currentIndex','playList','sequenceList','mode','favoriteSongs','sequenceList']),
        iconMode(){
            return this.mode === 0 ? 'icon-sequence' : this.mode === 1 ? 'icon-loop' : 'icon-random'
        }
    },
    methods:{
        changeMode(){
           let mode = this.mode
           mode = (mode +1)%3
           let list = null
           if(mode == 2){
            list = shifter(this.sequenceList)
           }else{list = this.sequenceList}
           this.resetCurrentIndex(list)
           this.setPlayList(list)
           this.setMode(mode)
        },
        resetCurrentIndex(list) {
            let index = list.findIndex((item) => {
              return item.songid === this.currentSong.songid
            })
            this.setCurrentIndex(index)
          },
      toggleFavorite(item){
       let flag = this._isFavorite(item)
       if(flag){
           this.deleteOneFavorite(item)
       }else{
           this.InsertOneFavorite(item)
       }
      },
      getFavoriteIcon(item){
        let flag = this._isFavorite(item)
        if(flag){
            return 'icon-favorite'
        }else{
           return 'icon-not-favorite'
        }
      },
      _isFavorite(item){
          let index= this.favoriteSongs.findIndex((song)=>{
               return item.songid === song.songid
           })

           if(index > -1){
               return true
           }else{
               return false
           }
      },
      ...mapMutations({
          'setMode':'SET_MODE',
          setCurrentIndex:'SET_CURRENT_INDEX',
          setPlayList:'SET_PLAY_LIST'
      }),
      ...mapActions(['deleteOneFavorite','InsertOneFavorite'])
    }
}

export const listMixin = {
    data(){
        return {
          query:''
        }
    },
    methods:{
        queryChange(query){
            this.query = query
        },
        selectHistory(item){
            this.query = item
            this.$refs.searchBox.setQuery(item) 
         },
         deleteHistory(item){
            this.deleteOneHistory(item)
        },
        blur(){
            this.$refs.searchBox.blur()
          },
          selectItem(item){
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
          },
          ...mapActions(['deleteOneHistory','store','insertSong']),
          ...mapMutations({
            setSinger:'SET_SINGER'
          })
    }
}