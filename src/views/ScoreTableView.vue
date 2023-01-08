<template>
    <div>
        <h1>{{ recordInfo.title }}</h1>
        <div>
            <div>{{ recordInfo.info }}</div>
            <span style="font-size: small;color: #b4b4b4;">{{ recordInfo.createdTime }}</span>
        </div>
        <div>
            <el-table :data="scores" show-summary :summary-method="getSummaries">
                <el-table-column type="index" width="100"></el-table-column>
                <el-table-column sortable v-for="it in colItems" :prop="it.prop" :label="it.label"/>
            </el-table>
        </div>

    </div>
</template>

<script>
import axios from "@/axios";

export default {
    name: "ScoreTableView",
    data() {
        return {
            recordId: this.$route.query.id,
            recordInfo: {},
            scores: [],
            colItems: [
                {label:'姓名',prop:'name'},
                {label:'总分',prop:'totalScore'},
                {label:'语文',prop:'languages'},
                {label:'数学',prop:'maths'},
                {label:'英语',prop:'englishes'},
                {label:'附加',prop:'addition'},
                {label:'物理',prop:'physicals'},
                {label:'历史',prop:'history'},
                {label:'地理',prop:'geography'},
                {label:'地赋',prop:'geographyReal'},
                {label:'政治',prop:'politics'},
                {label:'政赋',prop:'politicsReal'},
                {label:'化学',prop:'chemicals'},
                {label:'化赋',prop:'chemicalsReal'},
                {label:'生物',prop:'biological'},
                {label:'生赋',prop:'biologicalReal'},
                {label:'班级名次',prop:'classRank'},
                {label:'年级排名',prop:'gradeRank'},
            ],
        }
    },
    mounted() {
        this.getScoreRecords();
    },
    methods: {
        getScoreRecords() {
            axios.get('/score/getScores/' + this.$route.query.id).then(res => {
                this.recordInfo = res.data.data;
                this.scores = res.data.data.recordEntities;
                // console.log(this.scores);
                this.filterItems();
            })
        },
        filterItems() {
            let map = new Map();
            for (let sk in this.scores[0]) {
                map.set(sk,false);
            }
            this.scores.forEach(s => {
                for (let sk in s) {
                    if (s[sk]!==0) map.set(sk,true);
                }
            })
            console.log(map);
            this.colItems=this.colItems.filter(it => {
                return map.get(it.prop);
            });
        },
        //合计行
        getSummaries(param) {
            const {columns, data} = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '平均分';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value)) && column.property !== 'gradeRank' && column.property !== 'classRank') {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value))
                            return prev + curr;
                        else
                            return prev;
                    }, 0);
                    sums[index] = Math.round(sums[index] / values.length * 100) / 100;
                } else {
                    sums[index] = ' ';
                }
            });

            return sums;
        },
    }
}
</script>

<style scoped>

</style>