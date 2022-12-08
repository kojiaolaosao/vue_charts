<template>
    <el-container>
        <el-header>
            <el-menu default-active="home" mode="horizontal" :ellipsis="false" :collapse-transition="false"
                     popper-effect="dark" router>
                <el-menu-item  index="about">首页</el-menu-item>
                <div class="flex-grow" />
                <el-sub-menu  index="UserBack">
                    <template #title >
                        <el-avatar size="default" src=""></el-avatar>
                    </template>
                    <el-menu-item index="UserInfo">个人中心</el-menu-item>
                    <el-menu-item >退出</el-menu-item>
                    <el-menu-item>登录/注册</el-menu-item>
                </el-sub-menu>
                <el-menu-item >
                    <span @click.stop="toggleDark()">暗黑模式</span>
                    <el-switch size="small" v-model="isDark"/>
                </el-menu-item>
            </el-menu>
        </el-header>
        <el-main style="border: 1px solid black">
            <div id="show_scores" style="width: 900px;height:400px;border: 1px solid black;left: 10%"></div>
        </el-main>
    </el-container>

</template>
<script>
import * as ECharts from 'echarts';
import axios from "axios";
import {useToggle} from "@vueuse/shared";
import {useDark} from "@vueuse/core";

export default {
    name: 'show_carve',
    setup() {
        const isDark = useDark()
        const toggleDark = useToggle(isDark)
        return{
            isDark,
            toggleDark
        }
    },
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
<style>
.flex-grow {
    flex-grow: 1;
}
</style>