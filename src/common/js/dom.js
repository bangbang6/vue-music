export function addClass (el,name){
   if(haveClass(el,name)){return ;}
   else{
       var className = el.className.split(' ')
       className.push(name)
       el.className = className.join(' ')
   }
}

export function haveClass (el,name){
    var pattern = new RegExp("(^|\\s)" + name + "($|\\s)")
    return pattern.test(el.className)
}

export function getData(el,name){
    let prefix = 'data-'
    let names = prefix + name
    return el.getAttribute(names) 
}

let style = document.createElement('div').style
let vender = (function(){
    let transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
      }
      for(let key in transformNames){
          if(style[transformNames[key]] !== undefined){
              return key
          }
      }
      return false
})()
export function prefix (name){
   if(vender == false) return false
   if(vender == 'standard') return name
   else return vender+name.charAt(0).toUpperCase()+name.substr(1)
}