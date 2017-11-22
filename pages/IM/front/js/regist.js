$(function () {


    //通过调用新浪IP地址库接口查询用户当前所在国家、省份、城市、运营商信息
    $.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function () {
        var id = "city";
        var value = $("#" + id).val();
        if (value == "" || value == null) {
            $("#" + id).val(remote_ip_info.city);
        }
    });
    /*
     * 得到所有的错误信息，循环遍历。调用一个方法来确定是否显示错误信息！
     */
    $(".errorClass").each(function () {
        showError($(this));//遍历每一个元素，使用每一个元素来调用showError方法
    });

    /*
     * 输入框得到焦点隐藏错误信息
     */
    $(".form-control").focus(
        function () {
            var labelId = $(this).attr("id") + "Error";//通过输入框找到对应的label的id
            if (($(this).attr("id") == 'mobile' || $(this).attr("id") == 'picVerifyCode') && $("#but1").html().trim() == '获取验证码') {
                $('.js-getVerify-code').removeAttr('data-dis')
            }
            $("#" + labelId).text("");//把label的内容清空
            showError($("#" + labelId));//隐藏没有信息的label
        }
    );
    $(".box").focus(
        function () {
            var labelId = $(this).attr("name") + "Error";//通过输入框找到对应的label的id
            $("#" + labelId).text("");//把label的内容清空
            showError($("#" + labelId));//隐藏没有信息的label
        }
    );
    /*
     * 输入框失去焦点进行校验
     */
    $(".form-control").blur(
        function () {
            var id = $(this).attr("id");//获取当前输入框的id
            if (id == 'verifyCode' || id == 'departmentName' || id == 'duties') {
                return true;
            }
            var funname = "validate" + id.substring(0, 1).toUpperCase() + id.substring(1) + "()";//得到对应的函数校验名
            eval(funname);//执行函数调用
        }
    );

    cicc_index.getVerifyCode($('.js-getVerify-code'), sendVerifyCode)

});

/*
 * 表单提交时校验
 */

function validate() {
    var test = true;
    if (!validateFullName())
        test = false;
    if (!validateEmail())
        test = false;
    if (!validatePassword())
        test = false;
    if (!validateRePassword())
        test = false;
    if (!validateMobile())
        test = false;
    if (!validateVerifyCode())
        test = false;
    if (!validateBirthYear())
        test = false;
    if (!validateSex())
        test = false;
    if (!validateCity())
        test = false;
    if (!validateDegree())
        test = false;
    if (!validateIndustry())
        test = false;
    if (!validateCompanyName())
        test = false;
    if (!validatePicVerifyCode())
        test = false;
    return test;
};

/*
 * 姓名校验方法
 */
function validateFullName() {
    var id = "fullName";
    var value = $("#" + id).val();
    /*
     * 非空校验
     */
    if (!value) {
        $("#" + id + "Error").text("姓名不能为空！");
        showError($("#" + id + "Error"));
        return false;
    }
    /*
     * 长度校验
     */
    /*if(value.length<3||value.length>20){
        $("#" + id + "Error").text("用户名长度必须在3~20之间！");
        showError($("#" + id + "Error"));
        return false;
    }*/
    return true;
}

/*
 * Email校验方法
 */

function validateEmail() {
    var id = "email";
    var value = $("#" + id).val();
    var res = true;
    /*
     * 非空校验
     */
    if (!value) {
        $("#" + id + "Error").text("Email不能为空！");
        showError($("#" + id + "Error"));
        return false;
    }
    /*
     * 长度校验
     */
    if (!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(value)) {
        $("#" + id + "Error").text("Email格式不正确！");
        showError($("#" + id + "Error"));
        return false;
    }
    /*
     * Email是否已被注册
     */
    $.ajax({
        url: ctx + "/register/ajaxValidateEmail",
        data: {email: value},
        type: "POST",
        dataType: "json",
        async: false,
        cache: false,
        success: function (result) {
            if (!result) {
                $("#" + id + "Error").text("Email已被注册!");
                showError($("#" + id + "Error"));
            }
            res = result;
        }
    });
    return res;
}

