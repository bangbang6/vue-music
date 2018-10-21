import { setTimeout, clearTimeout } from "timers";

export function shifter(arr){
    let _arr  = arr.slice()
    
    for(var i = 0 ; i<_arr.length;i++){
        let j =Math.floor( (Math.random() *(_arr.length)) )
        var t = _arr[i]
        
        _arr[i] =  _arr[j]
        _arr[j] = t
    }
    return _arr
}


export function debounce(func,delay){
   let timer
   return function(...args){
       if(timer){
           clearTimeout(timer)
       }
       let timer = setTimeout(()=>{
           func.apply(this,args)
       },delay)
   } 
}
