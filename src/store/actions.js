import * as types from './mutation-types'
import {modeType} from 'common/js/config.js'
import {shifter} from 'common/js/util'
import storage from 'good-storage'
import Song from 'common/js/musicData'
function findIndex(list, song) {
    return list.findIndex((item) => {
      return item.songid === song.songid
    })
  }
  
export const selectItem = ({commit,state},{list,index})=>{
   
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_SEQUENCE_LIST,list)
    commit(types.SET_PLAYING,true)
    if(state.mode == modeType.random){
        var newlist = shifter(list)
       var newIndex = newlist.findIndex((i)=>{
            return i.songid == list[index].songid
        })
        commit(types.SET_PLAY_LIST,newlist)
        commit(types.SET_CURRENT_INDEX,newIndex)
    }else{
        commit(types.SET_PLAY_LIST,list)
        commit(types.SET_CURRENT_INDEX,index)
    }
    
}

export const randomPlay = function ({commit}, list) {
    commit(types.SET_MODE, 2)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shifter(list)
    commit(types.SET_PLAY_LIST, randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING, true)
  }

export const insertSong = ({commit,state},song) =>{
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let currentSong  = playList[currentIndex]
  //在playList里面加歌曲
  let index = playList.findIndex((item)=>{
    return song.songid == item.songid
  })

  currentIndex++
  // 插入这首歌到当前索引位置
  playList.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (index > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > index) {
        playList.splice(index, 1)
      currentIndex--
    } else {
        playList.splice(index + 1, 1)
    }
  }


  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  
    let fsIndex = findIndex(sequenceList, song)
  
    sequenceList.splice(currentSIndex, 0, song)
  
    if (fsIndex > -1) {
      if (currentSIndex > fsIndex) {
        sequenceList.splice(fsIndex, 1)
      } else {
        sequenceList.splice(fsIndex + 1, 1)
      }
    }
   console.log('tset playlist',playList)
    commit(types.SET_PLAY_LIST, playList)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING, true)
}

export const store = function({commit,state},key){
 let searchHistory = state.searchHistory.slice()
 let index = searchHistory.findIndex((item)=>{
  return item == key
 })
 if(index < 0){
    searchHistory.unshift(key)
    console.log(searchHistory)
    searchHistory = searchHistory.slice(0,10)
 }else if(index > 0){
    searchHistory.splice(index,1)
    searchHistory.unshift(key)
 } 
 commit(types.SET_SEARCHHISTORY,searchHistory)
 
 storage.set('__searchHistory__', searchHistory)
 
}

export const clearHistory =  ({commit,state})=>{
    storage.remove('__searchHistory__')
    commit(types.SET_SEARCHHISTORY,[])
}

export const deleteOneHistory = ({commit,state},item)=>{
    let searchHistory = state.searchHistory.slice()
    console.log(searchHistory,item)
    let index = searchHistory.findIndex((song)=>{
      return song.songname == item
    })
    searchHistory.splice(index,1)
    storage.set('__searchHistory__', searchHistory)
    commit(types.SET_SEARCHHISTORY,searchHistory)
}

export const clearPlayList = ({commit,state})=>{
  commit(types.SET_PLAY_LIST,[])
  commit(types.SET_SEQUENCE_LIST,[]),
  commit(types.SET_CURRENT_INDEX,-1)
  commit(types.SET_PLAYING,false)
}

export const deleteOnePlay = ({commit,state},item)=>{
   let playList = state.playList.slice()
   let sequenceList = state.sequenceList.slice()
   let currentIndex  =state.currentIndex
   let index = findIndex(playList,item)
   playList.splice(index,1)
   if(index < currentIndex){
     currentIndex = currentIndex -1
   }
   
   let fsIndex = findIndex(sequenceList,item)
   sequenceList.splice(fsIndex,1)

   if(currentIndex < 0){
     commit(types.SET_PLAYING,false)
   }

   commit(types.SET_CURRENT_INDEX,currentIndex)
   commit(types.SET_PLAY_LIST,playList)
   commit(types.SET_SEQUENCE_LIST,sequenceList)

}
export const selectOnePlay = ({commit,state},item) =>{
      let playList = state.playList.slice()
      let currentIndex = state.currentIndex
      let index = findIndex(playList,item)
      currentIndex = index
      commit(types.SET_CURRENT_INDEX,currentIndex)
}

export const deleteOneFavorite  =({commit,state},item) =>{
     let test = state.favoriteSongs.slice()
       let favoriteSongs =  test.map((item)=>{
        return new Song(item.albumname,item.albummid,item.interval,item.singer,item.songid,item.songmid,item.songname)
      })
       let index = findIndex(favoriteSongs,item)
       favoriteSongs.splice(index,1)
       storage.set('__favorite__', favoriteSongs)
       commit(types.SET_FAVORITE_SONGS,favoriteSongs)
}

export const InsertOneFavorite = ({commit,state},item) =>{
  let test = state.favoriteSongs.slice()
  let favoriteSongs =  test.map((item)=>{
   return new Song(item.albumname,item.albummid,item.interval,item.singer,item.songid,item.songmid,item.songname)
 })
  let index = findIndex(favoriteSongs,item)
  if(index == -1){
    favoriteSongs.unshift(item)
  }else{
    favoriteSongs.splice(idnex,1)
    favoriteSongs.unshift(item)
  }
  storage.set('__favorite__', favoriteSongs)
  commit(types.SET_FAVORITE_SONGS,favoriteSongs)
  
}

export const insertOnePlayHistory=({commit,state},item)=>{
  console.log(state.playHistory.slice())
  let test  =state.playHistory.slice()/* .map((song)=>{return new Song(song)}) */
  let song = new Song(item.albumname,item.albummid,item.interval,item.singer,item.songid,item.songmid,item.songname)
  let playHistory = test.map((Item)=>{
    return new Song(Item.albumname,Item.albummid,Item.interval,Item.singer,Item.songid,Item.songmid,Item.songname)
  })
  console.log(playHistory)
  let index = playHistory.findIndex((song)=>{
    return item.songid == song.songid
  })
  if(index == -1){
    playHistory.unshift(song)
  }else{
    playHistory.splice(index,1)
    playHistory.unshift(song)
  }
  storage.set('__playHistory__', playHistory)
  commit(types.SET_PLAY_HISTORY,playHistory)
} 