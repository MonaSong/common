var conn = new WebIM.connection({
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
  https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
  url: WebIM.config.xmppURL,
  heartBeatWait: WebIM.config.heartBeatWait,
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
  autoReconnectInterval: WebIM.config.autoReconnectInterval,
  apiUrl: WebIM.config.apiURL,
  isAutoLogin: true
});

conn.listen({
  onOpened: function (message) {           //连接成功回调
    console.log("成功连接！");
  },
  
  onClosed: function (message) {			//连接关闭回调
    console.log("连接关闭！")
  },
  
  onCmdMessage: function (message) {
  },		//收到命令消息
  onLocationMessage: function (message) {
  },//收到位置消息
  onEmojiMessage: function (message) {
  },	//收到表情消息
  
  onTextMessage: function (message) {		//收到文本消息，在此接收和处理消息，根据message.type区分消息来源，私聊或群组或聊天室
    console.log(message);
    acceptMsg.text(message);
  },
  
  onPictureMessage: function (message) {	//收到图片消息
    acceptMsg.file(message);
  },
  
  onAudioMessage: function (message) {		//收到音频消息
    acceptMsg.file(message);
  },
  
  onVideoMessage: function (message) {		//收到视频消息
    acceptMsg.file(message);
  },
  onFileMessage: function (message) {			//收到文件消息
    acceptMsg.file(message);
  },
  
  onPresence: function (message) {
  },       	//处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
  onRoster: function (message) {
  },         	//处理好友申请
  onInviteMessage: function (message) {
  },  	//处理群组邀请
  onOnline: function () {
  },                  	//本机网络连接成功
  onOffline: function () {
  },                 	//本机网络掉线
  onError: function (message) {
  },          	//失败回调
  onBlacklistUpdate: function (list) {
  },      	//黑名单变动, 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
  onReceivedMessage: function (message) {
  },    //收到消息送达客户端回执
  onDeliveredMessage: function (message) {
  },   //收到消息送达服务器回执
  onReadMessage: function (message) {
  },        //收到消息已读回执
  onCreateGroup: function (message) {
  },        //创建群组成功回执（需调用createGroupNew）
  onMutedMessage: function (message) {
  }   		//如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
});


var api = {
  readAllMsg: function (msgId, callback) {
    $.post(ctx + "/im/msg/readall", {msgId: msgId}, function (data) {
      if (callback) {
        callback(data);
      }
    });
  },
  readMsg: function (msgId, callback) {
    $.post(ctx + "/im/msg/read", {msgId: msgId}, function (data) {
      if (callback) {
        callback(data);
      }
    });
  }
};

var acceptMsg = {
  text: function (msg) {
    var from = msg.from;
    var text = msg.data;
    var contacts = $('#contact-item').find('[data-id="' + from + '"]');
    if (contacts.length === 0) {
      //新会话 添加新的会话记录
		$.post(ctx + "/im/findSender", {id: from}, function (data) {
		  if (data.ret == 1) {
			  msg.name = data.data.fullName;
			  addNewContacts(from, msg, false);
		  }
	    });
    }
    
    if (!contacts.hasClass("active")) {
      //非当前会话
      contacts.find('i.new-msg').css('display', 'block');
    } else {
      //当前会话,标记为已读
      api.readMsg(msg.id, function () {
        WEBIM.appendTextMsg(from, text, false, msg.ext);
        WEBIM.scrollBottom(from);
      });
    }
    contacts.find("p").html(text + "...");
  },
  file: function (msg) {
    var from = msg.from;
    var contacts = $('#contact-item').find('[data-id="' + from + '"]');
    if (contacts.length === 0) {
      //新会话添加新的会话记录
	  $.post(ctx + "/im/findSender", {id: from}, function (data) {
		  if (data.ret == 1) {
			  msg.name = data.data.fullName;
			  addNewContacts(from, msg, false);
		  }
      });
    }
    
    var fileType = getFileType(msg.filename);
    if (!contacts.hasClass("active")) {
      //非当前会话
      contacts.find('i.new-msg').css('display', 'block');
      $('#' + from).attr('data-status', 0);
    } else {
      api.readMsg(msg.id, function () {
        console.log(msg)
        if (fileType == 1) {
          renderMsg.renderImgMsg(from, msg.url, false);
        } else if (fileType == 3) {
          renderMsg.renderVedioMsg(from, msg.url, false);
        } else {
          var fileData = {'fileName': msg.filename, 'fileUrl': msg.url, 'fileSize': ''};
          renderMsg.renderFileMsg(from, fileData, false);
        }
        WEBIM.scrollBottom(from);
      });
    }
    contacts.find("p").html(getFileTypeStr(fileType));
  }
};



