 import Vue from 'vue'
import Router from 'vue-router'



let Search = (reslove)=>{
   import('../components/search/search').then((module)=>{
    return reslove(module)
  })
}
let Recommand = (reslove)=>{
  import('../components/recommand/recommand').then((module)=>{
   return reslove(module)
 })
}
let Rank = (reslove)=>{
  import('../components/rank/rank').then((module)=>{
   return reslove(module)
 })
}
let Singer = (reslove)=>{
  import('../components/singer/singer').then((module)=>{
   return reslove(module)
 })
}
let SingerDetail = (reslove)=>{
  import('../components/singerDetail/singerDetail').then((module)=>{
   return reslove(module)
 })
}
let Disc = (reslove)=>{
  import('../components/disc/disc').then((module)=>{
   return reslove(module)
 })
}
let TopList = (reslove)=>{
  import('../components/toplist/toplist').then((module)=>{
   return reslove(module)
 })
}
let User = (reslove)=>{
  import('../components/userCenter/userCenter').then((module)=>{
   return reslove(module)
 })
}
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
     redirect:'/recommand'
    },
    {
      path: '/recommand',
      name: 'Recommand',
      component: Recommand,
      children:[
        {
          path:':id',
          component:Disc
        }
      ]
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank,
      children:[{
        path:':id',
        component:TopList
      }]
    },
    {
      path:'/user',
      component:User,
      name:'User'
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children:[
        {
          path:':id',
          name:'SingerDetail',
          component:SingerDetail
        }
      ]
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      children:[{
        path:':id',
        
        component:SingerDetail
      }]
    }
   ]
}) 
 