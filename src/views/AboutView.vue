<template>
    <div class="about" style="margin-top: 2%">
        <div>
            <el-select v-model="searchGrade" class="m-2" placeholder="请选择年纪" size="large"
                       style="float: left;width: 8%">
                <el-option
                    v-for="item in grades"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
            <el-select v-model="searchClazz" class="m-2" placeholder="请选择班级" size="large"
                       style="float: left;width: 8%;margin-left: 1%">
                <el-option
                    v-for="item in 20"
                    :key="item"
                    :label="item+'班'"
                    :value="item"
                />
            </el-select>
            <el-input size="large" style="width: 20%;float: left;display: inline-flex;margin-left: 1%"
                      placeholder="请输入关键词"></el-input>
            <el-button size="large" style="float: left;margin-left: 1%">搜索</el-button>
        </div>
        <div>
            <div style="border: 1px solid black;width: 65%;margin-top:2%;float: left">
                <el-card class="box-card" v-for="item in records" style="padding-bottom: 1%">
                    <template #header>
                        <div class="card-header">
                            <span>{{ item.title }}</span>
                        </div>
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
                <el-card class="box-card" v-for="(item,i) in records" style="padding-bottom: 1%" shadow="never">
                    <div style="float:left;border:1px  black;line-height: 100%;font-size: 40px;width: 50px">{{i+1}}</div>
                    <div>{{ item.info }}</div>
                    <div style="color: #b4b4b4;float: left">{{ item.grade + "/" }}{{ item.clazz }}班</div>
                    <div style="float: right;margin-right: 2%;font-size: 14px;color: #b4b4b4">{{ item.createdTime }}
                    </div>
                </el-card>
            </div>
        </div>


    </div>
</template>
<script>

export default {
    name: 'read_xlsx',
    data() {
        return {
            outputs: [],
            grades: [{value: '1', label: '高一'}, {value: '2', label: '高二'}, {value: '2', label: '高三'}],
            searchGrade: null,
            searchClazz: null,
            records: [
                {title: '十月考试1', info: '不理想', grade: 3, clazz: 2, createdTime: "2022-10-22"},
                {title: '十月考试2', info: '不理想', grade: 3, clazz: 2, createdTime: "2022-09-02"},
                {title: '十月考试3', info: '不理想', grade: 3, clazz: 2, createdTime: "2022-03-12"},
                {title: '十月考试3', info: '不理想', grade: 3, clazz: 2, createdTime: "2022-03-12"},
                {title: '十月考试3', info: '不理想', grade: 3, clazz: 2, createdTime: "2022-03-12"},
                {title: '十月考试3', info: '不理想', grade: 3, clazz: 2, createdTime: "2022-03-12"},
                {title: '十月考试3', info: '不理想', grade: 3, clazz: 2, createdTime: "2022-03-12"},
                {title: '十月考试3', info: '不理想', grade: 3, clazz: 2, createdTime: "2022-03-12"},
                {title: '十月考试3', info: '不理想', grade: 3, clazz: 2, createdTime: "2022-03-12"},
                {title: '十月考试3', info: '不理想', grade: 3, clazz: 2, createdTime: "2022-03-12"},
            ],
            //分页
            page: {
                size: 10,
                current: 0,
                total: 0,
            },
        }
    },
    methods: {
        upload(file, fileList) {
            console.log("file", file);
            console.log("fileList", fileList);
            let files = {0: file};
            this.readExcel(files);
        },
        readExcel(files) {
            var that = this;
            console.log(files);

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
                    // 生成json表格内容
                    const ws = utils.sheet_to_json(workbook.Sheets[wsname]);
                    console.log(ws);
                    // 后续为自己对ws数据的处理
                } catch (e) {
                    return false;
                }
            };
            fileReader.readAsBinaryString(files[0]);
        },
        //分页
        handleCurrentChange(val) {
            this.page.current = val;
            // 获取数据
        },
    }
}


</script>

