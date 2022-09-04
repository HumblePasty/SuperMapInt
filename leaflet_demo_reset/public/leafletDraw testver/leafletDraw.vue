!<template>
  <div id="map" ref="mapElement"></div>
</template>

<script>
// 引入leaflet，成功
import L from "leaflet";

// 引入SuperMap失败
// import "@supermap/iclient-leaflet"

// 引入Geoman，成功
import "@geoman-io/leaflet-geoman-free";

export default {
  name: "leafletDraw",

  data: function () {
    return {
      map: null,
    };
  },

  mounted() {
    // 初始化地图
    // console.log(SuperMap)

    // BUG1: 使用创建地图实例的时候，要避免直接使用L.map('<elementID>')的方式
    // 详情：https://stackoverflow.com/questions/52047564/vuejs-leaflet-map-container-not-found
    // 因为基础差，吃了不少亏
    this.map = L.map(this.$refs["mapElement"]).setView([51.505, -0.09], 13);

    // this.map.on("click", function (ev) {
    //   console.log(ev.latlng); // ev is an event object (MouseEvent in this case)
    // });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // 添加Marker和Popup
    // L.marker([51.5, -0.09])
    //   .addTo(this.map)
    //   .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
    //   .openPopup();

    // 本次DEMO均使用Geoman插件完成
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
    this.map.pm.addControls(options);

    function bindPointPopup(layer) {
      var marker_latlng = layer.getLatLng();
      var lngShow = marker_latlng.lng.toFixed(2);
      var latShow = marker_latlng.lat.toFixed(2);
      // console.log(lngShow > 0)
      switch (lngShow > 0) {
        case true:
          switch (latShow > 0) {
            case true:
              layer.bindPopup(
                "经度: " +
                  Math.abs(lngShow) +
                  " E" +
                  "<br />" +
                  "纬度: " +
                  Math.abs(latShow) +
                  " N"
              );
              break;
            case false:
              layer.bindPopup(
                "经度: " +
                  Math.abs(lngShow) +
                  " E" +
                  "<br />" +
                  "纬度: " +
                  Math.abs(latShow) +
                  " S"
              );
              break;
          }
          break;
        case false:
          switch (latShow > 0) {
            case true:
              layer.bindPopup(
                "经度: " +
                  Math.abs(lngShow) +
                  " W" +
                  "<br />" +
                  "纬度: " +
                  Math.abs(latShow) +
                  " N"
              );
              break;
            case false:
              layer.bindPopup(
                "经度: " +
                  Math.abs(lngShow) +
                  " W" +
                  "<br />" +
                  "纬度: " +
                  Math.abs(latShow) +
                  " S"
              );
              break;
          }
          break;
      }
    }

    // 对每一个新增的图形都绑定对应的信息
    this.map.on("pm:create", ({ shape, layer }) => {
      switch (shape) {
        case "Marker":
          // 显示Marker对应的经纬度
          bindPointPopup(layer);
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
            newPoint.addTo(this.map);
            // console.log(newPoint)
            // 为每一个节点添加绑定Popup
            bindPointPopup(newPoint);
          }

          // 求折线长度

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
            newPoint.addTo(this.map);
            // console.log(newPoint)
            // 为每一个节点添加绑定Popup
            bindPointPopup(newPoint);
          }
          // 对矩形计算周长

          // 对矩形计算面积

          break;

        case "Polygon":
          // 首先为每一个节点添加Marker和Popup
          var pointSetPolygon = layer.getLatLngs()[0];
          // console.log(pointSetPolygon)
          for (j = 0; j < pointSetPolygon.length; j++) {
            // 为节点添加圆形Marker
            thisLat = pointSetPolygon[j].lat;
            // console.log(j)
            thisLng = pointSetPolygon[j].lng;
            newPoint = L.circleMarker(L.latLng(thisLat, thisLng), {
              radius: "5",
            });
            newPoint.addTo(this.map);
            // 为每一个节点添加绑定Popup
            bindPointPopup(newPoint);
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

          circleCenterMarker.addTo(this.map);
          bindPointPopup(circleCenterMarker);

          // ※iServer不支持对圆形的周长和面积测量
          // 需要使用Geoman库中的方法L.pm.Utils.circleToPolygon()转换
          var pseudoCircle = L.PM.Utils.circleToPolygon(layer, 1440);
          pseudoCircle.addTo(this.map);
          pseudoCircle.bindPopup("这是一个近似圆<br />共有1440条边");
          // console.log(pseudoCircle)

          // 对伪圆计算周长

          // 计算圆形面积

          break;

        case "CircleMarker":
          // 显示圆形Marker的经纬度
          bindPointPopup(layer);
          break;
      }
    });
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
</style>