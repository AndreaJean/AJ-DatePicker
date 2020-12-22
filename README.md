# AJ-DatePicker

基于js，jquery的日期时间插件

支持功能：

  1、单、双日历；

  2、设置显示类型：月份选择、日期选择、时间选择；

  3、设置前置文字；

  4、设置默认开始、结束时间; 
  
  5、设置选择范围时的分隔符；

  6、设置日历面板的自定义class
  
  7、设置禁选日期/月份等


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
  popperClass: '', // 选项面板的类名
  isRange: '', // 是否双日历
  rangeSeparator: '至', // 选择范围时的分隔符
  defaultValue: [], // 初始化时默认显示的时间，[开始，结束]
  disabledDate: { // 禁止选中的日期/月
    before: null, // 该日期前不可选
    after: null // 该日期后不可选
  },
  showType: 'date', // 显示类型，'month'、'date'、'time'
  showHotkey: false, // 是否显示快捷键
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
    dataChange: null, // 值改变
    setData: null // 赋值
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
|$_setDisabledDate|设置禁选日期/月份|before：{可被new Date()解析}，before之前的日期/月份不可选；after：{可被new Date()解析}，after之后的日期/月份不可选|---|