// 接收消息时消息回显时显示消息类型
var getFileType = function (fileName) {
  var lastDotIndex = fileName.lastIndexOf('.');
  var ext = fileName.substring(lastDotIndex + 1);
  var imgType = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
  var audioType = ['mp3'];
  var vedioType = ['amr', 'wmv', 'mp4'];
  var otherType = ['doc', 'pdf', 'zip', 'txt', 'mp3'];
  var type = ''
  if ($.inArray(ext, imgType) > -1) {
    type = 1;
  } else if ($.inArray(ext, audioType) > -1) {
    type = 2;
  } else if ($.inArray(ext, vedioType) > -1) {
    type = 3;
  } else {
    type = 4;
  }
  return type;
}

function getFileTypeStr(type) {
  if (type == 1) {
    return "[图片]";
  } else if (type == 2) {
    return "[音频]";
  } else if (type == 3) {
    return "[视频]";
  } else if (type == 4) {
    return "[文件]";
  }
}


/**
 * @Author mona
 * @date 2017-11-1
 * @desc 聊天界面交互
 */

// 添加新的消息
function addNewContacts (id, msg, isFile) {
  var dom = ''
  var curMsgStr = ''
  if (isFile) {
    var fileType = getFileType(msg.fileName)
    curMsgStr = getFileTypeStr(fileType)
  } else {
    curMsgStr = msg.data
  }
  dom += '<li data-id="'+ id +'" class="">' +
  '  <i class="new-msg" style="display: block;"> </i>' +
  '  <div class="media"><div class="media-left">' +
  '  <a href="javascript:void(0);"> ' +
  '  <img class="media-object b-r-8 mCS_img_loaded" src="' + ctx + '/static/front/img/default.jpg" alt="" width="50" height="50"></a>' +
  '  </div><div class="media-body">' +
  '  <h4 class="media-heading over-ell">'+ msg.name +'</h4><p>'+ curMsgStr +'</p></div></div></li>'
  $('#contact-item ul').append(dom);
  
  var h = '<div id="' + id + '" data-status="0"></div>'
  $('.im-history').append(h);
}


