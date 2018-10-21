import storage from 'good-storage'
import Song from 'common/js/musicData'
let state = {
    singer:{},
    sequenceList:[],
    playList:[],
    currentIndex:-1,
    fullScreen:true,
    playing:false,
    mode:0,
    recommandItem:{},
    topItem:{},
    searchHistory:storage.get('__searchHistory__',[]),
    favoriteSongs:storage.get('__favorite__',[]),
    playHistory:storage.get('__playHistory__',[]),
}


export default state