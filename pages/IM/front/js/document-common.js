$(document).on('click', '.icon-star', function () {
    var _this = this;
    var is_sc = $(_this).hasClass('active') ? '1' : '0';
    var documentId = $(_this).attr("value");
    $.post(ctx + "/frontend/document/favorite", {"id": documentId, "state": is_sc}, function (result) {
        if (result.ret == 0) {
            cicc_index.ciccModal({
                "content": {
                    "title": "提示",
                    "body": result.msg,
                    "suc_opt_text": "确定", "err_opt_text": ''
                }
            });
            return;
        }
        var selected = "";
        var select = "";
        if (lang == "zh") {
            selected = "已收藏";
            select = "收藏"
        } else {
            selected = "Selected";
            select = "Select"
        }
        if (is_sc == "0") {//收藏
            $(_this).parent()[0].innerHTML = "<i class=\"img icon-star active\" value=" + documentId + "></i>" + selected;
        } else {//取消收藏
            $(_this).parent()[0].innerHTML = "<i class=\"img icon-star\" value=" + documentId + "></i>" + select;
        }
    });
})

function appendDocumentItem(document) {
    var publishTime = "";
    if (document.publishTime != null) {
        publishTime = new Date(document.publishTime).pattern("yyyy-MM-dd")
    }
    var html = "";
    var dtitle = document.title;
    if (dtitle == null || dtitle == "") {
        dtitle = document.id;
    }
    var categoryName = "";
    if (document.categoryName != null) {
        categoryName = document.categoryName;
    }
    var html = html + "<div  class=\"contact-list-info clearfix\" value=" + document.id + ">" +
        "<div class=\"my-star\">" +
        "<div class=\"info-title\">" +
        "<a href='javascript:void(0)' onclick='documentClick(" + document.id + ")'><h4>" + dtitle;
    if (document.audioUrl != null && document.audioUrl != ""&& document.audioUrl .indexOf("getAudio")>-1) {
        html = html + "  <i class=\"img icon-speaker\"></i>";
    }
    var authorNames = document.authorNames;
    html = html + "</h4></a></div>" +
        "<div class=\"info-ctr clearfix\">" +
        "<div class=\"pull-left\">" +
        "<span><i class=\"img icon-clock\"></i><b>" + publishTime + "</b></span>" +
        " <span><i class=\"img icon-article\"></i><b class='over-ell'>" + categoryName + "</b></span>";
    html += (authorNames && authorNames.length > 0) ? "<span style='margin-right:0'><i class='img icon-authors' ></i></span>" : ''
    if (authorNames != null && authorNames.length > 0) {
        var authorIdArr = document.authorIds.split(",");
        var authorNameArr = authorNames.split(",");
        var authorList = new Array();
        var authorIds = new Array();
        for (var i = 0; i < authorNameArr.length-1; i++) {
            var author = {"id": authorIdArr[i], "name": authorNameArr[i]};
            authorList.push(author);
        }
        for (var i = 0; i < authorList.length; i++) {
            if (lang == 'en' && i + 1 > 3) {
                break;
            }
            html = html + " <span class=\"research-writer-info\" data-value='" + authorList[i]["id"] + "'>" +
                "<a target='_blank' href='" + ctx + "/frontend/author/" + authorList[i]["id"] + "' class='over-ell' "
            if (lang == 'en') {
                html = html + "style='max-width:100% !important'";
            }
            html = html + ">" + authorList[i]["name"] + "</a>" +
                "<div class=\"img writer-info\"> </div></span>";
        }
    }
    html = html + "</div>" +
        " <div class=\"pull-right\">" +
        "<span class=\"click-star js-my-star\">";
    var selected = "";
    var select = "";
    if (lang == "en") {
        selected = "Selected";
        select = "Select"
    } else {
        selected = "已收藏";
        select = "收藏"
    }
    if (document.selected == 1) {
        html = html + "<i class=\"img icon-star active\" value=" + document.id + "></i>" + selected + "</span>"
    } else {
        html = html + "<i class=\"img icon-star\" value=" + document.id + "></i>" + select + "</span>"
    }
    html = html +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";
    return html;
}

