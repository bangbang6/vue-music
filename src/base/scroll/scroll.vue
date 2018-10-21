<!--  -->

<template>
  <div class='wrapper' ref='wrapper'>
      <slot></slot>

  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
    props:{
     probeType:{
         type:Number,
         default:1
     },
     data:{
         type:Array,
         default:()=>[]
     },
     click:{
         type:Boolean,
         default:true
     },
     canListen:{
         type:Boolean,
         default:false
     },
     pullup:{
         type:Boolean,
         default:false
     },
     beforeScroll:{
         type:Boolean,
         default:false
     },
     refreshDelay:{
         type:Number,
         default:20
     }
    },
  data () {
    return {
    };
  },

  components: {},

  computed: {},

  mounted: function(){
     setTimeout( ()=>{
       this.init()
     },20) 

     
  },

  methods: {
    init(){
        if(!this.$refs.wrapper){return;}
        this.scroll = new BScroll(this.$refs.wrapper,{
            probeType:this.probeType,
            click: this.click
        })
        if(this.canListen){
         this.scroll.on('scroll',(pageY)=>{
           this.$emit('getY',pageY)
         })

       }
         if(this.pullup){
              this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
         }
         if(this.beforeScroll){
               this.scroll.on('beforeScrollStart', () => {
                this.scroll.on('blur')      
            })
         }
    },
     disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollToElement(){
           this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
      },

      scrollTo(x,y){
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      }
  },
  watch:{
      data(){
          setTimeout(()=>{
              this.refresh()
          },this.refreshDelay)
      }
  }
}

</script>
<style lang='scss' scoped>
</style>