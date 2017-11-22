/**
 * @author mona 
 * @date 2017-11-10
 * @desc 聊天
 */

/*var preview = plus.webview.currentWebview().opener();                           //获取当前窗口的创建者，即A
preview.evalJS("preference.refreshAttensionInfo('author')");        //执行父窗口中的方法  A中的showAG方法
plus.webview.currentWebview().close();*/


/**
 * 功能需求：语音，文字，图片，拍照，视频
 */

var apiURL = WebIM.config.apiURL
var conn = null 
var textSending = false
var appkey = WebIM.config.appkey
var userInfo = JSON.parse(window.localStorage["userInfo"]) //{fullName:'editor5', id:'5', status:'1', imStatus: '1'}//JSON.parse(window.localStorage["userInfo"])
var curUserId = userInfo.id
var userName = userInfo.fullName
var chatId = null
console.log('userInfo=>', window.localStorage["userInfo"])

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

// 允许发送的文件类型
var allowSendFileType = {
  img: {'jpg': true, 'gif': true, 'png': true, 'bmp': true, 'mp3': true, 'jpeg': true},
  audio: {"wav": true, "aac": true,"amr": true}
}

// 发送消息的类型
var renderFileType = {text: 0, img: 1, audio: 2, video: 3, other: 4}


// listern，添加回调函数
conn.listen({
  onOpened: function (message) {},
  onTextMessage: function (message) {
    console.log('接收到的文本消息', JSON.stringify(message))
    /*var msgData = {
      "id":"400891204578836964",
      "type":"chat",
      "from":"33292",
      "to":"5",
      "data":"[(H)]",
      "ext":{
        "weichat":{"originType":"webim"}},
      "error":false,
      "errorText":"",
      "errorCode":""}*/
      var msgData = message
      var type = 'text'
      var msg = msgData.data
      var isMe = msgData.from == curUserId
      appIM.renderMsg(isMe, type, msg)
  },  //收到文本消息
  onEmojiMessage: function (message) {},   //收到表情消息
  onPictureMessage: function (message) {}, //收到图片消息
  onCmdMessage: function (message) {},     //收到命令消息
  onAudioMessage: function (message) {},   //收到音频消息
  onLocationMessage: function (message) {},//收到位置消息
  onFileMessage: function (message) {
  
    var data = {"id":"402304991731122668",
    "type":"chat",
    "from":"5",
    "to":"33292",
    "url":"https://a1.easemob.com/1132170906115603/cicc-web/chatfiles/4bfb7c70-ce69-11e7-a8fa-859277cad3a4",
    "secret":"S_t8es5pEeeJaYNzYP_tq3cZ672kOwVwHPvnSxsRimSjUsms",
    "filename":"IMG_20150501_144334.jpg",
    "file_length":0,
    "accessToken":"YWMtvrx3TM5jEeewTaFnWT3q9v84udCS0BHnpQ3LrkoxvaoEMWFgpDAR55Tmb5j0p_DlAwMAAAFf3GhTbwBPGgCX-iAcDZmkIaTJOET8S2b1QY0FWFrGP6VN-_Hy2FnE3A",
    "ext":{
      "weichat":{"originType":"webim"}},
      "error":false,
      "errorText":"",
      "errorCode":""}
      try {
        var lastDotIndex = message.filename.lastIndexOf('.')
        var ext = message.filename.substring(lastDotIndex + 1)
        var type = null
        if (ext in allowSendFileType['img']) {
          type = 'img'
        } else if (ext in allowSendFileType['audio']) {
          type = 'audio'
        }
        var msg = {fileUrl: message.url}
        var isMe = message.from == curUserId
        appIM.renderMsg(isMe, type, msg)
        console.log(type, type, JSON.stringify(msg))
      } catch  (e) {
        console.log('e', JSON.stringify(e))
      }
  },    //收到文件消息
  onVideoMessage: function (message) {},   //收到视频消息
  onPresence: function (message) {},       //收到联系人订阅请求（加好友）、处理群组、聊天室被踢解散等消息
  onRoster: function (message) {},         //处理好友申请
  onInviteMessage: function (message) {},  //处理群组邀请
  onOnline: function () {},                //本机网络连接成功
  onOffline: function () {},                 //本机网络掉线
  onError: function (message) {},           //失败回调
  onBlacklistUpdate: function (list) {}
});


