/**
 * @author  mona
 * @date  2017-10-20
 * @description 网络层封装
 */

(function ($, owner){

  // 初始化app
  owner.initApp = function () {

  }

  // 获取服务器地址
  owner.getServer = function () {

  }

  /**
  * @description  基础请求
  * @param {options} [Object] [基础请求参数] 
  * options.param[Object],
  * options.param.url,     // 请求地址
  * options.param.data,    // 请求参数
  * options.param.httpType // 请求类型
  * options.cb             // 请求回调
  */
  var baseRequest = function (options) {
    var url = owner.getServer() + options.param.url
    var httpType = options.param.httpType
    var contentType = null
    if (httpType == 'post') {
      contentType = 'application/json'
    } else if (httpType == 'get') {
      contentType = 'application/json'
    } else {
      return $.isFunction(options.cb) && options.cb(false, '请求参数错误')
    }
    var curParam = {
      data: options.param.data,
      dataType: contentType,
      type: httpType,
      headers: {'Content-Type': contentType}
    }
    $.ajax(
      url,
      curParam, 
      success: function (data) {
        return $.isFunction(options.cb) && options.cb(true, data)
      },
      error: function (xhr, type, errorThrown) {
        var msg = '服务错误'
        if (type == 'timeout') msg = '请求超时'
        return $.isFunction(options.cb) && options.cb(false, msg)
      }
  )}

  /**
  * @description  get
  * @param {url} [String] [请求地址] 
  * @param {param} [Object] [请求参数] 
  * @param {callback} [Function] [请求回调]
  */
  var getData = function (param) {
    baseRequest({param: {url: param.url, data: param.data, httpType: 'get'}, cb: param.cb})
  }

  /**
  * @description  post
  * @param {url} [String] [请求地址] 
  * @param {param} [Object] [请求参数] 
  * @param {callback} [Function] [请求回调]
  */
  var postData = function (param) {
    baseRequest({ param: {url: param.url, data: param.data, httpType: 'post'}, cb: param.cb})
  }

}(mui, window.app = {}))