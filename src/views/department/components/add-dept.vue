<template>
    <!-- 组件之间可以通过属性（props）和事件（events）进行通信。展示了如何从子组件向父组件传递信息，特别是用于更新父组件中的数据状态。这种模式被称为“父子组件通信”。 -->
    <el-dialog title="新增部门" :visible="showDialog" @close="close">
        <!-- 放置弹层内容 -->
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