var renderMsg = {
  // 发送图片消息
  renderImgMsg: function (id, data, is_me) {
    var h = '<div class="clearfix">\n' +
    '<div class="clearfix ' + (is_me ? "pull-right im-from" : "pull-left im-to") + '"><div class="' + (is_me ? "pull-left" : "pull-right") + '"><i class="img ' + (is_me ? 'icon-im-r' : 'icon-im-l') + '"></i>\n' +
    '    <span><div class="p5 pv10" onclick="enlargeImg(this)"><img src="' + data + '" alt="" width="180px" height="100px"></div></span>' +
    '</div>' +
    '<img src= "' + ctx + '/static/front/img/default.jpg" width="50px" height="50px">' +
    '</div>' +
    '</div>';
    $('#' + id).append(h);
  },
  
  // 发送视频消息
  renderVedioMsg: function (id, fileUrl, is_me) {
    var h = '<div class="clearfix"><div class="clearfix ' + (is_me ? "pull-right im-from" : "pull-left im-to") + '"><div class="' + (is_me ? "pull-left" : "pull-right") + '"><i class="img ' + (is_me ? 'icon-im-r' : 'icon-im-l') + '"></i>\n' +
    '	 <span><div class="p5 pv10" onclick="enlargeVedio(this)" data-file-type="mp4">' +
    '	 <video width="230" height="150">\n' +
    '        <source src="' + fileUrl + '" type="video/mp4">\n' +
    /*   '    <source src="movie.ogg" type="video/ogg">\n' +*/
    '        您的浏览器不支持 video 标签。\n' +
    '    </video><i class="img icon-im-stop"></i></div></span>\n' +
    '</div><img src= "' + ctx + '/static/front/img/default.jpg" width="50px" height="50px">' +
    '</div>' +
    '</div>'
    $('#' + id).append(h)
  },
  
  // 发送文件消息
  renderFileMsg: function (id, msg, is_me) {
    var h = '<div class="clearfix">\n' +
    '<div class="clearfix ' + (is_me ? "pull-right im-from" : "pull-left im-to") + '">\n' +
    '<div class="' + (is_me ? "pull-left" : "pull-right") + '">\n' +
    '<i class="img ' + (is_me ? "icon-im-r" : "icon-im-l") + '"></i>\n' +
    '<span>\n' +
    '<div class="clearfix p15">\n' +
    '<div class="row">\n' +
    '<div class="pull-left">\n' +
    '	<h5 class="over-ell mb30"><a href="' + msg.fileUrl + '" target="_blank">' + msg.fileName + '</a></h5>\n' +
    '	<p class="text-gray">' + msg.fileSize + '</p>\n' +
    '</div>\n' +
    '<div class="pull-left pl0 w100">\n' +
    '	<div class="contact-file"><i class="img icon-im-file"></i></div>\n' +
    '</div>\n' +
    '</div>\n' +
    '</div>\n' +
    '</span>\n' +
    '</div>\n' +
    '<img src= "' + ctx + '/static/front/img/default.jpg" width="50px" height="50px">' +
    '</div>\n' +
    '</div>'
    $('#' + id).append(h)
  },
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
  login: function (param, callback) {
    var _this = this;
    var user = param.username + '';
    var pass = param.password + '';
    var token = param.type;
    console.log(param);
    
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
        window.location.href = url;
        console.log('登录成功回调！');
        $.isFunction(callback) && callback();
        
        // 将用户名存入 sessionStorage
        window.sessionStorage["name"] = JSON.stringify(user)
      },
      error: function (error) {
        window.location.href = '#';
        console.log('登录失败回调！');
        console.log(error);
      }
    }
    
    if (!param.type) {
      delete options.accessToken;
    }
    conn.autoReconnectNumTotal = 0;
    
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
      options.pwd + '","appDir":"' +
      WebIM.config.appDir + '","appKey":"' +
      WebIM.config.appkey + '","imIP":"' +
      WebIM.config.imIP + '","imPort":"' +
      WebIM.config.imPort + '","restIPandPort":"' +
      WebIM.config.restIPandPort + '"}',
      function (response) {
        conn.onOpened();
        console.log('登录成功')
      },
      function (code, msg) {
        alert('isWindowSDK 登录出错')
      });
    } else {
      if (_this.validTabs() === true) {
        conn.open(options)
      } else {
        conn.onError({type: "One account can't open more than " + this.state.pageLimit + ' pages in one minute on the same browser'})
        return
      }
    }
  },
  
  //注册新用户
  regist: function (param) {
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
      options.username + '","password":"' +
      options.password + '","appDir":"' +
      appDir + '","appKey":"' +
      WebIM.config.appkey + '","imIP":"' +
      imIP + '","imPort":"' +
      imPort + '","restIPandPort":"' +
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
  
  // 发送文本和表情消息
  sendText: function (curChatUserId) {
    var textSending = false;
    if (textSending) return;
    textSending = true;
    
    var msgInput = document.getElementById('input-msg');
    var msg = $.trim(msgInput.value);
    if (msg == null || msg.length == 0) {
      return;
    }
    if (curChatUserId == null) {
      alert("请选择聊天对象！");
      return;
    }
    
    var ext = {};
    if (isFirstMessage) {
      ext.title = articleTitle;
      isFirstMessage = false;
    }
    
    var illegalWords = '';
    //分析师发言是检查敏感词
    if (currentRole == 'analyst') {
      var data = JSON.parse(keyWords);
      
      $.each(data, function (i, keyWord) {
        if (msg.indexOf(keyWord) != -1) {
          illegalWords = illegalWords + keyWord + ","
        }
      })
      
      // 弹窗敏感词提示框
      if (illegalWords.length > 0) {
        illegalWords = illegalWords.substring(0, illegalWords.length - 1);
        sendFlag = false;
        cicc_index.ciccModal({
          content: {
            title: '温馨提示您的发言中包含如下敏感词：',
            body: '<p>' + illegalWords + '</p>'
          },
          suc_opt: function () {
            IM.sendMsg(msgInput, curChatUserId, msg, illegalWords, ext);
          }
        })
      } else {
        IM.sendMsg(msgInput, curChatUserId, msg, illegalWords, ext);
      }
    } else {
      IM.sendMsg(msgInput, curChatUserId, msg, illegalWords, ext);
    }
    
    setTimeout(function () {
      textSending = false;
    }, 1000);
  },
  
  // 发送文本消息
  sendMsg: function (msgInput, curChatUserId, msg, illegalWords, ext) {
    var options = {
      to: curChatUserId,
      msg: msg,
      roomType: false,
      ext: ext,
      success: function (id, serverMsgId) {
        // 发送成功，保存到数据库
        $.post(ctx + "/im/msg/save", {
          receiverId: curChatUserId,
          msg: msg,
          type: 0,
          msgId: serverMsgId,
          illegalWords: illegalWords
        }, function (data) {
          if (data.ret == 1) {
            //当前登录人发送的信息在聊天窗口中原样显示
            var msgtext = msg.replace(/\n/g, '<br>');
            WEBIM.appendTextMsg(curChatUserId, msg, true, ext);
            WEBIM.scrollBottom(curChatUserId);
            
            //聊天对象显示最后一条消息
            var contacts = $('[data-id="' + curChatUserId + '"]');
            contacts.find("p").html(msg + "...");
          } else {
            alert("发送消息失败，服务器出错")
          }
        });
      },
      fail: function (e) {
        alert("发送消息失败")
      }
    };
    
    conn.sendTextMessage(options);
    msgInput.value = "";
    msgInput.focus();
  }
}

