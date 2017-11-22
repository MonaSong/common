/**
 * @desc 研报列表页
 */
$(function () {
    $('.c-second-level-menu > div > ul > li').hover(function () {
        console.log($(this).children('a'))
        $(this).children('a:eq(0)').css({'color': '#dc3333'})
        $(this).children('a:eq(0)').find('i').removeClass('glyphicon-menu-down').addClass('glyphicon-menu-up')
        $(this).siblings().find('[data-role="search-info"]').hide()
        $(this).find('[data-role="search-info"]').show()
    }, function () {
        $(this).children('a:eq(0)').css({'color': '#333'})
        $(this).children('a:eq(0)').find('i').removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down')
        $(this).find('[data-role="search-info"]').hide()
        if ($(this).find('.a-categray-box').length > 0) {
            $(this).find('.categary-a, .categary-b, .categary-c').find('li.active').removeClass('active')
        }
    })

    $('.searcher ul li').hover(function () {
        $(this).addClass('active')
    }, function(){
        $(this).removeClass('active')
    })

    $(document).on('click','[data-role="search-info"] ul li', function () {
        $(this).parents('[data-role="search-info"]').hide()
    })
})
function followAuthorAndSetAuthorState(target) {
    var ygz = "";
    var gz = "";
    if (lang == "zh") {
        ygz = "已关注";
        gz = "关注";
    } else {
        ygz = "Added";
        gz = "Add";
    }
    var id = target.getAttribute("data-id");
    var name=target.getAttribute("data-value")
    var isAdd = target.getAttribute("data-status")==0
    _followAuthor(id,name,isAdd,function(){
        if (!isAdd) {//取消关注
            target.setAttribute("data-status",0)
            target.innerHTML = "";
            target.className = "btn btn-default gz cus-default";
            $(target).html("<i>+</i>" + gz);
        } else {
            target.setAttribute("data-status",1)
            target.innerHTML = "";
            target.className = "btn btn-default gz cus-default active";
            $(target).html(ygz);
        }
        setAuthorState(id);
    });
}
//列表列的关注数据与右边推荐分析师动态联动
function setAuthorState(authorId) {
    var ygz = "";
    var gz = "";
    if (lang == "zh") {
        ygz = "已关注";
        gz = "关注";
    } else {
        ygz = "Added";
        gz = "Add";
    }
    var user_list = $('#recommend-author').find('.card-user');
    $.each(user_list, function (i, item) {
        if ($(item).find('span').attr('data-id') == authorId) {
            var spanUI=$(item).find('span[data-id="' + authorId + '"]');
            var cur_val = spanUI.text();
            if (cur_val === ygz) {//取消关注
                spanUI.html('<i>+</i>' + gz);
                spanUI.removeClass('active');
                spanUI[0].setAttribute("data-status",0)
            } else {
                spanUI.html(ygz);
                spanUI.addClass('active');
                spanUI[0].setAttribute("data-status",1)
            }
            return false;
        }
    });
}
function showAuthorInfo2() {
    _showAuthorInfo("followAuthorAndSetAuthorState");
}
