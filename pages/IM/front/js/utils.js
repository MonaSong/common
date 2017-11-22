/**
 * @desc 通用UI处理
 */


var Utils = {
  /**
   * @desc 手机号码验证
   */
  _isMobile: function(value){
		var length = value.length
    //中国移动
    var cm = /(^1(3[4-9]|4[7]|5[0-27-9]|7[8]|8[2-478])\d{8}$)|(^1705\d{7}$)/

    //中国联通
    var cu = /(^1(3[0-2]|4[5]|5[56]|7[6]|8[56])\d{8}$)|(^1709\d{7}$)/

    //中国电信
    var ct = /(^1(33|53|77|8[019])\d{8}$)|(^1700\d{7}$)/
    return (length == 11 && (cm.test(value) || cu.test(value) || ct.test(value)))
  },
   /**
   * @desc 通用对话框
   * @param {Object}  param = {type:'', content:{}, suc_opt: function, err_opt: function, hidden_modal:function}
   * type 对话框类型  tip 为简单提示 || alert 是警告 || modal 为普通提示对话框  用来定义风格，后期完善
   * content.title  提示的标题 content.body  提示的内容 content.suc_opt_text  成功按钮的文案 content.err_opt_text 失败操作的文案
   */
  ciccModal: function (options) {
    if ($('#ciccModal').length > 0) {
      $('#ciccModal').detach()
    }
    var options = options || {}
    var content = options.content || {}
    var title = content.title === undefined ? '系统提示' : content.title 
    var body = content.body || '这里是提示框内容'
    var suc_txt = content.suc_opt_text === undefined ? '保存' : content.suc_opt_text 
    var err_txt = content.err_opt_text === undefined ? '取消' : content.err_opt_text 
    var hidden_modal = options.hidden_modal || null
    var suc_opt = options.suc_opt || null
    var err_opt = options.err_opt || null

    var h = ''
    h += '<div class="modal fade" id="ciccModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">'
    h += '<div class="modal-dialog" role="document">'
    h += '<div class="modal-content">'
    
    h += '<div class="modal-header">'
    h += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
    h += title ? '<h4 class="modal-title" id="myModalLabel">'+title+'</h4>' :''
    h += '</div>'

    h += '<div class="modal-body">'+body+'</div>'

    var suc_opt_dom = suc_txt ? '<button type="button" class="btn  btn-primary"  id="cicc-modal-confirm">'+suc_txt+'</button>' : ''
    var err_opt_dom = err_txt ? '<button type="button" class="btn btn-default" data-dismiss="modal" id="cicc-modal-cancel">'+err_txt+'</button>' : ''
    if (suc_opt_dom || err_opt_dom) {
      h += '<div class="modal-footer">'
      h += suc_opt_dom
      h += err_opt_dom
      h += '</div>'
    }

    h += '</div>'
    h += '</div>'
    h += '</div>'
    
    $('body').append(h)
    $('#ciccModal').modal('show')

    //取消按钮点击回调
    if (err_opt_dom) {
      $('#cicc-modal-cancel').on('click', function () {
        $.isFunction(err_opt) && err_opt()
      })
    }
    

    //确认按钮点击回调
    if (suc_opt_dom) {
      $('#cicc-modal-confirm').on('click', function () {
        $('#ciccModal').modal('hide')
        $.isFunction(suc_opt) && suc_opt()
      })
    }
    

    // 对话框消失后回调
    if (hidden_modal) {
      $('#ciccModal').on('hidden.bs.modal', function(){
        $.isFunction(hidden_modal) && hidden_modal()
      })
    }
    
  }
}

$.validator.addMethod("isMobile", function(value, element) {
  return (this.optional(element) || tools._isMobile(value));
}, "请填写正确的手机号码");