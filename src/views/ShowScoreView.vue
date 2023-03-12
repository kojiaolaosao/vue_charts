<template>
    <div style="margin-top: 2%">
<!--        <div>-->
<!--            <el-select v-model="selectRecords" multiple size="large" placeholder="筛选考试场次">-->
<!--                <el-option-->
<!--                    v-for="(index,item) in sourceRecords"-->
<!--                    :label="item.title"-->
<!--                    :value="index">-->
<!--                </el-option>-->
<!--            </el-select>-->
<!--            <el-button size="large" type="default" style="margin-left: 1%" @click="selectOption"> 显示所选场次 </el-button>-->
<!--            <el-button size="large" type="default" style="margin-left: 1%" @click="selectOrder"> 显示最近5场 </el-button>-->
<!--        </div>-->
        <div id="show_scores" style="width: 100%;height:600px;margin-top: 2%"></div>
    </div>
</template>

<script>
import * as ECharts from 'echarts';
import axios from "@/axios";

export default {
    name: "ShowScoreView",
    data() {
        return {
            student_id: this.$route.query.id,
            subjects: null,
            subjectSeries: [],
            recordXAxis: [],
            student: null,
            records: [],
            sourceRecords:[],
            selectRecords:[],
            sourceData: null,
            my_echarts:null,
        }
    },
    mounted() {
        this.getAllScore();
    },
    methods: {
        getAllScore() {
            axios.get('/score/allScore/' + this.student_id).then(res => {
                this.sourceData = res.data.data;
                this.sourceRecords=res.data.data.records;
                this.dealData(this.sourceData);
            })
        },
        dealData(data) {
            console.log(data);
            this.subjects = data.scoreFieldZH;
            for (let k in data.scoreFields) {

                let yAIndex = 0;
                if (k === 'gradeRank')
                    yAIndex = 1;
                else if(k==='totalScore')
                    yAIndex = 2;
                else if (k === 'classRank')
                    yAIndex = 3;

                if (data.scoreFields[k]) {
                    // console.log(k+"  "+data.fieldEN2ZH[k]);
                    this.subjectSeries.push(
                        {
                            name: data.fieldEN2ZH[k],
                            type: "line",
                            data: data[k],
                            yAxisIndex: yAIndex,
                            // areaStyle:{},
                            // smooth: true,//平滑曲线
                        }
                    )
                }
            }
            // console.log(this.subjectSeries)

            data.records.forEach(r => {
                this.recordXAxis.push(r.title);
            })
            this.records = data.records;
            this.student = data.student;
            this.drawChart();
        },
        drawChart() {
            // 基于准备好的dom，初始化echarts实例
            // axios.get('/student/update').then(res => {
            //   console.log(res.data.data)
            // })
            let myChart = ECharts.init(document.getElementById("show_scores"));
            // 指定图表的配置项和数据
            let option = {
                title: {
                    text: '高' + this.student.grade + '/' + this.student.clazz + '班   ' + this.student.name + '成绩',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {type: 'cross'},
                    // 使用回调函数
                    formatter: ((params) => {
                        // console.log(params[0])
                        params.push({seriesName: '备注', value: this.records[params[0].dataIndex].info})

                        //params[0].name表示x轴数据
                        let str = params[0].name + '<br/>';

                        //params是数组格式
                        for (let item of params) {
                            //设置浮层图形的样式跟随图中展示的颜色
                            str += "<span style='font-weight: bold;display:inline-block;width:10px;height:10px;border-radius:10px;background-color:" + item.color + ";'>" +
                                "</span>" + "\t" + item.seriesName + "<span style='font-weight: bold;float: right'>" + item.value + '</span><br>'
                        }
                        return str;
                    })
                },
                legend: {
                    // data: ['总分','语文', '数学', '英语','附加','物理','历史','地理','地赋','政治','政赋','化学','化赋','生物','生赋','班级名次','年级排名',],
                    data: this.subjects,
                    // icon: 'roundRect',
                    icon: 'circle',
                    selected: {
                        '总分': true,
                        '语文': false,
                        '数学': false,
                        '英语': false,
                        '附加': false,
                        '物理': false,
                        '历史': false,
                        '地理': false,
                        '地赋': false,
                        '政治': false,
                        '政赋': false,
                        '化学': false,
                        '化赋': false,
                        '生物': false,
                        '生赋': false,
                        '班级名次': false,
                        '年级排名': false,
                    },
                    selector: true
                },
                xAxis: {
                    data: this.recordXAxis,
                },
                yAxis: [
                    {
                        type: "value",
                        name: "各科分数",
                        min: 0,
                        max: 150,
                        scale:true,
                        position: 'left',
                        axisLabel: {formatter: '{value} 分'},
                        minorTick: {
                            show: true
                        },
                        minorSplitLine: {
                            show: true
                        }
                    }, {
                        type: "value",
                        name: "总分",
                        min: 0,
                        max: 800,
                        position: 'right',
                        axisLabel: {formatter: '{value} 分'}
                    },
                    {
                        type: "value",
                        name: "排名",
                        min: 0,
                        max: 800,
                        inverse:true,
                        position: 'right',
                        offset:80,
                        axisLabel: {formatter: '{value} 名'}
                    },
                    {
                        type: "value",
                        name: "班级排名",
                        min: 0,
                        max: 60,
                        scale:true,
                        inverse:true,
                        position: 'left',
                        axisLabel: {formatter: '{value} 名'},
                        offset:60,
                    },
                ],
                series: this.subjectSeries,
                dataZoom: [
                    {
                        type: 'inside',
                        xAxisIndex: [0, 1],
                        start: 0,
                        end: 100
                    },
                    {
                        show: true,
                        xAxisIndex: [0, 1],
                        type: 'slider',
                        top: '92%',
                        start: 98,
                        end: 100
                    }
                ],
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option, true);

        },
        selectOption(){
            console.log(this.selectRecords);
            // this.dealData(this.sourceData);
        },
        selectOrder(){
            // this.dealData(this.sourceData);
        }
    }
}
</script>

<style scoped>

</style>