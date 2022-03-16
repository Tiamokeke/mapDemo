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
 let bdary = "";
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
     centerPosition:"",//中心点
    };
  },
  methods: {
    init() {
      BMap = window.BMap;
      map = new BMap.Map("allmap");
      bdary=new BMap.Boundary();
      point = new BMap.Point(119.89491433353, 31.804447517539);
      map.centerAndZoom(point, 5);
      map.enableScrollWheelZoom();
      this.getLevel();
      this.getProvince();

      //  map.setMapStyleV2({
      //   styleId: "00e3cbee35c1b592b84911d05840556e",
      // });
    },

    //wgs坐标系转成百度坐标系
    transformlat(lng, lat) {
      const PI = 3.1415926535897932384626;
      let ret =
        -100.0 +
        2.0 * lng +
        3.0 * lat +
        0.2 * lat * lat +
        0.1 * lng * lat +
        0.2 * Math.sqrt(Math.abs(lng));
      ret +=
        ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
          2.0) /
        3.0;
      ret +=
        ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) *
          2.0) /
        3.0;
      ret +=
        ((160.0 * Math.sin((lat / 12.0) * PI) +
          320 * Math.sin((lat * PI) / 30.0)) *
          2.0) /
        3.0;
      return ret;
    },
    transformlng(lng, lat) {
      const PI = 3.1415926535897932384626;
      let ret =
        300.0 +
        lng +
        2.0 * lat +
        0.1 * lng * lng +
        0.1 * lng * lat +
        0.1 * Math.sqrt(Math.abs(lng));
      ret +=
        ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
          2.0) /
        3.0;
      ret +=
        ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) *
          2.0) /
        3.0;
      ret +=
        ((150.0 * Math.sin((lng / 12.0) * PI) +
          300.0 * Math.sin((lng / 30.0) * PI)) *
          2.0) /
        3.0;
      return ret;
    },
    toBD(lng, lat) {
      const xPI = (3.14159265358979324 * 3000.0) / 180.0;
      const PI = 3.1415926535897932384626;
      const a = 6378245.0;
      const ee = 0.00669342162296594323;
      // WGS84转GCj02
      let dlat = this.transformlat(lng - 105.0, lat - 35.0);
      let dlng = this.transformlng(lng - 105.0, lat - 35.0);
      let radlat = (lat / 180.0) * PI;
      let magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      let sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
      dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
      let mglat = lat + dlat;
      let mglng = lng + dlng;
      // 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
      let z =
        Math.sqrt(mglng * mglng + mglat * mglat) +
        0.00002 * Math.sin(mglat * xPI);
      let theta = Math.atan2(mglat, mglng) + 0.000003 * Math.cos(mglng * xPI);
      let bdlng = z * Math.cos(theta) + 0.0065;
      let bdlat = z * Math.sin(theta) + 0.006;
      // return [bdlng, bdlat]
      return { lng: bdlng, lat: bdlat };
    },
    getBoundary(value) {
      for (var i = 0; i < value.length; i++) {
        var cenLon = "";
        var cenLat = "";
        bdary.get(value[i], function (rs) {
          //获取行政区
          var count = rs.boundaries.length;
          if (count === 0) {
            return;
          }
          var list = rs.boundaries.fill().map(() => {
            return [100 + Math.random(), 30 + Math.random()];
          });
          let lonMin = Math.min(...list.map((item) => item[0]));
          let latMin = Math.min(...list.map((item) => item[1]));
          let lonMax = Math.max(...list.map((item) => item[0]));
          let latMax = Math.max(...list.map((item) => item[1]));
          cenLon = (parseFloat(lonMax) + parseFloat(lonMin)) / 2;
          cenLat = (parseFloat(latMax) + parseFloat(latMin)) / 2;
          this.centerPosition={lng:cenLon,lat:cenLat};
          console.log(this.centerPosition,"this.centerPosition");
          var ply;
          for (var i = 0; i < count; i++) {
            ply = new BMap.Polygon(rs.boundaries[i], {
              strokeWeight: 0.5,
              strokeColor: "#B6B7BA",
              fillColor: "",
              fillOpacity: "1",
            }); //建立多边形覆盖物
            map.addOverlay(ply); //添加覆盖物
          }
        //    ply.addEventListener("mouseover", function () {
             
        //   //    ply.setFillColor("blue");//设置颜色
        //   // ply.setFillOpacity(0.7); //设置的是色块的透明度。
        // });
        });
      }
      var labelProvince = new BMap.Label(value[i], {
        offset: new BMap.Size(1, -1),
        position: new BMap.Point(cenLon, cenLat),
      });
      map.addOverlay(labelProvince);
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
        } else if (that.zoom >= 10 && that.zoom <= 21) {
          map.clearOverlays();
          that.getStation();
          if (that.zoom >= 10 && that.zoom <= 14) {
            that.getCountry();
            if (that.zoom >= 11 || that.zoom == 14) {
              that.getRailways();
            }
          } else {
            that.getRailways();
          }
        } else {
          map.clearOverlays();
          that.getProvince();
        }
      });
    },
    // //鼠标移入地图时该行政区域高亮
    // mouseover(area) {
    //
    //},
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
      // this.getBoundary(this.provinceNameArr);
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
          var bd = this.toBD(item.lng, item.lat);
          console.log(bd, "bd");
          this.polylinePath.push(new BMap.Point(bd.lng, bd.lat));
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
        var bd = this.toBD(item.loc.lng, item.loc.lat);
        var marker = new BMap.Marker(new BMap.Point(bd.lng, bd.lat)); //创建标注
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

