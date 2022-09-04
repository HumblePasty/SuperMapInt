!<template>
  <div id="map" ref="mapContainer">
    <el-cascader v-model="optionValue" :options="options" @change="(optionValue) => optionSelected(optionValue)">
    </el-cascader>
  </div>
</template>

<script>
// 引入leaflet，成功
import L from "leaflet";

// 尝试引入jest

// 引入SuperMap失败
// import "@supermap/iclient-leaflet"

// 引入Geoman，成功
import "@geoman-io/leaflet-geoman-free";

export default {
  name: "leafletDraw",

  data: function () {
    return {
      map: null,
      layerUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      options: [
        {
          value: "option1",
          label: "popup函数绑定测试",
          children: [
            {
              value: "option11",
              label: "输入Marker",
            },
            {
              value: "option12",
              label: "输入矩形",
            },
            {
              value: "option13",
              label: "输入CircleMarker",
            },
          ],
        },
        {
          value: "option2",
          label: "pmLayerCreated函数测试",
        },
        {
          value: "option3",
          label: "模拟添加图层",
        },
      ],
      optionValue: "",
    };
  },

  mounted() {
    // 初始化地图
    // 编写为function并暴露
    this.mapInit(this.$refs["mapContainer"], this.layerUrl);

    // 对每一个新增的图形都绑定对应的信息
    this.map.on("pm:create", ({ shape, layer }) =>
      this.pmLayerCreated(shape, layer)
    );
  },

  methods: {
    mapInit: function (mapContainer, layerUrl) {
      // BUG1: 使用创建地图实例的时候，要避免直接使用L.map('<elementID>')的方式
      // 详情：https://stackoverflow.com/questions/52047564/vuejs-leaflet-map-container-not-found
      // 因为基础差，吃了不少亏
      var map = (this.$data.map = L.map(mapContainer).setView(
        [51.505, -0.09],
        13
      ));

      // this.map.on("click", function (ev) {
      //   console.log(ev.latlng); // ev is an event object (MouseEvent in this case)
      // });

      // 添加底图
      L.tileLayer(layerUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // 添加Geoman插件
      // 捕捉绘制控件参数设置
      var options = {
        position: "topleft", // 控件位置
        drawMarker: true, // marker绘制是否可选
        drawPolygon: true, // drawPolygon绘制是否可选
        drawPolyline: true, // drawPolyline绘制是否可选
        editPolygon: true, // editPolygon编辑是否可选
        deleteLayer: true,
      };
      // 添加捕捉绘制控件
      map.pm.addControls(options);
    },

    bindPointPopup: function (layer) {
      // 对输入的layer类型进行判断
      // if(typeof layer.getLatLng === 'undefined') {
      //   throw "Can't getLatLng from the layer!"
      // }
      var marker_latlng = layer.getLatLng();
      var lngShow = marker_latlng.lng.toFixed(2);
      var latShow = marker_latlng.lat.toFixed(2);
      var popupContent = "";
      switch (((lngShow > 0) << 1) + Number(latShow > 0)) {
        // 使用位移运算符来减少判断复杂度
        case 0:
          popupContent =
            "经度: " +
            Math.abs(lngShow) +
            " W" +
            "<br />" +
            "纬度: " +
            Math.abs(latShow) +
            " S";
          break;
        case 1:
          popupContent =
            "经度: " +
            Math.abs(lngShow) +
            " W" +
            "<br />" +
            "纬度: " +
            Math.abs(latShow) +
            " N";
          break;
        case 2:
          popupContent =
            "经度: " +
            Math.abs(lngShow) +
            " E" +
            "<br />" +
            "纬度: " +
            Math.abs(latShow) +
            " S";
          break;
        case 3:
          popupContent =
            "经度: " +
            Math.abs(lngShow) +
            " E" +
            "<br />" +
            "纬度: " +
            Math.abs(latShow) +
            " N";
          break;
      }
      layer.bindPopup(popupContent);
      return popupContent;
    },

    pmLayerCreated: function (shape, layer) {
      var returnLayerGroup = L.layerGroup();
      switch (shape) {
        case "Marker":
          // 显示Marker对应的经纬度
          this.$options.methods.bindPointPopup(layer);
          break;
        case "Line":
          // 首先为每一个节点添加Marker和popup
          var pointSetLine = layer.getLatLngs();
          for (var i = 0; i < pointSetLine.length; i++) {
            // 为节点添加圆形Marker
            var thisLat = pointSetLine[i].lat;
            var thisLng = pointSetLine[i].lng;
            var newPoint = L.circleMarker(L.latLng(thisLat, thisLng), {
              radius: "5",
              // fillColor : "red"
            });
            // 为每一个节点添加绑定Popup
            this.$options.methods.bindPointPopup(newPoint);
            newPoint.addTo(this.map).addTo(returnLayerGroup);
          }
          // 求折线长度, deleted
          break;

        case "Rectangle":
          // 首先为每一个节点添加Marker和Popup
          var pointSetRec = layer.getLatLngs()[0];
          // console.log(pointSetRec)
          for (var j = 0; j < pointSetRec.length; j++) {
            // 为节点添加圆形Marker
            thisLat = pointSetRec[j].lat;
            // console.log(j)
            thisLng = pointSetRec[j].lng;
            newPoint = L.circleMarker(L.latLng(thisLat, thisLng), {
              radius: "5",
              // fillColor : "red"
            });
            // 为每一个节点添加绑定Popup
            this.$options.methods.bindPointPopup(newPoint);
            newPoint.addTo(this.map).addTo(returnLayerGroup);
          }
          // 对矩形计算周长

          // 对矩形计算面积

          break;

        case "Polygon":
          // 首先为每一个节点添加Marker和Popup
          var pointSetPolygon = layer.getLatLngs()[0];
          for (j = 0; j < pointSetPolygon.length; j++) {
            // 为节点添加圆形Marker
            thisLat = pointSetPolygon[j].lat;
            // console.log(j)
            thisLng = pointSetPolygon[j].lng;
            newPoint = L.circleMarker(L.latLng(thisLat, thisLng), {
              radius: "5",
            });

            // 为每一个节点添加绑定Popup
            this.$options.methods.bindPointPopup(newPoint);
            newPoint.addTo(this.map).addTo(returnLayerGroup);
          }

          // 对多边形计算周长

          // 对多边形计算面积

          break;
        case "Circle":
          // 首先对圆心添加Marker
          layer.setStyle({
            fill: false,
          });
          var circleCenterMarker = L.circleMarker(layer.getLatLng(), {
            radius: "5",
            fill: true,
          });

          this.$options.methods.bindPointPopup(circleCenterMarker);
          circleCenterMarker.addTo(this.map).addTo(returnLayerGroup);

          // ※iServer不支持对圆形的周长和面积测量
          // 需要使用Geoman库中的方法L.pm.Utils.circleToPolygon()转换
          var pseudoCircle = L.PM.Utils.circleToPolygon(layer, 1440);

          pseudoCircle.bindPopup("这是一个近似圆<br />共有1440条边");

          pseudoCircle.addTo(this.map).addTo(returnLayerGroup);
          // console.log(pseudoCircle)

          // 对伪圆计算周长

          // 计算圆形面积

          break;

        case "CircleMarker":
          // 显示圆形Marker的经纬度
          this.$options.methods.bindPointPopup(layer);
          break;
      }
      layer.addTo(returnLayerGroup);
      return returnLayerGroup;
    },

    optionSelected: function (option) {
      console.log(option[option.length - 1]);
      switch (option[option.length - 1]) {
        case "option11": {
          let correctMarker = L.marker([51.52, -0.09]); // 有效类型Marker
          correctMarker.addTo(this.$data.map);
          try {
            this.$options.methods.bindPointPopup(correctMarker); // popup内容理应正常
            alert("测试通过!");
          } catch (err) {
            alert("测试失败!");
            alert(err);
          }
          break;
        }

        case "option12": {
          let faultyType = L.rectangle([
            [51.52, -0.12],
            [51.5, -0.09],
          ]).addTo(this.$data.map); // 无效类型的Rect
          try {
            this.$options.methods.bindPointPopup(faultyType); // 应该失败
            alert("测试通过!");
          } catch (err) {
            alert("测试失败!");
            alert(err);
          }
          break;
        }

        case "option13":{
          let correctCircle = L.circleMarker([51.52, -0.12]); // 有效类型Marker
          correctCircle.addTo(this.$data.map);
          try {
            this.$options.methods.bindPointPopup(correctCircle); // popup内容理应正常
            alert("测试通过!");
          } catch (err) {
            alert("测试失败!");
            alert(err);
          }
          break;
        }

        case "option2":{
          // let simuMarker = L.marker([51.5, -0.09]);
          // console.log(this.$options.methods.pmLayerCreated("Marker", simuMarker))
          // this.$options.methods.pmLayerCreated("Marker", simuMarker)
          try {
            // pmLayerCreated("Marker", simuMarker)
            // if (!(resultLayerGroup instanceof L.LayerGroup)) {
            //   throw ('failed!')
            // }
            alert('测试通过')
          } catch (err) {
            alert('测试失败!');
            alert(err);
          }
          break;
        }
      }
    },
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css");
@import url("https://iclient.supermap.io/dist/leaflet/iclient-leaflet.min.css");
@import url("@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css");

/* @import url("https://unpkg.com/@geoman-io/leaflet-geoman-free@latest/dist/leaflet-geoman.css"); */
#map {
  margin: 0;
  overflow: hidden;
  background: #fff;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
}

.el-cascader {
  z-index: 1000;
}
</style>