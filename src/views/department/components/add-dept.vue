<template>
    <!-- 组件之间可以通过属性（props）和事件（events）进行通信。展示了如何从子组件向父组件传递信息，特别是用于更新父组件中的数据状态。这种模式被称为“父子组件通信”。 -->
    <el-dialog :title="showTitle" :visible="showDialog" @close="close">
        <!-- 放置弹层内容 -->
        <!-- ref代表表单实例 -->
        <el-form ref="addDept"  :model="formData" :rules="rules" label-width="120px">
            <el-form-item prop="name" label="部门名称"><!--placeholder背景内容-->
                <!-- prop="name" 确保了 rules 中对应的验证规则被应用于 formData.name 的值。 -->
                <el-input v-model="formData.name" placeholder="2-10个字符" size="mini" style="width:80%"></el-input>
            </el-form-item>
            <el-form-item prop="code" label="部门编码">
                <el-input v-model="formData.code" placeholder="2-10个字符" size="mini" style="width:80%"></el-input>
            </el-form-item>
            <el-form-item prop="manageId" label="部门负责人">
                <el-select v-model="formData.managerId"  placeholder="请选择部门负责人" size="mini" style="width:80%" >
                    <!-- 下拉选项 循环 负责人数据 label表示显示内容的字段(此处显示的内容为负责人名字) value表示实际存储的字段(此处存储的是负责人id)。数据与后端接口返回的数据字段名一致(需查看接口文档)-->
                    <el-option v-for="item in managerList" :key="item.id" :label="item.username" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="introduce" label="部门介绍">
                <el-input v-model="formData.introduce" type="textarea" :rows="4" placeholder="1-100个字符" size="mini" style="width:80%"></el-input>
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item>
                <el-row type="flex" justify="center"><!--水平居中-->
                    <el-col :span="12">
                        <el-button @click="btnOk" type="primary" size="mini">确定</el-button>
                        <el-button @click="close" size="mini">取消</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { addDepartment, getDepartment, getDepartmentDetail, getManagerList, updateDepartment } from '@/api/department'; //引入封装好的api接口中的方法
