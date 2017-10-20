// 当前页面网络层封装
var httpUtils = (function () {
  var requestObj = {}

  // 业务请求1
  requestObj.getListData1 = function (url, param,callback) {
    app.getData({url: url, data: param, cb: callback})
  }

  // 业务请求2
  requestObj.getListData2 = function (url, param, callback) {
    app.getData({url: url, data: param, cb: callback})
  }

  return requestObj

}())

// 当前页面请求业务数据
httpUtils.getListData1('getList1', {name: 'mona', pwd: '123456'}, function () {
  // 具体的渲染逻辑
})

httpUtils.getListData2('getList2', {name: 'mona', pwd: '123456'}, function () {
  // 具体的渲染逻辑
})

