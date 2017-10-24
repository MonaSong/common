// 获取等级数据
  var levels = {
    getLi: function (item, pid, pname) {
      var h = ''
      var dot = pname ? '->' : ''
      var hasChildren = item.hasChildren ? '<i class="pull-right glyphicon glyphicon-menu-right"> </i>' : ''
          h += '<li class="" data-pid="' + pid + '" id="' + item.id + '">' +
              '<a onclick="selecteDocumentType(this)" href="javascript:void(0)" data-value="' + pname + dot + item.value + '" id="' + item.id + '"  data-pid="' + pid + '" class="clearfix"  data-level="' + item.level + '">' +
              '<b class="over-ell">' + item.value + '</b>' + hasChildren +
              '</a>' +
              '</li>'

      return h
    },
    renderData: function (pdata, data) {
      if (!pdata) {
          var h = '<ul>'
          $.each(data, function (i, item) {
              if (item.level == 1) {
                  h += levels.getLi(item, '0', '')
              }
          })
          h += '</ul>'
          return h
      } else {
          var ht = ''
          $.each(pdata, function (i, item) {
              var pid = item.id
              var pname = item.value
              var h = '<ul style="display:none">'
              var status = false
              $.each(data, function (k, v) {
                  if (pid == v.pid) {
                      status = true
                      h += levels.getLi(v, pid, pname)
                  }
              })
              h += '</ul>'
              ht += status ? h : ''
          })
          return ht
      }
    },
    renderUl: function (selector, pdata, data) {
      $(selector).html(levels.renderData(pdata, data))
      var ulList = $(selector).find('ul')
      $.each(ulList, function (i, item) {
          var curPID = $(item).find('li:eq(0)').attr('data-pid')
          $(item).attr('data-pid', curPID)
      })
    },
    renderUX: function () {
      $('.categary-a').find('ul li').hover(function () {
          var id = $(this).attr('id')
          $(this).addClass('active').siblings().removeClass('active')
          if ($('.categary-b').find('ul').length > 0) $('.categary-b').show()
          $('.categary-c').hide()
          $('.categary-b').find('ul').hide()
          $('.categary-b').find('ul[data-pid="' + id + '"]').show()
          console.log('id===>', id)
      })

      $(document).find('.categary-b ul li').hover(function () {
          var id = $(this).attr('id')
          if ($('.categary-c').find('ul').length > 0) $('.categary-c').show()
          $(this).addClass('active').siblings().removeClass('active')
          $('.categary-c').find('ul').hide()
          $('.categary-c').find('ul[data-pid="' + id + '"]').show()
          console.log('id===>', id)
      })
    }
  }
  
  function getLevelData() {
    $.ajax({
      url: '${ctx}/frontend/document/getLevels',
      type: 'get',
      success: function (data) {
        var lv1 = data.level1
        var lv2 = data.level2
        var lv3 = data.level3

        // 渲染 ul
        levels.renderUl($('.categary-a'), '', lv1)
        levels.renderUl($('.categary-b'), lv1, lv2)
        levels.renderUl($('.categary-c'), lv2, lv3)
        levels.renderUX()
      },
      error: function (data) {

      }
    })
  }
  
  getLevelData()