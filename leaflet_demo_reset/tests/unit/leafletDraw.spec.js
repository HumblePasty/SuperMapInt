import { shallowMount, mount } from '@vue/test-utils'
import leafletDraw from "@/components/leafletDraw.vue"

describe('leafletDraw.spec.js Tests', () => {

  // 首先构造wrapper以及VM
  const wrapper = mount(leafletDraw)
  // const VM = wrapper.vm // wrapper的vm属性为Vue实例

  // 构建测试
  // Example 1：确定地图上的各个组件已经被正常的显示
  test('Components are shown correctly', () => {
    // 核心：使用find寻找元素，使用.not .toBeNull的expect后缀来进行断言
    // 断言部分见Jest说明Doc：https://jestjs.io/docs/expect

    // find函数内为CSS选择器，返回的是wrapper类型
    // wrapper类型说明Doc：https://v1.test-utils.vuejs.org/api/wrapper/#properties

    // 地图容器正常挂载，html()以String类型返回DOM的html
    expect(wrapper.find("#map").html()).not.toBeNull()

    // 通过判断地图容器是否被渲染为了leaflet-container类型来判断地图是否正常加载
    expect(wrapper.find("#map").element.getAttribute('class')).toContain('leaflet-container') // 通过wrapper的element属性访问HTML DOM

    // Geoman插件正常显示
    // 使用类选择器
    expect(wrapper.find(".leaflet-pm-toolbar")).not.toBeNull()

    // 确定图层切换已经正常加载
    // expect(wrapper.find("#map").html).not.toBeNull()
  })

  // mapInit方法的测试，本质上是在测试DOM是否正确加载
  // 因此不需要进行业务逻辑代码测试，直接使用Example 1中的方法就可以

  // Example 2：业务逻辑代码测试

  test("bindPointPopup method test", () => {

    // 分别测试输入正确和错误类型的layer的bindPointPopup结果
    
    var correctMarker = L.marker([30.514, 114.514])  // 有效类型Marker
    expect(wrapper.vm.bindPointPopup(correctMarker)).toContain('经度:') // popup内容理应正常

    var faultyType = L.rectangle([[54.559322, -5.767822], [56.1210604, -3.021240]]); // 无效类型的Marker
    expect(()=>{wrapper.vm.bindPointPopup(faultyType)}).toThrowError() // 理应返回错误，注意expect内函数调用的写法

  })

  test("pmLayerCreated method test", () => {
    // 此method在geoman插件完成图层绘制时触发，如果需要测试，首先应该模拟创建的图形
    var simuMarker = L.marker([30.514, 114.514])
    expect(wrapper.vm.pmLayerCreated("Marker", simuMarker)).toBeInstanceOf(L.LayerGroup) // 正常返回的类型是LayerGroup
  })

  // Example 3：模拟用户操作

  test('Layers are added correctly', () => {
    // 核心：使用trigger模拟用户触发的交互事件，使用选择器选择新加载图层，进行断言

    // 选中Draw Marker按钮:
    // 使用find(CSS Selector)寻找按钮
    const markerBtn = wrapper.find('[title="Draw Marker"] a')

    // 模拟触发绘制按钮
    markerBtn.trigger('click').then(() => {

      // 模拟地图鼠标点击
      const mapWrapper = wrapper.find('#map');
      mapWrapper.trigger('click', {
        clientX: 500,
        clientY: 500 // 指定鼠标位置
      }) // trigger函数：trigger('EventType:<String>, {<Options>}'), 后面的选项根据不同的Event类型不同

      // 验证新添加的图层是否正确
      // 通过Vue Model获取map对象
      wrapper.vm.map.eachLayer((iterLayer) => {
        if (iterLayer instanceof L.Marker) {
          var layerPopup = iterLayer.getPopup()
          if (layerPopup) { // 测试文件中，如果任何一个步骤报错都会当做测试不通过
            console.log(layerPopup.getContent())
            expect(layerPopup.getContent()).toContain('经度: ')
            // Note：可以尝试换成中文冒号，查看输出报告
          }
        }
      })

    })

    // 验证其他按钮同理
  })
})

