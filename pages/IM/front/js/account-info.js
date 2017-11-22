/**
 * Created by xiaoluo on 17-9-5.
 */

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
});

/**
 * @desc 交互
 */

var cicc_index_account = {
    init: function () {
        var _this = this
        $(function () {

            //用户中心修改用户信息
            _this.updateUserInfo()

            // 初始化生日年份插件
            $.ms_DatePicker({
                YearSelector: ".sel_year",
                MonthSelector: ".sel_month",
                DaySelector: ".sel_day"
            });
            
            var curVal = $('.sel_year').attr('data-value')
            $('.sel_year').find('option[value="'+curVal+'"]').attr('selected', 'selected')

        })
    },

    updateUserInfo: function () {
        var _this = this
        var common_info = $('.common-info')
        $('[data-role="user-info-cancel"]').on('click', function () {
            _this._editStatus('save')

            _this._setStatus($('.js-update-info'), {role: 'user-info-edit', text: '修改资料'})
            $(this).hide()
        })

        $('.js-update-info').on('click', function () {
            var role = $(this).attr('data-role')
            //当前按钮是编辑状态
            if (role === 'user-info-edit') {
                _this._setStatus(this, {role: 'user-info-save', text: ' 保存修改'})
                _this._editStatus('edit')
                $('[data-role="user-info-cancel"]').show()// 隐藏取消按钮
            }
            //当前按钮是保存状态
            else if (role === 'user-info-save') {
                $('[data-role="user-info-cancel"]').hide() // 显示取消按钮
                //todo send info to java
                var name_list = common_info.find('[name]')
                var obj = {} //需要发送到数据库的data
                $.each(name_list, function (i, item) {
                    var key = $(item).attr('name')
                    var val = $(item).val()
                    $(item).parents('.need-edit').find('p').text(val)
                    obj[key] = val
                })
                console.log(obj)
                _this._editStatus('save')
                _this._setStatus(this, {role: 'user-info-edit', text: '修改资料'})
                console.log('修改了用户信息')
                $.ajax({
                    url: "../account/update",
                    type: 'post',
                    data: {
                        customer_id: $(".customerId").html(),
                        year: obj["year"],
                        sex: obj["sex"],
                        city: obj["city"],
                        degree: obj["degree"],
                        industry: obj["industry"],
                        companyName: obj["company-name"],
                        departmentName: obj["department-name"],
                        duties: obj["duties"]
                    },
                    success: function (data) {
                        // window.location.reload();
                    }
                });

            }
        })
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
    }

}


/**
 * @desc 初始化首页交互
 */
cicc_index_account.init()


/*
 * 手机号校验方法
 */

function validateMobile() {
    var id = "mobile";
    var value = $("#" + id).val();
    var res = true;
    /*
     * 非空校验
     */
    if (!value) {
        $("#" + id + "Error").text("手机号不能为空！");
        showError($("#" + id + "Error"));
        return false;
    }
    /*
     * 长度校验
     */
    if (!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(value)) {
        $("#" + id + "Error").text("手机号格式不正确！");
        showError($("#" + id + "Error"));
        return false;
    }
    /*
     * 手机号是否已被注册
     */
    $.ajax({
        url: ctx + "/ucenter/account/ajaxValidateMobile",
        data: {mobile: value},
        type: "POST",
        dataType: "json",
        async: false,
        cache: false,
        success: function (result) {
            if (!result) {
                $("#" + id + "Error").text("手机号已被注册");
                showError($("#" + id + "Error"));
            }
            res = result;
        }
    });
    return res;
}

//校验图片验证码
function validatePicVerifyCode() {
    var id = "picVerifyCode";
    var value = $("#" + id).val();
    var res = true;
    /*
     * 非空校验
     */
    if (!value) {
        $("#" + id + "Error").text("图片验证码不能为空！");
        showError($("#" + id + "Error"));
        return false;
    }
    /*
     * 长度校验
     */
    if (value.length != 4) {
        $("#" + id + "Error").text("图片验证码错误！");
        showError($("#" + id + "Error"));
        return false;
    }
    $.ajax({
        url: ctx + "/ucenter/account/picVerifyCode",
        data: {picVerifyCode: value},
        type: "POST",
        async: false,
        cache: false,
        success: function (result) {
            if (result.ret != 1) {
                $("#" + id + "Error").text(result.msg);
                showError($("#" + id + "Error"));
                res = false;
            } else if (result.ret == 200) {
                res = true;
            }
        }
    });
    return res;
}

