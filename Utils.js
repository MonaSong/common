var Utils = {
  /**
   * [storage description] 本地存储
   * @type {Object}
   */
  storage:{
    setSessionStore: function (key, val) {
      window.sessionStorage[key] = val
    },
    getSessionStore: function (key) {
      return window.sessionStorage[key]
    },
    clearSessionStore: function () {
      window.sessionStorage.clear()
    },
    setLocalStore: function (key, val) {
      window.sessionStorage[key] = val
    },
    getLocalStore: function (key) {
      return window.sessionStorage[key]
    },
    clearLocalStorage: function () {
      window.localStorage.clear()
    }
  },
  /**
   * @description  获取地址栏中的参数
   * @return {Object} 返回地址栏中的查询参数对象
   */
  getHrefData: function () {
   var idx0 = ref.indexOf('?')
   var data = {}
   if (idx0 > -1) {
     var c_data = ref.substring(idx0 + 1)
     var idx1 = c_data.indexOf('&')
     if (idx1 > -1) {
        c_data = c_data.split('&')
        $.each(c_data, function (i, item) {
          var cur = item.split('=')
          data[cur[0]] = cur[1]
      })
     } else {
      var cur = c_data.split('=')
      data[cur[0]] = cur[1]
     }
   } 
   return data
  },
  getCookie: function (name) {
      var match = document.cookie.match(new RegExp(name + '=([^;]+)'));
      if (match) return match[1];
  },
  setCookie: function (name, value) {
      var exp = new Date();
      exp.setTime(exp.getTime() + 365 * 24 * 3600 * 1000);
      document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
  },
  //获取当前协议
  getProtocol: function () {
    return window.location.protocol
  },
  //获取当前域名信息
  getUrlDomain: function () {
      return window.location.protocol + "//" + window.location.host;
  },
  getHashParams: function () {
      var hash = location.hash;
      var tmpArr = hash.split("&");
      var parmObj = {};
      if (tmpArr.length > 0 && tmpArr[0] !== "") {
          for (var i = 0, len = tmpArr.length; i < len; i++) {
              var tmp = tmpArr[i].replace("#", "").split("=");
              parmObj[tmp[0]] = tmp[1];
          }
      } else {
          parmObj = {};
      }
      return parmObj;
  },
  hasClass: function (elem, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
  },
  addClass: function(ele, cls) {
    if (!hasClass(elem, cls)) {
      ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
    }
  },
  removeClass: function (ele, cls) {
    if (hasClass(elem, cls)) {
      var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
      while (newClass.indexOf(' ' + cls + ' ') >= 0) {
        newClass = newClass.replace(' ' + cls + ' ', ' ');
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
  },
  convertBase64UrlToBlob: function(dataURI) {
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
    return new Blob([ab], {type: mimeString});
  },
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
  },
  //
  getStrLength: function(s) {
      var len = 0
      for(var i=0; i<s.length; i++) {
          var c = s.substr(i,1)
          var ts = escape(c);  
          if(ts.substring(0,2) == "%u"){
              len += 2
          } else {
              len += 1
          }
      }
      return len
  },
  browseName: function () {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
    var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
    var isSafari = userAgent.indexOf("Safari") > -1; //判断是否Safari浏览器
    if (isIE) {
        var IE5 = IE55 = IE6 = IE7 = IE8 = false;
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        IE55 = fIEVersion == 5.5;
        IE6 = fIEVersion == 6.0;
        IE7 = fIEVersion == 7.0;
        IE8 = fIEVersion == 8.0;
        if (IE55) {
            return "IE55";
        }
        if (IE6) {
            return "IE6";
        }
        if (IE7) {
            return "IE7";
        }
        if (IE8) {
            return "IE8";
        }
    }//isIE end
    if (isFF) {
        return "FF";
    }
    if (isOpera) {
        return "Opera";
    }

 }
