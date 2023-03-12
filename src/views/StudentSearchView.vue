<template>
    <div>
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
        <div style="width: 80%;margin-top:2%;float: left">
            <el-card class="box-card" v-for="item in students" style="padding-bottom: 1%" shadow="hover">
                <template #header>
                    <router-link :to="{path:'/showScoreView', query: { id: item.id }}">
                        <div class="card-header">
                            <span style="font-weight: bold">{{ item.name }}</span>
                        </div>
                    </router-link>
                </template>
                <div style="color: #b4b4b4">{{ item.grade + "/" }}{{ item.clazz }}班</div>
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
    </div>
</template>

<script>
import axios from "@/axios";

export default {
    name: "StudentSearchView",
    data() {
        return {
            outputs: [],
            searchGrade: null,
            searchClazz: null,
            searchIn: "",
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
        }
    },
    mounted() {
      this.getAllStudents();
    },
    methods:{
        getAllStudents(){
            axios.post('/student/getPage', this.page).then(res => {
                this.students = res.data.data.records;
                this.page.total = res.data.data.total;
                console.log(res.data.data);
            })
        },
        handleCurrentChange(val) {
            this.page.current = val;
            this.getAllStudents();
        },
        searchRecord() {
            this.page.grade = this.searchGrade;
            this.page.clazz = this.searchClazz;
            this.page.search = this.searchIn;
            this.getAllStudents();
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