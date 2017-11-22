/**
 * @author moma
 * @date 2017/09/12
 * @desc 通用界面交互,为了避免全局空间污染，将新增的函数加到cicc_index 这个对象中，作为属性调用
 */

var is_debugger = false // 是否是开发模式

// 插件
$.extend({
    ms_DatePicker: function (options) {
        var defaults = {
            YearSelector: "#sel_year",
            MonthSelector: "#sel_month",
            DaySelector: "#sel_day",
            FirstText: "--",
            FirstValue: 0
        };
        var opts = $.extend({}, defaults, options);
        var $YearSelector = $(opts.YearSelector);
        var $MonthSelector = $(opts.MonthSelector);
        var $DaySelector = $(opts.DaySelector);
        var FirstText = opts.FirstText;
        var FirstValue = opts.FirstValue;

        // 初始化
        var str = "<option value=\"" + FirstValue + "\">" + FirstText + "</option>";
        $YearSelector.html(str);
        $MonthSelector.html(str);
        $DaySelector.html(str);

        // 年份列表
        var yearNow = new Date().getFullYear();
        var yearSel = $YearSelector.attr("rel");
        for (var i = yearNow; i >= 1900; i--) {
            var sed = yearSel == i ? "selected" : "";
            var yearStr = "<option value=\"" + i + "\" " + sed + ">" + i + "</option>";
            $YearSelector.append(yearStr);
        }

        // 月份列表
        var monthSel = $MonthSelector.attr("rel");
        for (var i = 1; i <= 12; i++) {
            var sed = monthSel == i ? "selected" : "";
            var monthStr = "<option value=\"" + i + "\" " + sed + ">" + i + "</option>";
            $MonthSelector.append(monthStr);
        }

        // 日列表(仅当选择了年月)
        function BuildDay() {
            if ($YearSelector.val() == 0 || $MonthSelector.val() == 0) {
                // 未选择年份或者月份
                $DaySelector.html(str);
            } else {
                $DaySelector.html(str);
                var year = parseInt($YearSelector.val());
                var month = parseInt($MonthSelector.val());
                var dayCount = 0;
                switch (month) {
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                    case 8:
                    case 10:
                    case 12:
                        dayCount = 31;
                        break;
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        dayCount = 30;
                        break;
                    case 2:
                        dayCount = 28;
                        if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
                            dayCount = 29;
                        }
                        break;
                    default:
                        break;
                }

                var daySel = $DaySelector.attr("rel");
                for (var i = 1; i <= dayCount; i++) {
                    var sed = daySel == i ? "selected" : "";
                    var dayStr = "<option value=\"" + i + "\" " + sed + ">" + i + "</option>";
                    $DaySelector.append(dayStr);
                }
            }
        }

        $MonthSelector.change(function () {
            BuildDay();
        });
        $YearSelector.change(function () {
            BuildDay();
        });
        if ($DaySelector.attr("rel") != "") {
            BuildDay();
        }
    } // End ms_DatePicker
})

// 联动
function selectCategary(options) {
    var _this = this
    var defaults = {
        dom: '.a-categray-box', // 联动的盒子
        level: 3, // 联动的级别
        append_dom: '.choosed-list', // 需要添加的盒子
        is_fixed_width: false // 添加进去的dom 是否固定的宽度
    }
    _this.settings = $.extend({}, defaults, options)
    _this.init()
}

