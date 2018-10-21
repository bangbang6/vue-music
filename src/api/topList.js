 import {param,options} from './config.js'
import jsonp from 'common/js/jsonp.js'
import axios from 'axios'

export function getTopList(){
   return  axios.get('/api/getTopList').then(res=>{
        console.log(res)
        return Promise.resolve(res)
    })
}

export function getAllList(topId){
    
   return axios.get('/api/getAllToplist',{params:{topId:topId}}).then(res=>{
       console.log('all tooplist',res)
       return Promise.resolve(res)
   })
}