var appIM = {
    // 登录时的时间戳和登录类型 password/token
    validTabs: function () {
        if (!WebIM.config.isMultiLoginSessions || !window.localStorage) {
          return true
        } else {
            Demo.userTimestamp = new Date().getTime()
            var key = 'easemob_' + Demo.user
            var val = window.localStorage.getItem(key)
            var count = 0
            var oneMinute = 60 * 1000

            if (val === undefined || val === '' || val === null) {
                val = 'last'
            }
            val = Demo.userTimestamp + ',' + val
            var timestampArr = val.split(',')
            var uniqueTimestampArr = []

            for (var o in timestampArr) {
              if (timestampArr[o] === 'last')
                  continue;
              uniqueTimestampArr[timestampArr[o]] = 1
            }

            val = 'last'
            for (var o in uniqueTimestampArr) {
              if (parseInt(o) + oneMinute < Demo.userTimestamp) {
                  continue
              }
              count++;
              if (count > this.state.pageLimit) {
                  return false
              }
              val = o + ',' + val
            }
            window.localStorage.setItem(key, val)
            return true
        }
    },
    // 注册 param.username  param.password
    regist: function (param) {
      var _this = this
      var user = param.username
      var pass = param.password
      if (user == '' || pass == '') {
        console.log("用户名/密码/昵称 不能为空")
        return
      }
      var options = {
        username: user,
        password: pass,
        nickname: '',
        appKey: appkey,
        apiUrl: apiURL,
        success: function () {
          console.log('注册成功')
          _this.login(param)
        },
        error: function (e) {
          console.log(JSON.stringify(e))
        }
      }
      conn.registerUser(options)
    },
    // 登录 param.username  param.password
    login: function (param) {
      var name = param.username
      var pwd = param.password
      var options = {
        apiUrl: WebIM.config.apiURL,
        user: name,
        pwd: pwd,
        appKey: WebIM.config.appkey,
        success: function () {
          console.log('登录成功')
        }
      };
      conn.open(options);
    },
    // 表情数据
    facesData: function () {
      var data = {path: 'resource/im/faces/', map: {
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
    replaceTextMsg: function (msg) {
      var _this = this
      var faces = _this.facesData().map
      var path = 'resource/im/faces/'
      var curMsg = (msg).replace(/\[[^\]]+\]/g, function (it) {
        if (faces[it]) {
          return '<img src="'+path+ faces[it]+'"/>'
        }
        return it
      })
      return curMsg
    },
    /**
     * @param isMe {Boolean}
     * @param msg {Object} | msg.name {String} | msg.info [{Object} | {String}]
     */
    renderMsg: function (isMe, type, msg) {
      var _this = this
      var h = ''
      var liDom = document.createElement('li')
      var typeDom = ''
      if (type == 'text') {
        var curMsg = _this.replaceTextMsg(msg)
        typeDom = curMsg
      } else if (type == 'img') {
        console.log('img消息发送')
        typeDom = '<img src="'+ msg.fileUrl +'" style="max-width: 200px; height: auto;"/>'
      } else if (type == 'video') {
        typeDom = '<video  class="" controls preload="auto" width="100%" height="auto"' +
                  '<source src="'+msg.fileUrl+'" type="video/'+msg.fileExt+'">'
                  '<p class="vjs-no-js">\n' +
                  '您的浏览器不支持video'+
                  '<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>\n' +
                  '</p>\n' +
                  '</video>'
      } else if (type == 'audio') {
        console.log('msg.fileUrl==>', msg.fileUrl)
        typeDom = '<audio src="'+ msg.fileUrl+'"  controls="controls" style="width: 150px"></audio>'
      }
      
      if (isMe) {
        h +=  '<div class="chat-list flex-container-mid main-chat">'+
              '<div class="chat-cont chat-cont-right">'+ typeDom+'</div>'+
              '<div class="head-icon">'+
                '<img src="../../images/main/txl.png" alt="" />'+
              '</div>'+
            '</div>'
      } else {
        h += '<div class="chat-list flex-container-mid">'+
              '<div class="head-icon">'+
                '<img src="../../images/main/txl.png" alt="" />'+
              '</div>'+
              '<div class="chat-cont chat-cont-left">'+ typeDom +'</div>'+
            '</div>'
      }
      liDom.innerHTML = h
      var ulDom = document.getElementById('contact-ct').querySelector('ul')
      console.log('文件发送时生成的字符串dom==>', h)
      ulDom.appendChild(liDom)
      console.log('ulDom', ulDom.innerHTML)
    },
    // 获取文件地址
    getObjectURL: function (file) {
      var url = null
      console.log(file)
      if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    }
}

// app.js
// "{\"deadTime\":1516446016000,
// "email":"editor4@cicc.com",
// "freeCategoryIds\":\"0\",
// \"fullName\":\"editor4\",
// \"id\":4,\"imRights\":1,
// \"imStatement\":0,
// \"imStatus\":1,\"imTip\":1,
// \"level\":\"B\",
// \"mobile\":\"13444444444\",
// \"status\":1,
// \"type\":2}"

// main.js{"code":200,"data":{"hasComments":0,"message":0,"ciccTripStatus":true,"nameAndImg":{"name":"editor4"}},"msg":"请求成功！"}



function inArray( elem, arr, i ) {
  var len
  
  if ( arr ) {
    if (indexOf) {
      return indexOf.call(arr, elem, i)
    }
  
    len = arr.length;
    i = i ? i < 0 ? Math.max(0, len + i) : i : 0
    for (; i < len; i++) {
      if (i in arr && arr[i] === elem) {
        return i
      }
    }
  }
  return -1
}


var getFileUrlFn = function(file) {
  var uri = {
    url: '',
    filename: '',
    filetype: '',
    data: ''
  };
  
  var fileObj = file
  
  if (!fileObj) {
    return uri;
  }
  try {
    if (window.URL.createObjectURL) {
        var u = fileObj
        uri.data = u
        uri.url = window.URL.createObjectURL(u)
        uri.filename = u.name || ''
    }
    var index = uri.filename.lastIndexOf('.')
    if (index != -1) {
      uri.filetype = uri.filename.substring(index + 1).toLowerCase()
    }
    return uri
  } catch (e) {
    throw e
  }
}


function convertBase64UrlToBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);
  
  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  
  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  //Old Code
  //write the ArrayBuffer to a blob, and you're done
  //var bb = new BlobBuilder();
  //bb.append(ab);
  //return bb.getBlob(mimeString);
  
  //New Code
  console.log('mimeString==>', mimeString)
  return new Blob([ab], {type: mimeString});
}