selectCategary.prototype = {
    init: function () {
        var _this = this
        _this.data = {
            k: '0',
            v: [
                {
                    "k": "宏观",
                    "v": [
                        {
                            "k": "a",
                            "v": ["aa"]
                        }
                    ]
                },
                {
                    "k": "策略",
                    "v": [
                        {
                            "k": "b",
                            "v": ["bb"]
                        }
                    ]
                },
                {
                    "k": "大宗",
                    "v": [
                        {
                            "k": "c",
                            "v": ["cc"]
                        }
                    ]
                },
                {
                    "k": "固收",
                    "v": [
                        {
                            "k": "d",
                            "v": ["dd"]
                        }
                    ]
                },
                {
                    "k": "行业",
                    "v": [
                        {
                            "k": "建材",
                            "v": [
                                {'k': '建材-01'}
                            ]
                        },
                        {
                            "k": "贵金属",
                            "v": [
                                {'k': '贵金属-01'}
                            ]
                        }
                    ]
                }
            ]
        }
        //渲染默认数据
        if ($(_this.settings.dom).length < 1) return

        var h = _this.render(true, 1, '')
        $(_this.settings.dom).find('[data-level="1"]').html(h)

        // hover 效果
        $(document).on('mouseenter', '[data-level] a', function () {
            if (!$(this).attr('data-last')) {
                $(this).parent().addClass('active').siblings().removeClass('active')
                var dom_data = $(this).data(),
                    cur_level = dom_data.level,
                    id = dom_data.id,
                    h = _this.render(false, 2, id)
                if (cur_level == 1) {
                    $(_this.settings.dom).find('[data-level="' + (cur_level + 1) + '"]').html('')
                    $(_this.settings.dom).find('[data-level="' + (cur_level + 2) + '"]').html('')
                }
                $(_this.settings.dom).find('[data-level="' + (cur_level + 1) + '"]').html(h)
            }

        })

        // 点击效果
        $(document).on('click', _this.settings.dom + ' a[data-val]', function () {

            var my_level = $(this).data().level
            var total = ''
            var level_1_v = $('[data-level="1"] li.active a span').text()
            var level_2_v = $('[data-level="2"] li.active a span').text()
            var level_3_v = $(this).find('span').text()
            if (_this.settings.level === 1) {
                total = $(this).find('span').text()
            } else {
                switch (my_level) {
                    case 2:
                        total = level_1_v + '>' + level_2_v
                        break;
                    case 3:
                        total = level_1_v + '>' + level_2_v + '>' + level_3_v
                }
            }

            var fixed_width = _this.settings.is_fixed_width ? 'name-bage' : ''
            str = '<span class="opt-bage ' + fixed_width + '">' +
                '<b>' + total + '</b>' +
                '<i>×</i>' +
                '</span>'
            $(_this.settings.dom).find(_this.settings.append_dom).append(str)
        })
    },
    render: function (is_init, level, id) {
        var _this = this
        var str = '<ul>'
        $.each(_this.data.v, function (i, item) {
            //a
            if (is_init) {
                var is_single = _this.settings.level === 1
                var more = is_single ? '' : '<i class="pull-right glyphicon glyphicon-menu-right"> </i>'
                var get_val_status = is_single ? 'data-val' : ''
                str += '<li><a href="javascript:void(0)" data-id="' + item.k + '" data-level="' + level + '" ' + get_val_status + ' class="clearfix"><span>' + item.k + '</span>' + more + '</a></li>'
            }
            //b
            else if (id == item.k) {
                $.each(item.v, function (h, value) {
                    str += '<li><a href="javascript:void(0)" data-id="' + value.k + '"  data-level="' + (level) + '" class="clearfix" data-val> <span>' + value.k + '</span><i class="pull-right glyphicon glyphicon-menu-right"> </i></a></li>'
                })
            }
            // c
            else {
                $.each(item.v, function (h, value) {
                    if (id == value.k) {
                        $.each(value.v, function (h, val) {
                            if (val.k) {
                                str += '<li><a href="javascript:void(0)" data-last data-level="' + (level + 1) + '" data-id="' + val.k + '"  class="clearfix" data-val><span>' + val.k + '</span></a></li>'
                            }
                        })
                    }
                })
            }
        })
        str += '</ul>'

        return str
    }
}


