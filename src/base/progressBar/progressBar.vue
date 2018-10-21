<!--  -->
<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props:{
     percent:{
         type:Number,
         default:0
     }
    },
  data () {
    return {
        touch:{init:false},
        width:0
    };
  },

  components: {},

  computed: {},

  mounted: function(){
     
  },
 
  methods: {
      _scrollTo(offset){
          this.$refs.progress.style.width = `${offset}px`
          this.$refs.progressBtn.style.transform = `translate3d(${offset}px,0,0)`
      },
      
      progressClick(e){
          var left = this.$refs.progressBar.getBoundingClientRect().left
          var offset = e.pageX - left
          this._scrollTo(offset)
          this._triggerPercent()
      },
      progressTouchStart(e){
          this.touch.init = true
          var x =e.touches[0].pageX
          var y = e.touches[0].pageY
          this.touch.x=x
          this.touch.y=y
          this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e){
          if(!this.touch.init) return
             var newX = e.touches[0].pageX
             var newY = e.touches[0].pageY
             var deltaX = newX - this.touch.x
             var offset = Math.min(this.$refs.progressBar.clientWidth,Math.max(0,this.touch.left+deltaX))
             this._scrollTo(offset)
          
         
         
         
      },
      progressTouchEnd(){
          this.touch.init = false
          this._triggerPercent()
      },
      _triggerPercent(){
          var percent = this.$refs.progress.clientWidth / (this.$refs.progressBar.clientWidth - 16)
          this.$emit('onProgressBarChange',percent)
      }
  },
  watch:{
      percent(newP){
          if( newP>0&& !this.touch.init){
                this.width = this.$refs.progressBar.clientWidth - 16
                let offset = Math.min(this.width,this.width * newP)
                this._scrollTo(offset)
          }
         
      }
  }
}

</script>
<style lang='stylus' scoped>
 @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>