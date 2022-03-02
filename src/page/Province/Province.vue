<template>
  <baidu-map
    class="map"
    :center="center"
    :zoom="zoom"
    @ready="handler"
    :scroll-wheel-zoom="true"
  >
    <bm-boundary
      :name="provinceName"
      :strokeWeight="2"
      strokeColor="blue"
    ></bm-boundary>
  </baidu-map>
</template>
<script>
export default {
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 3,
      provinceArr: "",
      provinceName: "",
    };
  },
  methods: {
    handler({ BMap, map }) {
      console.log(BMap, map);
      this.center.lng = 116.404;
      this.center.lat = 39.915;
      this.zoom = 15;
    },
    getProvinceName() {
      this.provinceArr.map((item)=>{
          this.provinceName=item.name;
      })
    },
  },
   mounted() {
      const province = require("../../assets/json/province.json");
      this.provinceArr = province;
      console.log(this.provinceArr," this.provinceArr");
        this.getProvinceName();
        
    },
};
</script>
<style scoped>
.map {
  width: 100%;
  height: 800px;
}
</style>

