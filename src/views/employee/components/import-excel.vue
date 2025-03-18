<template>
    <el-dialog
      width="500px"
      title="员工导入"
      :visible="showExcelDialog"
      @close="$emit('update:showExcelDialog', false)"
    >
      <el-row type="flex" justify="center">
        <div class="upload-excel">
            <!-- 上传文件的input框,类型为file，可以弹出文件选择器 -->
            <!--change监听文件改变-上传excel-->
          <input
            ref="excel-upload-input"
            class="excel-upload-input"
            type="file"
            accept=".xlsx, .xls"
            @change="uploadChange"
          >
          <div class="drop">
            <i class="el-icon-upload" />
            <el-button type="text" @click="getTemplate">下载导入模板</el-button>
            <span>将文件拖到此处或
              <!--点击上传按钮，触发input框的click事件，弹出文件选择器-->
              <el-button type="text" @click="handleUpload">点击上传</el-button>
            </span>
          </div>
        </div>
      </el-row>
      <el-row type="flex" justify="end">
        <!-- update:props属性名，值 直接修改 .sync修饰符的属性值 -->
        <el-button size="mini" type="primary" @click="$emit('update:showExcelDialog', false)">取消</el-button>
      </el-row>
    </el-dialog>
  </template>
  <script>
  import { getExportTemplate, uploadExcel } from '@/api/employee'
import FileSaver from 'file-saver'
  export default {
    props: {
      showExcelDialog: {
        type: Boolean,
        default: false
      }
    },
    methods: {
        // 下载导入模板
        async getTemplate(){
            const data = await getExportTemplate()
            FileSaver.saveAs(data, '员工导入模板.xlsx')
        },
        // 弹出文件选择器 选择上传的文件,只有一种方法，input file的click事件
        handleUpload(){
            //获取refs实例，this.$refs.excel-upload-input获取input元素，click()触发input元素的click事件
                //此处不能用this.$refs.excel-upload-input.click()，因为包含'-'，不符合标识符规范,而方括号符号允许使用任意字符串作为属性名。
                //this.$refs.属性名 等价于 this.$refs['属性名']
            this.$refs['excel-upload-input'].click()

        },
        //上传文件
        async uploadChange(event){//上传文件的input框中change事件会传入event对象，打印可知其包含的属性
          //调用上传接口
          //uploadExcel() //参数 form-data 需要文件file作为参数
          console.log(event)//event对象中的target属性中包含files属性，files属性是一个数组，包含上传的文件
          const files = event.target.files//获取上传的文件
          if(files.length > 0){
            //大于0说明有文件上传
            const data = new FormData()//创建一个form-data对象
            // file: file类型
            data.append('file',files[0])//将上传的文件添加到form-data对象中
            try {
              await uploadExcel(data)
              //成功
                //$emit方法，用于从子组件向父组件发送事件。通过 $emit，子组件可以触发自定义事件，并可选地传递参数给父组件。
              this.$emit('uploadSuccess')//上传成功后，调用父组件的uploadSuccess方法
              this.$emit('update:showExcelDialog', false)// 关闭弹层
              // this.$refs['excel-upload-input'].value = ''//清空input框
            } catch (error) {
              //捕获失败
              // this.$refs['excel-upload-input'].value = ''//清空input框
            }finally{
              //无论成功失败都都会执行finally,清空input框
              this.$refs['excel-upload-input'].value = ''
            }

          }
          
        }
    }
  }
  </script>
  
  <style scoped lang="scss">
      .upload-excel {
        display: flex;
        justify-content: center;
        margin: 20px;
        width: 360px;
        height: 180px;
        align-items: center;
        color: #697086;
        .excel-upload-input {
          display: none;
          z-index: -9999;
        }
        .btn-upload,
        .drop {
          border: 1px dashed #dcdfe6;
          width: 100%;
          height: 100%;
          text-align: center;
          line-height: 160px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .drop {
          line-height: 40px;
          color: #bbb;
          i {
            font-size: 60px;
            display: block;
            color: #c0c4cc;
          }
        }
      }
  </style>