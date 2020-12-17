# AJ-DatePicker

基于js，jquery的日期时间插件

支持功能：

  1、单、双日历；

  2、月份选择、日期选择、时间选择；

  3、基础多选；

  4、设置默认开始、结束时间
  
  5、设置前置文字


## 引用
```html
<link rel="stylesheet" type="text/css" href="css/dataPicker.css">
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/dataPicker.js"></script>
```

## 调用

```JavaScript
var obj = new AjDataPicker(opt) //创建对象
obj.init() //初始化
```

## 参数

#### opt的默认设置

```JavaScript
{
  id: '',
  preText: '', // 前置文字内容
  preStyle: '', // 前置文字样式
  isRange: '', // 是否双日历
  startDate: null, // 默认开始时间
  endDate: null, // 默认结束时间
  showMonth: false, // 是否只提供月份选择
  showHotkey: false, // 是否显示快捷键
  showhhmmss: false, // 是否可选择时间
  inputStyle: {
    width: '', // 宽度
    height: '', // 高度
    bgColor: '', // 背景色
    borderRadius: '', // 边框圆角
    borderwith: '', // 边框粗细
    borderColor: '', // 边框颜色
    timerColor: '', // 日历或时间图标颜色
    timerSize: '', // 日历或时间图标大小
    clearColor: '', // 清空图标颜色
    clearSize: '' // 清空图标大小
  },
  callback: {
    dataOver: null, // 加载完毕
    dataChange: null // 值改变
  }
}
```

#### 方法

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
|$_getData|获取当前选中日期时间数据|---|{String}，选中日期字符串|
|$_setData|加载表格数据|selectedVal：{String}，日期时间字符串，双日历两个值用逗号隔开|---|
|$_addCheck|显示/隐藏校验文字|flag：{Boolean}，true可用，false不可用；msg：{String}，校验不通过时的提示文字；type：{String}，提示文字出现的位置，'right'或者'bottom'|---|
|$_disabled|设置可用不可用|flag：{Boolean}，true可用，false不可用|---|
|onClear|清空选中项|---|---|




