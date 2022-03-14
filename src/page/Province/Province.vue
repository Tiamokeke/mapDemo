<template>
  <div id="allmap" class="allmap"></div>
</template>
<script src="https://api.map.baidu.com/api?v=3.0&ak=URGrmm3xDKuybv42Fb9rr0O1LMEN9Bvn"></script>
<script>
let map = {};
let BMap = {};
let point = "";
let lineColorList = [
  { lineColor: "#800000" },
  { lineColor: "#C71585" },
  { lineColor: "#8B008B" },
  { lineColor: "#D2691E" },
  { lineColor: "#B88860B" },
];
export default {
  data() {
    return {
      provinceArr: "",
      provinceName: "",
      railwaysArr: "",
      polylinePath: [], //轨道线点
      cityArr: [], //城市
      countryArr: [], //市区
      zoom: "", //缩放级别
      railwayLogo: "", //地铁图标
      stationArr: [], //铁路站点
      chengtieArr: [], //城铁站点
    };
  },
  methods: {
    init() {
      BMap = window.BMap;
      map = new BMap.Map("allmap");

      point = new BMap.Point(119.89491433353, 31.804447517539);
      map.centerAndZoom(point, 5);
      map.enableScrollWheelZoom();
      this.getLevel();
      this.getProvince();
      //  map.setMapStyleV2({
      //   styleId: "00e3cbee35c1b592b84911d05840556e",
      // });
    },

    getBoundary(value) {
      var bdary = new BMap.Boundary();
      for (var i = 0; i < value.length; i++) {
        bdary.get(value[i], function (rs) {
          //获取行政区
          var count = rs.boundaries.length;
          if (count === 0) {
            return;
          }
          // var pointArray = [];
          for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i], {
              strokeWeight: 2,
              fillColor: "",
              fillOpacity: "1",
            }); //建立多边形覆盖物
            map.addOverlay(ply); //添加覆盖物
            // pointArray = pointArray.concat(ply.getPath());
          }
          // map.setViewport(pointArray); //调整视野
        });
      }
    },
    //获取地图缩放级别
    getLevel() {
      var that = this;
      map.addEventListener("zoomend", function (e) {
        that.zoom = map.getZoom(); // 获取缩放级别
        console.log(that.zoom, "地图缩放级别");
        //根据地图的缩放级别触发不同的方法展示不同的区域或者地铁线
        if (that.zoom >= 7 && that.zoom <= 10) {
          map.clearOverlays();
          that.getCity();
          if (that.zoom >= 9) {
            that.getStation();
          }
        } else if (that.zoom >=10 && that.zoom <= 21) {
          map.clearOverlays();
          that.getStation();
          if (that.zoom >= 10 && that.zoom <= 14) {
            that.getCountry();
          } else if (that.zoom >= 11) {
            that.getRailways();
            if (that.zoom >= 13) {
              that.getRailways();
            }
          }
        } else {
          map.clearOverlays();
          that.getProvince();
        }
      });
    },
    //省份
    getProvince() {
      this.provinceNameArr = [];
      this.provinceArr.filter((item) => {
        this.provinceNameArr.push(item.name);
        var labelProvince = new BMap.Label(item.name, {
          offset: new BMap.Size(1, -1),
          position: new BMap.Point(
            item.geom[parseInt(item.geom.length / 2)].lng,
            item.geom[parseInt(item.geom.length / 2)].lat
          ),
        });
        map.addOverlay(labelProvince);
      });
      this.getLevel();
      this.getBoundary(this.provinceNameArr);
    },

    //画城市
    getCity() {
      var city = [];
      this.cityArr.filter((item) => {
        city.push(item.name);
        var labelCity = new BMap.Label(item.name, {
          offset: new BMap.Size(1, -1),
          position: new BMap.Point(
            item.geom[parseInt(item.geom.length / 2)].lng,
            item.geom[parseInt(item.geom.length / 2)].lat
          ),
        });
        map.addOverlay(labelCity);
      });
      this.getBoundary(city);
    },
    //画市区
    getCountry() {
      var country = [];
      this.countryArr.map((item) => {
        country.push(item.name);
        console.log(country, "country");
        var labelCountry = new BMap.Label(item.name, {
          offset: new BMap.Size(1, -1),
          position: new BMap.Point(
            item.geom[parseInt(item.geom.length / 2)].lng,
            item.geom[parseInt(item.geom.length / 2)].lat
          ),
        });
        map.addOverlay(labelCountry);
      });

      this.getBoundary(country);
    },

    //画地铁线
    getRailways() {
      this.polylinePath = [];
      for (var i = 0; i < this.railwaysArr.length; i++) {
        this.polylinePath = [];

        this.railwaysArr[i].geom.map((item) => {
          this.polylinePath.push(new BMap.Point(item.lng, item.lat));
        });
        //将地铁所有点分为5个部分，在每一个部分上添加标注
        var length = parseInt(this.polylinePath.length / 5);
        this.addPolyline(i);
        this.addMarker(this.railwaysArr[i].name, length);
      }
    },
    //增加折线
    addPolyline(index) {
      var polyline = new BMap.Polyline(this.polylinePath, {
        strokeColor: lineColorList[index % 5].lineColor,
        strokeWeight: 2,
        strokeOpacity: 0.5,
      });
      map.addOverlay(polyline); //增加折线
    },
    //增加标注
    addMarker(name, length) {
      var markerIncon = new BMap.Icon(this.railwayLogo, new BMap.Size(30, 30));
      var marker = new BMap.Marker(this.polylinePath[length], {
        icon: markerIncon,
      });
      map.addOverlay(marker);
      var label = new BMap.Label(name, { offset: new BMap.Size(9, 4) });
      label.setStyle({
        // 设置文本标注样式
        fontWeight: 500,
        fontSize: "12px",
        color: "#fff",
        backgroundColor: "red",
        borderRadius: "5px",
      });
      marker.setLabel(label); // 为标注添加文本标注
    },

    //画铁路站点
    getStation() {
      this.stationArr.forEach((item) => {
        var marker = new BMap.Marker(
          new BMap.Point(item.loc.lng, item.loc.lat)
        ); //创建标注
        map.addOverlay(marker); //增加标注
        var labelStation = new BMap.Label(item.name, {
          offset: new BMap.Size(1, -1),
        });
        labelStation.setStyle({
          borderRadius: "10px",
          color: "#fff",
          fontSize: "12px",
          background: "red",
          textAlign: "center",
          "z-index": 9999,
        });
        marker.setLabel(labelStation);
      });
    },
    //画城铁站点
    getChengTie() {
      this.chengtieArr.forEach((item) => {
        var marker = new BMap.Marker(
          new BMap.Point(item.loc.lng, item.loc.lat)
        ); //创建标注
        map.addOverlay(marker); //增加标注
        var labelStation = new BMap.Label(item.name, {
          offset: new BMap.Size(1, -1),
        });
        labelStation.setStyle({
          borderRadius: "10px",
          color: "#fff",
          fontSize: "12px",
          background: "blue",
          textAlign: "center",
          "z-index": 9999,
        });
        marker.setLabel(labelStation);
      });
    },
  },
  mounted() {
    this.railwayLogo = require("../../assets/railwayLogo.png");
    this.provinceArr = require("../../assets/json/province.json");
    this.railwaysArr = require("../../assets/json/railways.json");
    this.cityArr = require("../../assets/json/city.json");
    this.countryArr = require("../../assets/json/country-shanghai.json");
    var station = require("../../assets/json/station.json");
    //处理站点数据，划分铁路站点(普高，普铁)和城铁站点
    station.filter((item) => {
      if (item.function != "") {
        this.stationArr.push(item);
      }
    });
    station.filter((item) => {
      if (item.function == "") {
        this.chengtieArr.push(item);
      }
    });
    // console.log(this.chengtieArr, "this.stationArr");
    //    this.$axios.get('/country.json').then(res => {     // 获取public下的country.json文件数据
    //        this.countryArr=res.data;
    // })
    this.$nextTick(() => {
      this.init();
    });
  },
};
</script>
<style scoped>
.allmap {
  width: 100%;
  height: 100vh;
}
</style>

