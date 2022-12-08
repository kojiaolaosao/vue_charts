<template>
    <div class="about">
        <el-upload
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :before-upload="upload"
            :show-file-list="false"
            accept=".xlsx,.xls"
            style="width: 100px; display: inline-flex;"
        >
            <el-button size="small">导入</el-button>
        </el-upload>
    </div>
</template>
<script>
import {read, utils} from 'xlsx'

export default {
    name: 'read_xlsx',
    data() {
        return {
            outputs: [],
        }
    },
    methods: {
        upload(file,fileList){
            console.log("file",file);
            console.log("fileList",fileList);
            let files={0:file};
            this.readExcel(files);
        },
        readExcel(files){
            var that=this;
            console.log(files);

            if (files.len<=0) return;
            if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())){
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
        }

    }
}


</script>

