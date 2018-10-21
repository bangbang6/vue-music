import axios from 'axios'

export function searchHotkey(){
    return axios.get('/api/getHotKey').then(res=>{
        return Promise.resolve(res)
    })
}

export function searchMessage(query,zhida,page){
 return  axios.get('/api/searchMessage',{params:{query,zhida,page}}).then(res=>{
   return  Promise.resolve(res)
 })
}