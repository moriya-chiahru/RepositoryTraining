// 20181219 アコーディオン用関数
//高さを測るアコーディオン
var moreAccordion = {
  names: {
    wrape: '.js-accordion', //アコーディオンする要素全体
    openButton: '.js-accordion_open', //表示ボタン
    closeButton: '.js-accordion_close', //閉じるボタン
    viewContet: '.js-accordion_content', //表示するコンテンツ
    openFlag: 'is-open', //表示中のフラグ
    closeFlag: 'is-close', //非表示中のフラグ
    heightData: 'data-accordionHeight' //高さ記録用のデータ属性
  },
  elm: {},
  flag: {
    resize: false,
    previousWidth: window.innerWidth
  },
  init: function () {
    var _this = this;
    _this.elm.$wrapeElm = $(_this.names.wrape);
    _this.elm.$closeElm = _this.elm.$wrapeElm.find(_this.names.closeButton);
    if (_this.elm.$wrapeElm.length === 0) {
      return false;
    }
    _this.setAccordionHeight(function (callback) {
      _this.elm.$closeElm.hide();
      _this.elm.$wrapeElm.addClass(_this.names.closeFlag);
    }.bind(null));
    _this.openEvent();
    _this.closeEvent();
    _this.windowObserver();
  },
  setAccordionHeight: function (callback) {
    var _this = this;
    _this.elm.$wrapeElm.each(function (index, element) {
      // closeなら高さを取得しない
      if ($(element).hasClass(_this.names.closeFlag) === false) {
        _this.clearViewContentHeight($(element));
        _this.getViewContentHeight($(element));
        if (typeof callback !== 'undefined') {
          callback();
        }
      }
    });
  },
  clearViewContentHeight: function (wrapeElm) {
    // cssのheightがあったら消す
    var isHeight = wrapeElm.find(_this.names.viewContet).attr('style');
    if (typeof isHeight !== 'undefined' && isHeight.indexOf('height') !== -1) {
      wrapeElm.find(_this.names.viewContet).css('height', '')
    }
  },
  getViewContentHeight: function(wrapeElm) {
     // 高さを設定
     var defaltHeight = 0;
     var previousHeight = wrapeElm.find(_this.names.viewContet).height();
        var setHEight = setInterval(function () {
          defaltHeight = wrapeElm.find(_this.names.viewContet).height();
          if (previousHeight === defaltHeight) {
            wrapeElm.attr(_this.names.heightData, defaltHeight);
            clearInterval(setHEight);
          } else {
            previousHeight = defaltHeight;
          }
        }, 300);
  },
  onWindowResize: function () {
    var _this = this;
    $(window).on('resize', function () {
      var nowWidth = window.innerWidth;
      if (_this.flag.previousWidth !== nowWidth) {
        _this.flag.resize = true;
        _this.setViewContentHeight();
        _this.flag.previousWidth = nowWidth;
      }
    });
  },
  //開く
  openViewContent: function () {
    var _this = this;
    _this.elm.$wrapeElm.find(_this.names.openButton).click(function (event) {
      var _event = event;
      var $openWrapper = $(_event.target).parents(_this.names.wrape);
      _this.openViewContent($openWrapper);
      _this.switchViewButton($openWrapper);
      _this.setViewContentHeight($openWrapper);
      _this.onTransitionFinish($openWrapper);
    });
  },
  switchViewButton: function(openWrapper) {
    openWrapper.find(_this.names.openButton).hide();
    openWrapper.find(_this.names.closeButton).show();
  },
  setViewContentHeight: function(openWrapper) {
    var setHeight = openWrapper.attr(_this.names.heightData);
      // 高さをCSSで設定
      if (typeof setHeight !== 'undefined') {
        openWrapper.find(_this.names.viewContet).css('height', setHeight);
      }
  },
  onTransitionFinish: function (openWrapper) {
    // transitionが終了したらclassを入れ替える
    openWrapper.find(_this.names.viewContet).on('transitionend', function () {
      openWrapper.removeClass(_this.names.closeFlag).addClass(_this.names.openFlag);
      // ウィンドウサイズが変更された場合は、高さを再取得
      if (_this.flag.resize === true) {
        setTimeout(function () {
          _this.heightSize();
          _this.flag.resize = false;
        }, 100);
      }
      openWrapper.find(_this.names.viewContet).off();
    });
  },
  //閉じる
  closeEvent: function () {
    var _this = this;
    _this.elm.$closeElm.click(function (event) {
      var _event = event;
      var $closeWrapper = $(_event.target).parents(_this.names.wrape),
        setHeight = $closeWrapper.attr(_this.names.heightData);
      if (!$closeWrapper.hasClass(_this.names.openFlag)) {
        return false;
      }
      // ボタンを切り替え
      $closeWrapper.find(_this.names.closeButton).hide();
      $closeWrapper.find(_this.names.openButton).show();
      // 高さをCSSで設定
      if (typeof setHeight !== 'undefined') {
        $closeWrapper.find(_this.names.viewContet).css('height', setHeight);
      }
      // クラス切り替え
      $closeWrapper.removeClass(_this.names.openFlag).addClass(_this.names.closeFlag);
      // 高さをリセット
      if (typeof setHeight !== 'undefined') {
        setTimeout(function () {
          $closeWrapper.find(_this.names.viewContet).css('height', '')
        }, 100);
      }
    });
  }
};