/*
 * 判断啊当前元素是否存在内容，如果存在显示，不存在不显示！
 */
function showError(ele) {
    var text = ele.text();
    if (!text) {
        ele.css("display", "none");
    }
    else {
        ele.css("display", "");
    }
}


/*
 * 发送验证码
 */
function sendVerifyCode(timer, _this) {

    var labelId = "verifyCodeError";//通过输入框找到对应的label的id
    $("#" + labelId).text("");//把label的内容清空
    showError($("#" + labelId));//

    if (!validateMobile() || !validatePicVerifyCode()) {
        clearInterval(timer);
        $(_this).html('获取验证码')
        $(_this).removeAttr('data-dis')
        return false;
    }
    var value = $("#mobile").val();
    var picCode = $("#picVerifyCode").val();
        $.ajax({
            url: ctx + "/ucenter/account/sendSms",
            data: {phone: value, picVerifyCode: picCode},
            type: "POST",
            dataType: "json",
            async: false,
            cache: false,
            success: function (result) {
                if (result.ret != 1) {
                    $("#" + result.data + "Error").text(result.msg);
                    showError($("#" + result.data + "Error"));
                    clearInterval(timer);
                    $(_this).html('获取验证码')
                    $(_this).removeAttr('data-dis')
                } else if (result.ret == 1) {
                    // alert("发送成功")
                }
            }
        });
}

function timerCb (timer, _this) {
    if ($('#edit-phone').css('display') == 'none') {
        clearInterval(timer)
        $(_this).html('获取验证码')
        $(_this).removeAttr('data-dis')
    }
    /*$('#mobile').on('change', function () {
        clearInterval(timer)
        $(_this).html('获取验证码')
        $(_this).removeAttr('data-dis')
    })*/
}

$(function () {

    cicc_index.getVerifyCode($('.js-getVerify-code'), sendVerifyCode, timerCb)


    /*
     * 得到所有的错误信息，循环遍历。调用一个方法来确定是否显示错误信息！
     */
    $(".errorClass").each(function () {
        showError($(this));//遍历每一个元素，使用每一个元素来调用showError方法
    });
    /*
     * 输入框得到焦点隐藏错误信息
     */
    $(".form1").focus(
        function () {
            var labelId = $(this).attr("id") + "Error";//通过输入框找到对应的label的id
            if (($(this).attr("id") == 'mobile' || $(this).attr("id") == 'picVerifyCode') && $("#but1").html().trim() == '获取验证码') {
                $('.js-getVerify-code').removeAttr('data-dis')
            }
            $("#" + labelId).text("");//把label的内容清空
            showError($("#" + labelId));//隐藏没有信息的label
        }
    );
    /*
     * 输入框失去焦点进行校验
     */
    $(".form1").blur(
        function () {
            var id = $(this).attr("id");//获取当前输入框的id
            if (id == 'verifyCode') {
                return true;
            }
            var funname = "validate" + id.substring(0, 1).toUpperCase() + id.substring(1) + "()";//得到对应的函数校验名
            eval(funname);//执行函数调用
        }
    );
});

function sub() {
    if (!validateMobile()) {
        return false;
    }
    if (!validatePicVerifyCode()) {
        return false;
    }
    var value = $("#verifyCode").val();
    if (!value) {
        $("#verifyCodeError").text("请输入短信验证码！");
        showError($("#verifyCodeError"));
        return false;
    }
    var value = $("#mobile").val();
    var picCode = $("#picVerifyCode").val();
    var smsVerifyCode = $("#verifyCode").val();
    //更新手机号
    $.ajax({
        url: ctx + "/ucenter/account/updatePhone",
        data: {phone: value, picVerifyCode: picCode, verifyCode: smsVerifyCode},
        type: "POST",
        // dataType: "json",
        async: false,
        cache: false,
        success: function (result) {
            if (result.ret == 2) {
                alert(result.msg)
                var param = {
                    type:'alert-fail',
                    myTimer: '1500',
                    alertText:' 修改失败'
                }
                cicc_index.alert.renderDom(param)
            } else if (result.ret != 1) {
                $("#" + result.data + "Error").text(result.msg);
                showError($("#" + result.data + "Error"));
            } else if (result.ret == 1) {
                $(".mobile").html(value)
                $('#edit-phone').slideToggle();
                var param = {
                    type:'alert-ok',
                    myTimer: '1500',
                    alertText:' 修改成功'
                }
                cicc_index.alert.renderDom(param)
                // alert(result.msg)
            }
        }
    });
}