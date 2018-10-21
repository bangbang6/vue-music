import * as types from './mutation-types'


let mutation = {
    [types.SET_SINGER](state,singer){
        state.singer = singer
    },
    [types.SET_CURRENT_INDEX](state,currentIndex){
        state.currentIndex = currentIndex
    },
    [types.SET_FULL_SCREEN](state,fullScreen){
        state.fullScreen = fullScreen
    },
    [types.SET_MODE](state,mode){
        state.mode = mode
    },
    [types.SET_PLAY_LIST](state,playList){
        /* state.playList = JSON.parse(JSON.stringify(playList))
       state.playlist = Object.assign([], playList) */
       state.playList = playList
    },
    [types.SET_PLAYING](state,playing){
        state.playing = playing
    },
    [types.SET_SEQUENCE_LIST](state,sequenceList){
        /* state.sequenceList = JSON.parse(JSON.stringify(sequenceList))
        state.sequenceList = Object.assign([], sequenceList) */
       
        state.sequenceList = sequenceList
    },
    [types.SET_RECOMMAND_ITEM](state,recommandItem){
        state.recommandItem = recommandItem
    },
    [types.SET_TOPITEM](state,topItem){
        state.topItem = topItem
    },
    [types.SET_SEARCHHISTORY](state,searchHistory){
        state.searchHistory = searchHistory
    },
    [types.SET_FAVORITE_SONGS](state,favoriteSongs){
        state.favoriteSongs = favoriteSongs
    },
    [types.SET_PLAY_HISTORY](state,playHistory){
        state.playHistory  = playHistory
    }
}

export default mutation