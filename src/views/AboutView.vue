<template>
    <div class="about" style="margin-top: 2%">
        <div>
            <el-select v-model="searchGrade" class="m-2" placeholder="请选择年纪" size="large" clearable
                       style="float: left;width: 8%">
                <el-option
                    v-for="item in 3"
                    :key="item"
                    :label="'高'+item"
                    :value="item"
                />
            </el-select>
            <el-select v-model="searchClazz" class="m-2" placeholder="请选择班级" size="large" clearable
                       style="float: left;width: 8%;margin-left: 1%">
                <el-option
                    v-for="item in 20"
                    :key="item"
                    :label="item+'班'"
                    :value="item"
                />
            </el-select>
            <el-input size="large" style="width: 20%;float: left;display: inline-flex;margin-left: 1%"
                     clearable placeholder="请输入关键词" v-model="searchIn" @keyup.enter="searchRecord"></el-input>
            <el-button size="large" style="float: left;margin-left: 1%" @click="searchRecord">搜索</el-button>
        </div>
        <div>
            <div style="border: 1px solid black;width: 65%;margin-top:2%;float: left">
                <el-card class="box-card" v-for="item in records" style="padding-bottom: 1%">
                    <template #header>
                        <router-link :to="{path:'/scoreTable', query: { id: item.id }}">
                            <div class="card-header">
                                <span style="font-weight: bold">{{ item.title }}</span>
                            </div>
                        </router-link>
                    </template>
                    <div style="color: #b4b4b4">{{ item.grade + "/" }}{{ item.clazz }}班</div>
                    <div style="float: left">{{ item.info }}</div>
                    <div style="float: right;margin-right: 2%;font-size: 14px;color: #b4b4b4">{{ item.createdTime }}
                    </div>
                </el-card>
                <div style="margin: 1%;">
                    <el-pagination background layout="total,prev, pager, next" :pager-count="5"
                                   :page-size="page.size"
                                   :current-page="page.current"
                                   :total="page.total"
                                   @current-change="handleCurrentChange">
                    </el-pagination>
                </div>
            </div>
            <div style="border: 1px solid black;width: 30%;margin-top:2%;float: right">
                <h1 style="text-align: center">学生列表</h1>
                <el-card class="box-card" v-for="(item,i) in students" style="padding-bottom: 1%" shadow="never">
                    <div>{{ item.name }}</div>
                    <div style="color: #b4b4b4;float: left;font-size: small">{{ item.grade + "/" }}{{
                            item.clazz
                        }}班
                    </div>
                    <div style="float: right;margin-right: 2%;font-size: 14px;color: #b4b4b4">{{ item.createdTime }}
                    </div>
                </el-card>
                <div style="margin: 3%;">
                    <el-pagination background small layout="total, prev, pager, next" :pager-count="5"
                                   :page-size="sPage.size"
                                   :current-page="sPage.current"
                                   :total="sPage.total"
                                   @current-change="handleCurrentChanges">
                    </el-pagination>
                </div>
            </div>
        </div>


    </div>
</template>
<script>
import axios from "@/axios";

export default {
    name: 'read_xlsx',
    data() {
        return {
            outputs: [],
            searchGrade: null,
            searchClazz: null,
            searchIn: "",
            records: [],
            students: [],
            //分页
            page: {
                size: 10,
                current: 0,
                total: 0,
                search: "",
                grade: null,
                clazz: null,
            },
            sPage: {
                size: 10,
                current: 0,
                total: 0,
            },
        }
    },
    mounted() {
        this.getAllRecords();
        this.getAllStudents();
    },
    methods: {
        //分页
        handleCurrentChange(val) {
            this.page.current = val;
            this.getAllRecords();
        },
        handleCurrentChanges(val) {
            this.sPage.current = val;
            this.getAllStudents();
        },
        getAllRecords() {
            axios.post('/score/getPageOrderByTime', this.page).then(res => {
                this.records = res.data.data.records;
                this.page.total = res.data.data.total;
                console.log(res.data.data);
            })
        },
        getAllStudents() {
            axios.post('/student/getPage', this.sPage).then(res => {
                this.students = res.data.data.records;
                this.sPage.total = res.data.data.total;
                console.log(res.data.data);
            })
        },
        searchRecord() {
            this.page.grade = this.searchGrade;
            this.page.clazz = this.searchClazz;
            this.page.search = this.searchIn;
            this.getAllRecords();
        },
    }
}


</script>

<style scoped>
a {
    text-decoration: none;
    color: #000000;
}

.router-link-active {
    text-decoration: none;
}

</style>