<template>
    <!-- 组件之间可以通过属性（props）和事件（events）进行通信。展示了如何从子组件向父组件传递信息，特别是用于更新父组件中的数据状态。这种模式被称为“父子组件通信”。 -->
    <el-dialog title="新增部门" :visible="showDialog" @close="close">
        <!-- 放置弹层内容 -->
        <el-form label-width="120px">
            <el-form-item label="部门名称"><!--placeholder背景内容-->
                <el-input placeholder="2-10个字符" size="mini" style="width:80%"></el-input>
            </el-form-item>
            <el-form-item label="部门编码">
                <el-input placeholder="2-10个字符" size="mini" style="width:80%"></el-input>
            </el-form-item>
            <el-form-item label="部门负责人">
                <el-select  placeholder="请选择部门负责人" size="mini" style="width:80%" ></el-select>
            </el-form-item>
            <el-form-item label="部门介绍">
                <el-input type="textarea" :rows="4" placeholder="1-100个字符" size="mini" style="width:80%"></el-input>
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item>
                <el-row type="flex" justify="center"><!--水平居中-->
                    <el-col :span="12">
                        <el-button type="primary" size="mini">确定</el-button>
                        <el-button size="mini">取消</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
export default{
    // 定义了一个名为 showDialog 的 prop 来接收来自父组件的数据。
    props:{
        showDialog:{
            type:Boolean,
            default:false
        }
    },
    methods:{
        close(){
            //子组件AddDept(add-dept.vue) 父组件Department(本文件夹下的index.vue)
            //修改父组件的值 子传父——emit发送了一个名为 update:showDialog 的事件，将 false 作为参数传递给该事件
            this.$emit('update:showDialog',false)//关闭弹层

        }
    }
    
}
</script>