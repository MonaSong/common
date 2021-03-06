/**
 * Created by xiaoluo on 17-9-5.
 */
/**
 * Created by xiaoluo on 17-8-18.
 */
var CiccCore = (function () {
    return {
        addTrack: function (ga_id) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.text = "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q = i[r].q || []).push(arguments)},i[r].l = 1 * new Date();a = s.createElement(o),m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m)})(window, document, 'script', '/js/common/ga.js', 'ga'); ga('create', '" + ga_id + "', 'auto'); ga('send', 'pageview');";
            document.body.appendChild(script);
        },
        trackLink : function(url) {
            var redirectTriggered = false;
            ga('send', 'event', 'link', 'click', url, {'hitCallback':
                function() {
                    redirectTriggered = true;
                    document.location = url;
                }
            });
            setTimeout(function() {
                if (!redirectTriggered) {
                    document.location = url;
                }
            }, 1000);
        },
        getChannel: function () {
            var match = navigator.userAgent.match(/Channel\/([\S]+)/i);
            var channel = DahuoCore.getCookie("raw_channel") || DahuoCore.getCookie("channel");
            if (match) {
                return match[1];
            } else if (this.isInWechat()) {
                if (channel) {
                    return "wechat-" + channel;
                } else {
                    return 'wechat';
                }
            } else if (channel) {
                return channel;
            } else {
                return 'ofw';
            }
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

        //获取当前域名信息
        getUrlDomain: function () {
            return window.location.protocol + "//" + window.location.host;
        }
        ,
        getUrlParams: function () {
            var search = window.parent.location.search,
                str = search.substring(1),
                tmpArr = str.split("&");
            var urlParmObj = {};
            if (tmpArr.length > 0 && tmpArr[0] !== "") {
                for (var i = 0, len = tmpArr.length; i < len; i++) {
                    var tmp = tmpArr[i].split("=");
                    urlParmObj[tmp[0]] = tmp[1];
                }
            } else {
                urlParmObj = false;
            }
            return urlParmObj;
        }
        ,
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
        }
        ,
        getLocal: function (key) {
            var storage = window.localStorage;
            return storage.getItem(key);
        }
        ,
        setLocal: function (key, value) {
            var storage = window.localStorage;
            storage.removeItem(key);
            try {
                storage.setItem(key, value);
            } catch (e) {
                return "error";
            }
        }
        ,
        getSession: function (key) {
            var session = window.sessionStorage;
            return session.getItem(key);
        }
        ,
        setSession: function (key, value) {
            var session = window.sessionStorage;
            session.removeItem(key);
            try {
                session.setItem(key, value);
            } catch (e) {
                return "error";
            }
        }
        ,
        clearLocal: function (key) {
            var storage = window.localStorage;
            try {
                storage.removeItem(key);
            } catch (e) {
                return "error";
            }
        }
        ,
        clearSession: function (key) {
            var session = window.sessionStorage;
            try {
                session.removeItem(key);
            } catch (e) {
                return "error";
            }
        }
        ,
        logger: function (content) {
            var template = "<div>" + content + "</div>";
            DahuoCore.toast({
                "content": content
            });
        }
        ,
        modal: function () {
            var defaulOptions = {
                "width": "90%",
                "height": "auto",
                "isCenter": true,
                "animate": true,
                "spaceHide": true,
                "type": "modal"
            };
            var $modal = null,
                opts;
            var setOption = function (options) {
                opts = $.extend({}, defaulOptions, options);
            };
            var show = function (options) {
                setOption(options);
                $modal = $("#" + opts.id);
                if ($modal.length) {
                    var $header = $modal.find(".modal-header"),
                        $body = $modal.find(".modal-body"),
                        $footer = $modal.find(".modal-footer");
                    if (opts.title) {
                        $header.html(opts.title).show();
                    } else {
                        $header.hide();
                    }
                    if (opts.body) {
                        $body.html(opts.body).show();
                    } else {
                        $body.hide();
                    }
                    if (opts.footer) {
                        $footer.html(opts.footer).show();
                    } else {
                        $footer.hide();
                    }
                } else {
                    var type = opts.type == "popup" ? "popup-modal" : "";
                    var modal = '<div class="modal-overlay ' + type + '" id="' + opts.id + '">';
                    modal += '<div class="dahuo-modal">';
                    if (opts.title) {
                        modal += '<div class="modal-header">' + opts.title + "</div>";
                    }
                    modal += '<div class="modal-body">' + opts.body + "</div>";
                    if (opts.footer) {
                        modal += '<div class="modal-footer">' + opts.footer + "</div>";
                    }
                    modal += "</div></div>";
                    $("body").append(modal);
                    $modal = $("#" + opts.id);
                }
                setTimeout(function () {
                    $modal.addClass("visible");
                }, 100)
                $modal.find(".dahuo-modal").css({
                    "width": opts.width,
                    "height": opts.height
                }).addClass("modal-in");
                $(".modal-cancel").on("click", function () {
                    if (typeof(opts.cancelcallback) == "function") {
                        opts.cancelcallback();
                    } else {
                        hide();
                    }
                    event.stopPropagation();
                });
                $(".modal-confirm").on("click", function (event) {
                    if (typeof(opts.callback) == "function") {
                        opts.callback();
                    } else {
                        hide();
                    }
                    event.stopPropagation();
                    event.preventDefault();
                });
                clickSpaceHide();
                function clickSpaceHide() {
                    $("body").on("click", function (e) {
                        if (opts.spaceHide) {
                            var target = $(e.target);
                            if (target.closest(".dahuo-modal").length === 0 && target.closest("[data-modal]").length === 0) {
                                hide();
                            }
                        }
                    });
                }
            };
            var hide = function () {
                $modal.removeClass("visible").find(".dahuo-modal").removeClass("modal-in");
            };
            return {
                show: show,
                hide: hide
            };
        }
        (),
        toast: function (opts) {
            var defaulOptions = {
                "content": "",
                "timeout": "1500",
                "width": "auto"
            };
            var options = $.extend({}, defaulOptions, opts);
            var time = options.timeout;
            var $template = '<div class="dahuo-toast" style="width:' + options.width + '">' + options.content + "</div>";
            var $toast = $(".dahuo-toast");
            if ($toast.length) {
                $toast.html(options.content);
            } else {
                $("body").append($template);
                $toast = $(".dahuo-toast");
            }
            $toast.addClass("visible").show();
            setTimeout(function () {
                $toast.removeClass("visible").hide();
            }, time);
        }

        ,
        loading: function () {
            var $loading = $("#loading");
            if (!$loading.length) {
                $loading = '<div class="loading" id="loading"></div>';
                $("body").append($loading);
            }
            return {
                show: function (mask) {
                    $("#loading").show();
                    if (mask) {
                        if ($(".mask").length) {
                            $(".mask").show();
                        } else {
                            $("body").append('<div class="mask"></div>');
                            $(".mask").show();
                        }
                    }
                },
                hide: function () {
                    $("#loading").hide();
                    $(".mask").hide();
                }
            };
        }
        (),
        dateFormat: function (date, format) {
            var date = date + "";
            var len = date.length,
                rdate;
            var y, month, m, d, h, min, s, days, offset, today;
            if (len === 13) {
                rdate = new Date(parseInt(date));
            } else {
                if (len === 10) {
                    rdate = new Date(parseInt(date) * 1000);
                    date = date * 1000;
                }
            }
            y = rdate.getFullYear();
            month = parseInt(rdate.getMonth()) + 1;
            m = month < 10 ? "0" + month : month;
            d = rdate.getDate() < 10 ? "0" + rdate.getDate() : rdate.getDate();
            h = rdate.getHours() < 10 ? "0" + rdate.getHours() : rdate.getHours();
            min = rdate.getMinutes() < 10 ? "0" + rdate.getMinutes() : rdate.getMinutes();
            s = rdate.getSeconds() < 10 ? "0" + rdate.getSeconds() : rdate.getSeconds();
            switch (format) {
                case "yy-mm-dd":
                    return y + "-" + m + "-" + d;
                    break;
                case "yy/mm/dd":
                    return y + "/" + m + "/" + d;
                    break;
                case "yy-mm-dd hh:mm:ss":
                    return y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s;
                    break;
                case "yy/mm/dd hh:mm:ss":
                    return y + "/" + m + "/" + d + " " + h + ":" + min + ":" + s;
                    break;
                case "tomorrow":
                    days = parseInt((new Date() - date) / 86400000);
                    today = new Date().getDate();
                    offset = Math.abs(today - d);
                    if (days < 4 && offset < 4) {
                        if (offset === 0) {
                            return "今天" + h + ":" + min;
                        } else {
                            if (offset === 1) {
                                return "昨天" + h + ":" + min;
                            } else {
                                if (offset === 2) {
                                    return "前天" + h + ":" + min;
                                }
                            }
                        }
                    } else {
                        return y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s;
                    }
                default:
                    return y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s;
            }
        },
        //微信分享
        initWcJsSDK: function (wcConfig, shareContent) {
            wx.config({
                debug: false,
                appId: wcConfig.wcappid,
                timestamp: wcConfig.timestamp,
                nonceStr: wcConfig.nonceStr,
                signature: wcConfig.signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'hideMenuItems'
                ]
            });
            wx.ready(function () {
                if (shareContent.noTimeline) {
                    wx.hideMenuItems({
                        menuList: ["menuItem:share:timeline"]
                    });
                } else {
                    wx.onMenuShareTimeline({
                        title: shareContent.title, // 分享标题
                        link: shareContent.link, // 分享链接
                        imgUrl: shareContent.imgUrl
                    });
                }
                wx.onMenuShareAppMessage({
                    title: shareContent.title, // 分享标题
                    desc: shareContent.desc, // 分享描述
                    link: shareContent.link, // 分享链接
                    imgUrl: shareContent.imgUrl, // 分享图标
                });
            });
        }
        ,
        isInWechat: function () {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        }
        ,
        mobileSys: function () {
            if (/Android/i.test(navigator.userAgent)) {
                return 'android';
            } else if (/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
                return 'ios';
            } else {
                return 'unknown';
            }
        }
        ,
        downloadAPK: function() {
            var yingyongbao=true;
            var weixin=document.getElementById("weixin");
            var downloadUrl = {
                'androidUrl': 'http://dn-dahuo.qbox.me/Fenqi-build.html?os=android&app=Beikeqianbao-instant-build-android',
                //todo ios download url
                'iPhoneUrl': ''
            };
            var mobileOs = DahuoCore.mobileSys();
            var shouldDownloadAssist = DahuoCore.isInWechat();
            if (shouldDownloadAssist) {
                ga('send', {
                    hitType: 'event',
                    eventCategory: 'download',
                    eventAction: 'click',
                    eventLabel: mobileOs+'_inWechat'
                });
                if (mobileOs == 'android') {
                    window.location = downloadUrl.androidUrl;
                    return false;
                } else {
                    window.location.hash = "#download";
                    weixin.className = "navbar-fixed-top visible";
                    window.onhashchange=function(){
                        var hash=location.hash;
                        if(hash.indexOf("download")<0){
                            weixin.className="navbar-fixed-top";
                            window.location.hash="";
                        }
                    };
                    return false;
                }

            }
            ga('send', {
                hitType: 'event',
                eventCategory: 'download',
                eventAction: 'click',
                eventLabel: mobileOs
            });
            if (mobileOs == 'android') {
                window.location = downloadUrl.androidUrl;
            } else if (mobileOs == 'ios') {
                window.location = downloadUrl.iPhoneUrl;
            } else{
            }
            return false;
        },
        moneyFormat: function (str) {
            var num = String(parseFloat(str).toFixed(2));
            var re = /(-?\d+)(\d{3})/;
            while (re.test(num)) num = num.replace(re, "$1,$2");
            return num;
        },
        validate: function (opts) {
            var flag = true;
            for (var i in opts) {
                if (opts[i]["value"] == "") {
                    DahuoCore.toast({
                        "content": opts[i]["notice"]
                    });
                    flag = false;
                    return false;
                }
            }
            return flag;
        }
        ,
        lazyload: (function () {
            $(".lazyload").each(function () {
                var self = $(this);
                var img = new Image();
                img.src = $(this).attr("origin");
                img.oncomplete = function () {
                    self.html(img);
                };
                img.onerror = function () {
                    console.log(1);
                    self.html('');
                };
            });
        })(),
        tabs: function (id) {
            var title = $(id).find(".tab-title");
            var contents = $(id).find(".tabs-content");
            title.on("click", function () {
                var index = $(this).index();
                var tabId = $(this).attr("tabId") || "";
                $(this).addClass("active").siblings().removeClass("active");
                contents.find(".tab-content").hide();
                contents.find(".tab-content").eq(index).show();
                var origin = window.location.origin;
                var pathname = window.location.pathname;
                var hash = window.location.hash;
                window.location.replace(origin + pathname + "#" + tabId);
            });
            updateHash();
            function updateHash() {
                var hash = window.location.hash.split("#")[1];
                if ($("[tabId=" + hash + "]").length) {
                    $("[tabId=" + hash + "]").addClass("active").siblings(".tab-title").removeClass("active");
                    $("[rel=" + hash + "]").show().siblings(".tab-content").hide();
                } else {
                    $(id).find(".tab-title:eq(0)").addClass("active");
                    contents.find(".tab-content:eq(0)").removeClass("hidden");
                }
            }
        }

        ,
        collapse: (function () {
            $(".collapse").on("click", function () {
                var content = $(this).next(".collapse-content");
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                } else {
                    $(this).addClass("active");
                }
                if (content.hasClass("hidden")) {
                    content.removeClass("hidden");
                } else {
                    content.addClass("hidden");
                }
            });
        }()),
        /*节流函数
         context={
         page:number,
         offset:number,
         count:number
         }
         */
        throttle: function (method, context, delay) {
            var timer = null,
                firstTime = true;
            return function () {
                if (firstTime) {
                    method(context);
                    firstTime = false;
                }
                if (timer) {
                    return false;
                }
                timer = setTimeout(function () {
                    clearTimeout(timer);
                    timer = null;
                    method(context);
                }, delay || 200);
            };
        }

        ,
        loadMore: function (context) {
            if (!context.loadend) {
                var scrollTop = document.body.scrollTop;
                var bodyH = document.body.offsetHeight;
                var winH = $(window).height();
                var timer = null;
                if (scrollTop + winH >= bodyH - 5) {
                    context.page = context.page + 1;
                    context.offset = context.page * context.count;
                    timer = setTimeout(function () {
                        clearTimeout(timer);
                        $("#loadingtxt").removeClass("hidden");
                        context.ajaxData(context.offset, context.count);
                    }, 100);
                }
            }
        }
        ,
        dataCollect: function (action, data) {
            var postdata = {
                action: action,
                data: JSON.stringify(data)
            };
            $.ajax({
                url: '/ajax/da/collect',
                method: 'post',
                data: postdata
            });
        }
        ,
        bindInputCloseBtn: function (item) {
            var $closebtn = $('<i class="ui_input_closebtn"></i>').bind("click", function () {
                $(item).val("").trigger("input");
            }).insertAfter(item);
            $(item).bind("input", function () {
                if ($.trim($(item).val()) == "") {
                    $closebtn.hide();
                } else {
                    $closebtn.show();
                }
            });
            $(item).trigger("input");
        }
    };
})
();
