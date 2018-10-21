import originJsonp from 'jsonp'



export default function jsonp(url,data,options){
    url += (url.indexOf('?')<0?'?':"&") + parse(data)   
    return new Promise((resolve,reject)=>{
        originJsonp(url,options,function(err,data1){
            if(err){
                reject(err)
            }else{
                resolve(data1)
            }
        })
    })
}
//对url进行拼接
function parse(data){
    let url = '';
    for(var key in data){
        let value = data[key] == undefined?'':data[key]
         url += `&${key}=${encodeURIComponent(value)}`  
    }
    return url? url.substring(1):''
}