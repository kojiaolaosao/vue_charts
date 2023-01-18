<template>
    <div>
        <el-dialog v-model="centerDialogVisible" title="考试信息" width="30%" align-center>
            <el-form :model="nowForm">
                <el-form-item label="姓名">
                    <el-input v-model="nowForm.name"></el-input>
                </el-form-item>
                <el-form-item label="年级">
                    <el-select v-model="nowForm.grade">
                        <el-option v-for="item in 3" :key="item" :label="'高'+item" :value="item"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级">
                    <el-select v-model="nowForm.clazz">
                        <el-option v-for="item in 20" :key="item" :label="item+'班'" :value="item"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取消</el-button>
                    <el-popconfirm width="220" confirm-button-text="确认" cancel-button-text="取消" icon-color="#626AEF" title="确定要修改嘛?"
                                   @confirm="subForm"
                                   @cancel="centerDialogVisible = false"
                    >
                        <template #reference>
                            <el-button type="primary">确认</el-button>
                        </template>
                    </el-popconfirm>
                </span>
            </template>
        </el-dialog>
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
            <el-table ref="multipleTableRef" :data="tableData" style="width: 100%"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"/>
                <el-table-column property="name" label="姓名"/>
                <el-table-column property="grade" label="年级"
                                 :filters="gradeFilter"
                                 :filter-method="filterHandler"/>
                <el-table-column property="clazz" label="班级"
                                 :filters="clazzFilter"
                                 :filter-method="filterHandler"
                />
                <el-table-column property="createdTime" label="创建时间" sortable/>
                <el-table-column property="updatedTime" label="更新时间" sortable/>
                <el-table-column fixed="right" label="操作" width="140">
                    <template #default="scope">
                        <el-popconfirm width="220" confirm-button-text="确认" cancel-button-text="取消" icon-color="#626AEF"
                                       title="确定要删除嘛?" @confirm="del(scope.$index)">
                            <template #reference>
                                <el-button type="danger" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                        <el-button type="primary" size="small" @click="update(scope.row,scope.$index)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin: 1%;">
            <el-pagination background layout="total,prev, pager, next" :pager-count="5"
                           :page-size="page.size"
                           :current-page="page.current"
                           :total="page.total"
                           @current-change="handleCurrentChange">
            </el-pagination>
        </div>

    </div>
</template>

<script>
import axios from "@/axios";

export default {
    name: "studentManage",
    data() {
        return {
            tableData: [],
            clazzFilter: [
                {text: '1班', value: 1},
                {text: '2班', value: 2},
                {text: '3班', value: 3},
                {text: '4班', value: 4},
                {text: '5班', value: 5},
                {text: '6班', value: 6},
                {text: '7班', value: 7},
                {text: '8班', value: 8},
                {text: '9班', value: 9},
                {text: '10班', value: 10},
                {text: '11班', value: 11},
                {text: '12班', value: 12},
                {text: '13班', value: 13},
                {text: '14班', value: 14},
                {text: '15班', value: 15},
                {text: '16班', value: 16},
                {text: '17班', value: 17},
                {text: '18班', value: 18},
                {text: '19班', value: 19},
                {text: '20班', value: 20},
            ],
            gradeFilter: [
                {text: '高一', value: 1},
                {text: '高二', value: 2},
                {text: '高三', value: 3}
            ],
            centerDialogVisible: false,
            nowForm: null,
            searchGrade: null,
            searchClazz: null,
            searchIn: "",
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
                this.tableData = res.data.data.records;
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
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        update(row, index) {
            this.nowForm = JSON.parse(JSON.stringify(row));
            this.centerDialogVisible = true;
        },
        subForm() {
            //axios post
            console.log(this.nowForm);
            axios.post('/student/update',this.nowForm).then(res=>{
                console.log(res);
                this.getAllStudents();
            })
            this.centerDialogVisible = false;
        },
        del(index) {
            axios.post('/student/del/'+this.tableData[index].id).then(res=>{
                if (res.data.data){
                    this.$message.success('删除成功');
                }
                this.getAllStudents();
            })
            // this.tableData.splice(index, 1);
        },
    }
}
</script>

<style scoped>

</style>