<template>
    <div>
        <el-dialog v-model="centerDialogVisible" title="考试信息" width="30%" align-center>
            <el-form :model="nowForm">
                <el-form-item label="标题">
                    <el-input v-model="nowForm.title"></el-input>
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
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="nowForm.info"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="subForm">确认</el-button>
                </span>
            </template>
        </el-dialog>
        <el-table ref="multipleTableRef" :data="tableData" style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"/>
            <el-table-column property="title" label="标题"/>
            <el-table-column property="grade" label="年级"
                             :filters="gradeFilter"
                             :filter-method="filterHandler"/>
            <el-table-column property="clazz" label="班级"
                             :filters="clazzFilter"
                             :filter-method="filterHandler"
            />
            <el-table-column property="info" label="备注" show-overflow-tooltip/>
            <el-table-column property="createdTime" label="创建时间" sortable/>
            <el-table-column property="updatedTime" label="更新时间" sortable/>
            <el-table-column fixed="right" label="操作" width="140">
                <template #default="scope">
                    <el-button type="danger" size="small" @click.prevent="del(scope.$index)">删除</el-button>
                    <el-button type="primary" size="small" @click="update(scope.row,scope.$index)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "manageView",
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
            centerDialogVisible:false,
            nowForm:null,
        }
    },
    mounted() {
        this.getAllRecords();
    },
    methods: {
        getAllRecords() {
            axios.get('/score/AllRecord').then(res => {
                this.tableData = res.data.data;
                console.log(res.data.data)
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        del(index) {
            this.tableData.splice(index, 1);
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        update(row,index){
            this.nowForm=JSON.parse(JSON.stringify(row));
            this.centerDialogVisible=true;
        },
        subForm(){
            this.centerDialogVisible=false;
        }
    }
}
</script>

<style scoped>

</style>