export const singer =state => state.singer 
export const mode = state=> state.mode
export const playList = state=> state.playList
export const sequenceList = state=> state.sequenceList
export const currentIndex = state => state.currentIndex
export const currentSong = (state) =>{ return state.playList[state.currentIndex]} 
export const playing = state=> state.playing
export const fullScreen  = state=> state.fullScreen
export const recommandItem = state=>state.recommandItem
export const topItem = state=>state.topItem
export const searchHistory = state=>state.searchHistory
export const favoriteSongs = state=>state.favoriteSongs
export const playHistory = state =>state.playHistory