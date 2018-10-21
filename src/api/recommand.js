import jsonp from '../common/js/jsonp.js'
import {param,options} from './config.js'
import axios from 'axios'
export function getRecommand (){
    let baseUrl = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
    let data = Object.assign({},param,{
        g_tk:5381,
        uin:0,
        notice:0,
        platform:"h5",
        needNewCode:1,
        _:"1539311410576"
    })
   return  jsonp(baseUrl,data,options)
}

export function getRecommandList(disstid){
 return  axios.get('/api/recommandList',{params:{disstid:disstid}}).then(res=>{
        console.log('recommand list',res.data)
        return Promise.resolve(res.data)
    })
}