function _showAuthorInfo(attensionAuthorFun) {
    var is_show = false
    $('.research-writer-info').off('mouseenter').unbind('mouseleave');
    $('.research-writer-info').hover(function () {
        var target = $(this);
        var id = target.attr("data-value");
        $(this).siblings('.research-writer-info').find('.writer-info').hide()
        is_show = true
        $.ajax({
            url: ctx + "/frontend/document/authorFocus",
            data: {"id": id},
            error: function (result) {
            },
            success: function (author) {
                if (author == null) {
                    return;
                }
                var summary = "";
                var authorName = "";
                var ygz = "";
                var gz = "";
                if (lang!="en") {
                    summary = author.summary;
                    authorName = author.name;
                    ygz = "已关注";
                    gz = "关注";
                } else {
                    summary = author.esummary;
                    authorName = author.ename;
                    ygz = "Added";
                    gz = "Add";
                }
                if (summary == null) {
                    summary = "";
                }
                if(summary==""){
                    if (lang == "en") {
                        summary="No brief introduction";
                    }else{
                        summary="暂无简介内容"
                    }
                }
                if (authorName == null) {
                    authorName = author.id;
                }
                var imgSrc = "";
                if (author.authorTitlePic == null || author.authorTitlePic == "") {
                    imgSrc = ctx + "/static/front/img/default.jpg";
                } else {
                    imgSrc = uploadPath + author.authorTitlePic;
                }
                var html = "<div class=\"clearfix mb15\">" +
                    "<img src=" + imgSrc + " width='60px' height='60px'>" +
                    "<div class=\"pull-right\" style= 'width: 130px'>" +
                    "<h4 class=\"pl15 over-ell\" style='width: 100px' alt='" + authorName + "' title='" + authorName + "'>" + authorName + "</h4>";
                if (!author.isFocus) {
                    html = html + "<span class=\"btn btn-default gz cus-default\" data-value='" + authorName + "' data-id='" + author.id + "' data-status='" + author.isFocus + "' onclick='" + attensionAuthorFun + "(this)'><i>+</i>" + gz + "</span>";
                } else {
                    html = html + "<span class=\"btn btn-default gz cus-default active\" data-value='" + authorName + "' data-id='" + author.id + "' data-status='" + author.isFocus + "' onclick='" + attensionAuthorFun + "(this)'>" + ygz + "</span>";
                }
                html = html + "</div>" +
                    " </div>" +
                    "<p class='over-ell'>" + summary + "</p>";
                target.find('.writer-info').html(html);
                is_show && target.find('.writer-info').show();
                return;
            }
        });
    }, function () {
        is_show = false
        $('.research-writer-info').find('.writer-info').hide();
        $(this).find('.writer-info').hide();
    })
}

function showAuthorInfo() {
    _showAuthorInfo("followAuthor");
}

function showAuthorInfoOfCustomAttesion(functionName) {
    _showAuthorInfo(functionName);
}

function _followAuthor(id, name, isAdd, complete) {
    if (id == null || id == "") {
        return;
    }
    $.post(ctx + "/ucenter/preference/updateAttension", {
        "id": id,
        "name": name,
        "type": "author",
        "isAdd": isAdd
    }, function (result) {
        var tip = LANGUAGE[lang][result.msg];
        if (result.msg == 'NON_USER_TEXT') {
            tip = tip.replace("[username]", result.data);
        } else {
            if (isAdd) {
                tip = tip.replace("[updateType]", LANGUAGE[lang].ATTENTION_TEXT);
            } else {
                tip = tip.replace("[updateType]", LANGUAGE[lang].CANCEL_ATTENTION_TEXT);
            }
            tip = tip.replace("[name]", name);
            tip = tip.replace("[type]", LANGUAGE[lang]["AUTHOR_TEXT"]);
        }
        if (result.ret == 0) {
            cicc_index.ciccModal({
                "content": {
                    "title": LANGUAGE[lang].TIP_TEXT,
                    "body": tip,
                    "suc_opt_text": LANGUAGE[lang].SUC_TEXT, "err_opt_text": ''
                }
            });
            return;
        }
        complete();
    });
}

function followAuthor(target) {
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
    var name = target.getAttribute("data-value")
    var isAdd = target.getAttribute("data-status") == 0
    var bigStatus = target.getAttribute("data-big-status")
    _followAuthor(id, name, isAdd, function () {
        if (!isAdd) {//取消关注
            target.setAttribute("data-status", 0)
            $(target).html("<i>+</i>" + gz);
            $(target).removeClass("active");
        } else {
            target.setAttribute("data-status", 1)
            $(target).html(ygz);
            $(target).addClass("active");
        }
    })
}


