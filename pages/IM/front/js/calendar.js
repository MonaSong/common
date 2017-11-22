
/**
 * @author mona 2017/9
 * @desc 简易日历
 */
function ciccCalendar(options) {
            var _this = this
            var defaults = {
                selector: '.c-calendar', // 日历容器
                size_type: 'big', // 渲染大小风格
                data_url:'', //请求数据的接口地址
                show_type:'', //显示 详细数据的方式 'click' 或者 '不同的方式数据结构不一样',
                big_cb: null
            }
            _this.settings = $.extend({}, options)
            _this.$box = $(_this.settings.selector)

            _this.the_month =  _this.$box.find('[role="the-month"]') //左上角年
            _this.the_year =  _this.$box.find('[role="the-year"]') //左上角月

            _this.prev_year =  _this.$box.find('[role="prev-year"]') //上一年
            _this.next_year =  _this.$box.find('[role="next-year"]') //下一年

            _this.prev_month =  _this.$box.find('[role="prev-month"]') //上一月
            _this.next_month =  _this.$box.find('[role="next-month"]') //下一月

            _this.settings.language = _this.settings.language || 'zh'

            _this.header_text = {
                'zh':{
                    'big': ['周日' ,'周一', '周二', '周三', '周四', '周五', '周六'],
                    'small': ['日', '一', '二', '三', '四', '五', '六'] 
                },
                'en':{
                    'big': ['Sun' ,'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                    'small': ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                }
                
            }

            _this.IsLeapYear = function (year) {
                if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)) {
                    return true
                }
                return false
            }

            _this.prev_year.on('click', function () {
                _this.prevYear()
            })
            _this.next_year.on('click', function () {
                _this.nextYear()
            })
            _this.prev_month.on('click', function () {
                _this.prevMonth()

            })
            _this.next_month.on('click', function () {
                _this.nextMonth()
            })

            _this.init()

        }

        ciccCalendar.prototype = {
            init: function () {
                var _this = this
                _this.renderHeader() // 渲染 头部 有中英文
                _this.renderTable() // 渲染日历

                // 初次加载 大日历数据
                $.isFunction(_this.settings.big_cb) && _this.settings.big_cb('')
            },
            /**
             * @desc 将数据信息根据 日期绑定到td dom 属性 data-list上
             */
            renderData: function(data){
                var _this = this
                console.log('data===>有无数据')
                console.log(data)
                if(!data) return
                var td_list = $(_this.settings.selector).find('tbody td')
                var star_dom = _this.settings.size_type === 'small' ? '<i></i>' : ''
                $.each(td_list, function(i, item){
                    var cur_date = $(this).attr('data-cur-date')
                    $.each(data, function(k,v){
                        if(cur_date == k){
                            $(item).attr('data-list', JSON.stringify(v))
                            $(item).append(star_dom)
                        }
                    })
                })
            },
            renderHeader: function(){
                var _this = this
                var h = ''
                var data = _this.header_text[_this.settings.language][_this.settings.size_type]
               // console.log(data)
                $.each(data, function(i, item){
                    h += '<td>'+item+'</td>'
                })
                $(_this.settings.selector).find('thead tr').html(h)
                if (_this.settings.size_type == 'big') {
                  $(_this.settings.selector).find('thead tr td:eq(0)').css('color', '#c90000')
                  $(_this.settings.selector).find('thead tr td:eq(6)').css('color', '#c90000')
                }
                
            },
            createCalendar: function (year, month, date) {
                var _this = this
                var d = new Date()
                var cur_year = (!year || year <= 0) ? cur_year = d.getFullYear() : cur_year = year
                var cur_mon = (!month || month <= 0) ? cur_mon = d.getMonth() : cur_mon = month - 1
                var cur_date = (!date || date <= 0) ? cur_date = d.getDate() : cur_date = date

                //默认年月
                var my_year = cur_year
                var my_month = cur_mon + 1

                //设置年月
                _this.the_year.text(my_year)
                _this.the_month.text(my_month)

                var month_days = new Array(31, 28 + (_this.IsLeapYear(d.getFullYear())), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31) // 月份天数数组
                var month_firstday_date = new Date(cur_year, cur_mon, 1) // 当前月的第一天星期几
                var monthDays = month_days[cur_mon] // 当前月的天数
                var prevMonthDays = cur_mon == 0 ? month_days[11] : month_days[cur_mon - 1] //上一个月的天数
                var monthFirstday = month_firstday_date.getDay() // 月份的第一天是星期几
                var lines = Math.ceil((monthDays + monthFirstday) / 7) // 表格所需行数
                var prevDays = (prevMonthDays - monthFirstday + 1) // 当前月的前一个月的最后几天
                var nextDays = 1 // 当前月的下一个月的前面几天
                var calendarBody = "" // 日历表格体
               
                for (var i = 0; i < lines; i++) {
                    calendarBody += "<tr class='line'>"
                    for (var j = 0; j < 7; j++) {
                        idx = i * 7 + j //  单元格自然序列号
                        var is_weekend = Math.ceil(idx / 6) === 0 ? 'text-red': ''
                        if (i == 0 && idx < monthFirstday) {
                            var prev_days = prevDays++
                            calendarBody += "<td class='prev-days'  data-cur-date='"+
                            my_year + "-" + 
                            (my_month-1) + "-" + 
                            prev_days +"'><div class='data-box'></div><span class='day '>" +
                            prev_days +"</span></td>"

                        } else if (idx < monthDays + monthFirstday) {
                            var date = idx + 1 - monthFirstday + ''
                            my_month = my_month + ''
                            //今天
                            my_month =  my_month.length == 2 ? my_month : '0' + my_month
                            var h_date = date.length ==2  ?  date  :  '0' + date
                            if (h_date == cur_date && cur_mon == d.getMonth() && cur_year == d.getFullYear()) {
                                var tody_text = _this.settings.language == 'zh' ? '今': date
                                var today_style = _this.settings.size_type == 'small' ? 'style="font-size: 12px"' : 'style="font-size: 20px"'
                                calendarBody += "<td class='today' data-cur-date='"+my_year+"-"+my_month+"-"+h_date+"'><div class='' data-is-empty='1' data-cur-date='" +
                                    my_year + "-" + 
                                    my_month + "-" +
                                h_date + "'><div class='data-box'></div><span class='day active' + "+today_style+">"+tody_text+"</span></div>"
                            } 
                            // 其他日期
                            else {
                                calendarBody += "<td data-cur-date='" +
                                    my_year + "-" + 
                                    my_month + "-" +
                                    h_date + "'><div class='data-box'></div><span class='day'>" +  date +  "</span></td>"
                            }
                        } else {
                            var next_days = nextDays ++
                            calendarBody += "<td class='next-days "+
                            is_weekend+"' data-cur-date='"+
                            my_year + "-" +
                            (my_month+1) + "-" +
                            next_days+"'><div class='data-box'></div><span class='day'>" + next_days + "</span></td>"
                        }
                    }
                    calendarBody += "</tr>"
                }

                return calendarBody
            },
            prevMonth: function () {
                var _this = this
                var theMonth = eval(_this.the_month.html())
                var theYear = eval(_this.the_year.html())
                if (theMonth <= 1) {
                    _this.the_month.html("12")
                    if (theYear <= 1) {
                        _this.the_year.html(1)
                    } else {
                        _this.the_year.html(theYear - 1)
                    }
                } else {
                    _this.the_month.html(theMonth - 1)
                }
                cur_year = eval(_this.the_year.html())
                cur_mon = eval(_this.the_month.html())
                _this.renderTable(cur_year, cur_mon)
            },
            nextMonth: function () {
                var _this = this
                var theMonth = eval(_this.the_month.html())
                if (theMonth >= 12) {
                    var theYear = eval(_this.the_year.html())
                    if (theYear >= 2200) {
                        _this.the_year.html(2200)
                    } else {
                        _this.the_year.html(eval(theYear + 1))
                    }
                    _this.the_month.html(1)
                } else {
                    _this.the_month.html(eval(theMonth + 1))
                }
                cur_year = eval(_this.the_year.html())
                cur_mon = eval(_this.the_month.html())

                console.log(cur_year,  cur_mon)
                _this.renderTable(cur_year, cur_mon)
            },
            prevYear: function () {
                var _this = this
                var theYear = eval(_this.the_year.html())
                if (theYear <= 1) {
                    _this.the_year.html(1)
                } else {
                    _this.the_year.html(eval(theYear - 1))
                }
                cur_year = eval(_this.the_year.html())
                cur_mon = eval(_this.the_month.html())
                _this.renderTable(cur_year, cur_mon)
            },
            nextYear: function () {
                var _this = this
                var theYear = eval(_this.the_year.html())
                if (theYear >= 2200) {
                    _this.the_year.html(2200)
                } else {
                    _this.the_year.html(eval(theYear + 1))
                }
                cur_year = eval(_this.the_year.html())
                cur_mon = eval(_this.the_month.html())
                _this.renderTable(cur_year, cur_mon)
            },
            /**
             * @desc 渲染具体数据 
             * @param target 当前dom，type 详情内容显示方式，day 当前日期， data 当前具体数据
             */
            renderDetailData:function(target, day, data){
                var _this = this
                if($('.calendar-data').length) $('.calendar-data').html('')
            	if(!data) return
            	data = JSON.parse(data)
            	if(_this.settings.show_type === 'click' && _this.settings.size_type == 'small') {
            		var day = $(target).attr('data-cur-date')
                		day = day.split('-')
                		day = day[0]+'/'+(day[1].length===2?day[1]:'0'+day[1])+'/'+(day[2].length===2?day[2]:'0'+day[2])
                		var h = '<h4>'+day+'</h4><ul class="">'
                		$.each(data, function(i, item){
                			h += '<li><i class="time-line">'+item.time+'</i><i class="img icon-im-l"></i><a style="width: 100%" class="xx"';
                			if(item.id){
                        h+=" href='javascript:void(0)' onclick='viewDetail("+item.id+")'";
                      }
                      h+="><p>"+item.value+"</p></a></li>";
                		})
                		h += '</ul>'
                		$('.calendar-data').html(h)
                    cicc_index.clampString($('.calendar-data li > a > p'), 2)
            	} else if(_this.settings.show_type === 'hover' ){
                    var h = '<ul class="c-data-list">'
                    $.each(data, function(i, item){
                        h += '<li>'+item+'</li>'
                    })
                    h += '</ul>'
                    $(target).find('.data-box').html(h)
                    $(target).siblings().find('.data-box').html('')

            	}
            },
            /*
             * @desc ajax 取日历数据
             */
            getData: function (param, callback){
            	var _this = this
            	//var param = {date:year+'/'+month}
            	/*模拟数据*/
            	//_this.settings.show_type === 'hover' 的数据结构
                /*var data1 = {
                    '2017-9-3': [
                        '公布6月CPI数据',
                        '2017年金融时报专家座谈会',
                        '金融论坛北京站国贸第8届讨论会'
                    ],
                    '2017-9-8': [
                        '这是第一条数据',
                        '这是第二条数据'
                    ]
		            }
                
	            // _this.settings.show_type === 'click'   的数据结构 		
        		var data2 = {
        			'2017-9-5':[
        					{id:'index.html', time:'8:20', value:'晨会'},
        					{id:'', time:'12:20', value:'午餐'}
        				],
        			'2017-9-7':[
        					{id:'index.html', time:'09:20', value:'晨会'},
        					{id:'', time:'11:20', value:'午餐'}
        				]
        			
        		}

        		// 推荐历史
        		var data3 = {
        		    '2017-10-12':[{id:'001', title:'标题1'}],
        		    '2017-10-13':{id:'002', title:'标题2'}
        		}
        		data = data2
        		_this.renderData(data)*/
                /*模拟数据 end*/

             // 真实请求
             if(!_this.settings.data_url) return
             $.ajax({
             	type: 'post',
             	data: param,  //当前年月
            	url:_this.settings.data_url,
             	//url:ctx+'/admin/editor/cn/getOneMonthCalendarList',
             	success:function(data){
             	    console.log('data==>', data)
             		_this.renderData(data)
             		$.isFunction(callback) && callback()
             	}
             })
            },
            renderTable: function (year, month) {
                var _this = this
                var param = {
                    year: year + '',
                    month: month + ''
                }
                if (year && month) {
                     _this.$box.find("table tr").not(".header").remove()
                     _this.$box.find("table tbody").append(_this.createCalendar(year, month))
                     _this.$box.find("table tr").not(".header").hide().fadeIn(500)
                    console.log(param)
                    _this.getData(param)
                } else {
                     _this.$box .find("table").append(_this.createCalendar())
                     _this.getData(param, function(){
                     	// 今天的日程详情初次加载时显示
                         if ( _this.show_type == 'click') {
                             var today_dom = $(_this.settings.selector).find('tbody .today')
                             var data = today_dom.attr('data-list')
                             var day = today_dom.attr('data-cur-date')
                             _this.renderDetailData(today_dom, day, data)
                         }

                     })
                }
                _this.$box.find("table tr td:eq(0) .day, table tr td:eq(6) .day").css({'color': '#c90000 !important'})

                // if(_this.settings.size_type === 'big') return
                
                // 活动列表 点击日历
                if(_this.settings.show_type === 'click'){
                    if (_this.settings.size_type == 'small') {// 小日历点击
                        console.log('点击小日历td==>')
                        $(_this.settings.selector).find('tbody td').on('click', function(){

                            var me = this
                            var data = $(me).attr('data-list')
                            var day = $(me).attr('data-cur-date')
                            $(this).parents('table ').find('tbody td').removeClass('active')
                            $(this).addClass('active')
                            _this.renderDetailData(me, day, data)
                        })
                    } else { // 大日历点击时请求数据
                        $(_this.settings.selector).find('tbody td').on('click', function(){
                            var myDate = $(this).attr('data-cur-date')

                            $(_this.settings.selector).find('.day').removeClass('active')
                            $(this).find('.day').addClass('active')

                            $.isFunction(_this.settings.big_cb) && _this.settings.big_cb(myDate)
                        })
                    }

                } else if(_this.settings.show_type === 'hover'){ // 小日历hover
                	$(_this.settings.selector).find('tbody td').hover(function(e){
	                    $(this).addClass('active').siblings().removeClass('active')
	                    	var me = this
	                        var data = $(me).attr('data-list')
							_this.renderDetailData(me, '', data)
	                    
	                }, function(){
	                    $(this).removeClass('active')
	                    $(this).find('.data-box').html('')
	                })
                }
                
                
              	_this.getData(year, month)
                



            }
        }

        