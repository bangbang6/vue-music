
import axios from 'axios'
import {Base64} from 'js-base64'
export default class Song {
    constructor(albumname,albummid,interval,singer,songid,songmid,songname){
        this.albumname = albumname
        this.albummid = albummid
        this.interval = interval
        this.singer = this.normalLizeSingers(singer)
        this.songid = songid
        this.songmid = songmid   
        this.image = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${this.albummid}.jpg?max_age=2592000`
        this.songname = songname,
        this.url = `http://ws.stream.qqmusic.qq.com/C100${this.songmid}.m4a?fromtag=0&guid=126548448`
    }
    getLyric(midid){
        console.log('enter')
        /* var data = {
          
          pcachetime: +new Date(),
          songmid: mid,
          g_tk: '1078325585',
          
          loginUin: '577174667',
          hostUin: '0',
          format: 'json',
          inCharset: 'utf8',
          outCharset: 'utf-8',
          notice: '0',
          platform: 'yqq',
          needNewCode: '0'
        } */
    
      return  axios.get('/api/getLyric',{params:{midid:midid}}).then(res=>{
          console.log('why',res)
          console.log(Base64.decode(res.data.lyric))
          this.lyric = Base64.decode(res.data.lyric)
          return Promise.resolve(Base64.decode(res.data.lyric))
        })
       
    }
    normalLizeSingers(arr){
        var arrs=[]
        if(typeof arr == 'string') return arr
        
       
        else{
            if(!arr.length){return }
            arr.forEach(item=>{
                arrs.push(item.name)
            })
            console.log('arrs',arrs)
            return arrs.join('-') 
        }
        
    }
}

