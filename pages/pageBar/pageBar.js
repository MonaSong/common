/*
* @author mona
* @date 2017-10-19
* @desc 分页控件，适用于ajax请求分页数据
 */
function PageBar (options) {
    this.settings = $.extend({}, options)
    this.init()
    this.status = 0
}

PageBar.prototype = {
    init: function () {
        var _this = this
        _this.render(_this.settings)
        _this.registEvent()
    },
    render: function (param) {
        var _this = this
        if (param.currentPage < 1) {
            $(param.selector).html('')
            return 
        }
        
        var hasPrev = param.currentPage > 1
        var hasNext = param.currentPage < param.totalPage
        
        var h = '<ul>'
        if (hasPrev) { // 如果当前页是第一页
            h += _this.getLi({type:'prev'})
        }
        if (_this.settings.totalPage <= 8) { // 如果总页数小于8
            for (var i = 1; i <= param.totalPage; i++) {
                if (param.currentPage == i) {
                    h += _this.getLi({type: 'cur', curPage: i})
                } else {
                    h += _this.getLi({pageNo: i})
                }
            }
            //h += _this.getCtLi(param.currentPage, param.totalPage)
        } else { // 如果总页数大于 8
            if (param.currentPage <= 5) { // 如果当前页小于5
                for (var i = 1; i <= 7; i++) {
                    if (param.currentPage == i) {
                        h += _this.getLi({type: 'cur', curPage: i})
                    } else {
                        h += _this.getLi({pageNo: i})
                    }
                }
                h += _this.getLi({type:'more'})
                h += _this.getLi({type:'total', totalPage: param.totalPage})
            } else { // 如果当前页大于5
                h += _this.getLi({pageNo:1})
                //h += _this.getLi({pageNo:2})
                h += _this.getLi({type:'more'})
                var begin = param.currentPage - 2
                var end = param.currentPage + 2
                if (end > param.totalPage) {
                    end = param.totalPage
                    begin = end - 4
                    if (param.currentPage - begin < 2) {
                        begin = begin - 1
                    }
                } else if ((end + 1 )== param.totalPage) {
                    end = param.totalPage
                }
                for (var i = begin; i <= end; i++) {
                    if (param.currentPage == i) {
                        h += _this.getLi({type:'cur', curPage: i})
                    } else {
                        h += _this.getLi({pageNo: i})
                    }
                }
                if (end != param.totalPage) {
                    h += _this.getLi({type:'more'})
                } 
                if (hasNext) {
                    if (param.totalPage - param.currentPage > 3) {
                        
                        h += _this.getLi({type:'total', totalPage: param.totalPage})
                    }
                }
            }

            if (hasNext) {
                    h += _this.getLi({type:'next'})
                }
        }
        
        h += _this.getCtLi(param.currentPage, param.totalPage)
        h += '</ul>'
        $(_this.settings.selector).html(h)
    },
    getLi: function (param) {
        var type = param.type
        var num = param.num
        var curPage = param.curPage
        var totalPage = param.totalPage
        var pageNo = param.pageNo
        var h = ''
        switch (type) {
            case 'more':
            h += '<li data-type="more">...</li>' 
            break;
            case 'prev':
            h += '<li data-type="page" data-role="prev"><span>上一页</span></li>' // 可点
            break;
            case 'next':
            h += '<li data-type="page" data-role="next"><span>下一页</span></li>' // 可点
            break;
            case 'total':
            h += '<li data-type="page" data-v="'+totalPage+'"><span>'+totalPage+'</span></li>' // 可点
            break;
            case 'oneof':
            h += '<li data-type="oneof"><span>'+curPage+'/'+totalPage+'</span></li>'
            break;
            case 'more':
            h += '<li data-type="more">...</li>'
            break;
            case 'search':
            h += '<li data-type="search-input" class="search-ct"><input type="text" value="'+curPage+'"></li>'
            break;
            case 'jumpLi':
            h += '<li data-type="search" class="search-page"><span>跳页</span></li>' //可点
            break;
            case 'each':
            if (num) {
                for (var i = 0; i < num; i++) {
                    h += '<li data-type="page" data-v="'+(i + 1)+'"><span>'+(i + 1)+'</span></li>'
                }
            }
            break;
            case 'cur':
            h += '<li data-type="page" data-v="'+curPage+'"><span class="cur">'+curPage+'</span></li>'
            break;
            default: 
            h += '<li data-type="page" data-v="'+pageNo+'"><span>'+pageNo+'</span></li>'
            break;
        }
        return h
    },
    getCtLi: function (curPage, totalPage) {
        var _this = this
        var h = ''
            h += _this.getLi({type:'oneof', curPage:curPage, totalPage: totalPage})
            h += _this.getLi({type:'search', curPage: curPage})
            h += _this.getLi({type:'jumpLi'})
            return h
    },
    registEvent: function () {
        var _this = this
        $(document).off('click', _this.settings.selector + ' [data-type="page"]')
        $(document).off('click', _this.settings.selector + ' [data-type="search"]')
        // 点击页码/上一页/下一页
        $(document).on('click', _this.settings.selector + ' [data-type="page"]', function () {
            var pageNum = ' '
            var hasDataRole = $(this).attr('data-role')
            if (hasDataRole) {
                if (hasDataRole == 'prev') {
                    pageNum = parseInt($(this).parents('ul').find('span.cur').text()) - 1
                }
                if (hasDataRole == 'next') {
                    pageNum = parseInt($(this).parents('ul').find('span.cur').text()) + 1
                }
            } else {
                pageNum = parseInt($(this).find('span').text())
            }
            _this.settings.currentPage = pageNum
            _this.render(_this.settings)
            $.isFunction(_this.settings.sucOpt) && _this.settings.sucOpt(pageNum)
        })

        // 点击跳转
        $(document).on('click', _this.settings.selector + ' [data-type="search"]', function () {
            var pageNum = parseInt($(_this.settings.selector).find('[data-type="search-input"] input').val())
            if (pageNum < 1 || pageNum > _this.settings.totalPage) return
            _this.settings.currentPage = pageNum
            _this.render(_this.settings)
            $.isFunction(_this.settings.sucOpt) && _this.settings.sucOpt(pageNum)
        })
    }
}

new PageBar({
    selector: '#myPageBar',
    currentPage: 1,
    totalPage: 103,
    sucOpt:function (num) {
        console.log(num)
    }
})

// 返回数据data = {}
// totalPage
// dataList：[{name:''},{name:''}]

/*function renderData(data){

}*/

/*$.ajax({
   type:'get',
   data:{currentPage:1, pageSize: 10},
   success: function (data) {
    var totalPage = data.totalPage
    renderData(data) // 渲染数据
    new PageBar({
        selector: '#myPageBar',
        currentPage: 1,
        totalPage: totalPage,
        sucOpt:function (num) {
            $.ajax({
                type:'get',
                data:{pageSize: 10, currentPage: num} 
                success: function (data) {
                    renderData(data)
                }
            })
        }
    })
   } 
})*/


