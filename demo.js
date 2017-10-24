/**
 * @author mona
 * @date 2017-10-24
 * @description  研报页
 */

var documentPage = (function($, doc, undefined){

  // ajax
  var _privateMethod = function () {
    // TODO
  }

  // 渲染li
  var publicMethod = function () {
    _privateMethod()
  }

  /**
   * @description render li模板
   * @param  {Object} param 
   * param.name {String} 名称
   * param.age  {String} 年龄
   * @return {String} 返回lidom
   */
  var publicMethod2 = function (param) {
    var li = '<li></li>'
    _privateMethod()
    return li
  }

  return {
    renderLi: publicMethod
    getLi: publicMethod2
  }

})(mui, document)


// 调用
documentPage.renderLi()
documentPage.getLi()