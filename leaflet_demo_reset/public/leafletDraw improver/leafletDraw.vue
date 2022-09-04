!<template>
  <div id="map" ref="baseMap"></div>
</template>

<script>
// 引入leaflet，成功
import L from "leaflet";
// require('leaflet')

// 引入iClient，失败，因此使用CDN引入，是因为babel没有配置好？
import {SuperMap} from "@supermap/iclient-leaflet/index" // 但是全局引入就是不行

// 引入Geoman，成功
import "@geoman-io/leaflet-geoman-free";

export default {
  name: "leafletDraw",

  mounted: () => {
    var url = "https://iserver.supermap.io";
    var China = new L.supermap.tiledMapLayer(
      url + "/iserver/services/map-china400/rest/maps/China",
      { noWrap: false }
    );
    var ChinaDark = new L.supermap.tiledMapLayer(
      url + "/iserver/services/map-china400/rest/maps/ChinaDark",
      { noWrap: false }
    );
    // 初始化地图
    var map = L.map("map", {
      center: { lon: 0, lat: 0 },
      maxZoom: 18,
      zoom: 2,
      zoomControl: false,
      layers: [China, ChinaDark],
    });
    var baseMaps = { China: China, ChinaDark: ChinaDark };
    // 添加图层切换控件
    L.control.layers(baseMaps).addTo(map);

    // 添加supermap搜索
    L.supermap.components.search({
      position: "topleft"
    }).addTo(map)

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
    map.pm.addControls(options);

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

    // 完成距离量算功能
    // 对每一个新增的图形都绑定对应的信息
    map.on("pm:create", ({ shape, layer }) => {
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
            newPoint.addTo(map);
            // console.log(newPoint)
            // 为每一个节点添加绑定Popup
            bindPointPopup(newPoint);
          }

          // 求折线长度

          // 首先构建距离计算参数
          var distanceMeasureParam = new SuperMap.MeasureParameters(); // 尝试一下直接输入点集
          distanceMeasureParam.geometry = L.polyline([pointSetLine])
          distanceMeasureParam.unit = SuperMap.Unit.METER;
          var measureService = new L.supermap.measureService(
            "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World"
          );
          // 发送请求
          measureService.measureDistance(
            distanceMeasureParam,
            function (serviceResult) {
              // 结果是输出折线的总长度
              var result = serviceResult.result;

              // 绑定Popup
              if (result.succeed) {
                layer.bindPopup("总长度: " + result.distance + " 米");
              } else {
                layer.bindPopup("距离计算失败!");
              }
              // 设置样式
              layer.setStyle({
                color: "red",
              });
            }
          );

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
            newPoint.addTo(map);
            // console.log(newPoint)
            // 为每一个节点添加绑定Popup
            bindPointPopup(newPoint);
          }
          // 对矩形计算周长
          distanceMeasureParam = new SuperMap.MeasureParameters(); // 尝试一下直接输入layer
          distanceMeasureParam.geometry = layer
          distanceMeasureParam.unit = SuperMap.Unit.METER;
          measureService = new L.supermap.measureService(
            "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World"
          );
          // 发送请求
          measureService.measureDistance(
            distanceMeasureParam,
            function (serviceResult) {
              var result = serviceResult.result;
              // console.log(result)
              // 首先构建边长的Line对象
              pointSetRec.push(pointSetRec[0]);
              var recBorderLine = L.polyline([pointSetRec], {
                color: "green",
              });
              // console.log(recBorderLine)
              recBorderLine.addTo(map);

              // 绑定Popup
              if (result.succeed) {
                recBorderLine.bindPopup(
                  "周长: " + result.distance.toFixed(2) + " 米"
                );
              } else {
                recBorderLine.bindPopup("距离计算失败!");
              }
            }
          );

          // 对矩形计算面积
          var areaMeasureParam = new SuperMap.MeasureParameters(layer);
          measureService = new L.supermap.measureService(
            "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World"
          );
          // 发送请求
          measureService.measureArea(
            areaMeasureParam,
            function (serviceResult) {
              var result = serviceResult.result;
              // console.log(result)

              // 绑定Popup
              if (result.succeed) {
                layer.bindPopup(
                  "面积: " + result.area.toFixed(2) + " 米<sup>2</sup>"
                );
              } else {
                layer.bindPopup("面积计算失败!");
              }
            }
          );
          // 设置样式
          layer.setStyle({
            color: "red",
          });

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
            newPoint.addTo(map);
            // 为每一个节点添加绑定Popup
            bindPointPopup(newPoint);
          }

          // 对多边形计算周长
          distanceMeasureParam = new SuperMap.MeasureParameters(layer); // 尝试一下直接输入layer
          distanceMeasureParam.unit = SuperMap.Unit.METER;
          measureService = new L.supermap.measureService(
            "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World"
          );
          // 发送请求
          measureService.measureDistance(
            distanceMeasureParam,
            function (serviceResult) {
              var result = serviceResult.result;
              // console.log(result)
              // 首先构建周长的Line对象
              // console.log(pointSetPolygon)
              pointSetPolygon.push(pointSetPolygon[0]);
              var recBorderLine = L.polyline([pointSetPolygon], {
                color: "green",
              });
              // console.log(recBorderLine)
              recBorderLine.addTo(map);

              // 绑定Popup
              if (result.succeed) {
                recBorderLine.bindPopup(
                  "周长: " + result.distance.toFixed(2) + " 米"
                );
              } else {
                recBorderLine.bindPopup("距离计算失败!");
              }
            }
          );

          // 对多边形计算面积
          areaMeasureParam = new SuperMap.MeasureParameters(layer);
          measureService = new L.supermap.measureService(
            "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World"
          );
          // 发送请求
          measureService.measureArea(
            areaMeasureParam,
            function (serviceResult) {
              var result = serviceResult.result;

              // 绑定Popup
              if (result.succeed) {
                layer.bindPopup(
                  "面积: " + result.area.toFixed(2) + " 米<sup>2</sup>"
                );
              } else {
                layer.bindPopup("面积计算失败!");
              }
            }
          );
          // 设置样式
          layer.setStyle({
            color: "red",
          });

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

          circleCenterMarker.addTo(map);
          bindPointPopup(circleCenterMarker);
          // console.log(circleCenterMarker.getPopup())

          // ※iServer不支持对圆形的周长和面积测量
          // 需要使用Geoman库中的方法L.pm.Utils.circleToPolygon()转换
          var pseudoCircle = L.PM.Utils.circleToPolygon(layer, 1440);
          pseudoCircle.addTo(map);
          pseudoCircle.bindPopup("这是一个近似圆<br />共有1440条边");
          // console.log(pseudoCircle)

          // 对伪圆计算周长
          distanceMeasureParam = new SuperMap.MeasureParameters(
            pseudoCircle
          ); // 尝试一下直接输入layer
          distanceMeasureParam.unit = SuperMap.Unit.METER;
          measureService = new L.supermap.measureService(
            "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World"
          );
          // 发送请求
          measureService.measureDistance(
            distanceMeasureParam,
            function (serviceResult) {
              var result = serviceResult.result;
              var circleBorderLine = L.circle(
                layer.getLatLng(),
                layer.getRadius(),
                {
                  fill: false,
                  color: "green",
                }
              );
              circleBorderLine.addTo(map);

              // 绑定Popup
              // 这里考虑直接绑定在原来的圆上，但是失败，后面再debug

              if (result.succeed) {
                circleBorderLine.bindPopup(
                  "周长: " + result.distance.toFixed(2) + " 米"
                );
              } else {
                circleBorderLine.bindPopup("距离计算失败!");
              }
            }
          );

          // 计算圆形面积
          areaMeasureParam = new SuperMap.MeasureParameters(pseudoCircle);
          measureService = new L.supermap.measureService(
            "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World"
          );
          // 发送请求
          measureService.measureArea(
            areaMeasureParam,
            function (serviceResult) {
              var result = serviceResult.result;
              // console.log(result)

              // 新建一个填充伪圆图层
              var filledCircle = L.polygon([pseudoCircle.getLatLngs()], {
                fill: true,
                fillColor: "red",
              });
              // console.log(filledCircle)
              filledCircle.addTo(map);

              // 将这个图层置底，不然会影响其他图层Popup的呼出
              filledCircle.bringToBack();

              // 绑定Popup
              if (result.succeed) {
                filledCircle.bindPopup(
                  "面积: " + result.area.toFixed(2) + " 米<sup>2</sup>"
                );
              } else {
                filledCircle.bindPopup("面积计算失败!");
              }
              // console.log(filledCircle.getPopup())
            }
          );

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