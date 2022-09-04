var url = "https://iserver.supermap.io";
var China = new L.supermap.TiledMapLayer(url + '/iserver/services/map-china400/rest/maps/China', { noWrap: true });
var ChinaDark = new L.supermap.TiledMapLayer(url + '/iserver/services/map-china400/rest/maps/ChinaDark', { noWrap: true });
// 初始化地图
var map = L.map('map', {
    center: { lon: 0, lat: 0 },
    maxZoom: 18,
    zoom: 2,
    zoomControl: false,
    layers: [China, ChinaDark]
});
var baseMaps = { "China": China, "ChinaDark": ChinaDark };
// 添加图层切换控件
L.control.layers(baseMaps).addTo(map);

// 往下开始通过leaflet-draw插件完成简单绘图功能，失败，有bug
// 创建一个绘制图层
// var editableLayers = new L.FeatureGroup();
// 绘制控件参数配置
// var options = {
//     position: 'topleft',
//     draw: {
//         polyline: {}, // 线
//         polygon: {}, // 面
//         circle: {}, // 圆
//         rectangle:{}, // 矩形
//         marker: {}, // 标记点
//         remove: {}
//     },
//     edit: {
//         featureGroup: editableLayers,
//         remove: true
//     }
// };
// 创建并添加绘制控件
// var drawControl = new L.Control.Draw(options);
// map.addControl(drawControl);
// 监听绘制事件
// map.on(L.Draw.Event.CREATED, function (e) {
//     var type = e.layerType, layer = e.layer;
//     editableLayers.addLayer(layer);
// });

// 本次DEMO均使用Geoman插件完成
// 捕捉绘制控件参数设置
var options = {
    position: 'topleft', // 控件位置
    drawMarker: true, // marker绘制是否可选
    drawPolygon: true, // drawPolygon绘制是否可选
    drawPolyline: true, // drawPolyline绘制是否可选
    editPolygon: true, // editPolygon编辑是否可选
    deleteLayer: true
};
// 添加捕捉绘制控件
map.pm.addControls(options);

function bindPointPopup (layer) {
    var marker_latlng = layer.getLatLng();
    var lngShow = marker_latlng.lng.toFixed(2);
    var latShow = marker_latlng.lat.toFixed(2);
    // console.log(lngShow > 0)
    switch (lngShow > 0) {
        case true:
            switch (latShow > 0) {
                case true:
                    layer.bindPopup('经度: ' + Math.abs(lngShow) + ' E' + '<br />' + '纬度: ' + Math.abs(latShow) + ' N');
                    break;
                case false:
                    layer.bindPopup('经度: ' + Math.abs(lngShow) + ' E' + '<br />' + '纬度: ' + Math.abs(latShow) + ' S');
                    break;
            }
            break;
        case false:
            switch (latShow > 0) {
                case true:
                    layer.bindPopup('经度: ' + Math.abs(lngShow) + ' W' + '<br />' + '纬度: ' + Math.abs(latShow) + ' N');
                    break;
                case false:
                    layer.bindPopup('经度: ' + Math.abs(lngShow) + ' W' + '<br />' + '纬度: ' + Math.abs(latShow) + ' S');
                    break;
            }
            break
    }
}