// 交互信息
var cicc_index = {
    init: function () {
        var _this = this
        $(function () {
            $(document).on('show.bs.modal', '#ciccModal', function () {
                if ($('.ct-detail').length) {
                    cicc_index.scrollBar('window', '.ct-detail')
                    //内容高度小于最大高度将滚动条height:100%去掉
                    $(".mCustomScrollBox").css('height', "auto");
                }

                $(this).css('visibility', 'hidden')

            })
            $(document).on('shown.bs.modal', '#ciccModal', function () {
                var _this = this
                var diaDom = $(_this).find(' .modal-dialog')
                var myHeight = '-' + parseInt(diaDom.outerHeight()) / 2 + 'px'
                diaDom.css({top: '50%', 'margin-top': myHeight})
                $(this).css('visibility', 'visible')


            })


            // 下拉事件
            _this.slideBox()

            //下拉选择事件
            _this.selectBox()

            //搜索框focus
            _this.showSearch()

            //tab
            _this.useTab()

            // 初始化生日年份插件
            // $.ms_DatePicker({
            //   YearSelector: ".sel_year",
            //   MonthSelector: ".sel_month",
            //   DaySelector: ".sel_day"
            // });

            //选择
            $('.set-btn').on('click', function () {
                var status = $(this).find('input').is(':checked')
                console.log(status)
            })

            //初始化行业
            _this.initSelect(['trade', 'record'])

            //用户中心修改用户信息
            // _this.updateUserInfo()

            //修改手机号
            //_this.updateUserPhone()

            //获取验证码
            //_this.getVerifyCode()

            //个人中心搜索
            // _this.listFocusShow()

            //点击收藏
            //_this.setStar()

            //初始化时间选择器
            _this.initDatetimepicker()

            //搜索组件
            _this.searchComponent.init()

            // 名称小色块删除
            _this.nameBage.init()

            //专题详情页的cover
            _this.coverImg()


            // 设置大导航的样式状态
            //_this.setMenuStatus()

            // index 点击 document 处理
            _this.clickHandle()

            // 设置 左侧导航的位置
            //_this.setUserCenterNav()

            // 回到顶部
            _this.backTop()
        })
    },
  
    // 设置搜索容器的宽度
    setSerchBoxWidth: function (lang) {
        if (lang == 'en') {
          var w = $('.search-type .search-content').width()
          $('.search-keyword').css({'width': w})
        } else {
          $('.search-keyword').css({'width': '309px'})
        }
    },

    // 回到顶部
    backTop: function () {
        if (!$('#back-top').length) return
        $(window).scroll(function () {
            if ($(this).scrollTop() > 250) {
                $('#back-top').fadeIn()
            } else {
                $('#back-top').fadeOut()
            }
        })
        $('#back-top').on('click', function () {
            console.log('点击了回到顶部==>', $('html, body').scrollTop())

            $('html, body').animate({scrollTop: '0'}, 500)
        })
        $('#back-top i').hover(function () {
            $(this).parent().find('span').css('display', 'block')
            $(this).parent().find('span').stop(true).animate({left: '-90px', opacity: '1'}, 300)
        }, function () {
            $(this).parent().find('span').stop(true).animate({left: '-100px', opacity: '0'}, 200, function () {
                $(this).parent().find('span').css('display', 'none')
            })
        })
    },
    hideDom: function (e, selector_list, dom) {
        var tag = $(e.target)
        var ref = $(tag).attr('data-ref')
        $.each(selector_list, function (i, item) {
            if (ref !== item) {
                $(item).find(dom).slideUp()
            }
        })

    },
    clickHandle: function () {
        var _this = this
        $(document).on('click', function (e) {
            var selector_list = ['#hy-jr', '#hy-bz', '#gs-jr', '#gs-bz']
            _this.hideDom(e, selector_list, '.yb-data-list')
            var cur_ref = $(e.target).attr('data-ref')
            if (cur_ref !== '#zs-tj') {
                $('#zs-tj').slideUp()
            }
        })
    },

    // 下拉
    slideBox: function () {
        var box = '[data-role="list-box"]'
        var list = '[data-role="list"]'
        var list_ctr = $(box).find('[data-role="list-ctr"]')
        $(list_ctr).on('click', function () {
            $(this).parents(box).find(list).toggle()
        })

        $(document).on('click', function (e) {
            var tag = $(e.target)
            var is_contains = $(tag).parents(box).length == 1
            if (!is_contains) {
                $(list).hide()
                if ($(list_ctr).hasClass('active')) {
                    $(list_ctr).removeClass('active')
                }
            }
        })
    },
    selectBox: function () {
        var select_box = $('[data-select]')
        var list_content = select_box.find('.list-content')
        var search_val = select_box.find('[data-role="value"]')
        select_box.find('li').on('click', function (e) {
            console.log(e.currentTarget)
            var arr = ['研报', '活动', '专题']
            if (lang == "en") {
                arr = ['Reports', 'Events', 'Topics']
            }
            var val = $(this).find('a').text(),
                list_li = select_box.find('li'),
                idx = $.inArray(val, arr)
            search_val.text(val)
            arr.splice(idx, 1)
            $.each(list_li, function (i, item) {
                $(this).find('a').text(arr[i])
            })
        })

        select_box.find('li').on('blur', function () {
            list_content.hide()
        })
    },
    showSearch: function () {
        var search_content = $('.search-content')
        var search_keyword = search_content.find('.search-keyword')
        search_content.find('input').on('focus', function () {
            search_keyword.show()
        })

        search_content.find('a').on('click', function () {
            search_keyword.hide()
        })

        $(document).on('click', function (e) {
            var tag = $(e.target)
            var is_contains = $(tag).parents('.search-content').length == 1
            if (!is_contains) {
                $('.search-keyword').hide()
            }
        })

    },

    /**
     * @desc 初始化下拉列表信息 有行业信息/学历信息
     * @param {Array} options trade/record
     */
    initSelect: function (options) {
        var settings = {
            trade: [
                '金融',
                '能源',
                '房地产、建筑业',
                '计算机',
                '通讯',
                '服务（旅游、餐厅、酒店）',
                '教育、培训',
                '娱乐媒体（演艺、影视、广告）',
                '环保',
                '航空航天',
                '机械制造',
                '政府机关',
                '其他',
            ],
            record: [
                '博士',
                '硕士',
                '本科',
                '大专',
                '高中',
                '中专'
            ]
        }

        $.each(options, function (i, item) {
            var str = ''
            $.each(settings[item], function (k, info) {
                str += '<option>' + info + '</option>'
            })
            $('.' + item).html(str)
        })

    },
    useTab: function () {
        if ($('.nav li').length < 1) return
        $('.nav li:eq(0) a').tab('show')
    },

    /**
     * @desc 是否编辑状态
     * @param {String} status edit/save
     */
    _editStatus: function (status) {
        var common_info = $('.common-info')
        if (status === 'edit') {
            common_info.find('.form-group .need-edit p').hide()
            common_info.find('.form-group .need-edit .edit-status').show()
        } else if (status === 'save') {
            common_info.find('.form-group .need-edit p').show()
            common_info.find('.form-group .need-edit .edit-status').hide()
        }

    },

    /**
     * @desc 设置当前的dom状态
     * @param {Object}  target 当前dom 对象
     * @param {Object}  obj obj {role:'',text:''}
     */
    _setStatus: function (target, obj) {
        $(target).attr('data-role', obj.role)
        $(target).text(obj.text)
    },

    /**
     * @desc 用户手机号修改
     */
    updateUserPhone: function () {
        var _this = this
        $('.js-phone-edit').on('click', function () {
            var role = $(this).attr('data-role')
            var p = $(this).parents('.phone-edit')
            var val = p.find('.phone-edit-status input').val()
            var p_dom = p.find('p')
            var edit_phone_dom = p.find('.phone-edit-status')
            if (role === 'phone-edit') {
                //设置节点状态
                _this._setStatus(this, {role: 'phone-save', text: ' 保存'})
                //设置dom状态
                p_dom.hide()
                edit_phone_dom.show()
            } else if (role === 'phone-save') {
                _this._setStatus(this, {role: 'phone-edit', text: ' 编辑'})
                p_dom.text(val)
                p_dom.show()
                edit_phone_dom.hide()
            }

        })
    },

    /**
     * @desc 获取验证码
     * @param dom 当前dom, callback回调函数
     */
    getVerifyCode: function (dom, callback, timerCallback) {
        dom = $(dom)
        dom.on('click', function () {
            var _this = this
            var status = $(this).attr('data-dis')
            console.log(status)
            if (status !== undefined) return
            var count = 120  // 此处时间按需求定义
            $(this).attr('data-dis', '0')
            var timer = setInterval(function () {
                if (count < 2) {
                    $(_this).text('获取验证码')
                    $(_this).removeAttr('data-dis')
                    $(_this).removeClass('sended')
                    clearInterval(timer)
                } else {
                    count--
                    if (!$(_this).hasClass('sended')) {
                        $(_this).addClass('sended')
                    }
                    $(_this).html('重新获取<br>(' + count + ')')
                }
                $.isFunction(timerCallback) && timerCallback(timer, _this)
            }, 1000)
            $.isFunction(callback) && callback(timer, _this)
        })
    },
    listFocusShow: function () {
        var box = $('.center-search')
        box.find('input').on('focus', function () {
            // $(this).parents('.center-search').find('.search-list').show()
        })
        box.find('a').on('click', function () {
            $(this).parents('.center-search').find('.search-list').hide()
        })

        $(document).on('click', function (e) {
            var tag = $(e.target)
            var is_contains = $(tag).parents('.center-search').length == 1
            if (!is_contains) {
                $('.search-list').hide()
            }
        })
    },

    // 初始化时间选择插件
    initDatetimepicker: function () {
        if ($('[data-date]').length < 1) return
        $('[data-date]').datetimepicker({
                format: 'yyyy/mm/dd',
                language: 'zh-CN',
                startView: 'month',
                todayHighlight: true,
                minView: 'month',
                autoclose: true
            }
        )
    },

    // 查询组件
    searchComponent: {
        init: function () {
            var _this = this
        },
        searchComponent: function () {
            _this.search_dom_str = '.component-search'
            // _this.search_list_str = '.search-data-list'
            var input_dom = $(_this.search_dom_str).find('input')

            _this.data = [
                {id: '1', name: '宋丹丹'},
                {id: '2', name: '张青书'},
                {id: '3', name: '宋江'},
                {id: '4', name: '盛青春'}
            ]
            input_dom.focus(function () {
                $(this).parents(_this.search_dom_str).find(_this.search_list_str).show()
                var search_list = $(this).parents(_this.search_dom_str).find(_this.search_list_str)

                _this.renderList(search_list, $.trim($(this).val()))
            })

            $(document).on('click', function (e) {
                var tag = $(e.target)
                var is_contains = $(tag).parents(_this.search_dom_str).length == 1
                if (!is_contains) {
                    $(_this.search_list_str).hide()
                }
            })

            input_dom.keyup(function () {
                var cur_val = $.trim($(this).val())
                console.log(cur_val)
                var search_list = $(this).parents(_this.search_dom_str).find(_this.search_list_str)
                _this.renderList(search_list, cur_val)
            })

            $(document).on('click', _this.search_list_str + ' li', function () {
                var cur_select_val = $(this).find('a').text()
                $(this).parents(_this.search_dom_str).find('input').val(cur_select_val)
                $(_this.search_list_str).hide()
            })
        },
        renderList: function (dom, keyword) {
            var _this = this
            var arr = []
            if (keyword) {
                $.each(_this.data, function (k, v) {
                    var cur_v_arr = (v.name).split('')
                    if ($.inArray(keyword, cur_v_arr) > -1 || keyword == v.name || v.name.indexOf(keyword) > -1) {
                        var obj = {}
                        obj.id = v.id
                        obj.name = v.name
                        arr.push(obj)
                    }
                })
            } else {
                arr = _this.data
            }
            dom.html('')
            var str = '<ul>'
            if (!arr.length) {
                dom.hide()
                return
            }
            $.each(arr, function (i, item) {
                str += '<li><a href="javascript:void(0)" data-id="' + item.id + '">' + item.name + '</a></li>'
            })
            dom.html(str)
        }
    },

    // name-bage删除
    nameBage: {
        init: function () {
            var _this = this
            _this.dom = '.opt-bage'
            _this.deleteBage()
        },
        deleteBage: function () {
            var _this = this
            $(document).on('click', _this.dom + ' i', function () {
                // $(this).parent().remove()
            })
        }
    },
    coverImg: function () {
        if (!$('.cover-bg').length) return
        $('.cover-bg .cover-text').css({"opacity": .8})
        $('.cover-bg').hover(function () {
            $(this).find('.cover-text').stop(true).animate({top: 0}, 300)
        }, function () {
            $(this).find('.cover-text').stop(true).animate({top: 375}, 300)
        })
    },

    /**
     * @desc 通用对话框
     * @param {Object}  param = {type:'', content:{}, suc_opt: function, err_opt: function, hidden_modal:function}
     * type 对话框类型  tip 为简单提示 || alert 是警告 || cicc-modal 为普通提示对话框  用来定义风格，后期完善
     * content.title  提示的标题 content.body  提示的内容 content.suc_opt_text  成功按钮的文案 content.err_opt_text 失败操作的文案
     */
    ciccModal: function (options) {
        if ($('#ciccModal').length > 0) {
            $('#ciccModal').detach()
        }
        var options = options || {}
        var content = options.content || {}
        var title = content.title === undefined ? '系统提示' : content.title
        var body = content.body || '这里是提示框内容'
        var suc_txt = content.suc_opt_text === undefined ? '保存' : content.suc_opt_text
        var err_txt = content.err_opt_text === undefined ? '取消' : content.err_opt_text
        var hidden_modal = options.hidden_modal || null
        var suc_opt = options.suc_opt || null
        var err_opt = options.err_opt || null
        var type = options.type || 'cicc-modal'
        var initModal = options.initModal
        var is_show_header_close = options.is_show_header_close === undefined ? true : false
        var backdrop = options.cicc_backdrop === undefined ? true : options.cicc_backdrop

        var h = ''
        h += '<div class="modal fade ' + type + '" id="ciccModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">'
        h += '<div class="modal-dialog" role="document">'
        h += '<div class="modal-content">'

        h += '<div class="modal-header">'
        h += is_show_header_close ? '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' : ''
        h += title ? '<h4 class="modal-title" id="myModalLabel">' + title + '</h4>' : ''
        h += '</div>'

        h += '<div class="modal-body">' + body + '</div>'

        var suc_opt_dom = suc_txt ? '<span class="btn  btn-primary"  id="cicc-modal-confirm">' + suc_txt + '</span>' : ''
        var err_opt_dom = err_txt ? '<span class="btn btn-default" data-dismiss="modal" id="cicc-modal-cancel">' + err_txt + '</span>' : ''
        if (suc_opt_dom || err_opt_dom) {
            h += '<div class="modal-footer text-center">'
            h += suc_opt_dom
            h += err_opt_dom
            h += '</div>'
        }

        h += '</div>'
        h += '</div>'
        h += '</div>'

        $('body').append(h)
        $('#ciccModal').modal({backdrop: backdrop})
        $('#ciccModal').modal('show')
        // modal生成之后的回调
        $.isFunction(initModal) && initModal()

        //取消按钮点击回调
        if (err_opt_dom) {
            $('#cicc-modal-cancel').on('click', function () {
                $.isFunction(err_opt) && err_opt()
            })
        }


        //确认按钮点击回调
        if (suc_opt_dom) {
            $('#cicc-modal-confirm').on('click', function () {
                $('#ciccModal').modal('hide')
                $.isFunction(suc_opt) && suc_opt()
            })
        }


        // 对话框消失后回调
        if (hidden_modal) {
            $('#ciccModal').on('hidden.bs.modal', function () {
                $.isFunction(hidden_modal) && hidden_modal()
            })
        }

    },

    /**
     * @desc 省略号
     * @param domlist dom的jquery 对象， num 需要多少行再省略
     */
    clampString: function (domlist, num) {
        if (!$(domlist).length) return
        $.each(domlist, function (i, item) {
            $clamp(item, {clamp: num})
        })
    },

    /**
     * @desc 添加滚动条
     * @param {String} type 加载类型 取值为 window/dLoad
     * @param {String} selector dom选择器
     */
    scrollBar: function (type, selector) {
        $(selector).mCustomScrollbar()
    },

    //设置大导航的状态
    setMenuStatus: function () {
        var ref = window.location.href
        var host = window.location.host
        if (!ctx) return
        $('.head-bottom .c-nav ul li').removeClass('active')
        var nav_list = $('.head-bottom .c-nav ul li a')
        $.each(nav_list, function (i, item) {
            var cur_ref = $(item).attr('data-list')
            var ref_index = ref.indexOf(ctx)
            var cur_str1 = ref.substring(ref_index)
            var cur_str2 = cur_str1.split('?')
            if (cur_str2[0] === (ctx + '/frontend/document/view')) {
                var cur_str = cur_str2[0]
            } else if (cur_str2[0] === (ctx + '/frontend/search')) {
                var cur_str = cur_str1.split('&')[0]
            } else {
                var cur_str = ref.substring(ref_index)
            }

            console.log(cur_str)
            console.log(cur_ref)

            // 首页
            if ((cur_str === cur_ref + '/' || cur_str === cur_ref + '/index') && i === 0) {
                $(item).parents('li').addClass('active')
                return false
            }

            if (cur_str === cur_ref) {
                $(item).parents('li').addClass('active')
                return false
            }
        })
    },

    // alert
    alert: {
        creatDom: function (type, id, param) {
            var h = ''
            switch (type) {
                case 'alert-ok':
                    h += '<div data-role="alert" class="clearfix cicc-alert bg-golden" id="' + id + '">' +
                        '      <i class="img icon-alert-ok"></i>' +
                        '      <p class="mt10">' + param.alertText + '</p>' +
                        '    </div>'
                    break;
                case 'alert-fail':
                    h += '<div data-role="alert" class="clearfix cicc-alert bg-red" id="' + id + '">' +
                        '      <i class="img icon-alert-fail"></i>' +
                        '      <p class="mt10">' + param.alertText + '</p>' +
                        '    </div>'
                    break;
                case 'alert-tip':
                    h += '<div data-role="alert" class="clearfix cicc-tip" style="display: block" id="' + id + '">\n' +
                        '      <p class="mt10">' + param.alertText + '</p>\n' +
                        '    </div>'
                    break;
                default:
                    break;
            }
            return h
        },
        renderDom: function (param) {
            var _this = this
            $('[data-role="alert"]').detach()
            var time_stamp = new Date().getTime()
            var dom = _this.creatDom(param.type, 'alert-' + time_stamp, param)
            var timer = param.myTimer === '' ? 1000 : param.myTimer
            $('body').append(dom)
            if (param.type == 'alert-tip') {
                var tipDom = $('#alert-' + time_stamp)
                var alertW = tipDom.outerWidth()
                var alertH = tipDom.outerHeight()
                var mt = '-' + parseInt(alertH / 2) + 'px'
                var ml = '-' + parseInt(alertW / 2) + 'px'
                tipDom.css({'margin-top': mt, 'margin-left': ml})
            }
            param.callback ? $.isFunction(param.callback) && param.callback() : (
                setTimeout(function () {
                    $('#alert-' + time_stamp).detach()
                    return
                }, timer))
        }
    }
}

// 弱提示 初始化方法
/*var param = {
  type:'alert-ok',
  myTimer: '6000',
  alertText:' 删除成功'
}
cicc_index.alert.renderDom(param)*/

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}


/**
 * @desc 初始化首页交互
 */
cicc_index.init()
