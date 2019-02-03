/**
 * @function グローバルナビ処理
 * @date 
 * @return void spHeaderDataに値を入れる
 */
  // util　共通処理
    ヘッダーの要素を取得()
    ヘッダーの高さ判定()
    機種判定()
  // onInit() 初期表示
  // スクロールイベントを検知　
  // グローバルナビ閉じるクリック
  // ランドスケープ


  // TODO 
  // spヘッダーリニューアル2019 -------------------------------
    var spHeader = spHeader || {};
    // ヘッダーSPの中身用HTML
    var DATA_FILE = '/common/js/spHeaderData.html';
    // メンバ変数
    var spHeaderData = {
      carentNav: false,
      currentScroll: 0,
      windowHeight: window.innerHeight,
      topElementsHeight: 0,
      underElementsHeight: 0,
      maxHeaderHight: 200, // ヘッダーの高さの最大値
      userAgent: '',
      touchFlag: false,
      orientationUrlBarFlag: false,
      $headerElemment: undefined,
      $topElements: undefined,
      $underElements: undefined,
      $navContent: undefined,
    };

    // spHeader.onLoad
    // global変更更新、イベントセット、初期実行
    spHeader.onLoad = function () {
      this.spHeader.Data$headerElemment = $('.js-spGlobalNav_header');
      this.spHeader.Data$topElements = $('.js-spGlobalNav_topElements');
      this.spHeader.Data$underElements = $('.js-spGlobalNav_under');
      this.spHeader.Data$navContent = $('[data-spglobalnav-content]');
      this.slideHerder = new spHeader.slideHerder(this.spHeader.Data$headerElemment);
      this.globalNav = new spHeader.globalNav(this.spHeader.Data$headerElemment);
      this.init();
    }

    // 初期実行
    spHeader.onLoad.prototype.init = function () {
      this.getUserAgent();
      this.getInnerHeight();
      this.slideHerder.createContentHeightElement();
      this.onClickEvent();
      this.onScrollEvent();
      this.onWindowResize();
    }

    // クリック、タッチイベント
    spHeader.onLoad.prototype.onClickEvent = function () {
      var _this = this;
      $('.js-spGlobalNav_btn').on('click', function () {
        _this.setTouchFlag();
        _this.globalNav.checkOpen($(this).attr('data-spGlobalNav-btn'));
        _this.slideHerder.addClassHeaderFixd();
      });

      $('.js-spGlobalNavClose,.js-spGlobalNav_wrap').on('click', function (event) {
        event.preventDefault();
        _this.setTouchFlag();
        _this.globalNav.closeMethod();
      });

      // 子要素へのイベント電波を阻止する
      spHeaderData.$navContent.on('click', function (event) {
        event.stopPropagation();
      });

    }

    // スクロールイベント
    spHeader.onLoad.prototype.onScrollEvent = function () {
      var _this = this;
      $(window).on('scroll', function () {
        if (spHeaderData.carentNav === false) {
          spHeaderData.currentScroll = $(window).scrollTop();
        }
        if (spHeaderData.userAgent === 'ios') {
          _this.setIosOrientationUrlBarFlag();
        }
        _this.slideHerder.init();
      });
    }

    // 読み込み、リサイズ、スマホ回転イベント
    spHeader.onLoad.prototype.onWindowResize = function () {
      var _this = this,
      windowEventTime = "";
      $(window).on('load orientationchange resize', function () {
        clearTimeout(windowEventTime);
        windowEventTime = setTimeout(
          function () {
            spHeaderData.windowHeight = window.innerHeight;
            if (spHeaderData.userAgent === 'ios') {
              _this.setIosOrientationUrlBarFlag();
            }
            _this.slideHerder.init();
            _this.getInnerHeight();
            _this.slideHerder.setContentHeightTop();
            if (spHeaderData.carentNav !== false) {
              _this.globalNav.setCssHeight();
              _this.globalNav.setContentAreaNonScroll();
            }
          },
          300);
      });
    }

    // タッチしたらフラグを付ける
    spHeader.onLoad.prototype.setTouchFlag = function () {
      spHeaderData.touchFlag = true;
      setTimeout(function () {
        spHeaderData.touchFlag = false;
      }, 1000);
    }

    /**
     * @function SPデバイス取得
     * @return void spHeaderDataに値を入れる
     */
    spHeader.onLoad.prototype.getUserAgent = function () {
      var userAgent = navigator.userAgent;
      if (/iP(hone|(o|a)d)/.test(userAgent) === true) {
        spHeaderData.userAgent = 'ios';
      } else {
        spHeaderData.userAgent = 'android';
      }
    }

    // ヘッダーの高さを取得
    spHeader.onLoad.prototype.getInnerHeight = function () {
      spHeaderData.topElementsHeight = spHeaderData.$topElements.height();
      spHeaderData.underElementsHeight = spHeaderData.$underElements.height();
    }

    // IOS対応 横の状態で開いたら、URLバーに埋まる調整、フラグ
    spHeader.onLoad.prototype.setIosOrientationUrlBarFlag = function () {
      var orientationFlag = $(window).width() > spHeaderData.windowHeight ? true : false;
      if (orientationFlag === true && spHeaderData.windowHeight !== $(window).height()) {
        spHeaderData.iosOrientationUrlBarFlag = true;
      } else {
        spHeaderData.iosOrientationUrlBarFlag = false;
      }
    }

    // spHeader.slideHerder
    // ヘッダー追従、下へスクロールしたら、ヘッダーを隠す。上にスクロールしたらヘッダーを表示。
    spHeader.slideHerder = function () {
      this.currentScroll = 0,
      this.pastCurrentScroll = 0,
      this.$contentHeightElement,
      this.$keywordInput = $('input#ss');
    }

    // 実行
    spHeader.slideHerder.prototype.init = function () {
      // 検索にフォーカスがある時は、ヘッダーを隠さない
      if (this.$keywordInput.is(':focus') === true) {
        return false;
      }

      this.currentScroll = spHeaderData.currentScroll;

      // IOS対応 横の状態で開いたら、URLバーに埋まる調整
      if (spHeaderData.userAgent === 'ios') {
        // ナビを開いたときに調整する
        if (spHeaderData.carentNav !== false && spHeaderData.iosOrientationUrlBarFlag === true) {
          this.setIosUrlBarTop();
        }
        // ナビを閉じた時に戻す
        if (spHeaderData.carentNav === false && spHeaderData.touchFlag === false) {
          this.resetIosUrlBarTop();
        }
      }

      // タッチがされていなかったら実行
      if (spHeaderData.touchFlag === false) {
        this.checkScroll();
      }

      // fixdを入れる
      if (spHeaderData.$headerElemment.hasClass('is-fixd') === false && this.currentScroll > 1) {
        this.addClassHeaderFixd();
      }
    }

    // ヘッダーを表示するか隠すか判定する
    spHeader.slideHerder.prototype.checkScroll = function () {
      if (this.currentScroll < spHeaderData.windowHeight / 3) {
        this.showHeader();
      } else if (this.currentScroll > this.pastCurrentScroll) {
        this.hideHeader();
      } else if (this.currentScroll !== this.pastCurrentScroll) {
        this.showHeader();
      }
      this.pastCurrentScroll = this.currentScroll;
    }

    // ヘッダーにfixdをセットする
    spHeader.slideHerder.prototype.addClassHeaderFixd = function () {
        spHeaderData.$headerElemment.addClass('is-fixd');
        this.setContentHeightTop();
    }

    // コンテンツエリアの上部にヘッダー縦幅分の余白用、要素を作成
    // fixdのみだとカクっとなるのを防ぐため空要素を追加（div要素で調整するのは、CSSの干渉を避ける為）
    spHeader.slideHerder.prototype.createContentHeightElement = function () {
      spHeaderData.$headerElemment.after('<div class="js-spGlobalNav_margin"></div>');
      this.$contentHeightElement = $('.js-spGlobalNav_margin');
    }
  
    // コンテンツエリアの上部にヘッダー縦幅分の余白を開ける
    spHeader.slideHerder.prototype.setContentHeightTop = function () {
      if (spHeaderData.$headerElemment.hasClass('is-fixd') === true) {
        var headerHeightSize = spHeaderData.topElementsHeight + spHeaderData.underElementsHeight;
        if ( headerHeightSize > spHeaderData.maxHeaderHight ) {
          headerHeightSize = spHeaderData.maxHeaderHight;
        }
        this.$contentHeightElement.css('height', headerHeightSize + 'px');
      }
    }

    // ヘッダーを隠す
    spHeader.slideHerder.prototype.hideHeader = function () {
      spHeaderData.$headerElemment.addClass('is-hide');
    }

    // ヘッダーを表示する
    spHeader.slideHerder.prototype.showHeader = function () {
      spHeaderData.$headerElemment.removeClass('is-hide');
    }

    // IOS対応 横の状態で開いたら、URLバーに埋まる調整、実行
    spHeader.slideHerder.prototype.setIosUrlBarTop = function () {
      spHeaderData.$headerElemment.css('top', '50px');
    }

    // IOS対応 横の状態で開いたら、URLバーに埋まる調整、戻す
    spHeader.slideHerder.prototype.resetIosUrlBarTop = function () {
      if (spHeaderData.$headerElemment.css('top') !== '0px') {
        spHeaderData.$headerElemment.css('top', '');
      }
    }

    // spHeader.slideHerder
    // ナビの開閉
    spHeader.globalNav = function () {
      this.$navWrap = $('.js-spGlobalNav_wrap'),
      this.$openCurrentButton,
      this.$openCurrentContent,
      this.$contentAreaAll = false,
      this.navContentscrollingFlag = false,
      this.init();
    }

    // 初期実行
    spHeader.globalNav.prototype.init = function () {
      this.getNavContentData();
    }

    // ナビの中身データを受信
    spHeader.globalNav.prototype.getNavContentData = function () {
      var _this = this;
      $.ajax({
        url: DATA_FILE,
        type:'GET',
        cache : true })
        .done( function (getData) {
          _this.setNavContentData(getData);
        })
        .fail( function (getData) {
          _this.setNavContentError();
        });
    }

    // 受信データを入れる
    spHeader.globalNav.prototype.setNavContentData = function (dataContent) {
      var $content = $(dataContent);
      $content.each(function (i, elm) {
        if ($(elm).prop('tagName') === 'SECTION') {
          var target = $(elm).data('target');
          $('[data-spglobalnav-btn=' + target + ']').attr('data-spglobalnav-index', $(elm).data('index'));
          $('[data-spGlobalNav-content=' + target + ']')
            .find('.js-spGlobalNav_content')
            .html($(elm).html());
        }
      });
      // ナビの中身の開閉エリアのイベントをセット
      this.toggleEvent();
    }

    // 受信エラー表示
    spHeader.globalNav.prototype.setNavContentError = function (dataContent) {
      $('.js-spGlobalNav_content').html('<p class="p-headerC_spGlobalNav_main">読み込みエラー<br>しばらくお待ちいただくか、再読み込みをお願いいたします。</p>');
    }

    // 状態に応じて開閉する
    spHeader.globalNav.prototype.checkOpen = function (thisStetas) {
      // ナビを開く
      if (spHeaderData.carentNav === false) {
        this.setStates(thisStetas);
        this.setCssHeight();
        this.setContentAreaNonScroll();
        this.openAddClass();
        this.openNavContentTopScroll();
      // 現在開いているナビを開く場合はリンク
      } else if (spHeaderData.carentNav === thisStetas) {
        location.href = this.$openCurrentButton.attr('data-spglobalnav-index');
      // 開いている状態で別カテゴリーのナビを開く
      } else {
        this.closeRemoveClass(spHeaderData.carentNav);
        this.setStates(thisStetas);
        this.openAddClass();
        this.openNavContentTopScroll();
      }
    }

    // OPEN
    // 開くナビカテゴリーと要素の変数を入れる
    spHeader.globalNav.prototype.setStates = function (thisStetas) {
      spHeaderData.carentNav = thisStetas;
      this.$openCurrentButton = $('[data-spGlobalNav-btn=' + thisStetas + ']')
      this.$openCurrentContent = $('[data-spGlobalNav-content=' + thisStetas + ']');
    }

    // OPEN
    // 縦幅調整
    spHeader.globalNav.prototype.setCssHeight = function () {
      spHeaderData.$headerElemment.css({
        'height' : '100%'
      });
      // ナビの中身
      this.$navWrap.css({
        'top': spHeaderData.topElementsHeight + 'px',
        'height': 'calc( 100% - ' + spHeaderData.topElementsHeight + 'px )'
      });
      // ナビの下、検索エリア
      spHeaderData.$underElements.css({
        'position': 'fixed',
        'top': spHeaderData.topElementsHeight + 'px',
        'width': '100%'
      });
    }

    // OPEN
    // ナビの中身のスクロール位置を一番上にする
    spHeader.globalNav.prototype.openNavContentTopScroll = function () {
      this.$openCurrentContent.scrollTop(0);
    }

    // OPEN
    // 開くクラスをつける
    spHeader.globalNav.prototype.openAddClass = function () {
      spHeaderData.$headerElemment.addClass('is-open');
      this.$openCurrentButton.addClass('is-selected');
      this.$openCurrentContent.addClass('is-show');
    }

    // OPEN
    // 背景のスクロール防止、コンテンツエリアにラッパーをつける
    spHeader.globalNav.prototype.createContentAreaWrapNonScroll = function () {
      if (this.$contentAreaAll === false) {
        this.getContentAreaNonScroll();
      }
      this.$contentAreaAll.wrapAll('<div class="js-spGlobalNav_contentWrap">');
    }

    // OPEN
    // 背景のスクロール防止、コンテンツエリアを取得
    spHeader.globalNav.prototype.getContentAreaNonScroll = function () {
      this.$contentAreaAll = spHeaderData.$headerElemment.nextAll()
    }

    // OPEN
    // 背景のスクロール防止、コンテンツエリアラッパーを縦幅いっぱいに広げる
    spHeader.globalNav.prototype.setContentAreaNonScroll = function () {
      this.createContentAreaWrapNonScroll();
      $('.js-spGlobalNav_contentWrap').css({
        'position': 'fixed',
        'top': (spHeaderData.currentScroll * -1) + 'px',
        'width': '100%'
      });
    }

    // CLOSE
    // 閉じ用メソッド
    spHeader.globalNav.prototype.closeMethod = function () {
      var _this = this;
      this.closeRemoveClass();
      // transition終了後に縦幅の調整を実行
      this.$navWrap.on('transitionend webkitTransitionEnd mozTransitionEnd',function(){
        _this.resetCssHeight();
        _this.resetContentAreaNonScroll();
        _this.$navWrap.off('transitionend webkitTransitionEnd mozTransitionEnd');
      });

      this.setStates(false);
    }

    // CLOSE
    // クラスを消す
    spHeader.globalNav.prototype.closeRemoveClass = function () {
      spHeaderData.$headerElemment.removeClass('is-open');
      this.$openCurrentButton.removeClass('is-selected');
      this.$openCurrentContent.removeClass('is-show');
    }

    // CLOSE
    // 背景のスクロール防止、コンテンツラッパーを消す
    spHeader.globalNav.prototype.resetContentAreaNonScroll = function () {
      $('.js-spGlobalNav_contentWrap').children().unwrap();
      $(window).scrollTop(spHeaderData.currentScroll);
    }

    // CLOSE
    // 縦幅調整を消す
    spHeader.globalNav.prototype.resetCssHeight = function () {
      spHeaderData.$headerElemment.css({
        'height' : ''
      });
      this.$navWrap.css({
        'top' : '',
        'height' : ''
      });
      spHeaderData.$underElements.css({
        'position': '',
        'top': '',
        'width': ''
      });
    }

    // ナビの中身のアコーディオンイベント、スクロール中は実行させない為のスクロール中フラグ変数を更新する
    spHeader.globalNav.prototype.isScrolltoggleEvent = function () {
      var _this = this,
      scrollSetTime = "";
      spHeaderData.$navContent.on( 'scroll', function () {
        _this.navContentscrollingFlag = true;
        clearTimeout(scrollSetTime);
        scrollSetTime = setTimeout( function () {
        _this.navContentscrollingFlag = false;
        }, 300 );
      });
    }

    // ナビの中身のアコーディオンイベント、トグル実行
    spHeader.globalNav.prototype.toggleEvent = function () {
      var _this = this;
      this.isScrolltoggleEvent();
      $('.js-spGlobalNav_toggleBtn').on('touchend', function () {
        // スクロール中は実行しない
        if( _this.navContentscrollingFlag === false ){
          $(' + .js-spGlobalNav_toggleArticle', this).stop(true, false).slideToggle();
          $(this).parent('.js-spGlobalNav_toggleWrap').toggleClass('is-open');
        }
      });
    }

    // 実行
    new spHeader.onLoad();
  }