var renderUX = {
  // 点击客户列表li/点击客户列表搜索出来的li
  clickContactListLi: function () {
    $(document).on('click', '#cur-custom-list ul li', function () {
      var _this = this
      var id = $(_this).attr('data-id')
      var contactsBox = $('#contact-item')
      var box = $('#contact-item').find('ul')
      var curLi = '<li data-id="'+ id +'">' + $(_this).html() + '</li>'
      var hasContact = contactsBox.find('li[data-id="' + id + '"]').length
      if (!hasContact) {
        $(curLi).prependTo(box)
        $(box).find('li[data-id="'+ id +'"]').addClass('active').siblings().removeClass('active')
        $('.im-history').append('<div id="' + id + '"></div>')
        $('#' + id).show().siblings().hide()
      } else {
        contactsBox.find('li[data-id="' + id + '"]').trigger('click')
      }
      renderUX.showCurContactList($('.js-back-to'))
    })
  },
  // 显示客户列表
  showContactsList: function (target) {
    $('.js-back-to').show()
    $(target).parents('.IM-left-bar').css({'left': '-235px'})
    $('.js-IM-title').html('客户列表')
  },
  // 显示最近一周会话记录列表
  showCurContactList: function (target) {
    $('.IM-left-bar').css({'left': '0'})
    $('.js-IM-title').text('会话记录（一周之内）')
    $(target).hide()
  }
}
// 放大图片
function enlargeImg(target) {
  var curImgSrc = $(target).find('img').attr('src')
  var curImg = '<img src="' + curImgSrc + '">'
  $('#im-ct').html(curImg)
  
  $('.im-enlarge-content').show(0, function () {
    var imgH = $('#im-ct').find('img').height()
    $('#im-ct').css('margin-top', '-' + parseInt(imgH / 2) + 'px')
  })
}

// 隐藏放大的内容
function hideLargeCt(target) {
  $(target).parents('.im-enlarge-content').hide()
  $('#im-ct').html('')
}

// 基础请求封装
var request = (function () {
  var application = {}
  var baseRequest = function (url, type, param, callback) {
    $.ajax({
      url: url,
      type: type,
      data: param,
      dataType: 'json',
      success: function (data) {
        return $.isFunction(callback) && callback(0, data)
      },
      error: function () {
        var curAgs = arguments
        return $.isFunction(callback) && callback(1, curAgs)
      }
    })
  }
  
  application.get = function (url, param, callback) {
    baseRequest(url, 'get', param, callback)
  }
  
  application.post = function (url, param, callback) {
    baseRequest(url, 'post', param, callback)
  }
  
  return application
}())

