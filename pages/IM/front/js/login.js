var Login = {
    getVerifyCode: function (timer, _this) {
        var mobile = $('#mobile').val();
        var picVerifyCode = $('#picVerifyCode').val();
        if ($.trim(mobile) == '') {
            $("#mobileError").html('请输入手机号！');
            reductionVerifyCode(timer, _this);
        } else if (!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(mobile)) {
            $("#mobileError").html('手机号格式不正确，请重新输入！');
            reductionVerifyCode(timer, _this);
        } else if ($.trim(picVerifyCode) == '') {
            $("#mobileError").html('请输入图片验证码！');
            reductionVerifyCode(timer, _this);
        } else {
            validatePicVerifyCode(function (flag) {
                if (flag) {
                    $("#mobileError").html('图片验证码错误，请重新输入！');
                    reductionVerifyCode(timer, _this);
                } else {
                    $.ajax({
                        url: ctx + "/sendSms",
                        data: {mobile: mobile, picVerifyCode: picVerifyCode},
                        type: "post",
                        dataType: "json",
                        success: function (data) {
                            if (data && data.ret == 1) {//发送成功
                                $("#mobileError").html("");
                                // alert("发送成功");
                            } else {
                                $("#mobileError").html(data.msg);
                                reductionVerifyCode(timer, _this);
                            }
                        },
                        error: function (e) {
                            $("#mobileError").html('短信验证码发送失败！');
                            reductionVerifyCode(timer, _this);
                        }
                    });
                }
            });
        }
        return;
    },
    // 登录
    doLogin: function (context, callback) {
        var data = {};
        if ($('#rememberMe').is(':checked')) {
            data.rememberMe = true;
        }
        var login_type = $('#myTab > li.active').attr('data-login-type');
        if (login_type == 'email') {
            var email = $('#email').val();
            var password = $('#password').val();
            if ($.trim(email) == '') {
                if (lang != 'en') {
                    $("#emailError").html('请输入账号和密码后登陆！');
                } else {
                    $("#emailError").html('Please enter the account number and password after landing!');
                }
                $("#btnLogin").attr('data-click', 'true');
                return;
            }
            if ($.trim(password) == '') {
                if (lang != 'en') {
                    $("#emailError").html('请输入账号和密码后登陆！');
                } else {
                    $("#emailError").html('Please enter the account number and password after landing!');
                }
                $("#btnLogin").attr('data-click', 'true');
                return;
            }

            data.email = email;
            data.password = password;
            data.target=$("#target").val();
        } else {
            var mobile = $('#mobile').val();
            var picVerifyCode = $('#picVerifyCode').val();
            var smsCode = $('#verifyCode').val();
            if ($.trim(mobile) == '') {
                $("#mobileError").html('请输入手机号！');
                $("#btnLogin").attr('data-click', 'true');
                return;
            } else if (!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(mobile)) {
                $("#mobileError").html('手机号格式不正确，请重新获取！');
                $("#btnLogin").attr('data-click', 'true');
                return;
            } else if ($.trim(picVerifyCode) == '') {
                $("#mobileError").html('请输入图片验证码！');
                $("#btnLogin").attr('data-click', 'true');
                return;
            }
            if ($.trim(smsCode) == '') {
                $("#mobileError").html('请输入短信验证码！');
                $("#btnLogin").attr('data-click', 'true');
                return;
            }
            data.mobile = mobile;
            data.smsCode = smsCode;
            data.picVerifyCode = picVerifyCode; 
        }
        $.ajax({
            url: context + "/login",
            data: data,
            type: "post",
            dataType: "json",
            success: callback,
            error: function (e) {
                if (lang != 'en') {
                    $(".error").html('登录失败！');
                } else {
                    $(".error").html('Login failed!');
                }
                $("#btnLogin").attr('data-click', 'true');
            }
        });
    }
}

function reductionVerifyCode(timer, _this) {
    clearInterval(timer);
    $(_this).html('获取验证码')
    $(_this).removeAttr('data-dis')
}

//校验图片验证码
function validatePicVerifyCode(complete) {
    var id = "picVerifyCode";
    var value = $("#" + id).val();
    /*
     * 长度校验
     */
    if (value.length != 4) {
        complete(true);
        return;
    }
    $.ajax({
        url: ctx + "/login/picVerifyCode",
        data: {picVerifyCode: value},
        type: "POST",
        async: false,
        cache: false,
        success: function (result) {
            if (result.ret != 1) {
                complete(true);
            } else if (result.ret == 1) {
                complete(false);
            }
        }
    });
}