<!--  -->
<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
     <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script>
import {addClass} from 'common/js/dom.js'
import BScroll from 'better-scroll'
import { setTimeout, clearTimeout } from 'timers';
export default {
    props:{
         loop:{
            type:Boolean,
            default:true
        },
        autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
  data () {
    return {
       currentPageIndex:0,
       dots:[]
    };
  },

  components: {},

  computed: {},

  mounted: function(){
      this.setWidth();
      this.initSlider();
       this.initdots();

       if(this.autoPlay){
           this.play()
       }


       window.addEventListener('resize',()=>{
           this.setWidth(true);
           this.slider.refresh()
       })
  },
   destroyed(){
    clearTimeout(this.timer)
   },
  methods: {
      setWidth(flag){
          var sliders = this.$refs.sliderGroup.children;
          console.log(sliders)
          this.children = sliders
          var sliderWidth  = this.$refs.slider.clientWidth
          var width = 0;
          for(var i = 0 ; i<sliders.length;i++){
              addClass(sliders[i],'slider-item')
              sliders[i].style.width = sliderWidth + 'px'
              width +=sliderWidth
          }
          if(this.loop && !flag){
              console.log(1)
              width += 2*sliderWidth
          }
          this.$refs.sliderGroup.style.width = width +'px' 
      },
      initSlider(){
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          },
        })
      this.slider.on('scrollEnd',()=>{
          let pageIndex = this.slider.getCurrentPage().pageX;
          this.currentPageIndex = pageIndex;
         
         if(this.autoPlay){ clearTimeout(this.timer) ;this.play()}
      })
      },
      initdots(){
         this.dots = new Array(this.children.length - 2 )
      },
      play(){
          let index = (this.currentPageIndex + 1)%(this.children.length - 2);
         console.log(index,this.children.length)
         this.timer = setTimeout(()=>{
          this.slider.goToPage(index,0,400)
         },this.interval)
      }
  }
}

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    height:160px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      z-index:999
      position: absolute
      right: 0
      left: 0
      bottom: -12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>