// 聊天交互
var contactUx = {
  // 获取客户列表
  getContactList: function (param, callback) {
    var url = ctx + '/im/searchByName'
    request.post(url, param, callback)
  },
  //渲染列表
  renderContactList: function (param, box) {
    contactUx.getContactList(param, function (state, data) {
      if (state == '0' && data.length > 0) {
        var dom = ''
        $.each(data, function (i, item) {
          dom += '<li data-id="' + item.targetId + '" class="">\n' +
          '<i class="new-msg" style="display: none;"> </i>\n' +
          '<div class="media" style="margin-top:0">' +
          '<div class="media-left">' +
          '<a href="javascript:void(0);"> <img class="media-object b-r-8" src="/ciccportal/static/front/img/default.jpg" alt="" width="50" height="50"></a>' +
          '</div>' +
          '<div class="media-body">' +
          '<h4 class="media-heading over-ell">' + item.targetName + '</h4><p></p></div></div></li>'
        })
        $(box).find('ul').html(dom)
      }
    })
  },
  // 交互初始化
  init: function () {
    //搜索按钮点击时
    $('#search-contacts').on('click', function () {
      var searchVal = $('#search-contacts-input').val() // 搜索值
      var contactListBox = $('#cur-custom-list')
      contactUx.renderContactList({name: searchVal}, contactListBox)
    })
    
    // 搜索文本框输入时
    $('#search-contacts-input').bind('input propertychange', function () {
      var searchVal = $(this).val()
      var contactListBox = $('#cur-custom-list')
      contactUx.renderContactList({name: searchVal}, contactListBox)
    })
  }
}