function convertBase64UrlToBlob2(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);
  
  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  
  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  //Old Code
  //write the ArrayBuffer to a blob, and you're done
  //var bb = new BlobBuilder();
  //bb.append(ab);
  //return bb.getBlob(mimeString);
  
  //New Code
  console.log('mimeString==>', mimeString)
  return new Blob([ab], {type: 'm3u8'});
}




function getFileUrl1 (fileObj, fileData) {
  var uri = {url: '', filename: '', filetype: '', data: ''}
  if (!fileObj) return uri
  
  try {
    if (window.URL.createObjectURL) {
      uri.data = fileData;
      uri.url = window.URL.createObjectURL(fileData)
      uri.filename = fileObj.name || ''
      uri.filesize = fileObj.size
    }
    var index = uri.filename.lastIndexOf('.')
    if (index != -1) {
      uri.filetype = uri.filename.substring(index + 1).toLowerCase()
    }
    return uri
    
  } catch (e) {
    throw e
  }
}



var imAction = {
  init: function () {
     var imStatus = userInfo.imStatus
     //var id = userInfo.id
     if (imStatus == 0) {
      appIM.regist({username: curUserId, password: '111111'})
     } else if (imStatus == 1) {
      appIM.login({username: curUserId, password: '111111'})
     }
     
    // appIM.login({'username': curUserId, 'password': '111111'})
  },
  /**
   * @desc 发送文件消息
   * @param {Object} param = {to: to, isMe: is_me, fileData}
   * to 是发送对象的id
   * fileId file input 的id
   * isMe 发送消息的人是否是我自己
   * */
  //{"size":136531,
  // "type":"image/jpeg",
  // "name":"IMG_0597.JPG",
  // "lastModifiedDate":"2017-11-15T07:24:13.737Z",
  // "fullPath":"/var/mobile/Containers/Data/Application/D2D117C5-B0A0-4A20-BA04-1B795C9C3A51/Documents/Pandora/apps/HBuilder/doc/camera/IMG_0597.JPG"}
  sendFile: function (param) {
      var id = conn.getUniqueId();                       // 生成本地消息id
      var msg = new WebIM.message('file', id)           // 创建文件消息
      var file = param.fileData
      var fileName = file.filename
      var fileSize = file.filesize
      var fileType = file.filetype
      var uploadFiledata = null
      var url = null
      var curRenderType = param.type
      var allowType = allowSendFileType[param.type]
      var msgType = renderFileType[param.type]
      var fileUuid = null
      var shareSecret = null
      
    
      console.log('msgType==>', msgType)
    
      console.log('file==>', JSON.stringify(file))
      
      if (fileType in allowType) {
        var option;
        option = {
          apiUrl: WebIM.config.apiURL,
          file: file,
          to: param.to, // 接收消息对象
          roomType: false,
          chatType: 'singleChat',
          onFileUploadError: function () { // 消息上传失败
            console.log('消息上传失败' + 'onFileUploadError')
            console.log('arguments==>', JSON.stringify(arguments))
          },
          onFileUploadComplete: function (data) { // 消息上传成功
            url = ((location.protocol != 'https:' && WebIM.config.isHttpDNS) ? (Demo.conn.apiUrl + data.uri.substr(data.uri.indexOf("/", 9))) : data.uri) + '/' + data.entities[0].uuid;
            
            console.log('消息上传成功', 'onFileUploadComplete')
            console.log('上传成功返回data==>', JSON.stringify(data))
            console.log('发送文件成功后生成的文件地址==》', url)
           
            uploadFiledata = data
            fileUuid = data.entities[0].uuid
            shareSecret = data.entities[0]['share-secret']
            
          },
          success: function () { // 消息发送成功
            console.log('消息发送成功 ===>', 'Success')
            console.log('文件发送成功回调函数的参数==》', JSON.stringify(arguments))
            
            // 文件消息渲染到当前窗口
            var msgId = arguments[1]
            var msgData = {
              fileName: fileName,
              fileSize: fileSize,
              fileUrl: url,
              fileExt: fileType
            }
            console.log('myRenderType', curRenderType)
            appIM.renderMsg(true, curRenderType, msgData)
            console.log('url==>', JSON.stringify(msgData))
            
            try {
              // 文件消息保存到数据库
              var param = {
                receiverId: chatId,
                msg: "",
                type: msgType,
                msgId: msgId,
                fileUrl: url,
                fileName: fileName,
                fileSize: fileSize,
                fileUuid: fileUuid,
                shareSecret: shareSecret,
              }
              console.log('文件参数', JSON.stringify(param))
              imApi.saveMsg(param, function (state, data) {
    
                if (state) {
                  console.log('保存文件消息成功~')
                  return
                }
                console.log('文件保存失败', JSON.stringify(data))
              })
            } catch (e) {
              console.log('error==>', e)
            }
            
            
      
          },
          flashUpload: WebIM.flashUpload
        };
        msg.set(option);
        conn.send(msg.body);
      } else {
       mui.toast('发送文件失败！')
      }
  },
  // 发送文本消息
  sendText: function(param) {
      if (textSending) return
          textSending = true
      var msgVal = param.msg //param.msg.replace(/(^\s*)|(\s*$)/g, '')
      var to = param.to
      if (msgVal == null || msgVal.length == 0 || !to)return
  
      var id = conn.getUniqueId();                // 生成本地消息id
      var msg = new WebIM.message('txt', id);     // 创建文本消息
      msg.set({
        msg: msgVal,                  // 消息内容
        to: to,                    // 接收消息对象（用户id）
        roomType: false,
        success: function (id, serverMsgId) {
          console.log('send private text Success')
          // 显示在当前窗口
          appIM.renderMsg(true, 'text', msgVal)
          // 保存进数据库
          var saveParam = {
            receiverId: to,
            msg: msgVal,
            type: 0,
            illegalWords:'',
            documentId:'',
            documentTitle:'',
            msgId: serverMsgId
          }
          console.log('to', to)
          imApi.saveMsg(saveParam, function (state, data) {
            if (state) {
              console.log('文本信息保存成功~')
            } else {
              console.log('保存信息失败==》', JSON.stringify(data))
            }
          })
        },
        fail: function(e){
          console.log("Send private text error")
        }
      })
      msg.body.chatType = 'singleChat'
      conn.send(msg.body)
      
      setTimeout(function() {
        textSending = false
      }, 1000)
    } 
  
}

