# 原生 js 实现走马灯（轮播图）

## 碰到的一些问题

### 多张图片之间的间隙

img 标签 display 属性默认是 inline，多个 img 标签水平并排时实际渲染出来之间相邻图片之间会有间隙。这里采取的解决办法是设置 img 的 display: block 并使用 float: left 让他们浮动在同一行。
