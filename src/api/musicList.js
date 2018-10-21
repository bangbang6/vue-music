import axios from 'axios'
import {param} from './config'
export function getMusicList (){

    var data = Object.assign({},param,{
        g_tk:5381,
        uin:0,
        notice:0,
        platform:"h5",
        needNewCode:1,
        _:"1539311410576"
    })
 return axios.get('/api/getMusicList',{params:data}).then(res=>{
      var res = res.data
      console.log( 'music',res)
      if(res.status == '0'){
          return Promise.resolve(res.result)
      }
  })

}