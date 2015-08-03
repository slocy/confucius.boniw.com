// initial the map point data.
var mapData = [];
var mapGeoCoord = {};
var myChart;
var ecConfig;
var zrEvent;

function initial(){
    for (var i = 0; i <= points.length - 1; i++) {
        if(points[i].geo === undefined) continue;

        // build the map points.
        var point = {
            name: points[i].name,
            value: "<div class='desc'><p>" + points[i].desc + "</p><br/>",
            speech:points[i].speech
    }

        if(points[i].images.length > 0){
            for (var j = 0; j <= points[i].images.length - 1; j++) {
                point.value += "<img src='" + points[i].images[j] +  "'></img><br/>";
            };
        }

        point.value += "</div>";

        mapData.push(point);

        // revert the X/Y by suit for Google Map Data.
        var revert = 0;
        revert = points[i].geo[0];
        points[i].geo[0] = points[i].geo[1];
        points[i].geo[1] = revert;

        // build the map point geo coord.
        mapGeoCoord[points[i].name] = points[i].geo;
    };
};

initial();


// Step:3 conifg ECharts's path, link to echarts.js from current page.
// Step:3 为模块加载器配置echarts的路径，从当前页面链接到echarts.js，定义所需图表路径
require.config({
    paths: {
        echarts: './js'
    }
});

// Step:4 require echarts and use it in the callback.
// Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径
require(
    [
        'echarts',
        'echarts/chart/map'
    ],
    function (ec) {
        // --- 地图 ---
        myChart = ec.init(document.getElementById('mapBody'));
        //设置点击事件
        ecConfig = require('echarts/config');

        myChart.on(ecConfig.EVENT.CLICK, function (point) {
            //do something for current point.
            if ($("#speech").size() > 0)
                $("#speech")[0].pause();
            $("#speech").remove();

            //play speech
            $("#mapBody").after("<audio id='speech' src='" + point.data.speech + "' />");
            
            $("#speech")[0].load();
            $("#speech")[0].play();

        });

        myChart.setOption(mapOption);

    }
);

mapOption = {
    title : {
        text: '孔子学院世界分布图',
        subtext: '',
        sublink: '',
        x:'center',
        y:'top',
    },

    tooltip : {
        trigger: 'item',
        formatter: function (params) {
            return params.name + (params.value == '-' ? '': params.value);
        }
    },

    series : [
        {
            name: 'Confucius',
            selectedMode: null,
            type: 'map',
            mapType: 'world',
            hoverable: false,
            mapLocation : {x:'center',y:'center'},
            roam: true,
            data : [],
            scaleLimit: {max:3.5, min:1},
            markPoint : {
                clickable : true,
                symbolSize: function(obj){
                    return 10;
                },
                symbolRotate : 0,
                large : false,
                effect: {
                    show: false,
                    type: 'scale',
                    loop: true,
                    period: 50,
                    scaleSize : 2,
                    bounceDistance: 3,
                    color : 'rgba(0,0,0)',
                    shadowColor : null,
                    shadowBlur : 0
                },
                itemStyle: {
                    normal: {
                        color: '#170',
                        borderColor: '#87cefa',
                        borderWidth: 1,            // 标注边线线宽，单位px，默认为1
                        label: {
                            show: false
                        }
                    },
                    emphasis: {
                        borderColor: '#1e90ff',
                        borderWidth: 5,
                        label: {
                            show: false
                        }
                    }
                },
                data : mapData,
            },
            geoCoord: mapGeoCoord,
        }
    ]
};