// 完成距离量算功能
// 对每一个新增的图形都绑定对应的信息
map.on('pm:create', ({ shape, layer }) => {
    switch (shape) {
        case 'Marker':
            // 显示Marker对应的经纬度
            bindPointPopup(layer);
            break;
        
        case 'Line':
            // 首先为每一个节点添加Marker和popup
            var pointSetLine = layer.getLatLngs();
            for (var i = 0; i < pointSetLine.length; i++) {
                // 为节点添加圆形Marker
                var thisLat = pointSetLine[i].lat;
                var thisLng = pointSetLine[i].lng;
                var newPoint = L.circleMarker(L.latLng(thisLat, thisLng), {
                    radius : "5",
                    // fillColor : "red"
                })
                newPoint.addTo(map)
                // console.log(newPoint)
                // 为每一个节点添加绑定Popup
                bindPointPopup(newPoint)
            }

            // 求折线长度

            // 首先构建距离计算参数
            var distanceMeasureParam = new L.supermap.MeasureParameters(L.polyline([pointSetLine]));// 尝试一下直接输入点集
            distanceMeasureParam.unit = L.supermap.Unit.METER;
            var measureService = new L.supermap.MeasureService("https://iserver.supermap.io/iserver/services/map-world/rest/maps/World");
            // 发送请求
            measureService.measureDistance(distanceMeasureParam, function (serviceResult) {
                // 结果是输出折线的总长度
                var result = serviceResult.result

                // 绑定Popup
                if (result.succeed) {
                    layer.bindPopup('总长度: ' + result.distance + ' 米')
                }
                else {
                    layer.bindPopup('距离计算失败!')
                }
                // 设置样式
                layer.setStyle({
                    color : 'red'
                })
            })
            
            // 下面想法是想对每一条线段求长度，因为异步还没有学到，目前有bug
            // var i = 0;
            // for (var i = 0; i < pointSetLine.length - 1; i++) {
            //     // 构造距离计算请求参数
            //     var distanceMeasureParam = new L.supermap.MeasureParameters(L.polyline([pointSetLine[i], pointSetLine[i + 1]]));
            //     // console.log(pointSetLine[i + 1])
            //     distanceMeasureParam.unit = L.supermap.Unit.METER;
            //     var distanceCalcUrl = "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World";
            //     //初始化服务类，设置服务请求关键参数
            //     var measureService = new L.supermap.MeasureService(distanceCalcUrl);
            //     //提交服务请求，传递服务查询参数，获取返回结果并按照用户需求进行处理
            //     measureService.measureDistance(distanceMeasureParam, function (serviceResult) {
            //         // 构建线段
            //         var iterLine = L.polyline([pointSetLine[i], pointSetLine[i + 1]], {
            //             color : 'red'
            //         });
            //         iterLine.addTo(map);
            //         // 获取服务器返回的结果
            //         var result = serviceResult.result;
            //         console.log(result)
            //         // 绑定Popup
            //         if (result.succeed) {
            //             iterLine.bindPopup('长度: ' + result.distance + ' 米')
            //         }
            //         else {
            //             iterLine.bindPopup('距离计算失败!')
            //         }
            //     });
            // }
            
            break;
        case 'Rectangle':
            // 首先为每一个节点添加Marker和Popup
            var pointSetRec = layer.getLatLngs()[0];
            // console.log(pointSetRec)
            for (var j = 0; j < pointSetRec.length; j++) {
                // 为节点添加圆形Marker
                var thisLat = pointSetRec[j].lat;
                // console.log(j)
                var thisLng = pointSetRec[j].lng;
                var newPoint = L.circleMarker(L.latLng(thisLat, thisLng), {
                    radius : "5",
                    // fillColor : "red"
                })
                newPoint.addTo(map)
                // console.log(newPoint)
                // 为每一个节点添加绑定Popup
                bindPointPopup(newPoint)
            }
            // 对矩形计算周长
            var distanceMeasureParam = new L.supermap.MeasureParameters(layer);// 尝试一下直接输入layer
            distanceMeasureParam.unit = L.supermap.Unit.METER;
            var measureService = new L.supermap.MeasureService("https://iserver.supermap.io/iserver/services/map-world/rest/maps/World");
            // 发送请求
            measureService.measureDistance(distanceMeasureParam, function (serviceResult) {
                var result = serviceResult.result
                // console.log(result)
                // 首先构建边长的Line对象
                pointSetRec.push(pointSetRec[0])
                var recBorderLine = L.polyline([pointSetRec], {
                    color : 'green'
                })
                // console.log(recBorderLine)
                recBorderLine.addTo(map)

                // 绑定Popup
                if (result.succeed) {
                    recBorderLine.bindPopup('周长: ' + result.distance.toFixed(2) + ' 米')
                }
                else {
                    recBorderLine.bindPopup('距离计算失败!')
                }

            })

            // 对矩形计算面积
            var areaMeasureParam = new L.supermap.MeasureParameters(layer)
            var measureService = new L.supermap.MeasureService("https://iserver.supermap.io/iserver/services/map-world/rest/maps/World")
            // 发送请求
            measureService.measureArea(areaMeasureParam, function (serviceResult) {
                var result = serviceResult.result;
                // console.log(result)

                // 绑定Popup
                if(result.succeed) {
                    layer.bindPopup('面积: ' + result.area.toFixed(2) + ' 米<sup>2</sup>')
                }
                else {
                    layer.bindPopup('面积计算失败!')
                }
            })
            // 设置样式
            layer.setStyle({
                color: 'red'
            })

            break;

        case 'Polygon':
            // 首先为每一个节点添加Marker和Popup
            var pointSetPolygon = layer.getLatLngs()[0];
            // console.log(pointSetPolygon)
            for (var j = 0; j < pointSetPolygon.length; j++) {
                // 为节点添加圆形Marker
                var thisLat = pointSetPolygon[j].lat;
                // console.log(j)
                var thisLng = pointSetPolygon[j].lng;
                var newPoint = L.circleMarker(L.latLng(thisLat, thisLng), {
                    radius : "5",
                })
                newPoint.addTo(map)
                // 为每一个节点添加绑定Popup
                bindPointPopup(newPoint)
            }

            // 对多边形计算周长
            var distanceMeasureParam = new L.supermap.MeasureParameters(layer);// 尝试一下直接输入layer
            distanceMeasureParam.unit = L.supermap.Unit.METER;
            var measureService = new L.supermap.MeasureService("https://iserver.supermap.io/iserver/services/map-world/rest/maps/World");
            // 发送请求
            measureService.measureDistance(distanceMeasureParam, function (serviceResult) {
                var result = serviceResult.result
                // console.log(result)
                // 首先构建周长的Line对象
                // console.log(pointSetPolygon)
                pointSetPolygon.push(pointSetPolygon[0])
                var recBorderLine = L.polyline([pointSetPolygon], {
                    color : 'green'
                })
                // console.log(recBorderLine)
                recBorderLine.addTo(map)

                // 绑定Popup
                if (result.succeed) {
                    recBorderLine.bindPopup('周长: ' + result.distance.toFixed(2) + ' 米')
                }
                else {
                    recBorderLine.bindPopup('距离计算失败!')
                }

            })

            // 对多边形计算面积
            var areaMeasureParam = new L.supermap.MeasureParameters(layer)
            var measureService = new L.supermap.MeasureService("https://iserver.supermap.io/iserver/services/map-world/rest/maps/World")
            // 发送请求
            measureService.measureArea(areaMeasureParam, function (serviceResult) {
                var result = serviceResult.result;

                // 绑定Popup
                if(result.succeed) {
                    layer.bindPopup('面积: ' + result.area.toFixed(2) + ' 米<sup>2</sup>')
                }
                else {
                    layer.bindPopup('面积计算失败!')
                }
            })
            // 设置样式
            layer.setStyle({
                color: 'red'
            })

            break;
        case 'Circle':

            // 首先对圆心添加Marker
            layer.setStyle({
                fill : false
            });
            var circleCenterMarker = L.circleMarker(layer.getLatLng(), {
                radius : '5',
                fill : true,
            });

            circleCenterMarker.addTo(map)
            bindPointPopup(circleCenterMarker)
            // console.log(circleCenterMarker.getPopup())

            // ※iServer不支持对圆形的周长和面积测量
            // 需要使用Geoman库中的方法L.pm.Utils.circleToPolygon()转换
            var pseudoCircle = L.PM.Utils.circleToPolygon(layer, 1440)
            pseudoCircle.addTo(map)
            pseudoCircle.bindPopup('这是一个近似圆<br />共有1440条边')
            // console.log(pseudoCircle)

            // 对伪圆计算周长
            var distanceMeasureParam = new L.supermap.MeasureParameters(pseudoCircle);// 尝试一下直接输入layer
            distanceMeasureParam.unit = L.supermap.Unit.METER;
            var measureService = new L.supermap.MeasureService("https://iserver.supermap.io/iserver/services/map-world/rest/maps/World");
            // 发送请求
            measureService.measureDistance(distanceMeasureParam, function (serviceResult) {
                var result = serviceResult.result
                var circleBorderLine = L.circle(layer.getLatLng(), layer.getRadius(), {
                    fill : false,
                    color : 'green'
                })
                circleBorderLine.addTo(map)

                // 绑定Popup
                // 这里考虑直接绑定在原来的圆上，但是失败，后面再debug

                if (result.succeed) {
                    circleBorderLine.bindPopup('周长: ' + result.distance.toFixed(2) + ' 米')
                }
                else {
                    circleBorderLine.bindPopup('距离计算失败!')
                }
            })

            // 计算圆形面积
            var areaMeasureParam = new L.supermap.MeasureParameters(pseudoCircle)
            var measureService = new L.supermap.MeasureService("https://iserver.supermap.io/iserver/services/map-world/rest/maps/World")
            // 发送请求
            measureService.measureArea(areaMeasureParam, function (serviceResult) {
                var result = serviceResult.result;
                // console.log(result)

                // 新建一个填充伪圆图层
                var filledCircle = L.polygon([pseudoCircle.getLatLngs()],{
                    fill : true,
                    fillColor : 'red'
                });
                // console.log(filledCircle)
                filledCircle.addTo(map)

                // 将这个图层置底，不然会影响其他图层Popup的呼出
                filledCircle.bringToBack()

                // 绑定Popup
                if(result.succeed) {
                    filledCircle.bindPopup('面积: ' + result.area.toFixed(2) + ' 米<sup>2</sup>')
                }
                else {
                    filledCircle.bindPopup('面积计算失败!')
                }
                // console.log(filledCircle.getPopup())
            })

            break;

        case 'CircleMarker':
            // 显示圆形Marker的经纬度
            bindPointPopup(layer)
            break;
    }
})

// TBD:在元素被修改后更新对应的Popup
// map.on('pm:change', ({ shape, latlngs, shape}) => {

// })