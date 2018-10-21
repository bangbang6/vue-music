<!--  -->
<template>
  <scroll  class="listview"
          ref="listview"
          :probe-type='probeType'
          :canListen='canListen'
          @getY='getY'
          >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.img">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent='onshortTouchStart' @touchmove.stop.prevent='onshortTouchMove'>
      <ul>
        <li v-for="(item, index) in shortcutList" :data-index="index" class="item"
            :class="{'current':currentIndex===index}">{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import loading from 'base/loading/loading'
import scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom.js'


const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 18

export default {
    props:{
        data:{
            type:Array,
            default:()=>[]
        },
    },
  data () {
    return {
        diff:-1,
        currentIndex:0,
        scrollY:1.
    };
  },

  components: {
      loading,
      scroll,
  },
  created(){
      this.probeType = 3,
      this.canListen = true
  },
  computed: {
      shortcutList(){
          return this.data.map((i)=>i.title.slice(0,1))
      },
      fixedTitle(){
         
            // console.log(this.scrollY)
              if(this.scrollY > 0 ) {console.log(1);return ''}
          
          
         
          return this.data[this.currentIndex]?this.data[this.currentIndex].title:''
      }
  },
  

  mounted: function(){
     
  },
  watch:{
   data(){
       setTimeout(this._calcHeight,20)
   },
   diff(newVal){
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      console.log(fixedTop)
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
   
  },
  methods: {
      onshortTouchStart(e){
          console.log(e)
          var index = getData(e.target,"index")
          console.log(index)
          var Y1 = e.touches[0].pageY
          this.touch = {
              index,
              Y1
          }
          this._scrollTo(index)
      },
      onshortTouchMove(e){
          var Y2 = e.touches[0].pageY
          var delta = (Y2 - this.touch.Y1) / ANCHOR_HEIGHT
          var newIndex = parseInt(delta) + parseInt(this.touch.index)
          //console.log(newIndex)
          if(newIndex < 0 ) this.currentIndex = 0
          else if(newIndex > this.shortcutList.length) this.currentIndex = this.shortcutList.length-1
          else this.currentIndex = newIndex
          
          this._scrollTo(newIndex)
      },
      getY(scrollXY){
           this.scrollY = scrollXY.y
         // console.log('scrollY',this.scrollY)
        let length = this.heightArr.length
        if(this.scrollY>0) this.currentIndex = 0;
        this.diff = 0;
         //console.log(this.heightArr)
        for(var i =0;i<length-2;i++){
               if((-this.scrollY>=this.heightArr[i])&&(-this.scrollY<this.heightArr[i+1])){
                   console.log( this.currentIndex)
                this.currentIndex = i
                this.diff = this.heightArr[i+1] +this.scrollY
                
          }
        }
        if(-this.scrollY>this.heightArr[length - 1]){
             this.currentIndex = length -1
        }     
        
      },
      selectItem(item){
        
        this.$emit('select',item)
      },
      _calcHeight(){
        var els = this.$refs.listGroup;
        let height = 0;
        let heightArr = [];
        heightArr.push(height)
        els.forEach(el=>{
         height += el.clientHeight;
         heightArr.push(height)
        })
        this.heightArr = heightArr
      },
      _scrollTo(index){
          this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
      },
      refresh(){
        this.$refs.listview.refresh()
      }
      
  }
}

</script>
<style lang='stylus' scoped>
 @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
