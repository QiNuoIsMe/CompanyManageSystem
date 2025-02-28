<script>
export default {
  name: 'MenuItem',
  functional: true,// 函数式组件(用函数表示组件，此处为render函数)
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  //渲染函数
  render(h, context) {
    const { icon, title } = context.props//将图标 标题传入
    const vnodes = []

    if (icon) {//图标非空
      /* icon是否包含字符串 'el-icon'，包含则icon是Element UI 的内置图标（包含 'el-icon'），则渲染 <i> 标签(用于渲染图标)，
        并为其动态绑定类名——两个 CSS 类：一个是传入的 icon，另一个是固定的 'sub-el-icon' 类。然后把这个元素推入 vnodes 数组。*/
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        /*无'el-icon'，则icon是自定义的 SVG 图标名称，则渲染 <svg-icon> 组件，传递图标名字icon*/
        vnodes.push(<svg-icon icon-class={icon}/>)//渲染图标
      }
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)//渲染标题
    }
    return vnodes// 渲染节点
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