export default {
    // 定义了一个名为 showDialog 的 prop 来接收来自父组件的数据。
    props: {
        showDialog: {
            type: Boolean,
            default: false
        },
        currentNodeId: {
            type: Number,
            default: null
        }
    },
    computed: {
        showTitle() {
            return this.formData.id ? '编辑部门' : '新增部门'
        }
    },
    data() {
        return {
            managerList: [],// 存储负责人列表
            formData: {//需要与接口文档字段保持一致，便于后续新增部门时调用后端接口
                code: '',//部门编码
                introduce: '',//部门介绍
                managerId: '',//部门负责人的id
                name: '',//部门名称
                pid: ''//父级部门的id
            },
            rules: {//校验规则
                code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
                {
                    min: 2, max: 10, message: '部门编码的长度为2-10个字符', trigger: 'blur'
                },
                {
                    trigger: 'blur',
                    //自定义校验模式
                    validator: async (rule, value, callback) => {
                        //value就是输入的编码
                        let result = await getDepartment()//调用api中封装好的接口方法，获取数据.let result 让result为变量
                        //【day5】编辑部门时排除自身数据，校验数据是否重复
                        if (this.formData.id) {//根据返回数据是否有id判断 是否是编辑场景。 后端新增部门返回的数据没有id，只有pid，编辑部门返回的数据有id
                            // 编辑场景 排除自身
                            //使用数组的·filter方法，保留不等于自身id的数据，重新赋给result
                            result = result.filter(item => item.id !== this.formData.id)
                        }

                        //result数组中是否存在value值.item 就是指当前正在被检查的那个部门对象。(item是每一个部门对象)
                        // 遍历 result 数组中的每一个元素（即每个部门对象），并检查其 code 属性是否与用户输入的新部门编码 (value) 相等。
                        if (result.some(item => item.code === value)) {//item.code需要查看 后端接口文档 获取部门列表 中返回的data数据字段名
                            callback(new Error('部门中已经有该编码了'))
                        } else {
                            callback()
                        }
                    }
                }
                ],//部门编码

                introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
                {
                    min: 1, max: 100, message: '部门介绍的长度为1-100个字符', trigger: 'blur'
                }
                ],//部门介绍

                managerId: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' },],//部门负责人的id

                name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
                {
                    min: 2, max: 10, message: '部门名称的长度为2-10个字符', trigger: 'blur'
                },
                {
                    trigger: 'blur',
                    //自定义校验模式
                    validator: async (rule, value, callback) => {
                        //value就是输入的编码
                        let result = await getDepartment()//调用api中封装好的接口方法，获取数据
                        //【day5】编辑部门时排除自身数据，校验数据是否重复
                        if (this.formData.id) {//根据返回数据是否有id判断 是否是编辑场景。 后端新增部门返回的数据没有id，只有pid，编辑部门返回的数据有id
                            // 编辑场景 排除自身。此处使用this表示当前表单数据对象，resul是getDepartment方法获取的部门列表数据，是数组
                            //使用数组的·filter方法，保留不等于自身id的数据，重新赋给result
                            result = result.filter(item => item.id !== this.formData.id)
                        }

                        //result数组中是否存在value值
                        if (result.some(item => item.name === value)) {
                            callback(new Error('部门中已经有该名称了'))
                        } else {
                            callback()
                        }
                    }
                }
                ],//部门名称
                // pid:[]//父级部门的id，不需要做校验
            }
        }

    },
    created() {
        this.getManagerList()//初始化时获取负责人数据
    },
    methods: {
        close() {
            //子组件AddDept(add-dept.vue) 父组件Department(本文件夹下的index.vue)
            //修改父组件的值 子传父——emit发送了一个名为 update:showDialog 的事件，将 false 作为参数传递给该事件
            // resetFields只能重置template模板(表单)(formData)中绑定的数据，id不是，所以不会重置id
            this.formData={//赋值为一个新的对象，无id
                code: '',//部门编码
                introduce: '',//部门介绍
                managerId: '',//部门负责人的id
                name: '',//部门名称
                pid: ''//父级部门的id
            }
            this.$refs.addDept.resetFields()//重置表单 
            this.$emit('update:showDialog', false)//关闭弹层            
        },

        async getManagerList() {//获取部门负责人数据
            this.managerList = await getManagerList()//给managerList属性赋值，调用api接口中的方法
        },

        //点击确认时调用
        btnOk() {
            //调用表单实例addDept的整体校验validate
            this.$refs.addDept.validate(async isOk => {
                //通过校验
                if (isOk) {
                    let msg ='新增'
                    //判断场景
                    if(this.formData.id){//编辑场景（有id）
                        msg='更新'
                        await updateDepartment(this.formData) //调用修改部门的api接口方法
                    }else{//新增场景（无id）
                        //调用api新增部门方法  延展运算符...将该数据formData拷贝到一个新对象中
                        //(即拷贝了formData中的五个字段),pid:this.currentNodeId表示为formData中pid赋值
                        await addDepartment({ ...this.formData, pid: this.currentNodeId })
                    }
                    //通知父组件更新数据
                    this.$emit('updateDepartment')//为父组件传了事件，事件名为updateDepartment
                    //提示消息
                    this.$message.success(`${msg}部门成功`)//反引号``创建模板字符串，${}动态内容插入，避免字符串拼接(msg+'部门成功')
                    this.close()//关闭弹层 重置表单
                }
            })
        },

        //获取组织详情
        async getDepartmentDetail() {
            this.formData = await getDepartmentDetail(this.currentNodeId)//调用api接口方法从后端获取数据，将数据赋值给当前表单数据
        }
    }

}
</script>