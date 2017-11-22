
	var apiURL = WebIM.config.apiURL;
	var curUserId = null;
	var curChatUserId = null;
	var conn = null;
	var curRoomId = null;
	var msgCardDivId = "chat01";
	var talkToDivId = "talkTo";
	var talkInputId = "talkInputId";
	var fileInputId = "fileInput";
	var bothRoster = [];
	var toRoster = [];
	var maxWidth = 200;
	var groupFlagMark = "group--";
	var groupQuering = false;
	var textSending = false;
	var appkey = "1132170906115603#cicc-web";
	var time = 0;
	var userName = ''

	window.URL = window.URL || window.webkitURL || window.mozURL
			|| window.msURL;

	// 接收消息时消息回显时显示消息类型
	var getFileType = function (fileName) {
		var lastDotIndex = fileName.lastIndexOf('.')
		var ext = fileName.substring(lastDotIndex + 1)
		var imgType = ['png','jpg','jpeg','bmp','gif']
		var otherType = ['doc','pdf','zip','txt']
		var vedioType = ['mp3', 'amr', 'wmv','mp4']
		var type = ''
		if ($.inArray(ext, imgType) > -1) {
			type = 'img'
		} else if ($.inArray(ext, vedioType) > -1) {
            type = 'vedio'
		} else {
			type = 'other'
		}
		return type
	}

	var getExt = function (fileName) {
        var lastDotIndex = fileName.lastIndexOf('.')
        var ext = fileName.substring(lastDotIndex + 1)
		return ext
	}

	// 放大图片
	var enlargeImg = function (target) {
		var curImgSrc = $(target).find('img').attr('src')
		var curImg = '<img src="'+curImgSrc+'">'
		$('#im-ct').html(curImg)

        $('.im-enlarge-content').show(0, function () {
        	var imgH = $('#im-ct').find('img').height()
            $('#im-ct').css('margin-top', '-' + parseInt(imgH/2) + 'px')
		})
	}

	// 未读消息数量
	var msgNumObj = {}

	// 放大并播放视频
	var enlargeVedio = function (target) {
		var curUrl = $(target).find('source').attr('src')
		var fileExt = $(target).attr('data-file-type')
		var largeVedioId = 'my-vedio-' + new Date().getTime()
		var vedioH = '<video id="'+largeVedioId+'" class="video-js" controls preload="auto" width="740" height="400"\n' +
                     'poster="MY_VIDEO_POSTER.jpg" data-setup="{}">\n' +
        			 '<source src="'+curUrl+'" type="video/'+fileExt+'">'
			         '<p class="vjs-no-js">\n' +
			         'To view this video please enable JavaScript, and consider upgrading to a web browser that\n' +
			         '<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>\n' +
			           '</p>\n' +
			        '</video>'

        $('#im-ct').html(vedioH)
        var myPlayer = videojs(largeVedioId);
        videojs(largeVedioId).ready(function(){
            var myPlayer = this;
            myPlayer.play();
        })
        $('#im-ct > div').css('margin-top', '-250px')
        $('.im-enlarge-content').show()

	}

	// 渲染消息
    var  renderMsg = {
        append: function (type) {
            var _this = this
            if (type == 'img') {
                _this.renderImgMsg(id, msg, is_me)
            } else if(type == 'vedio') {
                _this.renderVedioMsg(id, msg, is_me)
            } else {
                _this.renderFileMsg(id, msg, is_me)
            }
				},
				// 将文本消息放入对话框中
				appendTextMsg: function(id, type, msg){
					debugger
					var _this = this
					var faces = _this.facesData().map
					var path = _this.facesData().path
					var h = ''
					var text = msg.replace(/\[[^\]]+\]/g, function (it) {
						if (faces[it]) {
							return '<img src="'+path+ faces[it]+'"/>'
						}
						return it
					})
					if (type === 'right') {
						h += '<div class="clearfix"><div class="clearfix pull-right im-from"><div class="pull-left"><i class="img icon-im-r"></i><span>'+ text +'</span></div><img src="../img/default.jpg" width="50px" height="50px"></div></div>'
					} else {
						h += '<div class="clearfix"><div class="clearfix pull-left im-to"><div class="pull-right"><i class="img icon-im-l"></i><span>'+ text +'</span></div><img src="../img/default.jpg" width="50px" height="50px"></div></div>'
					}
					console.log('id===>'+ id)
					$('#'+id).append(h)
				},
        //发送文本消息
        renderTextMsg: function (curChatUserId) {
					debugger
					if (textSending) {
						return
					}
					textSending = true
					var msgInput = document.getElementById('input-msg')
					var msg = $.trim(msgInput.value)
			
					if (msg == null || msg.length == 0) {
						return
					}
					var to = curChatUserId
					if (to == null) {
						return
					}
					var options = {
						to : to,
						msg : msg,
						type : "chat"
					}
					// 群组消息和个人消息的判断分支
					if (curChatUserId.indexOf(groupFlagMark) >= 0) {
						options.type = 'groupchat'
						options.to = curRoomId
					}
					//easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
					conn.sendTextMessage(options)

					//当前登录人发送的信息在聊天窗口中原样显示
					var msgtext = msg.replace(/\n/g, '<br>')
					renderMsg.appendTextMsg(curChatUserId, 'right', msg)
					msgInput.value = ""
					msgInput.focus()
			
					setTimeout(function() {
						textSending = false
					}, 1000)
        },
        // 发送文件消息
        renderFileMsg: function (id, msg, is_me) {
						var h = ''
						var box_fx = is_me ? 'im-from' : 'im-to'
						var msg_fx = is_me ? 'pull-left' : 'pull-right'
						var icon_fx = is_me ? 'icon-im-r' : 'icon-im-l'

						h +=  '<div class="clearfix">' +
									'<div class="clearfix '+ box_fx +'">' +
									'<div class="'+ msg_fx +'">' +
									'<i class="img '+ icon_fx +'"></i>' +
									'<span>' +
									'<div class="clearfix p15">' +
									'<div class="row">' +
									'<div class="pull-left">' +
									'<h5 class="over-ell mb30"><a href="'+ msg.fileUrl +'" target="_blank">'+ msg.fileName +'</a></h5>' +
									'<p class="text-gray">'+ msg.fileSize +'</p>' +
									'</div>' +
									'<div class="pull-left pl0 w100">' +
									'<div class="contact-file"><i class="img icon-im-file"></i></div></div></div></div></span>' +
									'<img src="../img/default.jpg" width="50px" height="50px">' +
									'</div></div></div>'
          
            $('#'+id).append(h)
        },
        // 发送图片消息
        renderImgMsg: function (id, msg, is_me) {
        	var timeStamp = new Date().getTime()
            var h = ''
						var imgId = ''
						var box_fx = is_me ? 'pull-right im-from' : 'pull-left im-to'
						var msg_fx = is_me ? 'pull-left' : 'pull-right'
						var icon_fx = is_me ? 'icon-im-r' : 'icon-im-l'
                imgId = 'im-from-'+timeStamp
                h +=  '<div class="clearfix"><div class="clearfix '+ box_fx +'">\n' +
											'<div class="'+ msg_fx +'"><i class="img '+ icon_fx +'"></i>\n' +
											'<span><div class="p5 pv10" onclick="enlargeImg(this)"><img src="'+msg.fileUrl+'" alt=""  height="auto"  id="'+imgId+'" style="cursor: pointer;max-width:180px"></div></span>' +
											'</div><img src="../img/default.jpg" width="50px" height="50px">' +
											'</div>' +
											'</div>'
            
                $('#'+id).append(h)
        },
        renderVedioMsg: function (id, msg, is_me) {
            var h = ''
			console.log('msg===>', msg)
            var fileExt = getExt(msg.fileName)
            if (is_me) {
                h += '<div class="clearfix"><div class="clearfix pull-right im-from"><div class="pull-left"><i class="img icon-im-r"></i>\n' +
                '                                <span>' +
                '                                     <div class="p5 pv10" onclick="enlargeVedio(this)" data-file-type="'+fileExt+'">' +
                '                                   <video width="230" height="150"  >\n' +
                '    <source src="'+msg.fileUrl+'" type="video/mp4" >\n' +
                /*'    <source src="movie.ogg" type="video/ogg">\n' +*/
                '    您的浏览器不支持 video 标签。\n' +
                '</video><i class="img icon-im-stop"></i>' +
                '                                     </div>' +
                '                                </span>\n' +
                '                              </div><img src="../img/default.jpg" width="50px" height="50px">\n' +
                '                            </div>' +
                '                          </div>'
            } else {
                h += '<div class="clearfix"><div class="clearfix pull-left im-to">\n' +
                '                              <div class="pull-right"><i class="img icon-im-l"></i>\n' +
                '                                <span><div class="p5 pv10" onclick="enlargeVedio(this)" data-file-type="'+fileExt+'">' +
                '                                              <video width="230" height="150"  >' +
                '                                                          <source src="'+msg.fileUrl+'" type="video/mp4">' +
                /*'                                                         <source src="movie.ogg" type="video/ogg">' +*/
                '                                                          您的浏览器不支持 video 标签。' +
                '                                                      </video><i class="img icon-im-stop"></i>' +
                '<i class="img icon-im-stop"></i></div></span>' +
                '                              </div><img src="../img/default.jpg" width="50px" height="50px">' +
                '                            </div>' +
                '                          </div>'
            }
            $('#'+id).append(h)
        },
		renderErrorMsg: function (id, is_me) {
        	var h = ''
			if (is_me) {
				h +=  '<div class="clearfix">' +
				'<div class="clearfix pull-right im-from">' +
				'<div class="pull-left">' +
				'<i class="img icon-im-r"></i>' +
				'<span>发送失败</span>' +
				'</div>' +
				'<img src="../img/default.jpg" width="50px" height="50px">' +
				'</div>' +
				'</div>'
			} else {
				h +=  '<div class="clearfix">' +
				'<div class="clearfix pull-left im-to">' +
				'<div class="pull-right">' +
				'<i class="img icon-im-l"></i>' +
				'<span>发送失败</span>' +
				'</div>' +
				'<img src="../img/default.jpg" width="50px" height="50px">' +
				'</div>' +
				'</div>'
			}
			$('#'+id).append(h)

		}
    }

    // 获取别人发过来的未读消息
	var getUnreadMsg = function (from) {
        var isMe = from === window.sessionStorage["name"]
        if (isMe) return

		if ($('#' + from).css('display') == 'none' || $('#' + from).length == 0) { // 如果没有显示当前对话框或者没有显示弹出层则消息数量累加
            // 消息数量累加
			var curMsgNum = null
            msgNumObj[from] != undefined ? (curMsgNum = msgNumObj[from]) : (curMsgNum = 0)
            msgNumObj[from] = ++ curMsgNum
            if ($('#' + from).length && !($('[data-id="'+from+'"]').hasClass('active'))) {
            	$('[data-id="'+from+'"]').find('i.new-msg').css('display','block')
			}
			console.log('未读消息对象msgNumObj===>', msgNumObj)
		}
        
	}

	// 清除某个人发过来的消息提示
	var clearSigleMsgNum = function (from) {
		$('[data-id="'+from+'"]').find('i.new-msg').css('display', 'none')
        msgNumObj[from] = 0
        
	}

    // 文件类型错误时的提示信息
	var renderFileTypeTips = function (id, text, fileType) {
		if ($('#' + id).find('[data-role="error-tip"]').length) {
            $('#' + id).find('[data-role="error-tip"]').text(text)
		} else {
            var h = '<div class="clearfix" data-role="error-tip">' + text + fileType + '</div>'
			$('#' + id).append(h)
		}
		setTimeout(function () {
            $('#' + id).find('[data-role="error-tip"]').remove()
		}, 10000)
	}


	//处理连接时函数,主要是登录成功后对页面元素做处理
	var handleOpen = function(conn) {
		//从连接中获取到当前的登录人注册帐号名
		curUserId = conn.context.userId;
		//获取当前登录人的联系人列表
		conn.getRoster({
			success : function(roster) {
				// 页面处理
				var curroster;
				
				for ( var i in roster) {
					var ros = roster[i];					
					//both为双方互为好友，要显示的联系人,from我是对方的单向好友
					if (ros.subscription == 'both'
							|| ros.subscription == 'from') {
						bothRoster.push(ros);
					} else if (ros.subscription == 'to') {
						//to表明了联系人是我的单向好友
						toRoster.push(ros);
					}
				}
				
				// 渲染左侧列表
				WEBIM.renderLeftBar(roster, '#contact-item')
				// 渲染右侧对话box
				WEBIM.renderRightBox(roster, '.im-history')
				
				if (bothRoster.length > 0) {
					curroster = bothRoster[0];
				}
			},
			error: function(msg){
				console.log(JSON.stringify(msg))
			}
		});

	};
	conn = new WebIM.connection({
		isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
		https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
		url: WebIM.config.xmppURL,
		heartBeatWait: WebIM.config.heartBeatWait,
		autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
		autoReconnectInterval: WebIM.config.autoReconnectInterval,
		apiUrl: WebIM.config.apiURL,
		isHttpDNS: WebIM.config.isHttpDNS,
		isWindowSDK: WebIM.config.isWindowSDK,
		isAutoLogin: true,
		encrypt: WebIM.config.encrypt,
		delivery: WebIM.config.delivery
	})
	
	
	// listern，添加回调函数
    conn.listen({
        onOpened: function (message) {          //连接成功回调，连接成功后才可以发送消息
            //如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
            // 手动上线指的是调用conn.setPresence(); 在本例中，conn初始化时已将isAutoLogin设置为true
            // 所以无需调用conn.setPresence();
            console.log("%c [opened] 连接已成功建立", "color: green")
            handleOpen(conn)
        },
        onTextMessage: function (message) {
			// 获取未读消息
            getUnreadMsg(message.from)
            // 在此接收和处理消息，根据message.type区分消息来源，私聊或群组或聊天室
            console.log('接收消息', message);
            console.log(message.type);
						console.log('Text');
						// var data = {
						// 	data:"222",
						// 	delay:"2017-09-11T09:19:13.669Z",
						// 	error:false,
						// 	errorCode:"",
						// 	errorText:"",
						// 	ext:{
						// 		weichat:{originType:"webim"}
						// 	},
						// 	from:"sqq2",
						// 	id:"376053393468162540",
						// 	to:"sqq3",
						// 	type:"chat"
						// }
						var is_me = message.from === window.sessionStorage["name"]
						var type = is_me ? 'right' : 'left'
						var msg = message.data
						var id = is_me ?  message.to :  message.from
						var from = message.from
						var to = message.to

						WEBIM.appendTextMsg(id, type, msg, from, to)

						console.log('id========>')
						console.log(id)
						WEBIM.scrollBottom(id)
						
        },  //收到文本消息
        onEmojiMessage: function (message) {},   //收到表情消息
        onPictureMessage: function (message) {}, //收到图片消息
        onCmdMessage: function (message) {},     //收到命令消息
        onAudioMessage: function (message) {},   //收到音频消息
        onLocationMessage: function (message) {},//收到位置消息
        onFileMessage: function (message) {
        	// 获取未读消息
            getUnreadMsg(message.from)

            // 接收消息的消息对象
			/*message = {
            accessToken:"YWMtzjAaUK1fEeeSd9HQ26O1Hf84udCS0BHnpQ3LrkoxvapIas-QnGwR54oMERCkwF80AwMAAAFfBAmxvABPGgB-fAefOFX13tVLpyq0aGgEPj5UbHjiXecCRbzgO-xnCg",
            error:false,
            errorCode:"",
            errorText:"",
            ext:{weichat:{originType:"webim"}},
            file_length:0,
            filename:"微信分享.png",
            from:"sqq3",
            id:"386831139853042160",
            secret:"58BxCq2kEeebgc3d18jAwY6G_6BcxU-I5gDsWoS61-AmE07p",
            to:"sqq4",
            type:"chat",
            url:"https://a1.easemob.com/1132170906115603/cicc-web/chatfiles/e7c07100-ada4-11e7-a84b-7d3dfdf00485"
			}*/
			// id, msg, is_me
			var isMe = message.from == window.sessionStorage["name"]
			var id = message.from
			var msgData = {
				fileName: message.filename,
				fileUrl: message.url,
				fileSize: 0
			}
			var curFileType = getFileType(message.filename)
			console.log(message.filename)
			console.log('type==>', curFileType)
      console.log('message==>',message)
			if (curFileType === 'img') {
                renderMsg.renderImgMsg(id, msgData, isMe)
			} else if (curFileType === 'vedio') {
                renderMsg.renderVedioMsg(id, msgData, isMe)
			} else if(curFileType === 'other'){
                renderMsg.renderFileMsg(id, msgData, isMe)
			}

            WEBIM.scrollBottom(id)

        },    //收到文件消息
        onVideoMessage: function (message) {
            var node = document.getElementById('privateVideo');
            var option = {
                url: message.url,
                headers: {
                    'Accept': 'audio/mp4'
                },
                onFileDownloadComplete: function (response) {
                    var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
                    node.src = objectURL;
                },
                onFileDownloadError: function () {
                    console.log('File down load error.')
                }
            };
            WebIM.utils.download.call(conn, option);
        },   //收到视频消息
        onPresence: function (message) {},       //收到联系人订阅请求（加好友）、处理群组、聊天室被踢解散等消息
        onRoster: function (message) {},         //处理好友申请
        onInviteMessage: function (message) {},  //处理群组邀请
        onOnline: function () {},                //本机网络连接成功
        onOffline: function () {},                 //本机网络掉线
        onError: function (message) {
            console.log('Error');
            console.log(message);
            if (message && message.type == 1) {
                console.warn('连接建立失败！请确认您的登录账号是否和appKey匹配。')
            }
        },           //失败回调
        onBlacklistUpdate: function (list) {
            // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
            console.log('黑名单',list);
        }     // 黑名单变动
    });
	var getLoginInfo = function() {
		return {
			isLogin : false
		};
	};
	var showLoginUI = function() {
		//$('#loginmodal').modal('show');
		$('#username').focus();
	};
	var hiddenLoginUI = function() {
		//$('#loginmodal').modal('hide');
	};
	var showWaitLoginedUI = function() {
		$('#waitLoginmodal').modal('show');
	};
	var hiddenWaitLoginedUI = function() {
		$('#waitLoginmodal').modal('hide');
	};
	var showChatUI = function() {
		$('#content').css({
			"display" : "block"
		});
		var login_userEle = document.getElementById("login_user").children[0];
		login_userEle.innerHTML = curUserId;
		login_userEle.setAttribute("title", curUserId);
	};
	//登录之前不显示web对话框
	var hiddenChatUI = function() {
		$('#content').css({
			"display" : "none"
		});
		document.getElementById(talkInputId).value = "";
	};
	//定义消息编辑文本域的快捷键，enter和ctrl+enter为发送，alt+enter为换行
	//控制提交频率
	$(function() {
		/*$("textarea").keydown(function(event) {
			if (event.altKey && event.keyCode == 13) {
				e = $(this).val();
				$(this).val(e + '\n');
			} else if (event.ctrlKey && event.keyCode == 13) {
				//e = $(this).val();
				//$(this).val(e + '<br>');
				event.returnValue = false;
				sendText();
				return false;
			} else if (event.keyCode == 13) {
				event.returnValue = false;
				sendText();
				return false;
			}

		});*/
	});
	//easemobwebim-sdk注册回调函数列表
	$(document).ready(function() {
		//conn = new Easemob.im.Connection();
		
	
		//login();
		var loginInfo = getLoginInfo();
		if (loginInfo.isLogin) {
			showWaitLoginedUI();
		} else {
			showLoginUI();
		}
		//发送文件的模态窗口
		$('#fileModal').on('hidden.bs.modal', function(e) {
			var ele = document.getElementById(fileInputId);
			ele.value = "";
			if (!window.addEventListener) {
				ele.outerHTML = ele.outerHTML;
			}
			document.getElementById("fileSend").disabled = false;
			document.getElementById("cancelfileSend").disabled = false;
		});

		$('#addFridentModal').on('hidden.bs.modal', function(e) {
			var ele = document.getElementById("addfridentId");
			ele.value = "";
			if (!window.addEventListener) {
				ele.outerHTML = ele.outerHTML;
			}
			document.getElementById("addFridend").disabled = false;
			document.getElementById("cancelAddFridend").disabled = false;
		});

		$('#delFridentModal').on('hidden.bs.modal', function(e) {
			var ele = document.getElementById("delfridentId");
			ele.value = "";
			if (!window.addEventListener) {
				ele.outerHTML = ele.outerHTML;
			}
			document.getElementById("delFridend").disabled = false;
			document.getElementById("canceldelFridend").disabled = false;
		});



		//在 密码输入框时的回车登录
		$('#password').keypress(function(e) {
			var key = e.which;
			if (key == 13) {
				login();
			}
		});

		$(function() {
			$(window).bind('beforeunload', function() {
				if (conn) {
					conn.close();
					if (navigator.userAgent.indexOf("Firefox") > 0)
						return ' ';
					else
						return '';
				}
			});
		});
	});

	

	//连接中断时的处理，主要是对页面进行处理
	var handleClosed = function() {
		curUserId = null;
		curChatUserId = null;
		curRoomId = null;
		bothRoster = [];
		toRoster = [];
		hiddenChatUI();
		clearContactUI("contactlistUL", "contactgrouplistUL",
				"momogrouplistUL", msgCardDivId);

		showLoginUI();
		groupQuering = false;
		textSending = false;
	};
	//easemobwebim-sdk中收到联系人订阅请求的处理方法，具体的type值所对应的值请参考xmpp协议规范
	var handlePresence = function(e) {
		//（发送者希望订阅接收者的出席信息），即别人申请加你为好友
		if (e.type == 'subscribe') {
			if (e.status) {
				if (e.status.indexOf('resp:true') > -1) {
					agreeAddFriend(e.from);
					return;
				}
			}
			var subscribeMessage = e.from + "请求加你为好友。\n验证消息：" + e.status;
			showNewNotice(subscribeMessage);
			$('#confirm-block-footer-confirmButton').click(function() {
				//同意好友请求
				agreeAddFriend(e.from);//e.from用户名
				//反向添加对方好友
				conn.subscribe({
					to : e.from,
					message : "[resp:true]"
				});
				$('#confirm-block-div-modal').modal('hide');
			});
			$('#confirm-block-footer-cancelButton').click(function() {
				rejectAddFriend(e.from);//拒绝加为好友
				$('#confirm-block-div-modal').modal('hide');
			});
			return;
		}
		//(发送者允许接收者接收他们的出席信息)，即别人同意你加他为好友
		if (e.type == 'subscribed') {
			toRoster.push({
				name : e.from,
				jid : e.fromJid,
				subscription : "to"
			});
			return;
		}
		//（发送者取消订阅另一个实体的出席信息）,即删除现有好友
		if (e.type == 'unsubscribe') {
			//单向删除自己的好友信息，具体使用时请结合具体业务进行处理
			delFriend(e.from);
			return;
		}
		//（订阅者的请求被拒绝或以前的订阅被取消），即对方单向的删除了好友
		if (e.type == 'unsubscribed') {
			delFriend(e.from);
			return;
		}
	};
	//easemobwebim-sdk中处理出席状态操作
	var handleRoster = function(rosterMsg) {
		for (var i = 0; i < rosterMsg.length; i++) {
			var contact = rosterMsg[i];
			if (contact.ask && contact.ask == 'subscribe') {
				continue;
			}
			if (contact.subscription == 'to') {
				toRoster.push({
					name : contact.name,
					jid : contact.jid,
					subscription : "to"
				});
			}
			//app端删除好友后web端要同时判断状态from做删除对方的操作
			if (contact.subscription == 'from') {
				toRoster.push({
					name : contact.name,
					jid : contact.jid,
					subscription : "from"
				});
			}
			if (contact.subscription == 'both') {
				var isexist = contains(bothRoster, contact);
				if (!isexist) {
					var lielem = $('<li>').attr({
						"id" : contact.name,
						"class" : "offline",
						"className" : "offline"
					}).click(function() {
						chooseContactDivClick(this);
					});
					$('<img>').attr({
						"src" : "img/head/contact_normal.png"
					}).appendTo(lielem);

					$('<span>').html(contact.name).appendTo(lielem);
					$('#contactlistUL').append(lielem);
					bothRoster.push(contact);
				}
			}
			if (contact.subscription == 'remove') {
				var isexist = contains(bothRoster, contact);
				if (isexist) {
					removeFriendDomElement(contact.name);
				}
			}
		}
	};
	//异常情况下的处理方法
	var handleError = function(e) {
		if (curUserId == null) {
			hiddenWaitLoginedUI();
			alert(e.msg + ",请重新登录");
			showLoginUI();
		} else {
			var msg = e.msg;
			if (e.type == EASEMOB_IM_CONNCTION_SERVER_CLOSE_ERROR) {
				if (msg == "" || msg == 'unknown' ) {
					alert("服务器器断开连接,可能是因为在别处登录");
				} else {
					alert("服务器器断开连接");
				}
			} else {
				alert(msg);
			}
		}
	};
	//判断要操作的联系人和当前联系人列表的关系
	var contains = function(roster, contact) {
		var i = roster.length;
		while (i--) {
			if (roster[i].name === contact.name) {
				return true;
			}
		}
		return false;
	};

	Array.prototype.indexOf = function(val) {
		for (var i = 0; i < this.length; i++) {
			if (this[i].name == val.name)
				return i;
		}
		return -1;
	};
	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		if (index > -1) {
			this.splice(index, 1);
		}
	};

	

	//注册页面返回登录页面操作
	var showlogin = function() {
		$('#loginmodal').modal('show');
		$('#regist-div-modal').modal('hide');
	};

	var logout = function() {
		conn.close();
	};

	//设置当前显示的聊天窗口div，如果有联系人则默认选中联系人中的第一个联系人，如没有联系人则当前div为null-nouser
	var setCurrentContact = function(defaultUserId) {
		showContactChatDiv(defaultUserId);
		if (curChatUserId != null) {
			hiddenContactChatDiv(curChatUserId);
		} else {
			$('#null-nouser').css({
				"display" : "none"
			});
		}
		curChatUserId = defaultUserId;
	};

	//构造联系人列表
	var buildContactDiv = function(contactlistDivId, roster) {
		var uielem = document.getElementById("contactlistUL");
		console.log(uielem);
		var cache = {};
		for (i = 0; i < roster.length; i++) {
			if (!(roster[i].subscription == 'both' || roster[i].subscription == 'from')) {
				continue;
			}
			var jid = roster[i].jid;
			var nikeName = roster[i].name;
			var userName = jid.substring(jid.indexOf("_") + 1).split("@")[0];
			console.log(nikeName);
/* 			if (userName in cache) {
				continue;
			} */
			cache[userName] = true;
			var lielem = $('<li>').attr({
				'id' : userName,
				'class' : 'offline',
				'className' : 'offline',
				'type' : 'chat',
				'displayName' : userName
			}).click(function() {
				chooseContactDivClick(this);
			});
			$('<img>').attr("src", "img/head/contact_normal.png").appendTo(
					lielem);
			$('<span>').html(nikeName).appendTo(lielem);
			$('#contactlistUL').append(lielem);
		}
		var contactlist = document.getElementById(contactlistDivId);
		var children = contactlist.children;
		if (children.length > 0) {
			contactlist.removeChild(children[0]);
		}
		contactlist.appendChild(uielem);
	};

	//构造群组列表
	var buildListRoomDiv = function(contactlistDivId, rooms) {
		var uielem = document.getElementById("contactgrouplistUL");
		var cache = {};
		for (i = 0; i < rooms.length; i++) {
			var roomsName = rooms[i].name;
			var roomId = rooms[i].roomId;
			if (roomId in cache) {
				continue;
			}
			cache[roomId] = true;
			var lielem = $('<li>').attr({
				'id' : groupFlagMark + roomId,
				'class' : 'offline',
				'className' : 'offline',
				'type' : 'groupchat',
				'displayName' : roomsName,
				'roomId' : roomId,
				'joined' : 'false'
			}).click(function() {
				chooseContactDivClick(this);
			});
			$('<img>').attr({
				'src' : 'img/head/group_normal.png'
			}).appendTo(lielem);
			$('<span>').html(roomsName).appendTo(lielem);
			$('#contactgrouplistUL').append(lielem);
		}
		var contactlist = document.getElementById(contactlistDivId);
		var children = contactlist.children;
		if (children.length > 0) {
			contactlist.removeChild(children[0]);
		}
		contactlist.appendChild(uielem);
	};

	//选择联系人的处理
	var getContactLi = function(chatUserId) {
		return document.getElementById(chatUserId);
	};

	//构造当前聊天记录的窗口div
	var getContactChatDiv = function(chatUserId) {
		return document.getElementById(curUserId + "-" + chatUserId);
	};

	//如果当前没有某一个联系人的聊天窗口div就新建一个
	var createContactChatDiv = function(chatUserId) {
		var msgContentDivId = curUserId + "-" + chatUserId;
		var newContent = document.createElement("div");
		$(newContent).attr({
			"id" : msgContentDivId,
			"class" : "chat01_content",
			"className" : "chat01_content",
			"style" : "display:none"
		});
		return newContent;
	};

	//显示当前选中联系人的聊天窗口div，并将该联系人在联系人列表中背景色置为蓝色
	var showContactChatDiv = function(chatUserId) {
		var contentDiv = getContactChatDiv(chatUserId);
		if (contentDiv == null) {
			contentDiv = createContactChatDiv(chatUserId);
			document.getElementById(msgCardDivId).appendChild(contentDiv);
		}
		contentDiv.style.display = "block";
		var contactLi = document.getElementById(chatUserId);
		if (contactLi == null) {
			return;
		}
		contactLi.style.backgroundColor = "#33CCFF";
		var dispalyTitle = null;//聊天窗口显示当前对话人名称
		if (chatUserId.indexOf(groupFlagMark) >= 0) {
			dispalyTitle = "群组" + $(contactLi).attr('displayname') + "聊天中";
			curRoomId = $(contactLi).attr('roomid');
			$("#roomMemberImg").css('display', 'block');
		} else {
			dispalyTitle = "与" + chatUserId + "聊天中";
			$("#roomMemberImg").css('display', 'none');
		}
	
		document.getElementById(talkToDivId).children[0].innerHTML = dispalyTitle;
	};
	//对上一个联系人的聊天窗口div做隐藏处理，并将联系人列表中选择的联系人背景色置空
	var hiddenContactChatDiv = function(chatUserId) {
		var contactLi = document.getElementById(chatUserId);
		if (contactLi) {
			contactLi.style.backgroundColor = "";
		}
		var contentDiv = getContactChatDiv(chatUserId);
		if (contentDiv) {
			contentDiv.style.display = "none";

		}

	};
	//切换联系人聊天窗口div
	var chooseContactDivClick = function(li) {
		var chatUserId = li.id;
		// to do
		// 获得选中人的昵称
		var nikeName=li.getElementsByTagName("span")[0].innerHTML;
		if ($(li).attr("type") == 'groupchat'
				&& ('true' != $(li).attr("joined"))) {
			conn.join({
				roomId : $(li).attr("roomId")
			});
			$(li).attr("joined", "true");
		}
		if (chatUserId != curChatUserId) {
			if (curChatUserId == null) {
				showContactChatDiv(chatUserId);
			} else {
				showContactChatDiv(chatUserId);
				hiddenContactChatDiv(curChatUserId);
			}
			curChatUserId = chatUserId;
		}
		//对默认的null-nouser div进行处理,走的这里说明联系人列表肯定不为空所以对默认的聊天div进行处理
		$('#null-nouser').css({
			"display" : "none"
		});
		var badgespan = $(li).children(".badge");
		if (badgespan && badgespan.length > 0) {
			li.removeChild(li.children[2]);
		}

		//点击有未读消息对象时对未读消息提醒的处理
		var badgespanGroup = $(li).parent().parent().parent().find(".badge");
		if (badgespanGroup && badgespanGroup.length == 0) {
			$(li).parent().parent().parent().prev().children().children()
					.remove();
		}
	};

	var clearContactUI = function(contactlistUL, contactgrouplistUL,
			momogrouplistUL, contactChatDiv) {
		//清除左侧联系人内容
		$('#contactlistUL').empty();
		$('#contactgrouplistUL').empty();
		$('#momogrouplistUL').empty();

		//处理联系人分组的未读消息处理
		var accordionChild = $('#accordionDiv').children();
		for (var i = 1; i <= accordionChild.length; i++) {
			var badgegroup = $('#accordion' + i).find(".badgegroup");
			if (badgegroup && badgegroup.length > 0) {
				$('#accordion' + i).children().remove();
			}
		}
		;

		//清除右侧对话框内容
		document.getElementById(talkToDivId).children[0].innerHTML = "";
		var chatRootDiv = document.getElementById(contactChatDiv);
		var children = chatRootDiv.children;
		for (var i = children.length - 1; i > 1; i--) {
			chatRootDiv.removeChild(children[i]);
		}
		$('#null-nouser').css({
			"display" : "block"
		});
	};

	var emotionFlag = false;
	var showEmotionDialog = function() {
		if (emotionFlag) {
			$('#wl_faces_box').css({
				"display" : "block"
			});
			return;
		}
		emotionFlag = true;
		// Easemob.im.Helper.EmotionPicData设置表情的json数组
		var sjson = Easemob.im.Helper.EmotionPicData;
		for ( var key in sjson) {
			var emotions = $('<img>').attr({
				"id" : key,
				"src" : sjson[key],
				"style" : "cursor:pointer;"
			}).click(function() {
				selectEmotionImg(this);
			});
			$('<li>').append(emotions).appendTo($('#emotionUL'));
		}
		$('#wl_faces_box').css({
			"display" : "block"
		});
	};
	//表情选择div的关闭方法
	var turnoffFaces_box = function() {
		$("#wl_faces_box").fadeOut("slow");
	};
	var selectEmotionImg = function(selImg) {
		var txt = document.getElementById(talkInputId);
		txt.value = txt.value + selImg.id;
		txt.focus();
	};
	var showSendPic = function() {
		$('#fileModal').modal('toggle');
		$('#sendfiletype').val('pic');
		$('#send-file-warning').html("");
	};
	var showSendAudio = function() {
		$('#fileModal').modal('toggle');
		$('#sendfiletype').val('audio');
		$('#send-file-warning').html("");
	};

	var pictype = {
		"jpg" : true,
		"gif" : true,
		"png" : true,
		"bmp" : true
	};
	var sendFile = function() {
		var type = $("#sendfiletype").val();
		if (type == 'pic') {
			sendPic();
		} else {
			sendAudio();
		}
	};
	//发送图片消息时调用方法
	var sendPic = function() {
		var to = curChatUserId;
		if (to == null) {
			return;
		}
		// Easemob.im.Helper.getFileUrl为easemobwebim-sdk获取发送文件对象的方法，fileInputId为 input 标签的id值
		var fileObj = Easemob.im.Helper.getFileUrl(fileInputId);
		if (fileObj.url == null || fileObj.url == '') {
			$('#send-file-warning')
					.html("<font color='#FF0000'>请选择发送图片</font>");
			return;
		}
		var filetype = fileObj.filetype;
		var filename = fileObj.filename;
		if (filetype in pictype) {
			document.getElementById("fileSend").disabled = true;
			document.getElementById("cancelfileSend").disabled = true;
			var opt = {
				type : 'chat',
				fileInputId : fileInputId,
				to : to,
				onFileUploadError : function(error) {
					$('#fileModal').modal('hide');
					var messageContent = error.msg + ",发送图片文件失败:" + filename;
					appendMsg(curUserId, to, messageContent);
				},
				onFileUploadComplete : function(data) {
					$('#fileModal').modal('hide');
					var file = document.getElementById(fileInputId);
					if (file && file.files) {
						var objUrl = getObjectURL(file.files[0]);
						if (objUrl) {
							var img = document.createElement("img");
							img.src = objUrl;
							img.width = maxWidth;
						}
					}
					appendMsg(curUserId, to, {
						data : [ {
							type : 'pic',
							filename : filename,
							data : img
						} ]
					});
				}
			};

			if (curChatUserId.indexOf(groupFlagMark) >= 0) {
				opt.type = 'groupchat';
				opt.to = curRoomId;
			}
			opt.apiUrl = apiURL;
			conn.sendPicture(opt);
			return;
		}
		$('#send-file-warning').html(
				"<font color='#FF0000'>不支持此图片类型" + filetype + "</font>");
	};
	var audtype = {
		"mp3" : true,
		"wma" : true,
		"wav" : true,
		"amr" : true,
		"avi" : true
	};
	//发送音频消息时调用的方法
	var sendAudio = function() {
		var to = curChatUserId;
		if (to == null) {
			return;
		}
		//利用easemobwebim-sdk提供的方法来构造一个file对象
		var fileObj = Easemob.im.Helper.getFileUrl(fileInputId);
		if (fileObj.url == null || fileObj.url == '') {
			$('#send-file-warning')
					.html("<font color='#FF0000'>请选择发送音频</font>");
			return;
		}
		var filetype = fileObj.filetype;
		var filename = fileObj.filename;
		if (filetype in audtype) {
			document.getElementById("fileSend").disabled = true;
			document.getElementById("cancelfileSend").disabled = true;
			var opt = {
				type : "chat",
				fileInputId : fileInputId,
				to : to,//发给谁
				onFileUploadError : function(error) {
					$('#fileModal').modal('hide');
					var messageContent = error.msg + ",发送音频失败:" + filename;
					appendMsg(curUserId, to, messageContent);
				},
				onFileUploadComplete : function(data) {
					var messageContent = "发送音频" + filename;
					$('#fileModal').modal('hide');
					appendMsg(curUserId, to, messageContent);
				}
			};
			//构造完opt对象后调用easemobwebim-sdk中发送音频的方法
			if (curChatUserId.indexOf(groupFlagMark) >= 0) {
				opt.type = 'groupchat';
				opt.to = curRoomId;
			}
			opt.apiUrl = apiURL;
			conn.sendAudio(opt);
			return;
		}
		$('#send-file-warning').html(
				"<font color='#FF0000'>不支持此音频类型" + filetype + "</font>");
	};
	//easemobwebim-sdk收到文本消息的回调方法的实现
	var handleTextMessage = function(message) {
		var from = message.from;//消息的发送者
		var mestype = message.type;//消息发送的类型是群组消息还是个人消息
		var messageContent = message.data;//文本消息体
		//TODO  根据消息体的to值去定位那个群组的聊天记录
		var room = message.to;
		if (mestype == 'groupchat') {
			appendMsg(message.from, message.to, messageContent, mestype);
		} else {
			appendMsg(from, from, messageContent);
		}
	};
	//easemobwebim-sdk收到表情消息的回调方法的实现，message为表情符号和文本的消息对象，文本和表情符号sdk中做了
	//统一的处理，不需要用户自己区别字符是文本还是表情符号。
	var handleEmotion = function(message) {
		var from = message.from;
		var room = message.to;
		var mestype = message.type;//消息发送的类型是群组消息还是个人消息
		if (mestype == 'groupchat') {
			appendMsg(message.from, message.to, message, mestype);
		} else {
			appendMsg(from, from, message);
		}

	};
	//easemobwebim-sdk收到图片消息的回调方法的实现
	var handlePictureMessage = function(message) {
		var filename = message.filename;//文件名称，带文件扩展名
		var from = message.from;//文件的发送者
		var mestype = message.type;//消息发送的类型是群组消息还是个人消息
		var contactDivId = from;
		if (mestype == 'groupchat') {
			contactDivId = groupFlagMark + message.to;
		}
		var options = message;
		// 图片消息下载成功后的处理逻辑
		options.onFileDownloadComplete = function(response, xhr) {
			var objectURL = window.URL.createObjectURL(response);
			img = document.createElement("img");
			img.onload = function(e) {
				img.onload = null;
				window.URL.revokeObjectURL(img.src);
			};
			img.onerror = function() {
				img.onerror = null;
				if (typeof FileReader == 'undefined') {
					img.alter = "当前浏览器不支持blob方式";
					return;
				}
				img.onerror = function() {
					img.alter = "当前浏览器不支持blob方式";
				};
				var reader = new FileReader();
				reader.onload = function(event) {
					img.src = this.result;
				};
				reader.readAsDataURL(response);
			}
			img.src = objectURL;
			var pic_real_width = options.width;

			if (pic_real_width == 0) {
				$("<img/>").attr("src", objectURL).load(function() {
					pic_real_width = this.width;
					if (pic_real_width > maxWidth) {
						img.width = maxWidth;
					} else {
						img.width = pic_real_width;
					}
					appendMsg(from, contactDivId, {
						data : [ {
							type : 'pic',
							filename : filename,
							data : img
						} ]
					});

				});
			} else {
				if (pic_real_width > maxWidth) {
					img.width = maxWidth;
				} else {
					img.width = pic_real_width;
				}
				appendMsg(from, contactDivId, {
					data : [ {
						type : 'pic',
						filename : filename,
						data : img
					} ]
				});
			}
		};
        
        var redownLoadFileNum = 0;
		options.onFileDownloadError = function(e) {
            //下载失败时只重新下载一次
            if(redownLoadFileNum < 1){
               redownLoadFileNum++;
                options.accessToken = options_c;
               Easemob.im.Helper.download(options);
               
            }else{
              appendMsg(from, contactDivId, e.msg + ",下载图片" + filename + "失败");
              redownLoadFileNum = 0;
            }
           
		};
		//easemobwebim-sdk包装的下载文件对象的统一处理方法。
		Easemob.im.Helper.download(options);
	};

	//easemobwebim-sdk收到音频消息回调方法的实现
	var handleAudioMessage = function(message) {
		var filename = message.filename;
		var filetype = message.filetype;
		var from = message.from;

		var mestype = message.type;//消息发送的类型是群组消息还是个人消息
		var contactDivId = from;
		if (mestype == 'groupchat') {
			contactDivId = groupFlagMark + message.to;
		}
		var options = message;
		options.onFileDownloadComplete = function(response, xhr) {
			var objectURL = window.URL.createObjectURL(response);
			var audio = document.createElement("audio");
			if (("src" in audio) && ("controls" in audio)) {
				audio.onload = function() {
					audio.onload = null;
					window.URL.revokeObjectURL(audio.src);
				};
				audio.onerror = function() {
					audio.onerror = null;
					appendMsg(from, contactDivId, "当前浏览器不支持播放此音频:" + filename);
				};
				audio.controls = "controls";
				audio.src = objectURL;
				appendMsg(from, contactDivId, {
					data : [ {
						type : 'audio',
						filename : filename,
						data : audio
					} ]
				});
				//audio.play();
				return;
			}
		};
		options.onFileDownloadError = function(e) {
			appendMsg(from, contactDivId, e.msg + ",下载音频" + filename + "失败");
		};
		options.headers = {
			"Accept" : "audio/mp3"
		};
		Easemob.im.Helper.download(options);
	};

	//处理收到文件消息
	var handleFileMessage = function(message) {
		var filename = message.filename;
		var filetype = message.filetype;
		var from = message.from;

		var mestype = message.type;//消息发送的类型是群组消息还是个人消息
		var contactDivId = from;
		if (mestype == 'groupchat') {
			contactDivId = groupFlagMark + message.to;
		}
		var options = message;
		options.onFileDownloadComplete = function(response, xhr) {
			var spans = "收到文件消息:" + filename + '   ';
			var content = spans + "【<a href='"
					+ window.URL.createObjectURL(response) + "' download='"
					+ filename + "'>另存为</a>】";
			appendMsg(from, contactDivId, content);
			return;
		};
		options.onFileDownloadError = function(e) {
			appendMsg(from, contactDivId, e.msg + ",下载文件" + filename + "失败");
		};
		Easemob.im.Helper.download(options);
	};

	//收到视频消息
	var handleVideoMessage = function(message) {

		var filename = message.filename;
		var filetype = message.filetype;
		var from = message.from;

		var mestype = message.type;//消息发送的类型是群组消息还是个人消息
		var contactDivId = from;
		if (mestype == 'groupchat') {
			contactDivId = groupFlagMark + message.to;
		}
		var options = message;
		options.onFileDownloadComplete = function(response, xhr) {
			//var spans = "收到视频消息:" + filename;
			//appendMsg(from, contactDivId, spans);
			var objectURL = window.URL.createObjectURL(response);
			var video = document.createElement("video");
			if (("src" in video) && ("controls" in video)) {
				video.onload = function() {
					video.onload = null;
					window.URL.revokeObjectURL(video.src);
				};
				video.onerror = function() {
					video.onerror = null;
					appendMsg(from, contactDivId, "当前浏览器不支持播放此音频:" + filename);
				};
				video.src = objectURL;
				video.controls = "controls";
				video.width = "320";
				video.height = "240";
				appendMsg(from, contactDivId, {
					data : [ {
						type : 'video',
						filename : filename,
						data : video
					} ]
				});
				//audio.play();
				return;
			}

		};
		options.onFileDownloadError = function(e) {
			appendMsg(from, contactDivId, e.msg + ",下载音频" + filename + "失败");
		};
		Easemob.im.Helper.download(options);
	};

	var handleLocationMessage = function(message) {
		var from = message.from;
		var to = message.to;
		var mestype = message.type;
		var content = message.addr;
		if (mestype == 'groupchat') {
			appendMsg(from, to, content, mestype);
		} else {
			appendMsg(from, from, content, mestype);
		}
	};

	var handleInviteMessage = function(message) {
		var type = message.type;
		var from = message.from;
		var roomId = message.roomid;

		//获取当前登录人的群组列表
		conn.listRooms({
			success : function(rooms) {
				if (rooms) {
					for (i = 0; i < rooms.length; i++) {
						var roomsName = rooms[i].name;
						var roomId = rooms[i].roomId;
						var existRoom = $('#contactgrouplistUL').children(
								'#group--' + roomId);
						if (existRoom && existRoom.length == 0) {
							var lielem = $('<li>').attr({
								'id' : groupFlagMark + roomId,
								'class' : 'offline',
								'className' : 'offline',
								'type' : 'groupchat',
								'displayName' : roomsName,
								'roomId' : roomId,
								'joined' : 'false'
							}).click(function() {
								chooseContactDivClick(this);
							});
							$('<img>').attr({
								'src' : 'img/head/group_normal.png'
							}).appendTo(lielem);
							$('<span>').html(roomsName).appendTo(lielem);
							$('#contactgrouplistUL').append(lielem);
							//return;
						}
					}
					//cleanListRoomDiv();//先将原群组列表中的内容清除，再将最新的群组列表加入
					//buildListRoomDiv("contracgrouplist", rooms);//群组列表页面处理
				}
			},
			error : function(e) {
			}
		});

	};
	var cleanListRoomDiv = function cleanListRoomDiv() {
		$('#contactgrouplistUL').empty();
	};

	//收到陌生人消息时创建陌生人列表
	var createMomogrouplistUL = function createMomogrouplistUL(who, message) {
		var momogrouplistUL = document.getElementById("momogrouplistUL");
		var cache = {};

/* 		if (who in cache) {
			return;
		} */
		cache[who] = true;
		var lielem = document.createElement("li");
		$(lielem).attr({
			'id' : who,
			'class' : 'offline',
			'className' : 'offline',
			'type' : 'chat',
			'displayName' : who
		});
		lielem.onclick = function() {
			chooseContactDivClick(this);
		};
		var imgelem = document.createElement("img");
		imgelem.setAttribute("src", "img/head/contact_normal.png");
		lielem.appendChild(imgelem);

		var spanelem = document.createElement("span");
		spanelem.innerHTML = who;
		lielem.appendChild(spanelem);

		momogrouplistUL.appendChild(lielem);
	};
	//显示聊天记录的统一处理方法
	var appendMsg = function(who, contact, message, chattype) {
		var contactUL = document.getElementById("contactlistUL");
		var contactDivId = contact;
		if (chattype && chattype == 'groupchat') {
			contactDivId = groupFlagMark + contact;
		}
		var contactLi = getContactLi(contactDivId);
		if (contactLi == null) {
			createMomogrouplistUL(who, message);
		}

		// 消息体 {isemotion:true;body:[{type:txt,msg:ssss}{type:emotion,msg:imgdata}]}
		var localMsg = null;
		if (typeof message == 'string') {
			localMsg = Easemob.im.Helper.parseTextMessage(message);
			localMsg = localMsg.body;
		} else {
			localMsg = message.data;
		}
		var headstr = [ "<p1>" + who + "   <span></span>" + "   </p1>",
				"<p2>" + getLoacalTimeString() + "<b></b><br/></p2>" ];
		var header = $(headstr.join(''));
		console.log(headstr);
		var lineDiv = document.createElement("div");
		for (var i = 0; i < header.length; i++) {
			var ele = header[i];
			lineDiv.appendChild(ele);
		}
		var messageContent = localMsg;
		for (var i = 0; i < messageContent.length; i++) {
			var msg = messageContent[i];
			var type = msg.type;
			var data = msg.data;
			if (type == "emotion") {
				var eletext = "<p3><img src='" + data + "'/></p3>";
				var ele = $(eletext);
				for (var j = 0; j < ele.length; j++) {
					lineDiv.appendChild(ele[j]);
				}
			} else if (type == "pic" || type == 'audio' || type == 'video') {
				var filename = msg.filename;
				var fileele = $("<p3>" + filename + "</p3><br>");
				for (var j = 0; j < fileele.length; j++) {
					lineDiv.appendChild(fileele[j]);
				}
				lineDiv.appendChild(data);
			} else {
				var eletext = "<p3>" + data + "</p3>";
				var ele = $(eletext);
				ele[0].setAttribute("class", "chat-content-p3");
				ele[0].setAttribute("className", "chat-content-p3");
				if (curUserId == who) {
					ele[0].style.backgroundColor = "#EBEBEB";
				}
				for (var j = 0; j < ele.length; j++) {
					lineDiv.appendChild(ele[j]);
				}
			}
		}
		if (curChatUserId == null && chattype == null) {
			setCurrentContact(contact);
			if (time < 1) {
				$('#accordion3').click();
				time++;
			}
		}
		if (curChatUserId && curChatUserId.indexOf(contact) < 0) {
			var contactLi = getContactLi(contactDivId);
			if (contactLi == null) {
				return;
			}
			contactLi.style.backgroundColor = "green";
			var badgespan = $(contactLi).children(".badge");
			if (badgespan && badgespan.length > 0) {
				var count = badgespan.text();
				var myNum = new Number(count);
				myNum++;
				badgespan.text(myNum);

			} else {
				$(contactLi).append('<span class="badge">1</span>');
			}
			//联系人不同分组的未读消息提醒
			var badgespanGroup = $(contactLi).parent().parent().parent().prev()
					.children().children(".badgegroup");
			if (badgespanGroup && badgespanGroup.length == 0) {
				$(contactLi).parent().parent().parent().prev().children()
						.append('<span class="badgegroup">New</span>');
			}

		}
		var msgContentDiv = getContactChatDiv(contactDivId);
		if (curUserId == who) {
			lineDiv.style.textAlign = "right";
		} else {
			lineDiv.style.textAlign = "left";
		}
		var create = false;
		if (msgContentDiv == null) {
			msgContentDiv = createContactChatDiv(contactDivId);
			create = true;
		}
		msgContentDiv.appendChild(lineDiv);
		if (create) {
			document.getElementById(msgCardDivId).appendChild(msgContentDiv);
		}
		msgContentDiv.scrollTop = msgContentDiv.scrollHeight;
		return lineDiv;

	};

	var showAddFriend = function() {
		$('#addFridentModal').modal('toggle');
		$('#addfridentId').val('好友账号');//输入好友账号
		$('#add-frident-warning').html("");
	};

	//添加输入框鼠标焦点进入时清空输入框中的内容
	var clearInputValue = function(inputId) {
		$('#' + inputId).val('');
	};

	var showDelFriend = function() {
		$('#delFridentModal').modal('toggle');
		$('#delfridentId').val('好友账号');//输入好友账号
		$('#del-frident-warning').html("");
	};

	//消息通知操作时条用的方法
	var showNewNotice = function(message) {
		$('#confirm-block-div-modal').modal('toggle');
		$('#confirm-block-footer-body').html(message);
	};

	var showWarning = function(message) {
		$('#notice-block-div').modal('toggle');
		$('#notice-block-body').html(message);
	};

	//主动添加好友操作的实现方法
	var startAddFriend = function() {
		var user = $('#addfridentId').val();
		if (user == '') {
			$('#add-frident-warning').html(
					"<font color='#FF0000'> 请输入好友名称</font>");
			return;
		}
		if (bothRoster)
			for (var i = 0; i < bothRoster.length; i++) {
				if (bothRoster[i].name == user) {
					$('#add-frident-warning').html(
							"<font color='#FF0000'> 已是您的好友</font>");
					return;
				}
			}
		//发送添加好友请求
		conn.subscribe({
			to : user,
			message : "加个好友呗-" + getLoacalTimeString()
		});
		$('#addFridentModal').modal('hide');
		return;
	};

	//回调方法执行时同意添加好友操作的实现方法
	var agreeAddFriend = function(user) {
		conn.subscribed({
			to : user,
			message : "[resp:true]"
		});
	};
	//拒绝添加好友的方法处理
	var rejectAddFriend = function(user) {
		conn.unsubscribed({
			to : user,
			message : getLoacalTimeString()
		});
	};

	//直接调用删除操作时的调用方法
	var directDelFriend = function() {
		var user = $('#delfridentId').val();
		if (validateFriend(user, bothRoster)) {
			conn.removeRoster({
				to : user,
				success : function() {
					conn.unsubscribed({
						to : user
					});
					//删除操作成功时隐藏掉dialog
					$('#delFridentModal').modal('hide');
				},
				error : function() {
					$('#del-frident-warning').html(
							"<font color='#FF0000'>删除联系人失败!</font>");
				}
			});
		} else {
			$('#del-frident-warning').html(
					"<font color='#FF0000'>该用户不是你的好友!</font>");
		}
	};
	//判断要删除的好友是否在当前好友列表中
	var validateFriend = function(optionuser, bothRoster) {
		for ( var deluser in bothRoster) {
			if (optionuser == bothRoster[deluser].name) {
				return true;
			}
		}
		return false;
	};

	//回调方法执行时删除好友操作的方法处理
	var delFriend = function(user) {
		conn.removeRoster({
			to : user,
			groups : [ 'default' ],
			success : function() {
				conn.unsubscribed({
					to : user
				});
			}
		});
	};
	var removeFriendDomElement = function(userToDel, local) {
		var contactToDel;
		if (bothRoster.length > 0) {
			for (var i = 0; i < bothRoster.length; i++) {
				if (bothRoster[i].name == userToDel) {
					contactToDel = bothRoster[i];
					break;
				}
			}
		}
		if (contactToDel) {
			bothRoster.remove(contactToDel);
		}
		// 隐藏删除好友窗口
		if (local) {
			$('#delFridentModal').modal('hide');
		}
		//删除通讯录
		$('#' + userToDel).remove();
		//删除聊天
		var chatDivId = curUserId + "-" + userToDel;
		var chatDiv = $('#' + chatDivId);
		if (chatDiv) {
			chatDiv.remove();
		}
		if (curChatUserId != userToDel) {
			return;
		} else {
			var displayName = '';
			//将第一个联系人作为当前聊天div
			if (bothRoster.length > 0) {
				curChatUserId = bothRoster[0].name;
				$('#' + curChatUserId).css({
					"background-color" : "#33CCFF"
				});
				var currentDiv = getContactChatDiv(curChatUserId)
						|| createContactChatDiv(curChatUserId);
				document.getElementById(msgCardDivId).appendChild(currentDiv);
				$(currentDiv).css({
					"display" : "block"
				});
				displayName = '与' + curChatUserId + '聊天中';
			} else {
				$('#null-nouser').css({
					"display" : "block"
				});
				displayName = '';
			}
			$('#talkTo').html('<a href="#">' + displayName + '</a>');
		}
	};

	//清除聊天记录
	var clearCurrentChat = function clearCurrentChat() {
		var currentDiv = getContactChatDiv(curChatUserId)
				|| createContactChatDiv(curChatUserId);
		currentDiv.innerHTML = "";
	};

	//显示成员列表
	var showRoomMember = function showRoomMember() {
		if (groupQuering) {
			return;
		}
		groupQuering = true;
		queryOccupants(curRoomId);
	};

	//根据roomId查询room成员列表
	var queryOccupants = function queryOccupants(roomId) {
		var occupants = [];
		conn.queryRoomInfo({
			roomId : roomId,
			success : function(occs) {
				if (occs) {
					for (var i = 0; i < occs.length; i++) {
						occupants.push(occs[i]);
					}
				}
				conn.queryRoomMember({
					roomId : roomId,
					success : function(members) {
						if (members) {
							for (var i = 0; i < members.length; i++) {
								occupants.push(members[i]);
							}
						}
						showRoomMemberList(occupants);
						groupQuering = false;
					},
					error : function() {
						groupQuering = false;
					}
				});
			},
			error : function() {
				groupQuering = false;
			}
		});
	};

	var showRoomMemberList = function showRoomMemberList(occupants) {
		var list = $('#room-member-list')[0];
		var childs = list.childNodes;
		for (var i = childs.length - 1; i >= 0; i--) {
			list.removeChild(childs.item(i));
		}
		for (i = 0; i < occupants.length; i++) {
			var jid = occupants[i].jid;
			var userName = jid.substring(jid.indexOf("_") + 1).split("@")[0];
			var txt = $("<p></p>").text(userName);
			$('#room-member-list').append(txt);
		}
		$('#option-room-div-modal').modal('toggle');
	};

	var showRegist = function showRegist() {
		$('#loginmodal').modal('hide');
		$('#regist-div-modal').modal('toggle');
	};

	var getObjectURL = function getObjectURL(file) {
		var url = null;
		if (window.createObjectURL != undefined) { // basic
			url = window.createObjectURL(file);
		} else if (window.URL != undefined) { // mozilla(firefox)
			url = window.URL.createObjectURL(file);
		} else if (window.webkitURL != undefined) { // webkit or chrome
			url = window.webkitURL.createObjectURL(file);
		}
		return url;
	};
	var getLoacalTimeString = function getLoacalTimeString() {
		var date = new Date();
		var time = date.getHours() + ":" + date.getMinutes() + ":"
				+ date.getSeconds();
		return time;
  }
    
	var IM = {
		// 登录时的时间戳和登录类型 password/token
		validTabs: function () {
			if (!WebIM.config.isMultiLoginSessions || !window.localStorage) {
					return true;
			} else {
					Demo.userTimestamp = new Date().getTime();
					var key = 'easemob_' + Demo.user;
					var val = window.localStorage.getItem(key);
					var count = 0;
					var oneMinute = 60 * 1000;

					if (val === undefined || val === '' || val === null) {
							val = 'last';
					}
					val = Demo.userTimestamp + ',' + val;
					var timestampArr = val.split(',');
					var uniqueTimestampArr = [];
					// Unique

					for (var o in timestampArr) {
						if (timestampArr[o] === 'last')
								continue;
						uniqueTimestampArr[timestampArr[o]] = 1;
					}

					val = 'last';
					for (var o in uniqueTimestampArr) {
						// if more than one minute, cut it
						if (parseInt(o) + oneMinute < Demo.userTimestamp) {
								continue;
						}
						count++;
						if (count > this.state.pageLimit) {
								return false;
						}
						val = o + ',' + val;
					}
					window.localStorage.setItem(key, val);
					return true;
			}
		},

		//登录系统时的操作方法
		login: function(param, callback) {
				var _this = this
				var user = param.username + ''
				var pass = param.password + ''
				var token = param.type
				console.log(param)
	
				if (user == '' || pass == '') {
					alert("请输入用户名和密码");
					return;
				}
				
				var options = {
					apiUrl: apiURL,
					user: user.toLowerCase(),
					pwd: pass,
					accessToken: pass,
					appKey: appkey,
					success: function (token) {
						var encryptUsername = btoa(username);
						encryptUsername = encryptUsername.replace(/=*$/g, "");
						var token = token.access_token;
						var url = '#username=' + encryptUsername;
						WebIM.utils.setCookie('webim_' + encryptUsername, token, 1);
						window.location.href = url
						console.log('登录成功回调！')
						$.isFunction(callback) && callback()

						// 将用户名存入 sessionStorage
						window.sessionStorage["name"] = JSON.stringify(user)
					},
					error: function (error) {
						window.location.href = '#'
						console.log('登录失败回调！')
						console.log(error)
					}
			 }
			 if(!param.type) {
				 delete options.accessToken
			 }
				conn.autoReconnectNumTotal = 0
	
				if (WebIM.config.isWindowSDK) {
					var me = this;
					if (!WebIM.config.appDir) {
							WebIM.config.appDir = "";
					}
					if (!WebIM.config.imIP) {
							WebIM.config.imIP = "";
					}
					if (!WebIM.config.imPort) {
							WebIM.config.imPort = "";
					}
					if (!WebIM.config.restIPandPort) {
							WebIM.config.restIPandPort = "";
					}
					WebIM.doQuery('{"type":"login","id":"' +
					options.user + '","password":"' +
					options.pwd+
					'","appDir":"' +
					WebIM.config.appDir +
					'","appKey":"' +
					WebIM.config.appkey +
					'","imIP":"' +
					WebIM.config.imIP +
					'","imPort":"' +
					WebIM.config.imPort +
					'","restIPandPort":"' +
					WebIM.config.restIPandPort + '"}',
					function (response) {
						conn.onOpened();
						console.log('登录成功')
					},
					function (code, msg) {
							alert('isWindowSDK 登录出错')
					});
				} 
				else {	
					if (_this.validTabs() === true) {
						conn.open(options)
					}	else {
						conn.onError({
							type: "One account can't open more than " + this.state.pageLimit + ' pages in one minute on the same browser'
					})
						return
					}	
				}
		},

		// 注册新用户
		regist: function(param) {
			var user = param.user_name
			var pass = param.regist_password
			var nickname = param.nick_name
			if (user == '' || pass == '' || nickname == '') {
				alert("用户名/密码/昵称 不能为空");
				return;
			}

			var options = {
				username: user.toLowerCase(),
				password: pass,
				nickname: nickname,
				appKey: appkey,
				apiUrl: apiURL,
				success: function () {
					alert('注册成功')
				},
				error: function (e) {
					alert(JSON.stringify(e))
				}
			}

			if (WebIM.config.isWindowSDK) {
				var appDir = "";
				if (WebIM.config.appDir) {
						appDir = WebIM.config.appDir;
				}
				var imIP = "";
				if (WebIM.config.imIP) {
						imIP = WebIM.config.imIP;
				}
				var imPort = "";
				if (WebIM.config.imPort) {
						imPort = WebIM.config.imPort;
				}
				var restIPandPort = "";
				if (WebIM.config.restIPandPort) {
						restIPandPort = WebIM.config.restIPandPort;
				}
				WebIM.doQuery('{"type":"createAccount","id":"' + 
								options.username +
								'","password":"' +
								options.password+
								'","appDir":"' +
								appDir +
								'","appKey":"' +
								WebIM.config.appkey +
								'","imIP":"' +
								imIP +
								'","imPort":"' +
								imPort +
								'","restIPandPort":"' +
								restIPandPort + '"}',
								function (response) {
										options.success();
								},
								function (code, msg) {
										options.error()
								});
			} else {
					conn.registerUser(options);
			}

		},

		// 发送文本消息
		sendText: function(curChatUserId) {
			var textSending = true
			if (textSending) {
				return
			}
			textSending = true;
	
			var msgInput = document.getElementById('input-msg');
			var msg = $.trim(msgInput.value)
	
			if (msg == null || msg.length == 0) {
				return;
			}
			var to = curChatUserId
			if (to == null) {
				return;
			}
			var options = {
				to : to,
				msg : msg,
				type : "chat"
			}
			// 群组消息和个人消息的判断分支
			if (curChatUserId.indexOf(groupFlagMark) >= 0) {
				options.type = 'groupchat'
				options.to = curRoomId
			}
			//easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
			conn.sendTextMessage(options);

			//当前登录人发送的信息在聊天窗口中原样显示
			var msgtext = msg.replace(/\n/g, '<br>')
			WEBIM.appendTextMsg(curChatUserId, 'right', msg)
			//turnoffFaces_box()
			msgInput.value = ""
			msgInput.focus();
	
			setTimeout(function() {
				textSending = false
			}, 1000)
		}
	}

	var WEBIM = {
		init: function () {
			var _webim = this
			$(function(){
				$('#contact').on('click', function(){
					// 用户登录
					$('#regist-login').modal('show')
					//$('#disclaimer-tip').modal('show')
				})

				// 免责申明
				// $('#confirm-claimer').on('click', function(){
				// 	$('#m2').modal('show')
				// })

				// 注册
				$('#register').on('click', function(){
					var param = {
						user_name: $('#user_name').val(),
						regist_password: $('#pass_word').val(),
						nick_name: $('#nick_name').val()
					}
					IM.regist(param)
				})

				// 登录
				$('#login').on('click', function(){
					var param = {
						username: $('#username').val(),
						password: $('#password').val()
					}
					IM.login(param, function(){
						//IM.getRost()
					})

					$('#regist-login').modal('hide')
					$('#m2').modal('show')
				})

				// 加载聊天页面
				$('#m2').on('show.bs.modal', function() {
					var id = $('.contact-user-list ul li:eq(0)').attr('data-id')
					$('#'+id).siblings().hide()
					$('#'+id).show()

				})

				//加载表情
				_webim.initFace()

				//点击表情按钮
				$('#face-ctr').on('click', function () {
					$(this).find('.face-box').toggle()
				})

				//点击文件按钮
				$('#folder-ctr').on('mousedown', function () {
					$(this).find('input').trigger('click')
				})

				// 点击表情，发送表情
				$('.face-box li').on('click', function () {
				  var data = $('#input-msg').val()
					data = data + $(this).attr('data-key')
					$('#input-msg').val(data)
				})

				  // 选择不同用户聊天
				$('.contact-user-list').on('click', ' ul li', function(){
					var id = $(this).attr('data-id')
					$('.im-history > div').hide()
					$(this).addClass('active').siblings().removeClass('active')
					if (!$('#' + id).length) {
						$('.im-history').append('<div id="'+id+'"></div>')
					}
					$('#' + id).show()
                    clearSigleMsgNum(id)
					_webim.scrollBottom(id)
				})

				// 关闭连接
				$('#conn-close').on('click', function(){
					conn.close('logout')
				})

				// 发送消息
				$('.js-send-msg').on('click', function(){
								var id = $('.contact-user-list ul li.active').attr('data-id')
								//IM.sendText(id)
								renderMsg.renderTextMsg(id)
								_webim.scrollBottom(id)
							})

				// 按下enter键时发送消息
				$('#input-msg').keypress(function(e) {
					var id = $('.contact-user-list ul li.active').attr('data-id')
					var key = e.which
					if (key == 13) {
						IM.sendText(id)
						_webim.scrollBottom(id)
					}
				});
			})
		},
		facesData: function () {
			var data = {path: '../lib/im/images/faces/faces/'	, map: {
						'[):]': 'ee_1.png',
						'[:D]': 'ee_2.png',
						'[;)]': 'ee_3.png',
						'[:-o]': 'ee_4.png',
						'[:p]': 'ee_5.png',
						'[(H)]': 'ee_6.png',
						'[:@]': 'ee_7.png',
						'[:s]': 'ee_8.png',
						'[:$]': 'ee_9.png',
						'[:(]': 'ee_10.png',
						'[:\'(]': 'ee_11.png',
						'[:|]': 'ee_18.png',
						'[(a)]': 'ee_13.png',
						'[8o|]': 'ee_14.png',
						'[8-|]': 'ee_15.png',
						'[+o(]': 'ee_16.png',
						'[<o)]': 'ee_12.png',
						'[|-)]': 'ee_17.png',
						'[*-)]': 'ee_19.png',
						'[:-#]': 'ee_20.png',
						'[:-*]': 'ee_22.png',
						'[^o)]': 'ee_21.png',
						'[8-)]': 'ee_23.png',
						'[(|)]': 'ee_24.png',
						'[(u)]': 'ee_25.png',
						'[(S)]': 'ee_26.png',
						'[(*)]': 'ee_27.png',
						'[(#)]': 'ee_28.png',
						'[(R)]': 'ee_29.png',
						'[({)]': 'ee_30.png',
						'[(})]': 'ee_31.png',
						'[(k)]': 'ee_32.png',
						'[(F)]': 'ee_33.png',
						'[(W)]': 'ee_34.png',
						'[(D)]': 'ee_35.png'
				}
			}

			return data
		},

		// 滚动到底部
		scrollBottom: function (id) {

			console.log('id==>',id)
			/*var h = $('#'+id)[0].scrollHeight - $('#'+id).height()
			$('#'+id).scrollTop(h)*/
            var h = $('.im-history')[0].scrollHeight -$('.im-history').height()
            $('.im-history').scrollTop(h)
		},

		// 我提交的
		sendByMe: function (id) {
			return id === window.sessionStorage['name']
		},

		/**
		 * @desc 检测文件类型
		 */
		testFileType: function (file_data) {
			var cur_type = file_data.type;
			var file_type = {
			  is_img: /image\//.test(cur_type),
			  is_vedio: /video\//.test(cur_type)
			}
			return file_type;
		},

		/**
		 * @desc 渲染左侧栏
		 * @param {Array} data 
		 * @param {Dom} box
		 */
		renderLeftBar: function(data, box) {
			var h = '<ul>'
			$.each(data, function(i, item){
				h += '<li data-id="'+item.name+'"><i class="new-msg"></i><div class="media"><div class="media-left"><a href="#">'
        h += '<img class="media-object b-r-8" src="../img/default.jpg" alt="" width="48" height="48"></a></div>'
				h += '<div class="media-body"><h4 class="media-heading">'+item.name+'</h4><p>前天和你说的事情可以...</p></div></div></li>'
			})
			h += '</ul>'
			$(box).html(h)
			$(box).find('ul li:eq(0)').addClass('active')
		},

		// 渲染右侧对话框
		renderRightBox: function(data, box) {
			var h = ''
			$.each(data, function(i, item){
				h += '<div id="'+item.name+'"></div>'
			})
			$(box).html(h)
			$(box).children().hide()
			$(box).children().eq(0).show()
		},

		// 初始化标签容器
		initFace: function () {
			var data = this.facesData()
			var h = '<ul>'
			$.each(data.map, function(i, item) {
				h += '<li data-key="'+i+'"><img src="'+data.path+item+'"></li>'
			})	
			h += '</ul>'
			$('.face-box').html(h)
		},

		/**
		 * @desc 添加文本消息历史记录
		 * @param {DOM} id  dom 的id
		 * @param {String} type  from/to
		 * @param {String} msg  文本消息体
		 */

		/*var data = {
			data:"你好，sqq3↵",
			delay:"2017-09-11T08:34:38.073Z",
			error:false,
			errorCode:"",
			errorText:"",
			ext:"",
			weichat:"",
			originType:"webim",
			from:"sqq2",
			id:	"376041901930840556",
			to:"sqq3",
			type:"chat"
		}*/
		appendTextMsg: function(id, type, msg, from, to){
		var _this = this
		var faces = _this.facesData().map
		var path = _this.facesData().path
		var h = ''
		var text = msg.replace(/\[[^\]]+\]/g, function (it) {
			if (faces[it]) {
			  return '<img src="'+path+ faces[it]+'"/>'
			}
			return it
		})
		if (type === 'right') {
			h += '<div class="clearfix"><div class="clearfix pull-right im-from"><div class="pull-left"><i class="img icon-im-r"></i><span>'+ text +'</span></div><img src="../img/default.jpg" width="50px" height="50px"></div></div>'
		} else {
			h += '<div class="clearfix"><div class="clearfix pull-left im-to"><div class="pull-right"><i class="img icon-im-l"></i><span>'+ text +'</span></div><img src="../img/default.jpg" width="50px" height="50px"></div></div>'
		}
		console.log('id===>'+ id)
		$('#'+id).append(h)
	}
	}
	
	WEBIM.init()