var WEBIM = {
  init: function () {
    var _webim = this
    $(function () {
  
      // 显示客户列表
      $('.js-to-contact-list').on('click', function () {
        renderUX.showContactsList(this)
      })

      //显示最近一周会话记录列表
      $('.js-back-to').on('click', function () {
        renderUX.showCurContactList(this)
      })
      
      
      // 一周之内聊天记录
      cicc_index.scrollBar('', $('#contact-item'))
      
      // 加载表情
      _webim.initFace()
      
      // 点击表情按钮
      $('#face-ctr').on('click', function () {
        $(this).find('.face-box').toggle()
      })
      
      // 点击表情，发送表情
      $('.face-box li').on('click', function () {
        var data = $(this).attr('data-key')
        var v = $('#input-msg').val()
        $('#input-msg').val(v + data)
      })
      
      // 点击文件按钮
      $('#folder-ctr').on('mousedown', function () {
        $(this).find('input').trigger('click')
      })
      
      // 点击左侧好友列表后显示对应的右侧内容
      $('.contact-user-list').on('click', ' ul li', function () {
        var id = $(this).attr('data-id')
        var name = $(this).find("h4").text()
        $("#targetName h4").text(name)
        $("#targetName small").text("")
        if (!id) return
        $('.im-history > div').hide()
        $(this).addClass('active').siblings().removeClass('active')
        $(this).find('i.new-msg').css('display', 'none')
        
        var status = $('#' + id).attr('data-status')
        if (status == 0) {
          $.post(ctx + "/im/conversation/" + id, null, function (data) {
            if (data.ret == 1) {
              _webim.renderConversation(customerId, id, data.data)
              $('#' + id).attr('data-status', '1')
              if ($.grep(data.data, function (a) {
                return a.status === 0
              }).length > 0) {
                var lastMsg = data.data[data.data.length - 1]
                api.readAllMsg(lastMsg.msgId)
              }
            }
            _webim.scrollBottom(id)
          });
        }
        
        $('#' + id).show();
      })
      
      // 发送文本和表情消息
      $('.js-send-msg').on('click', function () {
        var id = $('.contact-user-list ul li.active').attr('data-id')
        IM.sendText(id)
        _webim.scrollBottom(id)
      })
      
      // 发送文件消息
      $('#folder-ctr input').change(function () {
        var data = this.files[0]
        var id = $('.contact-user-list ul li.active').attr('data-id')
        var file = WebIM.utils.getFileUrl(this)			// 将图片转化为二进制文件
        var fileType = _webim.checkFileType(data)
        var fileId = conn.getUniqueId()                   	// 生成本地消息id
        
        var msg
        var pictureType = {
          'jpg': true,
          'gif': true,
          'png': true,
          'bmp': true
        }
        var audioType = {
          'mp3': true,
          
        }
        var vedioType = {
          'amr': true,
          'mp4': true,
          'wmv': true,
          'avi': true,
          'rmvb': true,
          'mkv': true
        }
        
        var type = 4
        if (file.filetype.toLowerCase() in pictureType) {
          msg = new WebIM.message('img', fileId)        	// 创建图片消息
          type = 1;
        } else if (file.filetype.toLowerCase() in audioType) {
          msg = new WebIM.message('audio', fileId)       // 创建音频消息
          type = 2;
        } else if (file.filetype.toLowerCase() in vedioType) {
          msg = new WebIM.message('vedio', fileId)       // 创建视频消息
          type = 3;
        } else {
          msg = new WebIM.message('file', fileId)        // 创建文件消息
        }
        
        var fileUrl
        var option = {
          apiUrl: WebIM.config.apiURL,
          file: file,
          to: id,                       					// 接收消息对象
          roomType: false,
          chatType: 'singleChat',
          onFileUploadError: function (data) {     		// 消息上传失败
            cicc_index.alert.renderDom({type:'alert-fail', myTimer: '1500', alertText:'消息上传失败'})
          },
          onFileUploadComplete: function (data) {   		// 消息上传成功
            console.log('上传文件成功')
            fileUrl = (location.protocol != 'https:' && WebIM.config.isHttpDNS ? WebIM.config.apiURL + data.uri.substr(data.uri.indexOf("/", 9)) : data.uri) + '/' + data.entities[0].uuid;
          },
          success: function (msgId, serverMsgId) {
            console.log('发送文件成功')
            // 发送成功，保存到数据库
            $.post(ctx + "/im/msg/save", {
              receiverId: id,
              msg: "",
              type: type,
              msgId: serverMsgId,
              fileUrl: fileUrl,
              fileName: msg.filename,
              fileSize: data.size
            }, function (data) {
              if (data.ret == 1) {
                console.log("保存消息成功")
              } else {
                alert("发送消息失败，服务器出错")
              }
            
            });
            //聊天对象显示最后一条消息
            var contacts = $('[data-id="' + id + '"]');
            contacts.find("p").html(getFileTypeStr(type));
          },
          flashUpload: WebIM.flashUpload
        }
        
        // 渲染
        if (fileType.is_img) {
          msg.set(option);
          conn.send(msg.body)
          renderMsg.renderImgMsg(id, file.url, true)
        } else if (fileType.is_vedio) {
          conn.sendPicture(option)
          renderMsg.renderVedioMsg(id, file.url, true)
        } else {
          msg.set(option)
          conn.send(msg.body)
          var fileData = {'fileName': msg.filename, 'fileUrl': fileUrl, 'fileSize': +data.size}
          renderMsg.renderFileMsg(id, fileData, true)
        }
      })
      
      // 按下enter键时发送消息
      $('#input-msg').keypress(function (e) {
        var id = $('.contact-user-list ul li.active').attr('data-id')
        var key = e.which
        if (key == 13) {
          IM.sendText(id)
          _webim.scrollBottom(id)
        }
      })
  
      contactUx.init()
  
      renderUX.clickContactListLi()
    })
  },
  
  facesData: function () {
    var data = {
      path: ctx + '/static/front/lib/im/images/faces/faces/', map: {
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
  
  
  /**
   * @desc 滚动到底部
   */
  scrollBottom: function (id) {
    if (!$('#' + id).length) return;
    var h = $('#' + id)[0].scrollHeight - $('#' + id).height()
    $('#' + id).scrollTop(h)
  },
  
  /**
   * @desc 检测文件类型
   */
  checkFileType: function (file_data) {
    var cur_type = file_data.type
    var file_type = {
      is_img: /image\//.test(cur_type),
      is_vedio: /video\//.test(cur_type)
    }
    return file_type;
  },
  
  /**
   * 渲染会话记录
   */
  renderConversation: function (customerId, targetId, jsonData) {
    $.each(jsonData, function (i, item) {
      var isRight = item.senderId == customerId
      if (item.type == 0) {
        WEBIM.appendTextMsg(targetId, item.msg, isRight)
      } else if (item.type == 1) {
        renderMsg.renderImgMsg(targetId, item.fileUrl, isRight)
      } else if (item.type == 32) {
        WEBIM.renderVedioMsg(targetId, item.fileUrl, isRight)
      } else {
        var fileData = {'fileName': item.fileName, 'fileUrl': item.fileUrl, 'fileSize': item.fileSize};
        renderMsg.renderFileMsg(targetId, fileData, isRight)
      }
    })
  },
  
  /**
   * @desc 渲染左侧栏
   * @param {Array} data
   * @param {Dom} box
   */
  renderLeftBar: function (data, box) {
    var data = JSON.parse(data)
    console.log(typeof data)
    console.log(data)
    var h = '<ul>'
    console.log("ff")
    $.each(data, function (i, item) {
      h += '<li data-id="' + item.targetId + '"><div class="media"><i class="new-msg"> </i><div class="media-left"><a href="#">'
      h += '<img class="media-object b-r-8" src="' + ctx + '/static/front/img/default.jpg" alt="" width="48" height="48"></a></div>'
      h += '<div class="media-body"><h4 class="media-heading over-ell">' + item.name + '</h4><p></p></div></div></li>'
    });
    h += '</ul>'
    $(box).html(h)
    $(box).find('ul li:eq(0)').addClass('active')
  },
  
  /**
   * @desc 渲染右侧对话框box
   */
  renderRightBox: function (data, box) {
    var h = ''
    var data = JSON.parse(data)
    $.each(data, function (i, item) {
      h += '<div id="' + item + '" data-status="0"></div>'
    })
    $(box).html(h)
    $(box).children().hide()
    $(box).children().eq(0).show()
  },
  
  /**
   * @desc 渲染表情
   */
  initFace: function () {
    var data = this.facesData()
    var h = '<ul>'
    $.each(data.map, function (i, item) {
      h += '<li data-key="' + i + '"><img src="' + data.path + item + '"></li>'
    })
    h += '</ul>'
    $('.face-box').html(h)
  },
  
  encode: function (str) {
    if (!str || str.length === 0) {
      return ''
    }
    var s = '';
    s = str.replace(/&amp;/g, "&")
    s = s.replace(/<(?=[^o][^)])/g, "&lt;")
    s = s.replace(/>/g, "&gt;")
    s = s.replace(/\"/g, "&quot;")
    s = s.replace(/\n/g, "<br>")
    return s;
  },
  
  // 渲染文本消息
  appendTextMsg: function (id, msg, isRight, ext) {
    var _this = this
    var faces = _this.facesData().map
    var path = _this.facesData().path
    var h = '';
    var text = msg.replace(/\[[^\]]+\]/g, function (it) {
      if (faces[it]) {
        return '<img src="' + path + faces[it] + '"/>'
      }
      return it
    });
    
    if (ext && ext.title) {
      h += '<div class="clearfix text-center">' +
      '<span class="alert-tip">当前客户正在阅读研报《' + ext.title + '》</span>' +
      '</div>'
    }
    
    if (isRight) {
      h += '<div class="clearfix">' +
      '<div class="clearfix pull-right im-from">' +
      '<div class="pull-left">' +
      '<i class="img icon-im-r"></i>' +
      '<span>' + text + '</span>' +
      '</div>' +
      '<img src= "' + ctx + '/static/front/img/default.jpg" width="50px" height="50px">' +
      '</div>' +
      '</div>'
    } else {
      h += '<div class="clearfix">' +
      '<div class="clearfix pull-left im-to">' +
      '<div class="pull-right">' +
      '<i class="img icon-im-l"></i>' +
      '<span>' + text + '</span>' +
      '</div>' +
      '<img src= "' + ctx + '/static/front/img/default.jpg" width="50px" height="50px">' +
      '</div>' +
      '</div>'
    }
    $('#' + id).append(h)
  }
}

WEBIM.init()


/*end 界面交互*/

