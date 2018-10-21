import {param,options} from './config.js'
import jsonp from 'common/js/jsonp.js'
import axios from 'axios'
import {Base64} from 'js-base64'
export function getSingers(){
   /*  var data = {
        g_tk: '1078325585',
        callback:'jsonpCallback',
        jsonpCallback:'jsonpCallback',
       
        loginUin: '577174667',
        hostUin: '0',
        format: 'jsonp',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: '0',
        platform: 'yqq',
        needNewCode:'0',
        data: {"comm":{"ct":24,"cv":10000},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":-100,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}
    } */
    
    
  return  jsonp('/api/getSingers',{},options).then(res=>{
       return Promise.resolve(res)
    })
}
   
export function getSingerDetail(id){
  let data = {
    singerid: ''+id,
    g_tk: '5381',
    uin: '0',
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: '0',
    platform: 'h5page',
    needNewCode: '1',
    order: 'listen',
    from: 'h5',
    num: '15',
    begin: '0',
    _: '1539438936109'
  }
 return  jsonp('https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',data,options).then(res=>{
    console.log('songs',res)  
   return Promise.resolve(res)
   })
}





