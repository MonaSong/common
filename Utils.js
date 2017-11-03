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
  }
}