imAction.init()


var vm = new Vue({
    el: '#im-chat-box',
    data: {
      msgList: [],
      showSmil: false,
      showFile: false,
      showInput: true,
      showSend: false, // 发送按钮是否显示
      chatName: '',
      showBig: false, // 点击显示大图
      bigSrc: null,
      bigType: null,
      showVoiceTip: true,
      voiceTipContent:null
    },
    created: function () {
      var _this = this
      this.setSmilContent()
      document.getElementById('smil-box').innerHTML = this.smilContent
      //imAction.init()// 用户注册/登录
    },
    mounted: function () {
      var _this = this
      
      var ui = {
        smilCt: document.getElementById('smil-control'),
        fileCt: document.getElementById('file-control'),
        inputMsg: document.getElementById('input-msg'),
        voiceCt: document.getElementById('voice-control'),
        contactBox: document.getElementById('contact-ct'),
        sendBtn: document.getElementById('send-text'),
        modalBody: document.getElementById('im-modal-body'),
        voiceBtn: document.getElementById('app-voice'),
        sendImgInput: document.getElementById('sendImgInput'),
        takePicBtn: document.getElementById('im-take-pic'),
        takeVideoBtn: document.getElementById('im-video'),
        footer: document.querySelector('footer'),
        h: document.querySelector('#h'),
        content: document.querySelector('.mui-content')
      }
      
      function msgTextFocus() {
        ui.inputMsg.focus();
        setTimeout(function() {
          ui.inputMsg.focus();
        }, 150);
      }
      

      // 以下实现状态切换
      // 点击表情按钮
      ui.smilCt.addEventListener('tap', function () {
        var curStatus = _this.setStatus(this, 'smil')
        _this.showInput = true
        if (curStatus == 'smil') {
          _this.showSmil = false
        } else {
          _this.showSmil = true
          _this.showFile = false
          _this.resetStatus('file')
        }
        _this.resetStatus('input')
      })

      // 点击文件按钮
      ui.fileCt.addEventListener('tap', function () {
        console.log('xx')
        var curStatus = _this.setStatus(this, 'file')
        _this.showInput = true
        if (curStatus == 'file') {
          _this.showFile = false
        } else {
          _this.showFile = true
          _this.showSmil = false
          _this.resetStatus('smil')
          _this.resetStatus('input')
        }
        _this.resetStatus('input')
      })

      // input 获取光标
      ui.inputMsg.addEventListener('focus', function () {
        _this.showFile = false
        _this.showSmil = false
        _this.resetStatus('smil')
        _this.resetStatus('file')
      })


      // 语音图标点击
      ui.voiceCt.addEventListener('tap', function () {
        var status = this.getAttribute('data-status')
        _this.showSmil = false
        _this.showFile = false
        if (status == 'input') {
          _this.showInput = false
          _this.showSend = false
          this.setAttribute('data-status', 'voice')
        } else {
          _this.showInput = true
          _this.resetStatus('input')
          document.getElementById('input-msg').focus()
          var inputVal = document.getElementById('input-msg').value
          if (inputVal != '') {
            _this.showSend = true
          } else {
            _this.showSend = false
          }
        }
      })

      // 操作区失去焦点
      ui.contactBox.addEventListener('tap', function () {
          ui.inputMsg.blur()
          _this.showFile = false
          _this.showSmil = false
          _this.resetStatus('file')
          _this.resetStatus('smil')
      })
  
      /*ui.h.style.width = ui.inputMsg.offsetWidth + 'px';
      var footerPadding = ui.footer.offsetHeight - ui.inputMsg.offsetHeight;
      ui.footer.style.height = (ui.h.offsetHeight + footerPadding) + 'px';
      ui.content.style.paddingBottom = ui.footer.style.height;*/
      
      // 点击表情
      mui('#smil-box').on('tap', 'li', function () {
        var dataKey = this.getAttribute('data-key')
        var curVal = document.getElementById('input-msg').value
        document.getElementById('input-msg').value = curVal + dataKey
        if (document.getElementById('input-msg').value != '') {
          _this.showSend = true
        }
      })
      var focus = false
      ui.inputMsg.addEventListener('tap', function(event) {
        ui.inputMsg.focus()
        setTimeout(function() {
          ui.inputMsg.focus()
        }, 0)
        focus = true
        setTimeout(function () {
          focus = false
        },1000)
      }, false)
      
      // 监听input标签的输入input onpropertychange
      ui.inputMsg.addEventListener('input', function () {
        var curVal = this.value
        if (curVal) {
          _this.showSend = true
        } else {
          _this.showSend = false
        }
      })
  
      // 监听input标签的输入input onpropertychange
      ui.inputMsg.addEventListener('change', function () {
        var curVal = this.value
        if (curVal) {
          _this.showSend = true
        } else {
          _this.showSend = false
        }
      })
      
      // 点击发送
      ui.sendBtn.addEventListener('tap', function () {
        var val = document.getElementById('input-msg').value
        imAction.sendText({to: chatId, msg: val})
        document.getElementById('input-msg').value = ''
        _this.showSend = false
      })
      
      // 图片消息点击
      mui('#contact-ct').on('tap', 'img', function () {
        var curBigSrc = this.getAttribute('src')
        console.log('curBigSrc', curBigSrc)
        _this.bigSrc = curBigSrc
        _this.showBig = true
        _this.bigType = 'img'
        
      })
      
      // 点击大图背景
      ui.modalBody.addEventListener('tap', function () {
      	console.log('背景消失')
        _this.bigSrc = null
        _this.showBig = false
        _this.bigType = null
      })
  
      mui.init({
        gestureConfig: {
            tap: true, //默认为true
			doubletap: true, //默认为false
			longtap: true, //默认为false
			swipe: true, //默认为true
			drag: true, //默认为true
			hold: true, //默认为false，不监听
			release: true //默认为false，不监听
        }
      })
    
      var old_back = mui.back
      mui.back = function(){
        console.log('执行上一个界面的方法')
        var preview = plus.webview.currentWebview().opener()
        preview.evalJS("renderDom.init()")
        old_back()
      }

       mui.plusReady(function () {
        
        // 获取上一个窗口传递过来的chatName
        var curChatInfo= plus.webview.currentWebview()
        document.getElementById('chatName').innerHTML = curChatInfo.chatName
        chatId = curChatInfo.chatId
        
        // 渲染聊天列表
        imApi.getCurrentChatInfo({id: chatId, page: 1}, function (state, data) {
          if (state) {
              console.log('chat-info-data-->', JSON.stringify(data))
              var curD = data.data.imList
              var curData = []
              mui.each(curD, function (i, item){
                var obj = {}
                var me = item.senderId == curUserId
                obj['type'] = item.type + ''
                obj['isMe'] = me
                obj['name'] = me ? userName : item.senderAccount
                if (item.type == 0) {
                  obj['msg'] = appIM.replaceTextMsg(item.msg)
                } else if (item.type == 1 || item.type == 2 || item.type == 3) { // type:0 文本, 1 图片，2 音频， 3视频， 4 文件
                  obj['fileUrl'] = item.fileUrl
                }
                
                console.log('receiverAccount',item.senderId)
                console.log('senderAccount',item.receiverId)
                
                curData.push(obj)
              })
            
            setTimeout(function () {
              console.log('curData==>', JSON.stringify(curData))
              console.log('innerh==>', document.getElementById('contact-ct').innerHTML)
            }, 3000)

              _this.msgList = curData
          }
        })
  
         /*begin audio*/
         // 创建audio 目录
         plus.io.resolveLocalFileSystemURL('_doc/', function(entry){
           entry.getDirectory('audio', {create:true}, function(dir){
             gentry = dir
             clearHistoryAudio() // 页面初次加载清空语音记录
           }, function(e){
             console.log('Get directory "audio" failed: '+e.message);
           })
         }, function(e){
           console.log('Resolve "_doc/" failed: '+e.message);
         })

         //清空录音目录
         function clearHistoryAudio() {
           try {
             gentry.removeRecursively(function(){
               console.log('清空audio本地历史记录操作成功！');
             }, function(e){
               console.log('清空audio本地历史记录操作失败：'+e.message);
             });
           } catch (e) {
             console.log('清空目录失败===》', JSON.stringify(e))
           }
         }

        // 语音 长按
         ui.voiceBtn.addEventListener("touchstart", function(e) {
           console.log("start....");
           e.preventDefault();
         });


        var r = plus.audio.getRecorder();
        ui.voiceBtn.addEventListener('hold', function () {
          this.setAttribute('style', 'background-color: #ccc')
          console.log('正在录音==》')
          if (r == null) {
            alert("Device not ready!");
            return;
          }
          r.record({filename: "_doc/audio/"}, function (path) {
            alert("Audio record success!" + path);
            var curPath = 'file://' + plus.io.convertLocalFileSystemURL(path) //将平台绝对路径转换成本地URL路径
            console.log('curPath==>', curPath)
            try {
              plus.io.resolveLocalFileSystemURL(curPath, function (entry) {
                console.log('curPath==>', curPath)
                entry.file(function (file) {
                  var myFileReader = new plus.io.FileReader()
                  myFileReader.readAsDataURL(file)
                  myFileReader.onloadend = function (e) {
                    console.log('result==>', e.target.result)
                    var imgBlob = convertBase64UrlToBlob(e.target.result)
                    var myFile = getFileUrl1(file, imgBlob)
                    imAction.sendFile({fileData: myFile, to: chatId, type: 'audio'})
                  }
                })
              })
            } catch (e) {
              console.log('e=>', JSON.stringify(e))
            }
          })
  
        })
         
         
         // 音频预览
         document.getElementById('tapAudio').addEventListener('tap', function () {
           var audioDom = this.querySelector('audio')
           audioDom.play()
         })
         
          // 点击播放音频
        /* mui('#contact-ct').on('tap', '.thisAudio', function () {
           var path = this.getAttribute('data-url')
           var audioObj = plus.audio.createPlayer(path)
            audioObj.play(function (){
              console.log('语音播放完成')
            })  
         })*/

        // 语音 松开
        ui.voiceBtn.addEventListener('release', function () {
          this.setAttribute('style', 'background-color: #fff')
          console.log('松开录音')
          r.stop()
        })
         
         mui('#contact-ct').on('tap', '.my-audio', function () {
           
           var myAudio = this.querySelector('audio')
           console.log('audio==>')
           console.log(myAudio)
           try {
             myAudio.play()
           } catch (e) {
             console.log('音频播放出错==>', JSON.stringify(e))
           }
           
         })
         
         /*end audio*/
         
         // 发送相册图片
        document.getElementById('im-pic').addEventListener('tap', function () {
          plus.gallery.pick( function(e){
            var fileList = e.files
            mui.each(fileList, function (i, item) {
              plus.io.resolveLocalFileSystemURL(item, function( entry ) {
                entry.file( function(file){
                   var myFileReader = new plus.io.FileReader()
                    myFileReader.readAsDataURL(file)
                    myFileReader.onloadend = function (e) {
                      var imgBlob = convertBase64UrlToBlob(e.target.result)
                      var myFile = getFileUrl1(file, imgBlob)
                      imAction.sendFile({fileData: myFile, to: chatId, type: 'img'})
                    }
                })
              }, function ( e ) {
                alert( "Resolve file URL failed: " + e.message )
              })
            })
            
          }, function (e) {
            console.log( "取消选择图片")
          },{filter:"image", multiple:true, maximum: 3, system:false, onmaxed: function () {
            //plus.nativeUI.alert('最多只能选择3张图片')
            mui.toast('最多只能选择3张图片')
          }})
        })
    
        // 拍照
        ui.takePicBtn.addEventListener('tap', function () {
          _this.takePhoto()
        })
    
        // 摄像
        ui.takeVideoBtn.addEventListener('tap', function () {
          _this.takeVedio()
        })
      })
      
    },
    destroyed: function () {

    },
    methods: {
      // 填充表情图标
      setSmilContent: function () {
        var data = appIM.facesData()
        var h = '<ul>'
        mui.each(data.map, function(i, item) {
          h += '<li data-key="'+i+'"><img src="'+data.path+item+'"></li>'
        })	
        h += '</ul>'
        this.smilContent = h
      },
      // 设置状态属性
      setStatus: function (target, type) {
        var status = target.getAttribute('data-status')
        if (status == 'keyboad') {
          if(type == 'smil') {
            target.setAttribute('data-status', 'smil')
          } else {
            target.setAttribute('data-status', 'file')
          }
        } else {
          target.setAttribute('data-status', 'keyboad')
        }
        return target.getAttribute('data-status')
      },
      // 重置data-status属性
      resetStatus: function (type) {
        if (type == 'file') {
            document.getElementById('file-control').setAttribute('data-status', 'file')
        } else if (type == 'smil') {0
            document.getElementById('smil-control').setAttribute('data-status', 'smil')
        } else if (type == 'input') {
            document.getElementById('voice-control').setAttribute('data-status', 'input')
        }
      },
      // 在系统相册中选取图片
      getPic: {
        init: function () {
          console.log('getpic==>')
        
        }
      },
      // 拍照
      takePhoto: function () {
        var cmr = plus.camera.getCamera()
        var res = cmr.supportedImageResolutions[0]
        var fmt = cmr.supportedImageFormats[0]
        console.log("Resolution: "+res+", Format: "+fmt)
        try {
          cmr.captureImage(function(path){
            alert( "Capture image success: " + path )
            var curPath = 'file://' + plus.io.convertLocalFileSystemURL(path)
            console.log('curPath==>', curPath)
            plus.io.resolveLocalFileSystemURL(curPath, function( entry ) {
              entry.file( function(file){
                var myFileReader = new plus.io.FileReader()
                myFileReader.readAsDataURL(file)
                myFileReader.onloadend = function (e) {
                  var imgBlob = convertBase64UrlToBlob(e.target.result)
                  var myFile = getFileUrl1(file, imgBlob)
                  imAction.sendFile({fileData: myFile, to: chatId, type: 'img'})
                }
              })
            }, function ( e ) {
              alert( "Resolve file URL failed: " + e.message )
            })
          },
          function( error ) {
            alert( "Capture image failed: " + error.message )
          }, {resolution: res, format: fmt})
        } catch (e) {
          console.log('拍照出错==>', JSON.stringify(e))
        }

      }, 
      // 摄像
      takeVedio: function () {
        var cmr = plus.camera.getCamera()
        var res = cmr.supportedImageResolutions[0]
        var fmt = cmr.supportedImageFormats[0]
        console.log("Resolution: "+res+", Format: "+fmt)
        cmr.startVideoCapture( function( path ){
            alert( "Capture video success: " + path ) 
          },function( error ) {
            alert( "Capture video failed: " + error.message )
          },
          {resolution: res, format: fmt}
        )
      }
    }
  }) 
