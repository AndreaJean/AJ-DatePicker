const arrMonth = [
  {text: '一月', m: 1},
  {text: '二月', m: 2},
  {text: '三月', m: 3},
  {text: '四月', m: 4},
  {text: '五月', m: 5},
  {text: '六月', m: 6},
  {text: '七月', m: 7},
  {text: '八月', m: 8},
  {text: '九月', m: 9},
  {text: '十月', m: 10},
  {text: '十一月', m: 11},
  {text: '十二月', m: 12}
]
const arr24 = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
const arr60 = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']
const startInit = {text: '', y: '', m: '', d: '', hh: '00', mm: '00', ss: '00'}
const endInit = {text: '', y: '', m: '', d: '', hh: '23', mm: '59', ss: '59'}

let AjDataPicker = function (options) {
  let newObj = {
    option: {},
    box: {},
    initData: { // 初始开始/结束时间
      start: null,
      end: null
    },
    now: {}, // 当前时间
    start: startInit, // 选择结束的开始/结束时间信息
    end: endInit,
    _startDate: null, // 选择中的开始/结束时间，Data类型，双日历鼠标滑动时跟随改变
    _endDate: null,
    _start: startInit, // 选择中的的开始/结束时间信息，双日历鼠标点击td时跟随改变
    _end: endInit,
    _startY: '', // 日历面板的年月
    _startM: '',
    _endY: '',
    _endM: '',
    init () {
      this.option = this.utils.mergeObjectDeep(this.Opt, options)
      if (this.option.showMonth) {
        this.option.showhhmmss = false
        this.option.showHotkey = false
      }
      this.initValue()
      console.log('option', this.option)
      this.box = $('#' + this.option.id)
      this.box.empty()
      this.createHeader()
      this.setInputVal(true)
      this.bindHeaderEvent()
    },
    // 初始化各种存储值
    initValue () {
      this.now = this.setTimeObj(new Date())
      if (this.option.startDate) {
        this.initData.start = new Date(this.option.startDate)
        this._startDate = new Date(this.option.startDate)
      }
      if (this.option.endDate) {
        this.initData.end = new Date(this.option.endDate)
        this._endDate = new Date(this.option.endDate)
      }
    },
    // 生成输入框============================================
    createHeader () {
      let style = this.getStyle()
      let html = (this.option.preText !== '' ? ('<span class="vp-picker-pre-text" style="' + this.option.preStyle + '">' + this.option.preText + '</span>') : '') +
                 '<div class="vp-picker-container">' +
                 '<div class="vp-picker-header' + (this.option.isRange ? ' is-range' : '') + '" style="' + style.input + '">' +
                 '<i class="vp-picker-input-icon iconfont ' + (this.option.showhhmmss ? 'icon-tubiao_shijian2' : 'icon-rili') + '" style="' + style.rili + '"></i>' +
                 '<input class="vp-picker-input start" placeholder="选择日期' + (this.option.showhhmmss ? '时间' : '') + '" readonly="readonly" unselectable="on" />'
      html += this.option.isRange ? this.createEndTime() : ''
      html += '<i class="vp-picker-input-icon clear iconfont" style="' + style.clear + '"></i></div><span class=\'vp-error-msg\'></span></div>'
      this.box.append(html)
      this.container = this.box.find('.vp-picker-container')
      this.header = this.box.find('.vp-picker-header')
      this.input = {}
      this.input.start = this.box.find('.vp-picker-input.start')
      if (this.option.isRange) {
        this.input.end = this.box.find('.vp-picker-input.end')
      }
      this.clearBtn = this.box.find('.vp-picker-input-icon.clear')
      this.errorMsg = this.box.find('.vp-error-msg')
    },
    // 日历补充结束时间html
    createEndTime () {
      let html = '<span class="vp-picker-range-separator">至</span>' +
                 '<input class="vp-picker-input end" placeholder="选择日期' + (this.option.showhhmmss ? '时间' : '') + '" readonly="readonly" unselectable="on" />'
      return html
    },
    // 整理输入框自定义样式
    getStyle () {
      let opt = this.option.inputStyle
      let input = 'width:' + opt.width + ';' +
                  'height:' + opt.height + ';' +
                  'background-color:' + opt.bgColor + ';' +
                  'border-radius:' + opt.borderRadius + ';' +
                  'border-width:' + opt.borderwith + ';' +
                  'border-color:' + opt.borderColor + ';'
      let rili = 'color:' + opt.timerColor + ';' +
                  'font-size:' + opt.timerSize + ';'
      let clear = 'color:' + opt.clearColor + ';' +
                  'font-size:' + opt.clearSize + ';'
      return {input, rili, clear}
    },
    // 绑定header相关事件
    bindHeaderEvent () {
      let vm = this
      // Header鼠标滑入/滑出事件
      this.header.unbind('mouseover').bind('mouseover ', function (e) {
        if (vm.input.start.val() || (vm.option.isRange && vm.input.end.val())) {
          vm.clearBtn.addClass('icon-shanchu2')
        }
      })
      this.header.unbind('mouseout').bind('mouseout ', function (e) {
        vm.clearBtn.removeClass('icon-shanchu2')
      })
      // 点击清空按钮
      this.clearBtn.unbind('click').bind('click', function (e) {
        e.stopPropagation()
        vm.onClear()
      })
      // Header点击事件
      this.header.unbind('click').bind('click', function (e) {
        e.stopPropagation()
        let isOpen = vm.header.hasClass('is-active')
        if (!isOpen) {
          $('.vp-picker-panel').remove()
          vm.createBody()
          vm.showBody(true)
          vm.bindBodyEvent()
        }
        $(document).unbind('click').click(function (ev) {
          ev.stopPropagation()
          vm.showBody(false)
          $('.vp-picker-time-panel').hide()
        })
        vm.panel.unbind('click').click(function (ev) {
          ev.stopPropagation()
          vm.panel.find('.vp-picker-time-panel').hide()
        })
      })
    },
    // 显示/隐藏选项面板=======================================
    showBody (flag) {
      if (flag) {
        $('.vp-picker-header').removeClass('is-active')
        this.header.addClass('is-active')
      } else {
        this.header.removeClass('is-active')
      }
      if (this.panel) {
        this.panel.css(this.getBodyPosition(flag))
      }
    },
    // 获取选项面板出现位置信息
    getBodyPosition (flag) {
      let h = this.panel.outerHeight()
      let w = this.panel.outerWidth()
      let scrollH = $(document).scrollTop()
      let scrollW = $(document).scrollLeft()
      let bottom = $(window).height() - (this.header.offset().top - scrollH) - this.header.outerHeight() - 2
      let right = $(window).width() - (this.header.offset().left - scrollW)
      let left = w < right ? (this.header.offset().left + 'px') : ((this.header.offset().left + this.header.outerWidth() - w) + 'px')
      let css = {}
      if (h <= bottom) {
        css = {
          'opacity': flag ? 1 : 0,
          'transform': flag ? 'scaleY(1)' : 'scaleY(0)',
          'transform-origin': 'center top 0px',
          'top': (this.header.offset().top + this.header.outerHeight() + 2) + 'px',
          'left': left
        }
      } else {
        css = {
          'opacity': flag ? 1 : 0,
          'transform': flag ? 'scaleY(1)' : 'scaleY(0)',
          'transform-origin': 'center bottom 0px',
          'top': (this.header.offset().top - h - 2) + 'px',
          'left': left
        }
      }
      return css
    },
    // 生成日历面板
    createBody () {
      let bodyClass = 'vp-picker-panel' + (this.option.isRange ? ' is-range' : '') + (this.option.showMonth ? ' show-month' : '')
      let html = '<div class="' + bodyClass + '" id="vp-picker-' + this.option.id + '">' +
                  '<div class="vp-picker-body-wrapper">' +
                  '<div class="vp-picker-body">'
      html += this.option.showhhmmss ? '<div class="vp-picker-body-header"></div>' : ''
      html += '<div class="vp-picker-con start"><div class="vp-picker-mask"></div></div>' +
              (this.option.isRange ? '<div class="vp-picker-con end"><div class="vp-picker-mask"></div></div>' : '')
      html += '</div></div></div>'
      $('body').append(html)
      this.panel = $('#vp-picker-' + this.option.id)
      this.cons = this.panel.find('.vp-picker-con')
      this.startPanel = this.panel.find('.vp-picker-con.start')
      this.endPanel = this.panel.find('.vp-picker-con.end')

      this.setTempInitData()

      this.addConHeader(this.option.showMonth)
      this.addYearTable()
      if (this.option.showMonth) {
        this.addMonthTable(true)
        this.panel.find('.vp-picker-con-header-btn.month').hide()
      } else {
        this.addMonthTable(false)
        this.addDayTable(true)
        if (this.option.showhhmmss) {
          this.addTimeBlock()
          this.addConFooter()
        }
      }
    },
    // 设置日历面板显示的日期时间
    setTempInitData () {
      if (this.start.text.length) {
        this._start = this.utils.deepCopy(this.start)
        this._startY = this._start.y
        this._startM = this._start.m
        this._startDate = new Date(this.start.text)
      } else {
        this._start = this.utils.deepCopy(startInit)
        this._startY = this.now.y
        this._startM = this.now.m
        this._startDate = null
      }
      if (this.option.isRange) {
        if (this.end.text.length) {
          this._end = this.utils.deepCopy(this.end)
          this._endY = this.end.y
          this._endM = this.end.m
          this._endDate = new Date(this.end.text)
          // 如果开始和结束日期在同一月，右日历自动向后移一月
          if (this._endY === this._startY && this._endM === this._startM) {
            let sibling = this.getSiblingMonth(this.end.y, this.end.m, true)
            this._endY = sibling.y
            this._endM = sibling.m
          }
          if (this.option.showMonth && this._endY === this._startY) {
            this._endY = parseInt(this._endY) + 1
          }
        } else {
          this._end = this.utils.deepCopy(endInit)
          let sibling = this.getSiblingMonth(this.now.y, this.now.m, true)
          this._endY = sibling.y
          this._endM = sibling.m
          this._endDate = null
          if (this.option.showMonth && this._endY === this._startY) {
            this._endY = parseInt(this._startY) + 1
          }
        }
      }
      this.setLabelText()
    },
    // 添加日历面板显示年月的部分+存放日历tables的div
    addConHeader (isMonth) {
      let html = '<div class="vp-picker-con-header">' +
                  '<button type="button" title="前十年" class="iconfont vp-picker-con-header-btn year-10 pre icon-shuangxianyoujiantou"></button>' +
                  '<button type="button" title="前一年" class="iconfont vp-picker-con-header-btn year pre icon-shuangxianyoujiantou"></button>' +
                  '<button type="button" title="上个月" class="iconfont vp-picker-con-header-btn month pre icon-arrow-left"></button>' +
                  '<span role="button" class="vp-picker-con-header-label year-to-year"></span>' +
                  '<span role="button" class="vp-picker-con-header-label year"></span>' +
                  (isMonth ? '' : '<span role="button" class="vp-picker-con-header-label month"></span>') +
                  '<button type="button" title="后十年" class="iconfont vp-picker-con-header-btn year-10 next icon-shuangxianzuojiantou"></button>' +
                  '<button type="button" title="后一年" class="iconfont vp-picker-con-header-btn year next icon-shuangxianzuojiantou"></button>' +
                  '<button type="button" title="下个月" class="iconfont vp-picker-con-header-btn month next icon-right"></button>' +
                '</div>' +
                '<div class="vp-picker-con-body"></div>'
      let vm = this
      this.cons.each(function () {
        $(this).append(html)
        vm.setLabelText($(this))
      })
    },
    // 添加日期表格
    addDayTable (showFlag) {
      let style = showFlag ? '' : ' style="display:none"'
      let html = '<table cellspacing="0" cellpadding="0" class="data-table vp-picker-table-day"' + style + '>' +
                    '<thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead>' +
                    '<tbody></tbody>' +
                  '</table>'
      let vm = this
      this.cons.each(function () {
        $(this).find('.vp-picker-con-body').append(html)
        vm.updateDayTd($(this))
      })
    },
    // 更新显示的日期
    updateDayTd (target) {
      let tbody = target.find('.vp-picker-table-day tbody')
      let isStart = target.hasClass('start')
      let arr = this.getDayArr(isStart ? this._startY : this._endY, isStart ? this._startM : this._endM)
      let html = '<tr>'
      arr.forEach((item, i) => {
        let isToday = this.checkToday(item)
        let isStart = this.checkStartDay(item)
        let isEnd = this.checkEndDay(item)
        let isBetween = this.checkBetweenDay(item)
        let className = (item.preNext ? 'pre-next ' : '') +
                        (isToday ? 'today ' : '') +
                        (isStart ? 'is-start ' : '') +
                        (isEnd ? 'is-end ' : '') +
                        (isBetween ? 'is-between ' : '')
        html += '<td data-val=\'' + JSON.stringify(item) + '\' class=\'' + className + '\'><div><span>' + item.d + '</span></div></td>'
        html += i % 7 === 6 ? '</tr><tr>' : ''
      })
      html += '</tr>'
      tbody.empty()
      tbody.append(html)
      this.updateBtnStatus()
    },
    // 获取目标月日期数据
    getDayArr (y, m) {
      y = parseInt(y)
      m = parseInt(m)
      let firstWeekDay = new Date(y, m - 1, 1).getDay()
      let dayNum = this.getDayNum(y, m)
      let lastMonthDay = new Date(y, m - 1, 0).getDate()
      let lastMonth = new Date(y, m - 1, 0).getMonth() + 1
      let lastMonthYear = new Date(y, m - 1, 0).getFullYear()
      let nextMonth = new Date(y, m - 1, dayNum + 1).getMonth() + 1
      let nextMonthYear = new Date(y, m - 1, dayNum + 1).getFullYear()
      let arr = []
      // 前一月日期
      for (let i = 0; i < firstWeekDay; i++) {
        arr.push({
          d: lastMonthDay - i,
          m: lastMonth,
          y: lastMonthYear,
          preNext: true
        })
      }
      arr.reverse()
      // 当月日期
      for (let i = 1; i <= dayNum; i++) {
        arr.push({
          d: i,
          m: m,
          y: y
        })
      }
      // 下一月日期
      for (let i = 1; i <= 42 - firstWeekDay - dayNum; i++) {
        arr.push({
          d: i,
          m: nextMonth,
          y: nextMonthYear,
          preNext: true
        })
      }
      return arr
    },
    // 添加年表格
    addYearTable () {
      let html = '<table cellspacing="0" cellpadding="0" class="data-table vp-picker-table-year">' +
                    '<tbody></tbody>' +
                  '</table>'
      let vm = this
      this.cons.each(function () {
        $(this).find('.vp-picker-con-body').append(html)
        vm.updateYearTd($(this))
      })
    },
    // 更新显示年
    updateYearTd (target, year) {
      let tbody = target.find('.vp-picker-table-year tbody')
      let isStart = target.hasClass('start')
      let arr = this.getYearArr(isStart ? (year || this._startY) : (year || this._endY), target)
      let html = '<tr>'
      arr.forEach((item, i) => {
        let isToyear = item == this.now.y
        let className = (item.preNext ? 'pre-next ' : '') +
                        (isToyear ? 'today ' : '') +
                        ((isStart && item == this.start.y) ? 'is-start ' : '') +
                        ((this.option.isRange && !isStart && item == this.end.y) ? 'is-end ' : '')
        html += '<td data-val="' + item + '" class="' + className + '"><span>' + item + '</span></td>'
        html += i % 4 === 3 ? '</tr><tr>' : ''
      })
      if (arr.length < 4) {
        for (let i = arr.length; i < 4; i++) {
          html += '<td></td>'
        }
      }
      html += '</tr>'
      tbody.empty()
      tbody.append(html)
      this.updateBtnStatus()
    },
    // 获取年数据
    getYearArr (y, target) {
      let s = parseInt(parseInt(y) / 10) * 10
      let e = s + 9
      let arr = []
      if (this.option.isRange) {
        if (target.hasClass('start')) {
          e = e < parseInt(this._endY) ? e : ((this._endM == 1 || this.option.showMonth) ? parseInt(this._endY) - 1 : parseInt(this._endY))
        } else {
          s = s > parseInt(this._startY) ? s : ((this._startM == 12 || this.option.showMonth) ? parseInt(this._startY) + 1 : parseInt(this._startY))
        }
      }
      for (let i = s; i <= e; i++) {
        arr.push(i)
      }
      target.find('.vp-picker-con-header-label.year-to-year').text(s + ' 年 - ' + e + ' 年').attr('data-val', parseInt(parseInt(y) / 10) * 10)
      return arr
    },
    // 添加月表格
    addMonthTable (showFlag) {
      let style = showFlag ? ' style="display:table"' : ' style="display:none"'
      let html = '<table cellspacing="0" cellpadding="0" class="data-table vp-picker-table-month"' + style + '>' +
                    '<tbody></tbody>' +
                  '</table>'
      let vm = this
      this.cons.each(function () {
        $(this).find('.vp-picker-con-body').append(html)
        vm.updateMonthTd($(this))
      })
    },
    // 更新显示的月
    updateMonthTd (target) {
      let tbody = target.find('.vp-picker-table-month tbody')
      let isStart = target.hasClass('start')
      let arr = this.getMonthArr(isStart)
      let html = '<tr>'
      arr.forEach((item, i) => {
        let isToyear = item.y == this.now.y && item.m == this.now.m
        let className = (item.preNext ? 'pre-next ' : '') +
                        (isToyear ? 'today ' : '')

        if (this.option.showMonth) {
          className += (this.checkBetweenMonth(item) ? 'is-between ' : '') +
                       (this.checkStartMonth(item) ? 'is-start ' : '') +
                       ((this.option.isRange && this.checkEndMonth(item)) ? 'is-end ' : '')
        } else {
          className += ((isStart && this._startY == this.start.y && item.m == this.start.m) ? 'is-start ' : '') +
                       ((this.option.isRange && !isStart && this._endY == this.end.y && item.m == this.end.m) ? 'is-end ' : '')
        }
        html += '<td data-val=\'' + JSON.stringify(item) + '\' class=\'' + className + '\'><div><span>' + item.text + '</span></div></td>'
        html += i % 4 === 3 ? '</tr><tr>' : ''
      })
      if (arr.length < 4) {
        for (let i = arr.length; i < 4; i++) {
          html += '<td></td>'
        }
      }
      html += '</tr>'
      tbody.empty()
      tbody.append(html)
      this.updateBtnStatus()
    },
    // 获取月数据
    getMonthArr (isStart) {
      let s = 1
      let e = 12
      let arr = []
      if (this.option.isRange) {
        if (isStart) {
          e = this._startY == this._endY ? parseInt(this._endM) - 1 : 12
        } else {
          s = this._startY == this._endY ? parseInt(this._startM) + 1 : 1
        }
      }
      for (let i = s; i <= e; i++) {
        let obj = this.utils.deepCopy(arrMonth[i - 1])
        obj.y = isStart ? this._startY : this._endY
        arr.push(obj)
      }
      return arr
    },
    // 添加日历面板的时间选择部分
    addTimeBlock () {
      let html = '<div class="vp-picker-time">' +
                   '<input class="vp-picker-input-temp date" placeholder="日期" readonly="readonly" unselectable="on" />' +
                   '<input class="vp-picker-input-temp time" placeholder="时间" readonly="readonly" unselectable="on" />' +
                   '<div class="vp-picker-time-panel">' +
                     '<div class="vp-picker-time-opt">' +
                        '<div class="vp-picker-time-opts hh" data-val="hh">'
      html += this.getTimeUl(true)
      html += '</div><div class="vp-picker-time-opts mm" data-val="mm">'
      html += this.getTimeUl(false)
      html += '</div><div class="vp-picker-time-opts ss" data-val="ss">'
      html += this.getTimeUl(false)
      html += '</div></div>'
      html += '<span class="vp-picker-time-btn cancel">取消</span><span class="vp-picker-time-btn sure">确定</span>'
      html += '</div></div>'

      this.cons.each(function () {
        $(this).prepend(html)
      })
      this.setTempTime()
    },
    // 获取时间列表html
    getTimeUl (ishh) {
      let arr = this.utils.deepCopy(ishh ? arr24 : arr60)
      let html = '<ul class="vp-picker-time-ul">'
      arr.forEach(str => {
        html += '<li data-val="' + parseInt(str) + '">' + str + '</li>'
      })
      html += '</ul>'
      return html
    },
    // 日历面板footer，清空/确定按钮
    addConFooter () {
      let html = '<div class="vp-picker-footer">' +
                    '<button type="button" class="vp-picker-footer-btn clear">清空</button>' +
                    '<button type="button" class="vp-picker-footer-btn sure">确定</button>' +
                  '</div>'
      this.panel.find('.vp-picker-body').append(html)
      this.sureBtn = this.panel.find('.vp-picker-footer-btn.sure')
      this.clearBtnFooter = this.panel.find('.vp-picker-footer-btn.clear')
    },
    // 绑定日历面板上的事件============================================
    bindBodyEvent () {
      let vm = this
      // 年label点击事件
      this.panel.find('.vp-picker-con-header-label.year').unbind('click').bind('click', function (e) {
        let target = $(this).parents('.vp-picker-con')
        vm.showYearTable(target)
      })
      // 月label点击事件
      this.panel.find('.vp-picker-con-header-label.month').unbind('click').bind('click', function (e) {
        let target = $(this).parents('.vp-picker-con')
        vm.showMonthTable(target)
      })

      // 前/后十年点击事件
      this.panel.find('.vp-picker-con-header-btn.year-10').unbind('click').bind('click', function (e) {
        if ($(this).hasClass('disabled')) {
          return
        }
        let target = $(this).parents('.vp-picker-con')
        vm.change10Year(target, $(this).hasClass('next'))
      })
      // 前/后一年点击事件
      this.panel.find('.vp-picker-con-header-btn.year').unbind('click').bind('click', function (e) {
        if ($(this).hasClass('disabled')) {
          return
        }
        let target = $(this).parents('.vp-picker-con')
        vm.changeYear(target, $(this).hasClass('next'))
      })
      // 前/后一月点击事件
      this.panel.find('.vp-picker-con-header-btn.month').unbind('click').bind('click', function (e) {
        if ($(this).hasClass('disabled')) {
          return
        }
        let target = $(this).parents('.vp-picker-con')
        vm.changeMonth(target, $(this).hasClass('next'))
      })

      // 年点击事件
      this.panel.find('.vp-picker-table-year td').unbind('click')
      this.panel.find('.vp-picker-table-year').on('click', 'td', function (e) {
        let target = $(this).parents('.vp-picker-con')
        let isStart = target.hasClass('start')
        let val = $(this).attr('data-val')
        isStart ? vm._startY = val : vm._endY = val
        vm.setLabelText()
        vm.showMonthTable(target)
      })
      // 月点击事件
      this.panel.find('.vp-picker-table-month td').unbind('click')
      this.panel.find('.vp-picker-table-month').on('click', 'td', function (e) {
        if (vm.option.showMonth) {
          vm.clickTd($(this))
        } else {
          let target = $(this).parents('.vp-picker-con')
          let isStart = target.hasClass('start')
          let val = JSON.parse($(this).attr('data-val')).m
          isStart ? vm._startM = val : vm._endM = val
          vm.setLabelText()
          vm.showDayTable(target)
        }
      })
      // 日期点击事件
      this.panel.find('.vp-picker-table-day td').unbind()
      this.panel.find('.vp-picker-table-day').on('click', 'td', function (e) {
        vm.clickTd($(this))
      })

      // 双日/月历鼠标滑上事件
      if (this.option.isRange) {
        this.panel.find('.vp-picker-table-day').on('mouseover', 'td', function (e) {
          vm.chooseTds($(this))
        })
        if (this.option.showMonth) {
          this.panel.find('.vp-picker-table-month').on('mouseover', 'td', function (e) {
            vm.chooseTds($(this))
          })
        }
      }

      // 时间模式
      if (this.option.showhhmmss) {
        // 日历面板确定/清空按钮点击事件
        this.sureBtn.unbind('click').bind('click', function (e) {
          if ($(this).hasClass('disabled')) {
            return
          }
          vm.setInputVal()
          vm.showBody(false)
        })
        this.clearBtnFooter.unbind('click').bind('click', function (e) {
          vm.onClear()
        })

        // 时间显示框点击事件
        this.panel.find('.vp-picker-input-temp.time').unbind('click').bind('click', function (e) {
          e.stopPropagation()
          let target = $(this).siblings('.vp-picker-time-panel')
          target.show()
          vm.updateTimePanel($(this).parents('.vp-picker-con'), true)
        })

        // 时间选项面板确定按钮点击事件
        this.panel.find('.vp-picker-time-btn.sure').unbind('click').bind('click', function (e) {
          let target = $(this).parents('.vp-picker-time-panel')
          target.hide()
        })
        // 时间选项面板取消按钮点击事件
        this.panel.find('.vp-picker-time-btn.cancel').unbind('click').bind('click', function (e) {
          let target = $(this).parents('.vp-picker-time-panel')
          target.hide()
          vm._start = vm.setTimeObj(vm._startDate, startInit)
          vm._end = vm.setTimeObj(vm._endDate, endInit)
          vm.setTempTime()
        })
        // 时间选项面板选项列表滚动事件
        this.panel.find('.vp-picker-time-ul').unbind('mousewheel').bind('mousewheel', function (e) {
          var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1))
          let h = $(this).scrollTop()
          let is24 = $(this).parents('.vp-picker-time-opts').hasClass('hh')
          let max = is24 ? 640 : 1720
          delta > 0 ? h -= 90 : h += 90
          if (h >= 0 && h <= max) {
            vm.changeTime($(this).find('li').eq(h / 30))
          }
          return false
        })
        // 时间选项面板选项点击事件
        this.panel.find('.vp-picker-time-ul li').unbind('click').bind('click', function (e) {
          e.stopPropagation()
          vm.changeTime($(this))
        })
      }
    },
    // 点击选择日期/月份
    clickTd (target) {
      let val = JSON.parse(target.attr('data-val'))
      let day = new Date(val.y, parseInt(val.m) - 1, val.d || 1)
      if (this.option.isRange) {
        if (this._start.text && !this._end.text) {
          if (!this._endDate) {
            this._endDate = new Date(val.y, (parseInt(val.m) - 1), val.d || 1, 23, 59, 59)
          }
          this._start = this.setTimeObj(this._startDate, startInit)
          this._end = this.setTimeObj(this._endDate, endInit)
          if (this.option.showhhmmss) {
            this.panel.find('.vp-picker-input-temp').removeAttr('disabled')
            this.setTempTime()
            this.sureBtn.removeClass('disabled')
          } else {
            this.setInputVal()
            this.showBody(false)
          }
        } else {
          this._startDate = day
          this._endDate = null
          this._start = this.setTimeObj(day, startInit)
          this._end = this.utils.deepCopy(endInit)
          this.updateTdClass()
          if (this.option.showhhmmss) {
            this.panel.find('.vp-picker-input-temp').attr('disabled', 'disabled')
            this.sureBtn.addClass('disabled')
          }
        }
      } else {
        this._startDate = day
        this._start = this.setTimeObj(day, startInit)
        this.updateTdClass()
        if (this.option.showhhmmss) {
          this.setTempTime()
        } else {
          this.setInputVal()
          this.showBody(false)
        }
      }
    },
    // 双日/月历鼠标滑上选择日期/月份
    chooseTds (target) {
      let val = JSON.parse(target.attr('data-val'))
      let day = new Date(val.y, (parseInt(val.m) - 1), val.d || 1)
      if (this._start.text && !this._end.text) {
        if (day < new Date(this._start.text)) {
          this._endDate = new Date(this._start.y, (parseInt(this._start.m) - 1), this._start.d, 23, 59, 59)
          this._startDate = day
        } else {
          this._startDate = new Date(this._start.text)
          this._endDate = new Date(val.y, (parseInt(val.m) - 1), val.d || 1, 23, 59, 59)
        }
        this.updateTdClass()
      }
    },
    // 鼠标滑上时更新双日/月历上的选中效果
    updateTdClass () {
      let vm = this
      let target = this.option.showMonth ? this.panel.find('.vp-picker-table-month td') : this.panel.find('.vp-picker-table-day td')
      target.each(function () {
        $(this).removeClass('is-start is-end is-between')
        let item = JSON.parse($(this).attr('data-val'))
        let isStart = false
        let isEnd = false
        let isBetween = false
        if (vm.option.showMonth) {
          isStart = vm.checkStartMonth(item)
          isEnd = vm.checkEndMonth(item)
          isBetween = vm.checkBetweenMonth(item)
        } else {
          isStart = vm.checkStartDay(item)
          isEnd = vm.checkEndDay(item)
          isBetween = vm.checkBetweenDay(item)
        }
        let className = (isStart ? 'is-start' : '') +
                        (isEnd ? ' is-end' : '') +
                        (isBetween ? ' is-between' : '')
        $(this).addClass(className)
      })
    },
    // 显示年表格
    showYearTable (target) {
      target.siblings('.vp-picker-con').find('.vp-picker-mask').show() // 双日历兄弟面板不可操作
      target.find('.vp-picker-con-header-label.year-to-year').show()
      target.find('.vp-picker-con-header-label.year').hide()
      target.find('.vp-picker-con-header-label.month').hide()
      target.find('.vp-picker-con-header-btn.year-10').show()
      target.find('.vp-picker-con-header-btn.year').hide()
      target.find('.vp-picker-con-header-btn.month').hide()
      target.find('.data-table').hide()
      target.find('.vp-picker-table-year').show()
      this.updateYearTd(target)
    },
    // 显示月表格
    showMonthTable (target) {
      if (!this.option.showMonth) {
        target.find('.vp-picker-con-header-label.year-to-year').show()
      } else {
        target.siblings('.vp-picker-con').find('.vp-picker-mask').hide()
      }
      target.find('.vp-picker-con-header-label.year-to-year').hide()
      target.find('.vp-picker-con-header-label.year').show()
      target.find('.vp-picker-con-header-label.month').hide()
      target.find('.vp-picker-con-header-btn.year-10').hide()
      target.find('.vp-picker-con-header-btn.year').show()
      target.find('.vp-picker-con-header-btn.month').hide()
      target.find('.data-table').hide()
      target.find('.vp-picker-table-month').show()
      this.updateMonthTd(target)
    },
    // 显示日期表格
    showDayTable (target) {
      target.siblings('.vp-picker-con').find('.vp-picker-mask').hide() // 双日历兄弟面板可操作
      target.find('.vp-picker-con-header-label.year-to-year').hide()
      target.find('.vp-picker-con-header-label.year').show()
      target.find('.vp-picker-con-header-label.month').show()
      target.find('.vp-picker-con-header-btn.year-10').hide()
      target.find('.vp-picker-con-header-btn.year').show()
      target.find('.vp-picker-con-header-btn.month').show()
      target.find('.data-table').hide()
      target.find('.vp-picker-table-day').show()
      this.updateDayTd(target)
    },
    // 前/后一月
    changeMonth (target, isNext) {
      if (target.hasClass('start')) {
        let val = this.getSiblingMonth(this._startY, this._startM, isNext)
        this._startY = val.y
        this._startM = val.m
      } else {
        let val = this.getSiblingMonth(this._endY, this._endM, isNext)
        this._endY = val.y
        this._endM = val.m
      }
      this.updateDayTd(target)
      this.setLabelText(target)
    },
    // 前/后一年
    changeYear (target, isNext) {
      if (target.hasClass('start')) {
        this._startY = isNext ? parseInt(this._startY) + 1 : parseInt(this._startY) - 1
      } else {
        this._endY = isNext ? parseInt(this._endY) + 1 : parseInt(this._endY) - 1
      }
      if (!this.option.showMonth) {
        this.updateDayTd(target)
      }
      this.updateMonthTd(target)
      this.setLabelText(target)
    },
    // 前/后十年
    change10Year (target, isNext) {
      let year = parseInt(target.find('.vp-picker-con-header-label.year-to-year').attr('data-val'))
      year = isNext ? year + 10 : year - 10
      this.updateYearTd(target, year)
    },
    // 改变时间
    changeTime (li) {
      let target = li.parents('.vp-picker-con')
      let isStart = target.hasClass('start')
      let t = li.parents('.vp-picker-time-opts').attr('data-val')
      let val = li.attr('data-val')
      let obj = isStart ? this._startDate : this._endDate
      if (t === 'hh') {
        obj.setHours(val)
      } else if (t === 'mm') {
        obj.setMinutes(val)
      } else {
        obj.setSeconds(val)
      }
      isStart ? this._startDate = new Date(obj) : this._endDate = new Date(obj)
      isStart ? this._start = this.setTimeObj(this._startDate) : this._end = this.setTimeObj(this._endDate)
      // debugger
      this.updateTimePanel(target, false)
      this.setTempTime()
    },
    // 更新时间面板
    updateTimePanel (target, hasEdit) {
      let isStart = target.hasClass('start')
      let time = null
      if (hasEdit) {
        time = isStart ? this._start : this._end
      } else {
        time = isStart ? this.setTimeObj(this._startDate) : this.setTimeObj(this._endDate)
      }
      let arr = ['hh', 'mm', 'ss']
      arr.forEach(t => {
        let ul = target.find('.vp-picker-time-opts.' + t + ' ul')
        let num = parseInt(time[t])
        let li = ul.find('li').eq(num)
        ul.scrollTop(num * 30)
        ul.find('li').removeClass('active')
        li.addClass('active')
      })
    },
    // 工具方法===================================================
    // 更新前/后一月、前/后一年、前/后十年按钮的可用状态
    updateBtnStatus () {
      if (!this.option.isRange) {
        return
      }
      let vm = this
      this.panel.find('.vp-picker-con-header-btn').each(function () {
        let btn = $(this)
        let target = btn.parents('.vp-picker-con')
        if (target.find('.vp-picker-table-year').css('display') !== 'none') { // 年
          if (target.hasClass('start')) {
            let year10Btn = target.find('.year-10.next')
            vm._endY - parseInt(target.find('.year-to-year').attr('data-val')) < 10 ? year10Btn.addClass('disabled') : year10Btn.removeClass('disabled')
          } else {
            let year10Btn = target.find('.year-10.pre')
            parseInt(target.find('.year-to-year').attr('data-val')) - vm._startY < 10 ? year10Btn.addClass('disabled') : year10Btn.removeClass('disabled')
          }
        } else if (target.find('.vp-picker-table-month').css('display') !== 'none') { // 月
          let yBtn = target.hasClass('start') ? target.find('.year.next') : target.find('.year.pre')
          yBtn.removeClass('disabled')
          if (vm._startY == vm._endY) {
            yBtn.addClass('disabled')
          }
          if (parseInt(vm._startY) === parseInt(vm._endY) - 1 && (parseInt(vm._endM) === 1 || parseInt(vm._startM) === 12)) {
            yBtn.addClass('disabled')
          }
          if (vm.option.showMonth && parseInt(vm._startY) === parseInt(vm._endY) - 1) {
            yBtn.addClass('disabled')
          }
        } else { // 日
          let yBtn = target.hasClass('start') ? target.find('.year.next') : target.find('.year.pre')
          let mBtn = target.hasClass('start') ? target.find('.month.next') : target.find('.month.pre')
          yBtn.removeClass('disabled')
          mBtn.removeClass('disabled')
          if (vm._startY == vm._endY) {
            yBtn.addClass('disabled')
            if (parseInt(vm._startM) === parseInt(vm._endM) - 1) {
              mBtn.addClass('disabled')
            }
          }
          // 如2011年12月和2012年1月
          if (parseInt(vm._startY) === parseInt(vm._endY) - 1 && parseInt(vm._startM) === 12 && parseInt(vm._endM) === 1) {
            mBtn.addClass('disabled')
          }
          // 如2011年4月和2012年1月
          if (parseInt(vm._startY) === parseInt(vm._endY) - 1 && parseInt(vm._startM) >= parseInt(vm._endM)) {
            yBtn.addClass('disabled')
          }
        }
      })
    },
    // 设置日历面板时间区域显示的数据
    setTempTime () {
      let start = this._start.text.split(' ')
      this.startPanel.find('.vp-picker-input-temp.date').val(start[0])
      this.startPanel.find('.vp-picker-input-temp.time').val(start[1])
      if (this.option.isRange) {
        let end = this._end.text.split(' ')
        this.endPanel.find('.vp-picker-input-temp.date').val(end[0])
        this.endPanel.find('.vp-picker-input-temp.time').val(end[1])
      }
    },
    // 设置日历面板中显示的年月
    setLabelText () {
      this.startPanel.find('.vp-picker-con-header-label.year').text(this._startY + ' 年')
      this.startPanel.find('.vp-picker-con-header-label.month').text(parseInt(this._startM) + ' 月')
      if (this.option.isRange) {
        this.endPanel.find('.vp-picker-con-header-label.year').text(this._endY + ' 年')
        this.endPanel.find('.vp-picker-con-header-label.month').text(parseInt(this._endM) + ' 月')
      }
    },
    // 设置输入框中显示的信息
    setInputVal (init) {
      this.start = this.setTimeObj(this._startDate, (init ? startInit : null))
      this.input.start.val(this.start.text)
      let str = this.start.text
      if (this.option.isRange) {
        this.end = this.setTimeObj(this._endDate, (init ? endInit : null))
        this.input.end.val(this.end.text)
        str = JSON.stringify({start: this.start.text, end: this.end.text})
      }
      if (this.option.callback.dataChange && !init) {
        this.option.callback.dataChange(str)
      }
    },
    // 整理时间信息对象
    setTimeObj (time, init) {
      if (!time) {
        return init
      }
      let arr = this.utils.formatTime(time, 'yyyy-MM-dd-HH-mm-ss').split('-')
      let res = {
        text: arr[0] + '-' + arr[1] + '-' + arr[2],
        y: arr[0],
        m: arr[1],
        d: arr[2],
        hh: init ? init.hh : arr[3],
        mm: init ? init.mm : arr[4],
        ss: init ? init.ss : arr[5]
      }
      if (this.option.showMonth) {
        res.text = arr[0] + '-' + arr[1]
      }
      if (this.option.showhhmmss) {
        res.text += ' ' + res.hh + ':' + res.mm + ':' + res.ss
      }
      return res
    },
    // 获取前一月/后一月的年份、月份
    getSiblingMonth (y, m, isNext) {
      y = parseInt(y)
      m = parseInt(m)
      if (isNext) {
        y = m === 12 ? y + 1 : y
        m = m === 12 ? 1 : m + 1
      } else {
        y = m === 1 ? y - 1 : y
        m = m === 1 ? 12 : m - 1
      }
      return {y, m}
    },
    // 获取目标月的天数
    getDayNum (year, month) {
      let num = 31
      if ([4, 6, 9, 11].includes(month)) {
        num = 30
      }
      if (month === 2) {
        let d = new Date(year, 2, 0)
        num = d.getDate()
      }
      return num
    },
    // 检验是否当日
    checkToday (item) {
      return item.y == this.now.y && item.m == this.now.m && item.d == this.now.d
    },
    // 检验是否选中日期
    checkStartDay (item) {
      let day1 = this.utils.formatTime(new Date(item.y, (parseInt(item.m) - 1), item.d), 'yyyy/MM/dd')
      let day2 = this.utils.formatTime(this._startDate, 'yyyy/MM/dd')
      return day1 === day2
      // return item.y == this._start.y && item.m == this._start.m && item.d == this._start.d
    },
    checkEndDay (item) {
      if (!this.option.isRange) {
        return false
      }
      let day1 = this.utils.formatTime(new Date(item.y, (parseInt(item.m) - 1), item.d), 'yyyy/MM/dd')
      let day2 = this.utils.formatTime(this._endDate, 'yyyy/MM/dd')
      return day1 === day2
      // return item.y == this._end.y && item.m == this._end.m && item.d == this._end.d
    },
    // 检验是否选中日期之间的日期
    checkBetweenDay (item) {
      if (!this.option.isRange) {
        return false
      }
      let data = new Date(item.y, (parseInt(item.m) - 1), item.d)
      return data <= this._endDate && data >= new Date(this.utils.formatTime(this._startDate, 'yyyy/MM/dd'))
    },
    // 检验是否选中月份（双月历）
    checkStartMonth (item) {
      if (!this._startDate) {
        return
      }
      return item.y == this._startDate.getFullYear() && item.m == (this._startDate.getMonth() + 1)
    },
    checkEndMonth (item) {
      if (!this._endDate) {
        return
      }
      return item.y == this._endDate.getFullYear() && item.m == this._endDate.getMonth() + 1
    },
    // 检验是否选中月份之间的月（双月历）
    checkBetweenMonth (item) {
      if (!this._endDate) {
        return
      }
      let y = parseInt(item.y)
      let m = parseInt(item.m)
      let day = new Date(y, m - 1)
      let start = new Date(this._startDate.getFullYear(), this._startDate.getMonth())
      let end = new Date(this._endDate.getFullYear(), this._endDate.getMonth())
      return day < end && day > start
    },
    // 外部调用方法===================================================
    // 清空
    onClear () {
      this._startDate = null
      this._endDate = null
      this.showBody(false)
      this.setInputVal(true)
      if (this.option.callback.dataChange) {
        this.option.callback.dataChange('')
      }
    },
    // 赋值
    $_setData (data) {
      let arr = data.split(',')
      this._startDate = new Date(arr[0])
      this._endDate = arr[1] ? new Date(arr[1]) : null
      this.setInputVal()
    },
    // 取值
    $_getData () {
      return this.option.isRange ? JSON.stringify({start: this.start.text, end: this.end.text}) : this.start.text
    },
    // 添加校验文字
    $_addCheck (flag, msg, type) {
      setTimeout(() => {
        if (flag) {
          let top = ''
          let left = ''
          let h = ''
          if (type === 'right') {
            top = 0
            left = this.header.offset().left - this.box.offset().left + this.header.outerWidth() + 15
            h = this.header.outerHeight() + 'px'
          } else {
            top = this.header.outerHeight() + 8
            left = this.header.offset().left - this.box.offset().left
            h = '1em'
          }
          this.errorMsg.html(msg).css({
            'display': 'block',
            'height': h,
            'line-height': h,
            'top': top,
            'left': left
          })
          this.header.addClass('error')
        } else {
          this.errorMsg.css('display', 'none')
          this.header.removeClass('error')
        }
      }, 10)
    },
    // 设置下拉框可用不可用
    $_disabled (flag) {
      if (flag) {
        this.container.addClass('disabled')
      } else {
        this.container.removeClass('disabled')
      }
    }
  }
  // 工具方法
  newObj.utils = {
    // 时间格式转换 (Date(),'yyyy-MM-dd HH:mm:ss')
    formatTime: function (time, format) {
      var t = new Date(time)
      var tf = function (i) { return (i < 10 ? '0' : '') + i }
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
        case 'yyyy':
          return tf(t.getFullYear())
        case 'MM':
          return tf(t.getMonth() + 1)
        case 'dd':
          return tf(t.getDate())
        case 'HH':
          return tf(t.getHours())
        case 'mm':
          return tf(t.getMinutes())
        case 'ss':
          return tf(t.getSeconds())
        };
      })
    },
    // 合并
    mergeObjectDeep: function (defaultObj, originalObj) {
      let newObj = this.deepCopy(defaultObj)
      for (let i in defaultObj) {
        let dv = defaultObj[i]
        let ov = originalObj[i]
        if (this.isObjectObject(dv) && this.checkNull(ov)) {
          newObj[i] = this.mergeObjectDeep(dv, ov)
        } else {
          if (this.checkNull(ov)) {
            newObj[i] = this.deepCopy(ov)
          }
        }
      }
      return newObj
    },
    // 深拷贝
    deepCopy: function (source) {
      let sourceCopy = null
      if (this.isObjectObject(source)) {
        sourceCopy = {}
        for (let item in source) {
          sourceCopy[item] = this.deepCopy(source[item])
        }
      } else if (this.isArray(source)) {
        sourceCopy = []
        source.forEach(item => {
          sourceCopy.push(this.deepCopy(item))
        })
      } else {
        return source
      }
      return sourceCopy
    },
    // 类型判断
    isArray: function (obj) {
      return Array.isArray(obj) || Object.prototype.toString.call(obj) === '[object Array]'
    },
    isObject: function (obj) {
      let type = typeof obj
      return (type === 'function' || type === 'object') && !!obj
    },
    isObjectObject: function (val) {
      return Object.prototype.toString.call(val) === '[object Object]'
    },
    isString: function (val) {
      return Object.prototype.toString.call(val) === '[object String]'
    },
    isNumber: function (val) {
      return Object.prototype.toString.call(val) === '[object Number]'
    },
    // 空值校验
    checkNull: function (obj) {
      if (obj === null || obj === '' || obj === undefined) {
        return false
      } else if (JSON.stringify(obj) === '{}') {
        let a = false
        for (let i in obj) {
          a = true
        }
        return a
      } else if ((this.isString(obj) || this.isArray(obj)) && obj.length === 0) {
        return false
      } else {
        return true
      }
    }
  }
  // 默认设置
  newObj.Opt = {
    id: '',
    preText: '',
    preStyle: '', // 前置文字样式
    isRange: '',
    startDate: null,
    endDate: null,
    showMonth: false,
    showHotkey: false,
    showhhmmss: false,
    inputStyle: {
      width: '', // 宽度
      height: '', // 高度
      bgColor: '', // 背景色
      borderRadius: '', // 边框圆角
      borderwith: '', // 边框粗细
      borderColor: '', // 边框颜色
      timerColor: '',
      timerSize: '',
      clearColor: '',
      clearSize: ''
    },
    callback: {
      dataOver: null, // 加载完毕
      dataChange: null // 值改变
    }
  }
  return newObj
}
