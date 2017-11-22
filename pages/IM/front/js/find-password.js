//全局对象
/*var contextPath = "/"+window.location.pathname.split("/")[1];*/
var FindPwd = {
	init : function(basePath){
		//回车事件绑定
		document.onkeydown=function(event) {
			var e = event || window.event || arguments.callee.caller.arguments[0];
			if (e && e.keyCode == 13) { 
				$('#btnCommit').click();
			}
		};
		
		$("#email,#emailVerify,#password").focus(function(){
			$("#emailError").html("");
		});
		
	 	// 验证码相关操作FindPwd.
	  	cicc_index.getVerifyCode($('.get-verify-code'), function(timer,dom) {
	  		var email = $('#email').val();
	  		if ($.trim(email) == '') {
	  			$("#emailError").html("请输入邮箱地址");
	  			$(dom).removeAttr('data-dis');
	      		clearInterval(timer);
	  			$(dom).text('获取验证码');
	     	} else {
	     		$(this).attr('data-dis');
	         	$.ajax({
	             	url: basePath+"/sendEmail",
	             	data: {email: email},
	             	type: "post",
	             	dataType: "json",
	             	success: function(data) {
	     	    		if (data.ret == 1) { //邮件发送结果提示
	     	    			
	     	    		} else if(data.ret == 0) { //发送失败
	     	    			//恢复按钮
	     	    			$(dom).removeAttr('data-dis');
	     	    			clearInterval(timer);
	     	    			$(dom).text('获取验证码');
	     	    			$("#emailError").html(data.msg);
	     	    		}
	             	},
	             	error: function(e) {
	             		//恢复按钮
	             		$(dom).removeAttr('data-dis');
 		    			clearInterval(timer);
 	      	  			$(dom).text('获取验证码');
 	      	  			$("#emailError").html("邮箱验证码获取失败");
	             	}
	       		});
	 		}
	  	});
		
	  	// 登录按钮点击事件
	  	$('#btnCommit').on('click', function() {
	  		var data = {};	  		
	  		var email = $('#email').val();
	  		var verifyCode = $('#emailVerify').val();
	  		var password = $('#password').val();
	  		if ($.trim(email) == '') {
	  			$("#emailError").html("请输入邮箱！");
	  			return;
	  		}
	  		if ($.trim(verifyCode) == '') {
	  			$("#emailError").html("请输入邮箱验证码！");
	  			return;
	  		}
	  		if ($.trim(password) == '') {
	  			$("#emailError").html("请输入密码！");
	  			return;
	  		} else if($.trim(password).length<6 || $.trim(password).length>20){
	  			$("#emailError").html("密码长度必须在6~20之间!");
	  			return;
	  		}
	  		
		  	data.email = email;
		  	data.verifyCode = verifyCode;
		  	data.password = password;
	  		
	  		//发送异步请求，校验信息是否合法
	 		$.ajax({
		    	url:basePath+"/findPwd",
		    	data: data,
		    	type: "post",
		    	dataType: "json",
		    	success: function(back) {
		    		if (back && back.ret == 1) {
			    		window.location.href=basePath+"/findPasswordSuc?email="+data.email;
		    		} else {
		    			$("#emailError").html(back.msg);    			
		    		}
		    	},
		    	error: function(e) {
		    		$("#emailError").html("密码修改失败"); 
		    	}
		    }); 
	  	});
		
	}

}	

/*//页面加载完成执行
$(function(){
	var basePath="/"+window.location.pathname.split("/")[1];
	FindPwd.init(basePath);
});*/