/*
 * 登陆密码校验方法
 */

function validatePassword() {
    var id = "password";
    var value = $("#" + id).val();
    /*
     * 非空校验
     */
    if (!value) {
        $("#" + id + "Error").text("密码不能为空！");
        showError($("#" + id + "Error"));
        return false;
    }
    /*
     * 长度校验
     */
    if (value.length < 6 || value.length > 20) {
        $("#" + id + "Error").text("密码长度必须在6~20之间！");
        showError($("#" + id + "Error"));
        return false;
    }
    return true;
}

/*
 * 确认密码校验方法
 */

function validateRePassword() {
    var id = "rePassword";
    var value = $("#" + id).val();
    /*
     * 非空校验
     */
    if (!value) {
        $("#" + id + "Error").text("确认密码不能为空！");
        showError($("#" + id + "Error"));
        return false;
    }
    /*
     * 两次输入密码是否相同校验
     */
    if (value != $("#password").val()) {
        $("#" + id + "Error").text("两次输入密码不一致！");
        showError($("#" + id + "Error"));
        return false;
    }
    return true;
}

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
        url: ctx + "/register/ajaxValidateMobile",
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

/*
 * 验证码校验方法
 */

function validateVerifyCode() {
    var id = "verifyCode";
    var value = $("#" + id).val();
    /*
     * 非空校验
     */
    if (!value) {
        $("#" + id + "Error").text("短信验证码不能为空！");
        showError($("#" + id + "Error"));
        return false;
    }
    /*
     * 长度校验
     */
    if (value.length != 6) {
        $("#" + id + "Error").text("短信验证码错误！");
        showError($("#" + id + "Error"));
        return false;
    }
    return true;
}

/*
 * 出生年份校验方法
 */
function validateBirthYear() {
    var id = "birthYear";
    var value = $("#" + id).val();
    /*
     * 非空校验
     */
    if (value == 0) {
        $("#" + id + "Error").text("请选择出生年份！");
        showError($("#" + id + "Error"));
        return false;
    }
    return true;
}

/*
 * 性别校验方法
 */
function validateSex() {
    var name = "sex";
    //var value = $("." + class1).val();
    var value = $('input[name=' + name + ']').filter(':checked').val();
    /*
     * 非空校验
     */
    if (value == undefined) {
        $("#" + name + "Error").text("请选择性别！");
        showError($("#" + name + "Error"));
        return false;
    }
    return true;
}

/*
 * 所在地校验方法
 */
function validateCity() {
    var id = "city";
    var value = $("#" + id).val();
    /*
     * 非空校验
     */
    if (!value) {
        $("#" + id + "Error").text("请输入所在地！");
        showError($("#" + id + "Error"));
        return false;
    }
    return true;
}

/*
 * 学历校验方法
 */
function validateDegree() {
    var id = "degree";
    var value = $("#" + id).val();
    /*
     * 非空校验
     */
    if (value == 0) {
        $("#" + id + "Error").text("请选择学历！");
        showError($("#" + id + "Error"));
        return false;
    }
    return true;
}

/*
 * 行业校验方法
 */
function validateIndustry() {
    var id = "industry";
    var value = $("#" + id).val();
    /*
     * 非空校验
     */
    if (value == 0) {
        $("#" + id + "Error").text("请选择行业！");
        showError($("#" + id + "Error"));
        return false;
    }
    return true;
}

/*
 * 公司名称校验方法
 */
function validateCompanyName() {
    var id = "companyName";
    var value = $("#" + id).val();
    /*
     * 非空校验
     */
    if (!value) {
        $("#" + id + "Error").text("请输入公司名称！");
        showError($("#" + id + "Error"));
        return false;
    }
    return true;
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
        url: ctx + "/register/picVerifyCode",
        data: {picVerifyCode: value},
        type: "POST",
        async: false,
        cache: false,
        success: function (result) {
            if (result.ret != 200) {
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
        //发送验证码
        $.ajax({
            url: ctx + "/register/sendVerifyCode",
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
                    $(_this).removeAttr('data-dis')
                } else if (result.ret == 1) {
                    // alert("发送成功")
                }
            }
        });
}

