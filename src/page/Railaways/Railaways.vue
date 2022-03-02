<template>
    <baidu-map class="map" :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom="true">
         <bm-polyline :path="polylinePath" stroke-color="pink" :stroke-opacity="0.5" :stroke-weight="10"  ></bm-polyline>
    </baidu-map>
</template>
<script>
export default{

    data(){
        return {
            center: {lng: 0, lat: 0},
            zoom:3,
            polylinePath:[],
            railwaysArr:[],
        }
    },
    methods:{
        handler({BMap,map}){
            console.log(BMap,map);
            this.center.lng=116.404
            this.center.lat=39.915
            this.zoom=15
        },
        getPoints(){
             this.polylinePath=[];
            // this.railwaysArr.map((item)=>{
            //     this.polylinePath=item.geom;
            // })
            
            // console.log(this.polylinePath,"this.polylinePath");
              for(var i=0;i<this.railwaysArr.length;i++){
        this.polylinePath = [];
       this.polylinePath =this.railwaysArr[i].geom;
    }
        },
         updatePolylinePath (e) {
      this.polylinePath = e.target.getPath()
    },
    },
    mounted(){
       const railways=require('../../assets/json/railways.json');
       this.railwaysArr=railways;
       this.getPoints();
    }
}

</script>
<style scoped>
.map{
    width: 100%;
    height: 800px;
}
</style>

