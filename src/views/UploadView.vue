<template>
    <div>
        <el-dialog v-model="centerDialogVisible" title="学生成绩" width="30%" align-center>
            <el-form :model="scoreForm" >
                <el-form-item   v-for="(v,k,index) in scoreForm" :label="k" >
                    <el-input v-model="scoreForm[k]" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="subForm">确认</el-button>
                </span>
            </template>
        </el-dialog>

        <el-upload
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :before-upload="upload"
            :show-file-list="false"
            accept=".xlsx,.xls"
            style="width: 100px; display: inline-flex;float: left;margin-bottom: 10%; "
        >
            <el-button size="large" type="primary">导入</el-button>
        </el-upload>
        <el-form :model="record" class="demo-form-inline" :rules="rules" ref="record">
            <el-form-item label="年级" prop="grade">
                <el-select v-model="record.grade" class="m-2" placeholder="请选择年级" size="large">
                    <el-option v-for="item in 3" :key="item" :label="'高'+item" :value="item"/>
                </el-select>
            </el-form-item>
            <el-form-item label="班级" prop="clazz">
                <el-select v-model="record.clazz" class="m-2" placeholder="请选择班级" size="large">
                    <el-option v-for="item in 20" :key="item" :label="item+'班'" :value="item"/>
                </el-select>
            </el-form-item>
            <el-form-item label="标题" prop="title">
                <el-input v-model="record.title"  placeholder="请输入标题" size="large" style="width: 20%;"/>
            </el-form-item>
            <el-form-item label="备注" prop="info">
                <el-input v-model="record.info" placeholder="请输入备注" size="large" type="textarea"/>
            </el-form-item>

            <el-form-item>
                <el-button size="large" type="success" @click="onSubmit('record')">提交</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" show-summary :summary-method="getSummaries"
                  style="width: 100%;">
            <el-table-column sortable v-for="(v,k) in tableData[0]" :prop="k" :label="k"/>
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
import {read, utils} from 'xlsx'
import axios from "@/axios";


export default {

    name: "UploadView",
    data() {
        return {
            rules: {
                title: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                // info: [
                //     { required: true, message: '请选择活动区域', trigger: 'change' }
                // ],
                grade: [
                    { required: true, message: '请选择年级', trigger: 'change' }
                ],
                clazz: [
                    { required: true, message: '请选择班级', trigger: 'change' }
                ],
            },
            centerDialogVisible: false,
            tableData: [],
            record: {
                title: '',
                info: '',
                clazz: null,
                grade: null,
            },
            scoreFormIndex:null,
            scoreForm: {

            }
        }
    },
    methods: {
        upload(file, fileList) {
            let files = {0: file};
            this.readExcel(files);
        },
        readExcel(files) {
            var that = this;

            if (files.len <= 0) return;
            if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
                return;
            }

            const fileReader = new FileReader();
            fileReader.onload = (ev) => {
                try {
                    const data = ev.target.result;
                    const workbook = read(data, {
                        type: 'binary'
                    });
                    // 取第一张表
                    const wsname = workbook.SheetNames[0];
                    let excelName=files[0].name;
                    this.record.title = excelName.substring(0,excelName.lastIndexOf('.'));
                    // 生成json表格内容
                    let ws = utils.sheet_to_json(workbook.Sheets[wsname]);
                    // 后续为自己对ws数据的处理
                    let res = JSON.stringify(ws)

                    for (let i = 0; i < ws.length; i++) {
                        for (let rk in ws[i]) {
                            if (rk.includes('班')) {
                                let reg = `/"${rk}":/g`;
                                res = res.replace(eval(reg), '"班级名次":');
                            }
                            if (rk.includes('年')) {
                                let reg = `/"${rk}":/g`;
                                res = res.replace(eval(reg), '"年级排名":');
                            }
                        }
                    }
                    res = res.replaceAll(' ', '');

                    this.tableData = JSON.parse(res);
                } catch (e) {
                    return false;
                }
            };
            fileReader.readAsBinaryString(files[0]);
        },
        del(index) {
            this.tableData.splice(index, 1);
        },
        update(row,index) {
            this.scoreFormIndex=index;
            this.scoreForm=JSON.parse(JSON.stringify(row));
            this.centerDialogVisible = true;
        },
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.tableData.length<1) {
                        this.$message.error('请导入excel!')
                        return false;
                    }
                    let recordVO=this.record;
                    recordVO.records=this.tableData;
                    axios.post('/score/addScoresList',recordVO).then(res=>{
                        if (res.data.data){
                            this.$message.success("添加成功");
                            this.tableData=[];
                            this.record={
                                title: '',
                                info: '',
                                clazz: null,
                                grade: null,
                            }
                        }
                    })
                } else {
                    this.$message.error('请检查考试信息输入是否正确!');
                    return false;
                }
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
                if (!values.every(value => isNaN(value)) && column.property !== '班级名次' && column.property !== '年级排名') {
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
        subForm(){
            this.tableData[this.scoreFormIndex]=this.scoreForm;
            this.centerDialogVisible=false;
        }
    },
    computed: {}
}
</script>

<style scoped>

</style>