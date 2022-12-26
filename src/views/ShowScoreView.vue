<template>
<div>
    <div id="show_scores" style="width: 900px;height:400px;border: 1px solid black;left: 10%"></div>
</div>
</template>

<script>
import * as ECharts from 'echarts';

export default {
    name: "ShowScoreView",
    data() {
        return {

        }
    },
    mounted() {
        this.drawChart();
    },
    methods: {
        drawChart() {
            // 基于准备好的dom，初始化echarts实例
            // axios.get('/student/update').then(res => {
            //   console.log(res.data.data)
            // })
            let myChart = ECharts.init(document.getElementById("show_scores"));
            // 指定图表的配置项和数据
            let option = {
                title: {
                    text: "马奇伟第二学期成绩",
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {type: 'cross'}
                },
                legend: {
                    data: ["语文成绩"]
                },
                xAxis: {
                    data: ["期初", "月考", "期中", "月考", "模拟考", "期末"]
                },
                yAxis: {
                    type: "value",
                    name: "分数",
                    min: 0,
                    max: 130,
                    position: 'left',
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                series: [
                    {
                        name: "语文成绩",
                        type: "line",
                        data: [5, 20, 36, 10, 10, 20]
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }
    }
}
</script>

<style scoped>

</style>