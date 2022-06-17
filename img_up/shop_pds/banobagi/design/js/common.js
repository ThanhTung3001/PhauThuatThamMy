$(document).ready(function() {
    $(window).on('load resize', function() {
        $('body').attr(
            'data-mobile',
            (function() {
                var r = $(window).width() <= 1024 ? true : false;
                return r;
            })()
        );

        $('body').attr(
            'only-mobile',
            (function() {
                var r = $(window).width() <= 680 ? true : false;
                return r;
            })()
        );

        if ($('body').attr('data-mobile') == 'false') {
            $('.js-doctor-hover')
                .on('mouseenter', function() {
                    $(this).addClass('is-active');
                })
                .on('mouseleave', function() {
                    $(this).removeClass('is-active');
                });
        } else {
            $('.js-doctor-hover').off('mouseenter mouseleave');
        }

        if ($('body').attr('only-mobile') == 'false') {
            var lnbW = $('.lnb__item.type-active').width();
            var lnbW2 = $('.lnb__2depth-item').width();
            if (lnbW > lnbW2) {
                $('.lnb__2depth-item').width(lnbW + 1);
            } else {
                $('.lnb__item.type-active').width(lnbW2 + 1);
            }
            $('.dim.type-lnb').removeClass('is-active');
            //검색결과 말줄임
            cellNoWrap2($('.js-news-ellipsis1'));
            cellNoWrap3($('.js-news-ellipsis2'));
            //모바일에서 스크롤멈춘상태에서 pc로 전환시 다시 스크롤시작
            if ($('body').attr('class') == 'no-scroll') {
                scrollStart();
            }
        } else {
            $('.lnb__2depth-item').css('width', 'auto');
            //PC에서 로컬네비킨상태로 모바일 같을떄 딤처리
            var lnbClass = $('.lnb__2depth-list').attr('class');
            try {
                var lnbInfo = lnbClass.split(' ');
                if (lnbInfo[1] == 'is-active') {
                    $('.dim.type-lnb').addClass('is-active');
                }
            } catch (error) {}
            //모바일에서 로케네비 온상태일때 다른곳클릭시 닫기
            $(document)
                .off('click touchmove')
                .on('click touchmove', function(e) {
                    try {
                        var lnbClass = $('.lnb__2depth-list').attr('class');
                        var lnbInfo = lnbClass.split(' ');
                        if (lnbInfo[1] == 'is-active') {
                            var lnbItem = $('.lnb');
                            if (lnbItem.has(e.target).length === 0) {
                                $('.lnb__2depth-list, .dim.type-lnb').removeClass('is-active');
                                scrollStart();
                            }
                        }
                    } catch (error) {}
                });
            //검색결과 말줄임
            cellNormal($('.js-news-ellipsis1, .js-news-ellipsis2'));
        }
        var footerH = $('.footer').height();
        $('body').css('padding-bottom', footerH);
        if ($('body').attr('data-mobile') == 'false') {
            $('.header').removeClass('js-open-m'); //모바일 메뉴 오픈되어잇는 상태에서 PC로 돌아갈때 해제
            //gnb 외 클릭시 닫기
            $(document)
                .off('click')
                .on('click', function(e) {
                    var container = $('.header, .gnb__depth2-wrap');
                    if (container.has(e.target).length === 0) {
                        $('.gnb__all, .gnb__depth1-item').removeClass('js-open-d');
                    }
                });
            $('.quick-menu__link')
                .on('mouseenter', function() {
                    wowClear();
                    $(this).addClass('is-hover');
                    $('.quick-menu__box.type-big').addClass('is-hover');
                })
                .on('mouseleave', function() {
                    wowStart();
                });
        } else {
            $('.header-search').removeClass('is-active');
            $('.quick-menu__link').off();
        }

        //전체메뉴 스크롤바
        //$('.total__depth-scroll').mCustomScrollbar({
        //	theme:'dark'
        //})
    }); //load 끝

    //quick, 상담 수정
    //퀵모션
    var quickMotion = false;
    $(window).on('scroll', function() {
        var winH = $(window).height();

        if (!quickMotion) {
            quickMotion = true;
            $('.quick-menu__wrap').removeClass('is-active');
        }
    });

    $('.js-quick-m').on('click', function(e) {
        e.preventDefault();

        $('.quick-menu__wrap').toggleClass('is-active');
    });

    $('.consultation-icon').on('click', function() {
        var counsel = $(this).siblings();

        if (counsel.hasClass('is-open')) {
            counsel.removeClass('is-open');
            counsel.addClass('is-close');
        } else {
            counsel.addClass('is-open');
            counsel.removeClass('is-close');
        }
    });

    /*gnb*/
    var gnb = $('.gnb');
    $('.gnb__depth1-link').on('mouseenter', function(e) {
        var nowDepth = $(this).attr('class');
        var nowDepth2 = nowDepth.split(' ');
        if (nowDepth2[1] != 'type-1depth') {
            e.preventDefault();
            var gnbState = $(this).parents('.gnb__depth1-item');
            gnbState
                .addClass('js-open-d js-open-menu')
                .siblings()
                .removeClass('js-open-d js-open-menu');
            $('.gnb__depth1-item').addClass('js-open-all');
            oneBulletRemove();
        }
    });
    //마우스아웃시 gnb 닫기
    $('.gnb, .gnb__depth2-wrap').on('mouseleave', function(e) {
        $('.gnb__depth1-item').removeClass('js-open-all js-open-menu');
    });
    $('.gnb__depth2-item.type-3depth .gnb__depth2-link').on(
        'click',
        function(e) {
            e.preventDefault();
            var depth2Elam = $(this).closest('.gnb__depth2-item.type-3depth');
            if (depth2Elam.hasClass('is-open')) {
                depth2Elam.removeClass('is-open is-fix-open');
                depth2Elam.find('.gnb__depth3-list').slideUp(300);
            } else {
                depth2Elam.addClass('is-open');
                depth2Elam.find('.gnb__depth3-list').slideDown(300);
            }
        }
    );
    //바노바기 링크
    $('.js-bano-link').on('mouseenter', function(e) {
        e.preventDefault();
        var gnbBano = $('.gnb__depth1-item.type-bano');
        gnbBano
            .addClass('js-open-d js-open-menu')
            .siblings()
            .removeClass('js-open-d js-open-menu');
        $('.gnb__depth1-item').addClass('js-open-all');
        $('.gnb__depth1-list').removeClass('is-hide');
        $('.search_inner').removeClass('open');
        oneBulletRemove();
    });
    //리뷰 링크
    $('.js-review-link').on('mouseenter', function(e) {
        e.preventDefault();
        var gnbBano = $('.gnb__depth1-item.type-review');
        gnbBano
            .addClass('js-open-d js-open-menu')
            .siblings()
            .removeClass('js-open-d js-open-menu');
        $('.gnb__depth1-item').addClass('js-open-all');

        $('.gnb__depth1-list').removeClass('is-hide');
        $('.search_inner').removeClass('open');
        oneBulletRemove();
    });
    //글로벌,로그인
    $('.js-global, .js-login').on('click', function(e) {
        e.preventDefault();
        $(this).parents('.snb__item').toggleClass('is-active');
    });
    //전체메뉴
    $('.js-all-menu')
        .off('click')
        .on('click', function(e) {
            e.preventDefault();
            $(this).parents('.gnb__all').toggleClass('js-open-d');
            $('.gnb__depth1-item').removeClass('js-open-d js-open-all js-open-menu');
        });

    //하나인 경우 삭제
    function oneBulletRemove() {
        var gnbNum = $(
            '.gnb__depth1-item.js-open-d .gnb__full-img .gnb-bullet__item'
        ).length;
        if (gnbNum == 1) {
            $('.gnb-bullet').hide();
        } else {
            $('.gnb-bullet').show();
        }
    }

    /*검색*/
    var hederMenu = $('.header__wrap');
    $('.js-search').on('click', function(e) {
        e.preventDefault();
        if ($('body').attr('data-mobile') == 'false') {
            $('.header-search').toggleClass('is-active');
            if ($('.header-search').hasClass('is-active')) {
                $('.header-search__group').addClass('animated fadeInRight');
                $('#keyword').focus();
                hederMenu.addClass('is-hide');
            } else {
                hederMenu.removeClass('is-hide');
            }
        } else {
            $('.m-search, .m-search__close').addClass('animated is-active');
            $('.header__bg').addClass('is-active');
        }
    });
    $('.js-search-close').on('click', function(e) {
        e.preventDefault();
        $('.header-search').removeClass('is-active');
        hederMenu.removeClass('is-hide');
    });

    $('.mobile-menu').on('click', function(e) {
        e.preventDefault();
        $('.header').toggleClass('js-open-m');
        if ($('.header').hasClass('js-open-m')) {
            //로그인했을 경우 상단의 로그인아이콘 hide
            if (isLogin == 'Y') {
                $('.snb__item.type-login').removeClass('is-show');
                $('.snb__item.type-login').addClass('is-hide');
                $('.snb__item.type-search').addClass('is-login');
            } else {
                $('.snb__item.type-login').removeClass('is-hide');
                $('.snb__item.type-login').addClass('is-show');
                $('.snb__item.type-search').removeClass('is-login');
            }
            $('#progress-indicator').addClass('is-hide');
            scrollStop();
            if (
                $('body').attr('data-mobile') == 'true' &&
                $('body').attr('only-mobile') == 'false'
            ) {
                timer = setInterval(function() {
                    digital();
                }, 1000);
            }
            //모바일메뉴 클릭시 해당 세션으로 포커스
            var nowDepth = $('.m-1depth__item.is-active').position().top;
            $('.m-1depth').stop().animate({
                    scrollTop: nowDepth,
                },
                0
            );
        } else {
            $('.m-search, .header__bg').removeClass('is-active');
            $('.m-search__close').removeClass('animated is-active');
            $('#progress-indicator').removeClass('is-hide');
            scrollStart();
            if (
                $('body').attr('data-mobile') == 'true' &&
                $('body').attr('only-mobile') == 'false'
            ) {
                clearInterval(timer);
            }
        }
    });

    $('.m-1depth__link').on('click', function(e) {
        e.preventDefault();
        var tabClass = $(this).attr('data-tab');
        if (tabClass == 'PETIT') {
            window.open('https://www.petitbanobagi.com');
        } else {
            $('.m-1depth__item, .m-2depth__list').removeClass('is-active');
            $(this).parents('.m-1depth__item').addClass('is-active');
            $('.' + tabClass).addClass('is-active');
        }
    });

    $('.type-3depth .m-2depth__link').on('click', function(e) {
        e.preventDefault();
        $(this).parent().toggleClass('is-active');
        var viewH = window.innerHeight;
        var itemH = $(this).height();
        var clicky = e.clientY;
        var itemPosition = $(this).closest('.type-3depth').height();
        var depthPosition = $('.m-2depth').scrollTop();
        var depthPosition2 = Math.ceil(depthPosition / itemH) * itemH;
        if (viewH - itemH < clicky) {
            if (itemPosition > itemH) {
                $('.m-2depth')
                    .stop()
                    .animate({
                            scrollTop: depthPosition2 + (itemPosition - itemH),
                        },
                        500
                    );
            }
        } else if (viewH - itemH > clicky && viewH - itemH * 2 < clicky) {
            if (itemPosition > itemH) {
                $('.m-2depth')
                    .stop()
                    .animate({
                            scrollTop: depthPosition2 + (itemPosition - itemH * 2),
                        },
                        500
                    );
            }
        }
    });

    $('.js-keyord-link').on('click', function(e) {
        e.preventDefault();
        var tabClass = $(this).attr('data-tab');
        $(
            '.keyword-box__list, .keyword-box2__list, .keyword-tab__item, .keyword-tab2__item'
        ).removeClass('is-active');
        $(this).addClass('is-active');
        $('.' + tabClass).addClass('is-active');
    });

    $('.js-search-close').on('click', function(e) {
        e.preventDefault();
        $('.m-search, .header__bg').removeClass('is-active');
        $('.m-search__close').removeClass('animated is-active');
    });

    $('.js-lnb').on('click', function(e) {
        e.preventDefault();
        if ($('.lnb__2depth-list, .dim.type-lnb').hasClass('is-active')) {
            $('.lnb__2depth-list').removeClass('is-active');
            if ($('body').attr('only-mobile') == 'true') {
                $('.dim.type-lnb').removeClass('is-active');
                scrollStart();

            }
        } else {
            $('.lnb__2depth-list').addClass('is-active');
            if ($('body').attr('only-mobile') == 'true') {
                $('.dim.type-lnb').addClass('is-active');
                scrollStop();

            }
        }
        e.stopImmediatePropagation();
    });

    //로그인 바노바기
    $('.js-bano-close').on('click', function(e) {
        e.preventDefault();
        $(this).parents('.p-login__layer').removeClass('is-active');
    });
    $('.js-open-layer').on('click', function(e) {
        e.preventDefault();
        $('.p-login__layer').addClass('is-active');
    });
    //로그인 open/close
    $('.js-login-close').on('click', function(e) {
        e.preventDefault();
        $('.p-login, .p-login-dim').fadeOut(500);
        scrollStart();
    });
    $('.js-bfaf-link').on('click', function(e) {
        e.preventDefault();
        $(this).parent().find('.pics-link__list').toggleClass('is-active');
    });

    //시계
    function digital() {
        var d = new Date(); /* d = 현재 시간 */
        var h = d.getHours(); /* h = 시간 */
        var m = d.getMinutes(); /* m = 분 */
        var s = d.getSeconds(); /* s = 초 */

        /* 시간을 12시간 단위로 하기 위해 12보다 큰 경우 12를 빼줌 */
        if (h > 12) h = h - 12;

        var dh = h * 30 + m / 2; /* dh = 시침의 각도 */
        dh = parseInt(dh); /* 시침의 각도를 정수형으로 변환 */
        var dm = m * 6; /* 분침의 각도 */
        var ds = s * 6; /* 초침의 각도 */
        /* 시침, 분침, 초침의 각도를 계산한 값으로 변경 */
        $('.search-info__hour').css('transform', 'rotate(' + dh + 'deg)');
        $('.search-info__minute').css('transform', 'rotate(' + dm + 'deg)');
        $('.search-info__second').css('transform', 'rotate(' + ds + 'deg)');
    }
    //현재경로 폴더명

    var arrSplitUrl = window.location.pathname.split('/');
    var arrSplitUrlLength = arrSplitUrl.length;
    var currentFolderName = arrSplitUrl[arrSplitUrlLength - 2];
    if (currentFolderName != 'program') {
        scroll_button();
    }

    function scroll_button() {
        var $button = $('.scroll-top');

        if (!$button.length) {
            return;
        }
        var scrollBtnW = $button.width();
        // circle progress scroll
        $.circleProgress.defaults.animation = false;
        $.circleProgress.defaults.value = 0;
        $.circleProgress.defaults.size = scrollBtnW;
        $.circleProgress.defaults.startAngle = (-Math.PI / 4) * 2;
        $.circleProgress.defaults.thickness = '4';
        $.circleProgress.defaults.emptyFill = 'rgba(221, 221, 221, 0.9)';
        $.circleProgress.defaults.fill = { color: '#b916a4' };

        $('.scroll-top__progress').circleProgress();

        $(window).on('load resize', function() {
            scroll_button_resize();
        });
        $button.on('click', function(e) {
            e.preventDefault();
            $('html, body').stop().animate({
                    scrollTop: 0,
                },
                500
            );
        });
    }

    function scroll_button_resize() {
        $('.scroll-top__progress').circleProgress('redraw');
    }

    /* setCookie function */
    function setCookie(cname, value, expire) {
        var todayValue = new Date();
        // 오늘 날짜를 변수에 저장

        todayValue.setDate(todayValue.getDate() + expire);
        document.cookie =
            cname +
            '=' +
            encodeURI(value) +
            '; expires=' +
            todayValue.toGMTString() +
            '; path=/;';
    }
    // Get cookie function
    function getCookie(name) {
        var cookieName = name + '=';
        var x = 0;
        while (x <= document.cookie.length) {
            var y = x + cookieName.length;
            if (document.cookie.substring(x, y) == cookieName) {
                if ((lastChrCookie = document.cookie.indexOf(';', y)) == -1)
                    lastChrCookie = document.cookie.length;
                return decodeURI(document.cookie.substring(y, lastChrCookie));
            }
            x = document.cookie.indexOf(' ', x) + 1;
            if (x == 0) break;
        }
        return '';
    }

    //바노바기 20주년 쿠키 저장
    var fouseState = 'stop';
    //bnbg20thCookie();

    function bnbg20thCookie() {
        var bnbg20thCookie = getCookie('bnbg-20th');

        if (bnbg20thCookie != 'end') {
            if ($('.js-scroll-focus').length) {
                //focuspick
                $('.js-scroll-focus').each(function() {
                    var $this = $(this);
                    var introHeight = $('.intro').height();

                    var n = function() {
                        if (
                            $this.offset().top <
                            $(window).scrollTop() + $(window).height() / 1.3 &&
                            $this.offset().top > $(window).scrollTop() - $this.height()
                        ) {
                            if (fouseState == 'stop') {
                                bnbg20thSetCookie();
                                fouseState = 'play';
                            }
                        }
                    };

                    var b = function() {
                        if (
                            $this.offset().top <
                            $(window).scrollTop() + $(window).height() / 1.3 &&
                            $this.offset().top > $(window).scrollTop() - $this.height()
                        ) {
                            if (fouseState == 'stop') {
                                bnbg20thSetCookie();
                                fouseState = 'play';
                            }
                        }
                    };
                    // 윈도우 스크롤 이벤트로 함수 n 지속 실행
                    $(window).on('scroll', n);
                    // $this 위치값 계산
                    $(window).on('load', b);
                });
            } else if ($('.hair-section99').length) {
                //모발이식
                $('.bnbg-20th').removeClass('is-show');
            } else {
                bnbg20thSetCookie();
            }
        }
    }

    function bnbg20thSetCookie() {
        setCookie('bnbg-20th', 'end', 1);
        $('.bnbg-20th').addClass('is-show');
        // $('.common').append('<div class="bnbg-20th"><div class="bnbg-20th__wrap"><img src="../../images/common/banobagi_20th.png" alt="바노바기 20주년 since 2000" class="img-w100"></div></div>');

        setTimeout(function() {
            // $('.bnbg-20th').addClass('is-hide');
            $('.bnbg-20th').removeClass('is-show');
        }, 2000);
    }

    // 하루동안 안열기 쿠키 저장
    $(function() {
        var closeTodayBtn = $('.js-popup-m-today');
        var closeTodayBtn2 = $('.js-popup-m-today2');
        // 버튼의 클래스명은 closeTodayBtn

        closeTodayBtn.click(function(e) {
            setCookie('popup20200513', 'end', 1);
            // 하루동안이므로 1을 설정
            e.preventDefault();
            $('.popup-m.type-first').removeClass('is-active');
            // 현재 열려있는 팝업은 닫으면서 쿠키값을 저장
        });

        closeTodayBtn2.click(function(e) {
            setCookie('popup2020', 'end', 1);
            // 하루동안이므로 1을 설정
            e.preventDefault();
            $('.popup-m.type-second').removeClass('is-active');
            // 현재 열려있는 팝업은 닫으면서 쿠키값을 저장
        });
    });

    //쿠키체크후 팝업열기
    var result = getCookie('popup20200513'); // 긴급재난지원금 팝업
    var result2 = getCookie('popup2020'); // 코로나 팝업

    if (result != 'end') {
        $('.popup-m.type-first').addClass('is-active');
    }
    if (result2 != 'end') {
        $('.popup-m.type-second').addClass('is-active');
    }

    $('.js-popup-m-close').on('click', function(e) {
        e.preventDefault();
        $(this).closest('.popup-m').removeClass('is-active');
    });
}); //ready 끝

$('.js-login-open').on('click', function(e) {
    e.preventDefault();
    $('.p-login, .p-login-dim').fadeIn(500);
    scrollStop();
});

/*	$('.js-login-open2').on('click',function(e){
		e.preventDefault();
		$('#vlog_login, #vlog_login_dim').fadeIn(500);
		scrollStop();
	});*/

// 빠른 상담
var bodyY;
var isPage;
var isData;

function scrollStop() {
    bodyY = $(window).scrollTop();
    isPage = $('body').attr('page-type');
    isData = $('body').attr('data-mobile');
    if (isPage == 'detail' && isData == 'false') {
        $.scrollify.disable();
        return;
    }
    $('html, body').addClass('no-scroll');
    $('.common').css('top', -bodyY);
}

function scrollStart() {
    if (isPage == 'detail' && isData == 'false') {
        $.scrollify.enable();
        return;
    }
    $('html, body').removeClass('no-scroll');
    $('.common').css('top', 'auto');
    bodyY = $('html,body').scrollTop(bodyY);
}

//input:file
$(document).ready(function() {
    var fileTarget = $('.upload-hidden');

    fileTarget.on('change', function() {
        if (window.FileReader) {
            // 파일명 추출
            var filename = $(this)[0].files[0].name;
        } else {
            // Old IE 파일명 추출
            var filename = $(this).val().split('/').pop().split('\\').pop();
        }

        $(this).parent().siblings('.upload-name').val(filename);
    });

    //preview image
    var imgTarget = $('.upload-hidden');

    imgTarget.on('change', function() {
        var parent = $(this).parent().parent();
        parent
            .children('.upload-display')
            .remove()
            .end()
            .removeClass('upload-set-v1_thumb');

        if (window.FileReader) {
            //image 파일만
            $('.upload-set-v1__input').removeClass('is-img');
            if (!$(this)[0].files[0].type.match(/image\//)) return;
            var reader = new FileReader();
            reader.onload = function(e) {
                var src = e.target.result;
                parent
                    .prepend(
                        '<span class="upload-display"><img src="' +
                        src +
                        '" class="upload-thumb"></span>'
                    )
                    .addClass('upload-set-v1_thumb');
            };
            reader.readAsDataURL($(this)[0].files[0]);
            $('.upload-set-v1__input').addClass('is-img');
        } else {
            //$(this)[0].select();
            //$(this)[0].blur();
            //var imgSrc = document.selection.createRange().text;
            //parent.prepend('<span class="upload-display"><img class="upload-thumb"></span>').addClass('upload-set-v1_thumb');
            //var img = $(this).parent().siblings('.upload-display').find('img');
            //img[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enable='true',sizingMethod='scale',src=\"" + imgSrc + "\")";
        }
    });
});

//원페이지 팝업
var posY;
$('.js-popup-open').on('click', function(e) {
    e.preventDefault();
    if (
        $('body').attr('data-mobile') == 'false' ||
        $(this).attr('data-popup-type') == 'section'
    ) {
        $(this).parents('.fs_section').find('.detail__popup').fadeIn();
        $(this)
            .parents('.fs_section')
            .find('.detail__popup-m, .detail__dim')
            .fadeToggle();
        if ($(this).attr('data-popup-type') == 'section') {
            $(this).toggleClass('is-active');
        } //큰팝업 엑스회전 막기
    } else {
        $(this).parents('.fs_section').find('.detail__popup').fadeIn();
        $(this)
            .parents('.fs_section')
            .find('.detail__popup-m, .detail__dim')
            .fadeToggle();
        scrollStop();
        $('.footer').addClass('is-active');
        if ($(this).attr('data-popup-type') == 'footer') {
            $('.footer').removeClass('is-active');
        }
    }
});
$('.js-popup-close').on('click', function(e) {
    e.preventDefault();
    if (
        $('body').attr('data-mobile') == 'false' ||
        $(this).attr('data-popup-type') == 'section'
    ) {
        $('.detail__popup').fadeOut();
        $('.js-popup-open').removeClass('is-active');
        $(this).parents('.fs_section').find('.detail__dim').fadeToggle();
    } else {
        $('.detail__popup').fadeOut();
        scrollStart();
        $('.footer').removeClass('is-active');
        $(this).parents('.fs_section').find('.detail__dim').fadeToggle();
    }
});

$('.js-consultation').on('click', function(e) {
    console.log('js-consultation');
    e.preventDefault();
    $('.header__right').addClass('remove-phone');
    $('.popup-c.type-common').fadeIn(300);

    if ($(this).parents('.counsel__item').hasClass('type-cost')) {
        counselTabOpen('cost');
    } else {
        counselTabOpen('katalk');
    }

    scrollStop();
});

function counselTabOpen(item) {
    //$.clearPopupCounsel();

    $('.popup-tab__item').removeClass('is-active');
    $('.popup-content').removeClass('is-active');
    $('.popup-tab__item.' + item).addClass('is-active');
    $('.popup-content.' + item).addClass('is-active');
    $('.input1__clear').hide();
}

$('.js-consultation-exam').click(function(e) {
    e.preventDefault();
    $('.popup-c.type-exam').fadeIn(300);
    scrollStop();
});
$('.popup-c__close').on('click', function(e) {
    e.preventDefault();
    //$.clearPopupCounsel();
    $('.input1__clear').hide();
    $('.popup-c').fadeOut(300);
    scrollStart();
});

//상담신청
$('.js-c-open').on('click', function(e) {
    e.preventDefault();
    $('.popup-c').fadeIn(500);
});
$('.js-c-close').on('click', function(e) {
    e.preventDefault();
    $('.popup-c').fadeOut(500);
});
$('.popup-tab__link').on('click', function(e) {
    e.preventDefault();
    //$.clearPopupCounsel();
    var tab_id = $(this).attr('data-tab');
    $('.popup-tab__item').removeClass('is-active');
    $(this).closest('.popup-c').find('.popup-content').removeClass('is-active');
    $(this).parent().addClass('is-active');
    $('.popup-content' + '.' + tab_id).addClass('is-active');
    $('.input1__clear').hide();
});

/*
$.clearPopupCounsel = function () {

  $('#kakaoForm')[0].reset();
  $('#kakaoForm .popup-select__tit').text('관심부위를 선택해주세요');
  $('#kakaoForm .popup-select__item').removeClass('select');
  $('#part_item').val('');

  $('#priceForm')[0].reset();
  $('#priceForm .js-multi').text('관심부위를 선택해주세요');
  $('#priceForm .popup-select__item').removeClass('select');

  $('#part_item2').val('');
  $('#priceForm .popup-check__item').remove();

  $('#priceForm .type-another .popup-select__tit').text('상담시간');
  $('#ampm').val('');
};
*/

//input 닫기
var $ipt = $('.popup-input1'),
    $clearIpt = $('.input1__clear');

$ipt.keyup(function() {
    $(this)
        .next()
        .toggle(Boolean($(this).val()));
});

//select 박스
$clearIpt.toggle(Boolean($ipt.val()));
$clearIpt.click(function(e) {
    e.preventDefault();
    $(this).prev().val('').focus();
    $(this).hide();
});

$('.popup-select__item')
    .on('mouseenter', function() {
        $(this).addClass('is-hover');
    })
    .on('mouseleave', function() {
        $(this).removeClass('is-hover');
    });

function innerScrollStop() {
    $('.popup-c__box').addClass('no-scroll');
}

function innerScrollStart() {
    $('.popup-c__box').removeClass('no-scroll');
}
$('.popup-select__tit').click(function() {
    $('.popup-select, .popup-select2__subject, .popup-select__list').removeClass(
        'is-active'
    );
    $(this).parent().addClass('is-active');
    $(this)
        .parent()
        .find('.popup-select2__subject, .popup-select__list')
        .addClass('is-active');
    innerScrollStop();
    return false;
});

$('.popup-select2__subject').click(function() {
    $(this).parent().removeClass('is-active');
    $(this)
        .parent()
        .find('.popup-select2__subject, .popup-select__list')
        .removeClass('is-active');
    innerScrollStart();
    return false;
});

//기본 탭 링크
$('.js-tab-link').on('click', function(e) {
    e.preventDefault();
    var tab_id = $(this).parent().attr('data-tab');
    $(this).parent().addClass('is-active').siblings().removeClass('is-active');
    $('.' + tab_id)
        .addClass('is-active')
        .siblings()
        .removeClass('is-active');
    if ($('body').attr('only-mobile') == 'false') {
        cellNoWrap2($('.js-news-ellipsis1'));
        cellNoWrap3($('.js-news-ellipsis2'));
    } else {
        cellNormal($('.js-news-ellipsis1, .js-news-ellipsis2'));
    }
});
//의료진소개 쪽 탭 링크
$('.js-tab-link2').on('click', function(e) {
    e.preventDefault();
    var tab_id = $(this).parent().attr('data-tab');
    $(this).parent().addClass('is-active').siblings().removeClass('is-active');
    $(this)
        .closest('.medical-view__item')
        .find('.' + tab_id)
        .addClass('is-active')
        .addClass('is-active')
        .siblings()
        .removeClass('is-active');
});

//팝업 스크롤
// $('.popup-select__list, .terms-c__area').mCustomScrollbar({
// 	theme:'minimal'
// });

//실시간상담
$('.js-realtime').on('click', function(e) {
    e.preventDefault();
    $('.js-consultation').trigger('click');
    $('.popup-tab__item').eq(1).find('.popup-tab__link').trigger('click');
});


//카톡상담
$('.js-katalk').on('click', function(e) {
    e.preventDefault();
    $('.js-consultation').trigger('click');
    $('.popup-tab__item').eq(0).find('.popup-tab__link').trigger('click');

    $(".popup-c .popup-tab__item").removeClass("is-active");
    $(".popup-c .popup-tab__item.katalk").addClass("is-active");

    $(".popup-c .popup-c__scroll .popup-content").removeClass("is-active")
    $(".popup-c .popup-c__scroll .popup-content.katalk").addClass("is-active")

});



//비용상담
$('.js-cost').on('click', function(e) {
    e.preventDefault();
    $('.js-consultation').trigger('click');
    $('.popup-tab__item').eq(2).find('.popup-tab__link').trigger('click');


    $(".popup-c .popup-tab__item").removeClass("is-active");
    $(".popup-c .popup-tab__item.cost").addClass("is-active");

    $(".popup-c .popup-c__scroll .popup-content").removeClass("is-active")
    $(".popup-c .popup-c__scroll .popup-content.cost").addClass("is-active")

});
//$('.js-katalk').on('click', function (e) {
//  console.log('katalk');
// e.preventDefault();
//  console.log('1');
// $('.js-consultation').trigger('click');
// console.log('2');
//  $('.popup-tab__item').eq(0).find('.popup-tab__link').trigger('click');
// console.log('3');
//});

//$('.js-cost').on('click', function (e) {
//  console.log('cost');
//  e.preventDefault();
//  $('.js-consultation').trigger('click');
//  $('.popup-tab__item').eq(2).find('.popup-tab__link').trigger('click');
//});

//비용상담의 상담항목 선택
$('#priceForm .popup-select__item').click(function() {
    $(this)
        .parents('.popup-select__list')
        .removeClass('is-active')
        .parents('.popup-select')
        .removeClass('is-active')
        .find('.popup-select__tit')
        .text($(this).text());
    $(this)
        .parents('.popup-select')
        .find('.popup-select2__subject')
        .removeClass('is-active');
    var selectType = $(this).parents('.popup-select').attr('data-style');
    if (selectType == 'multi') {
        var optCount = $('#priceForm .popup-check li').length;
        if (optCount > 2) {
            alert('최대 3개까지 선택 가능합니다.');
            return false;
        } else {
            if (!$(this).find('h4').hasClass('popup-select2__tit') &&
                !$(this).hasClass('select')
            ) {
                $(this).addClass('select');
                var idx = $(this).attr('id').split('_');
                var nowTxt = $(this).text();
                $('#part_item2').val(nowTxt).keyup();
                $('.popup-check').append(
                    '<li class="popup-check__item" id="cost_' +
                    idx[1] +
                    '"><span class="popup-check__wrap">' +
                    nowTxt +
                    '<a href="" class="popup-check__close">삭제</a></span></li>'
                );
                return false;
            }
        }
    }
});

//비용상담의 상담 선택항목 삭제
$('#priceForm .popup-check').on('click', '.popup-check__close', function(e) {
    e.preventDefault();
    $(this).parents('.popup-check__item').remove();
    var idx = $(this).parents('.popup-check__item').attr('id').split('_');
    $('#cost_' + idx[1]).removeClass('select');

    var optCount = $('#priceForm .popup-check__item').length;

    if (optCount == 0) {
        //$(this).parents('.popup-content__box').find('.popup-content__box').text('관심부위를 선택해주세요');
        $('#priceForm .js-multi').text('관심부위를 선택해주세요');
        $('#part_item2').val('').keyup();
    }
    return false;
});

// 비용상담 상담시간 선택
$('#priceForm .type-another .popup-select__item').click(function() {
    $('#ampm').val($(this).text()).keyup();
});

//카카오상담의 상담항목 선택
$('#kakaoForm .popup-select__item').click(function() {
    $(this)
        .parents('.popup-select__list')
        .removeClass('is-active')
        .parents('.popup-select')
        .removeClass('is-active')
        .find('.popup-select__tit')
        .text($(this).text());
    $(this)
        .parents('.popup-select')
        .find('.popup-select2__subject')
        .removeClass('is-active');
    $(this).addClass('select').siblings().removeClass('select');
    var idx = $(this).attr('id').split('_')[1];
    $('#part_item').val(idx).keyup();
});

//수험생전용상담의 상담항목 선택
$('#examForm .popup-select__item').click(function() {
    $(this)
        .parents('.popup-select__list')
        .removeClass('is-active')
        .parents('.popup-select')
        .removeClass('is-active')
        .find('.popup-select__tit')
        .text($(this).text());
    $(this)
        .parents('.popup-select')
        .find('.popup-select2__subject')
        .removeClass('is-active');
    $(this).addClass('select').siblings().removeClass('select');
    var idx = $(this).attr('id').split('_')[1];
    $('#part_item3').val(idx).keyup();
});

$('.js-terms-open').on('click', function(e) {
    e.preventDefault();
    $(this).closest('.popup-c').find('.popup-c__terms').addClass('is-active');
});
$('.js-terms-close').on('click', function(e) {
    e.preventDefault();
    $('.popup-c__terms').removeClass('is-active');
});

//푸터 블로그 오버효과
$('.sns__link.type-blog')
    .mouseenter(function() {
        $(this)
            .find('img')
            .attr('src', $(this).find('img').attr('src').replace('.png', '_on.png'));
    })
    .mouseleave(function() {
        $(this)
            .find('img')
            .attr('src', $(this).find('img').attr('src').replace('_on.png', '.png'));
    });


/*
$(function () {
  //전화번호 클릭 시 전화걸기
  $.callMobile = function () {
    gtag('event', '전화상담', {
      event_category: '전화상담',
      event_label: '전화상담',
    });

    // 카카오픽셀 상담신청 전환 2021-04-30
    kakaoPixel('5847411933049565621').pageView();
    kakaoPixel('5847411933049565621').signUp();
    //kakaoPixel('2283117492995443940').purchase(); // 구버전 제거

    fbq('track', 'CompleteRegistration');
    //mobConv();
    (function (a, g, e, n, t) {
      a.enp =
        a.enp ||
        function () {
          (a.enp.q = a.enp.q || []).push(arguments);
        };
      n = g.createElement(e);
      n.defer = !0;
      n.src =
        'https://cdn.megadata.co.kr/dist/prod/enp_tracker_cafe24_smart.min.js';
      t = g.getElementsByTagName(e)[0];
      t.parentNode.insertBefore(n, t);
    })(window, document, 'script');
    enp('create', 'conversion', 'banobagips', {
      device: 'b',
      convType: 'etc',
      productName: '상담신청',
    }); // 디바이스 타입  W:웹, M: 모바일, B: 반응형
    enp('send', 'conversion', 'banobagips', {
      device: 'b',
      convType: 'etc',
      productName: '상담신청',
    });

    document.location.href = 'tel:15886508';
  };

  //전화번호 클릭 시 전화걸기
  $.callMobileAnother = function () {
    gtag('event', '전화상담', {
      event_category: '전화상담',
      event_label: '전화상담',
    });

    // 카카오픽셀 상담신청 전환 2021-04-30
    kakaoPixel('5847411933049565621').pageView();
    kakaoPixel('5847411933049565621').signUp();
    // kakaoPixel('2283117492995443940').purchase();  // 구버전 제거

    fbq('track', 'CompleteRegistration');
    //mobConv();
    (function (a, g, e, n, t) {
      a.enp =
        a.enp ||
        function () {
          (a.enp.q = a.enp.q || []).push(arguments);
        };
      n = g.createElement(e);
      n.defer = !0;
      n.src =
        'https://cdn.megadata.co.kr/dist/prod/enp_tracker_cafe24_smart.min.js';
      t = g.getElementsByTagName(e)[0];
      t.parentNode.insertBefore(n, t);
    })(window, document, 'script');
    enp('create', 'conversion', 'banobagips', {
      device: 'b',
      convType: 'etc',
      productName: '상담신청',
    }); // 디바이스 타입  W:웹, M: 모바일, B: 반응형
    enp('send', 'conversion', 'banobagips', {
      device: 'b',
      convType: 'etc',
      productName: '상담신청',
    });
    document.location.href = 'tel:02-562-6001';
  };

  //핸드폰 번호 유효성 체크
  $(
    '#k_tel, #p_tel, #s_tel, #userPhone, #eventPhone, #checkupPhone, #eventExamPhone'
  )
    .on('keyup', function () {
      this.value = this.value.replace(/^[-]|[^0-9-]/gi, '');
    })
    .on('blur', function () {
      // 포커스를 잃었을때 실행합니다.
      if ($(this).val() == '') return;

      // 기존 번호에서 - 를 삭제합니다.
      var trans_num = $(this).val().replace(/-/gi, '');

      // 입력값이 있을때만 실행합니다.
      if (trans_num != null && trans_num != '') {
        // 총 핸드폰 자리수는 11글자이거나, 10자여야 합니다.
        if (trans_num.length == 11 || trans_num.length == 10) {
          // 유효성 체크
          var regExp_ctn =
            /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/;
          if (regExp_ctn.test(trans_num)) {
            // 유효성 체크에 성공하면 하이픈을 넣고 값을 바꿔줍니다.
            trans_num = trans_num.replace(
              /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?([0-9]{3,4})-?([0-9]{4})$/,
              '$1-$2-$3'
            );
            $(this).val(trans_num);
          } else {
            alert('유효하지 않은 전화번호 입니다.');
            $(this).val('');
            $(this).focus();
          }
        } else {
          alert('유효하지 않은 전화번호 입니다.');
          $(this).val('');
          $(this).focus();
        }
      }
    });
});
*/
// 수험생 전용 상담
/*
$('#examForm').validate({
  errorPlacement: function (error, element) {
    if (element.attr('name') == 'chkAgree3') {
      error.insertAfter('.popup-content__check');
    } else if (element.attr('name') == 'part_item3') {
      error.insertAfter('.popup-select');
    } else {
      error.insertAfter(element);
    }
  },
  messages: {
    s_name: '이름을 입력해주세요.',
    s_tel: '연락처를 입력해주세요.',
    part_item3: '관심부위를 선택해주세요.',
    s_content: '상담내용을 입력해주세요.',
    chkAgree3: '개인정보취급방침에 동의해주세요.',
  },
  submitHandler: function () {
    // form.submit();
    gtag('event', '수험생전용상담', {
      event_category: '상담신청',
      event_label: '상담신청',
    });

    // 카카오픽셀 상담신청 전환 2021-04-30
    kakaoPixel('5847411933049565621').pageView();
    kakaoPixel('5847411933049565621').signUp();
    // kakaoPixel('2283117492995443940').purchase();  // 구버전 제거

    fbq('track', 'CompleteRegistration');
    //mobConv();
    (function (a, g, e, n, t) {
      a.enp =
        a.enp ||
        function () {
          (a.enp.q = a.enp.q || []).push(arguments);
        };
      n = g.createElement(e);
      n.defer = !0;
      n.src =
        'https://cdn.megadata.co.kr/dist/prod/enp_tracker_cafe24_smart.min.js';
      t = g.getElementsByTagName(e)[0];
      t.parentNode.insertBefore(n, t);
    })(window, document, 'script');
    enp('create', 'conversion', 'banobagips', {
      device: 'b',
      convType: 'etc',
      productName: '상담신청',
    }); // 디바이스 타입  W:웹, M: 모바일, B: 반응형
    enp('send', 'conversion', 'banobagips', {
      device: 'b',
      convType: 'etc',
      productName: '상담신청',
    });
    var formdata = $('#examForm').serialize();

    $.post('/inc/incCounselProc.php', formdata, function (data) {
      if (data == 'errorCase1') {
        alert('필수입력 항목이 누락되었습니다!!');
      } else if (data == 'errorCase2') {
        alert('상담신청에 실패하였습니다!!');
      } else {
        // alert(data);
        $('#examForm')[0].reset();
        $('#examForm .popup-select__tit').text('관심부위를 선택해주세요');
        $('#examForm .popup-select__item').removeClass('select');
        $('#part_item3').val('');
        alert('상담신청이 완료되었습니다!!');
      }
    });
  },
});
*/

// 카톡 상담
/*
$('#kakaoForm').validate({
  errorPlacement: function (error, element) {
    if (element.attr('name') == 'chkAgree1') {
      error.insertAfter('#chkAgree1-error');
    } else {
      error.insertAfter(element);
    }
  },
  messages: {
    k_name: '이름을 입력해주세요.',
    k_tel: '연락처를 입력해주세요.',
    part_item: '관심부위를 선택해주세요.',
    k_content: '상담내용을 입력해주세요.',
    chkAgree1: '개인정보취급방침에 동의해주세요.',
  },
  submitHandler: function () {
    // form.submit();

    var formdata = $('#kakaoForm').serialize();

    $.post('/inc/incCounselProc.php', formdata, function (data) {
      if (data == 'errorCase1') {
        alert('필수입력 항목이 누락되었습니다!!');
      } else if (data == 'errorCase2') {
        alert('상담신청에 실패하였습니다!!');
      } else {
        try {
          _PL('https://www.banobagi.com/conversion/kakao.php');
        } catch (e) {}

        gtag('event', '카톡상담', {
          event_category: '상담신청',
          event_label: '상담신청',
        });

        // 카카오픽셀 상담신청 전환 2021-04-30
        kakaoPixel('5847411933049565621').pageView();
        kakaoPixel('5847411933049565621').signUp();
        // kakaoPixel('2283117492995443940').purchase();  // 구버전 제거

        fbq('track', 'CompleteRegistration');
        //mobConv();
        (function (a, g, e, n, t) {
          a.enp =
            a.enp ||
            function () {
              (a.enp.q = a.enp.q || []).push(arguments);
            };
          n = g.createElement(e);
          n.defer = !0;
          n.src =
            'https://cdn.megadata.co.kr/dist/prod/enp_tracker_cafe24_smart.min.js';
          t = g.getElementsByTagName(e)[0];
          t.parentNode.insertBefore(n, t);
        })(window, document, 'script');
        enp('create', 'conversion', 'banobagips', {
          device: 'b',
          convType: 'etc',
          productName: '상담신청',
        }); // 디바이스 타입  W:웹, M: 모바일, B: 반응형
        enp('send', 'conversion', 'banobagips', {
          device: 'b',
          convType: 'etc',
          productName: '상담신청',
        });
        if (typeof wcs != 'undefined') {
          if (!wcs_add) var wcs_add = {};
          wcs_add['wa'] = 's_4f45621f2c8e';
          var _nasa = {};
          _nasa['cnv'] = wcs.cnv('4', '1');
          wcs_do(_nasa);
        }

        $('#kakaoForm')[0].reset();
        $('#kakaoForm .popup-select__tit').text('관심부위를 선택해주세요');
        $('#kakaoForm .popup-select__item').removeClass('select');
        $('#part_item').val('');
        alert('상담신청이 완료되었습니다!!');
      }
    });
  },
});
*/

// 비용 상담
/*
$('#priceForm').validate({
  groups: {
    username: 'chk_agree2 chk_sms_agree',
  },
  errorPlacement: function (error, element) {
    if (element.attr('name') == 'chk_agree2') {
      error.insertAfter('#chk_agree2-error');
    } else if (element.attr('name') == 'part_item2') {
      error.insertAfter('#part_item2-error');
    } else if (element.attr('name') == 'ampm') {
      error.insertAfter('#ampm_error');
    } else {
      error.insertAfter(element);
    }
  },
  messages: {
    p_name: '이름을 입력해주세요.',
    p_tel: '연락처를 입력해주세요.',
    part_item2: '관심부위를 선택해주세요.',
    p_content: '메모를 입력해주세요.',
    ampm: '상담시간을 선택해주세요.',
    chk_agree2: '개인정보취급방침에 동의해주세요.',
  },
  submitHandler: function () {
    var partId = '';
    for (i = 0; i < $('#priceForm .popup-check li').length; i++) {
      partId =
        partId +
        $('#priceForm .popup-check li').eq(i).attr('id').split('_')[1] +
        ',';
    }
    $('#part_item2').val(partId);

    var formdata = $('#priceForm').serialize();
    $.post('/inc/incCounselProc.php', formdata, function (data) {
      if (data == 'errorCase1') {
        alert('필수입력 항목이 누락되었습니다!!');
      } else if (data == 'errorCase2') {
        alert('상담신청에 실패하였습니다!!');
      } else {

        try {
          _PL('https://www.banobagi.com/conversion/price.php');
        } catch (e) {}

        gtag('event', '비용상담', {
          event_category: '상담신청',
          event_label: '상담신청',
        });

        // 카카오픽셀 상담신청 전환 2021-04-30
        kakaoPixel('5847411933049565621').pageView();
        kakaoPixel('5847411933049565621').signUp();
        // kakaoPixel('2283117492995443940').purchase();  // 구버전 제거

        fbq('track', 'CompleteRegistration');
        //mobConv();
        (function (a, g, e, n, t) {
          a.enp =
            a.enp ||
            function () {
              (a.enp.q = a.enp.q || []).push(arguments);
            };
          n = g.createElement(e);
          n.defer = !0;
          n.src =
            'https://cdn.megadata.co.kr/dist/prod/enp_tracker_cafe24_smart.min.js';
          t = g.getElementsByTagName(e)[0];
          t.parentNode.insertBefore(n, t);
        })(window, document, 'script');
        enp('create', 'conversion', 'banobagips', {
          device: 'b',
          convType: 'etc',
          productName: '상담신청',
        }); // 디바이스 타입  W:웹, M: 모바일, B: 반응형
        enp('send', 'conversion', 'banobagips', {
          device: 'b',
          convType: 'etc',
          productName: '상담신청',
        });

        if (typeof wcs != 'undefined') {
          if (!wcs_add) var wcs_add = {};
          wcs_add['wa'] = 's_4f45621f2c8e';
          var _nasa = {};
          _nasa['cnv'] = wcs.cnv('4', '1');
          wcs_do(_nasa);
        }

        $('#priceForm')[0].reset();
        $('#priceForm .js-multi').text('관심부위를 선택해주세요');
        $('#priceForm .popup-select__item').removeClass('select');

        $('#part_item2').val('');
        $('#priceForm .popup-check__item').remove();

        $('#priceForm .type-another .popup-select__tit').text('상담시간');
        $('#ampm').val('');
        alert('상담신청이 완료되었습니다!!');
      }
    });
    // form.submit();
  },
});
*/

//테이블 말줄임
function cellNoWrap(target) {
    target.css({ 'max-width': target.parent().width(), 'white-space': 'nowrap' },
        function() {}
    );
}

function cellNoWrap2(target) {
    target.css({ 'max-width': target.parent().width(), 'white-space': 'nowrap' },
        function() {}
    );
}

function cellNoWrap3(target) {
    target.css({ 'max-width': target.parent().width(), 'white-space': 'nowrap' },
        function() {}
    );
}

function cellNormal(target) {
    target.css({ 'max-width': 'auto', 'white-space': 'normal' });
}

$(document).ready(function() {
    cellNoWrap($('.js-board-link, .js-menu-link, .js-epilogue-tit'));
});

$(window)
    .on('resize', function(e) {
        cellNormal($('.js-board-link, .js-menu-link, .js-epilogue-tit'));
        cellNoWrap($('.js-board-link, .js-menu-link, .js-epilogue-tit'));
    })
    .resize();

//퀵메뉴

var wowTimeOut;

function wowStart() {
    wowTimeOut = setTimeout(function() {
        $('.quick-menu__link').removeClass('is-hover');
        $('.quick-menu__box.type-big').removeClass('is-hover');
    }, 2000);
}

function wowClear() {
    clearTimeout(wowTimeOut);
}

//페이지 이동 함수
$.fnGoPage = function(page) {
    if (document.location.href.indexOf('photoGallery.php') > 0) {
        $('#photoSearchForm #page').val(page);
        $('#photoSearchForm #curpage').val(page);
        //alert($('#photoSearchForm #page').val());
        $('#photoSearchForm')
            .attr({ action: '/review/photoGallery.php', method: 'post' })
            .submit();
    } else {
        $('#frmBoard #page').val(page);
        $('#frmBoard')
            .attr({ action: $('#goUrl').val(), method: 'post' })
            .submit();
    }
};

//탭바
$(document).ready(function() {
    $('.content-tab__link').on('click', function(e) {
        e.preventDefault();
        var tabClass = $(this).attr('data-tab');
        $('.content-tab__item, .content-tab__page').removeClass('is-active');
        $(this).parents('.content-tab__item').addClass('is-active');
        $('.' + tabClass).addClass('is-active');
    });
});

$.fnSearchSubmit = function(searchword) {
    $('#keyword').val(searchword);
    $('#seearchForm').attr({ method: 'post' }).submit();
};

$('#seearchForm').on('submit', function() {
    $('#gnbHiddenInputSearch').val($('#keyword').val());
    if (
        $('#gnbHiddenInputSearch').val() != '눈' &&
        $('#gnbHiddenInputSearch').val() != '코' &&
        $('#gnbHiddenInputSearch').val().length == 1
    ) {
        alert('검색어는 최소 2자이상 입력하세요!');
        return false;
    }
});

$.fnSearchSubmit2 = function(searchword) {
    $('#keyword2').val(searchword);
    $('#seearchForm2').attr({ method: 'post' }).submit();
};

// 검색
/*
$('#seearchForm2').validate({
  errorPlacement: function (error, element) {
    if (element.attr('name') == 'keyword2') {
      error.insertAfter('#keyword2-error');
    } else {
      error.insertAfter(element);
    }
  },
  messages: {
    keyword2: '* 검색어를 입력해주세요.',
  },
  submitHandler: function (form) {
    searchword = $('#keyword2').val();
    if (searchword != '눈' && searchword != '코' && searchword.length == 1) {
      alert('검색어는 최소 2자이상 입력하세요!');
      return false;
    }
    form.submit();
  },
});
*/

//로그아웃
$.fnLogout = function(kind) {
    $.post('/inc/incLogout.php', function(data) {
        //location.reload();
        if ($.trim(data) == 'success') {
            //location.reload();
            if (
                $(location).attr('pathname') == '/' ||
                $(location).attr('pathname') == '/index.php'
            ) {
                $('#isMove').val('Y');
                $('#frmRealstoryForm').attr({ action: '/', method: 'post' }).submit();
            } else {
                location.reload();
            }
            /*
                if(kind == "P")
                    $('#gnbLogout').addClass('hide');
                else
                    location.reload();*/
        }
    });
};

//실시간 상담
$.fnOpenCounsel = function() {
    //window.open('https://banobagi.qsales.co.kr/linkoc',  '_blank');
    gtag('event', '실시간상담', {
        event_category: '상담신청',
        event_label: '상담신청',
    });

    // 카카오픽셀 상담신청 전환 2021-04-30
    /*
  kakaoPixel('5847411933049565621').pageView();
  kakaoPixel('5847411933049565621').signUp();
  */
    // kakaoPixel('2283117492995443940').purchase();  // 구버전 제거

    fbq('track', 'CompleteRegistration');
    //mobConv();
    (function(a, g, e, n, t) {
        a.enp =
            a.enp ||
            function() {
                (a.enp.q = a.enp.q || []).push(arguments);
            };
        n = g.createElement(e);
        n.defer = !0;
        n.src =
            'https://cdn.megadata.co.kr/dist/prod/enp_tracker_cafe24_smart.min.js';
        t = g.getElementsByTagName(e)[0];
        t.parentNode.insertBefore(n, t);
    })(window, document, 'script');
    enp('create', 'conversion', 'banobagips', {
        device: 'b',
        convType: 'etc',
        productName: '상담신청',
    }); // 디바이스 타입  W:웹, M: 모바일, B: 반응형
    enp('send', 'conversion', 'banobagips', {
        device: 'b',
        convType: 'etc',
        productName: '상담신청',
    });

    if (typeof wcs != 'undefined') {
        if (!wcs_add) var wcs_add = {};
        wcs_add['wa'] = 's_4f45621f2c8e';
        var _nasa = {};
        _nasa['cnv'] = wcs.cnv('4', '1');
        wcs_do(_nasa);
    }

    //$.ajax({url:'/conversion/navertalk.php'})

    try {
        _PL('https://www.banobagi.com/conversion/navertalk.php');
    } catch (e) {}

    window.open('https://talk.naver.com/WC5GY8', '', 'width=550,height=700');
};

//챗봇 상담
$.fnChatBot = function() {
    //window.open('https://banobagi.qsales.co.kr/linkoc',  '_blank');
    // gtag('event', '실시간상담', {'event_category': '상담신청','event_label':'상담신청'});
    //kakaoPixel('2283117492995443940').purchase();
    //fbq('track', 'CompleteRegistration');
    //mobConv();
    (function(a, g, e, n, t) {
        a.enp =
            a.enp ||
            function() {
                (a.enp.q = a.enp.q || []).push(arguments);
            };
        n = g.createElement(e);
        n.defer = !0;
        n.src =
            'https://cdn.megadata.co.kr/dist/prod/enp_tracker_cafe24_smart.min.js';
        t = g.getElementsByTagName(e)[0];
        t.parentNode.insertBefore(n, t);
    })(window, document, 'script');
    enp('create', 'conversion', 'banobagips', {
        device: 'b',
        convType: 'etc',
        productName: '상담신청',
    }); // 디바이스 타입  W:웹, M: 모바일, B: 반응형
    enp('send', 'conversion', 'banobagips', {
        device: 'b',
        convType: 'etc',
        productName: '상담신청',
    });

    if (typeof wcs != 'undefined') {
        if (!wcs_add) var wcs_add = {};
        wcs_add['wa'] = 's_4f45621f2c8e';
        var _nasa = {};
        _nasa['cnv'] = wcs.cnv('4', '1');
        wcs_do(_nasa);
    }

    //$.ajax({url:'/conversion/chatbot.php'})
    try {
        _PL('https://www.banobagi.com/conversion/chatbot.php');
    } catch (e) {}

    //mobConv();
    window.open('http://bano.vap.ai');
};

/*
$(document).ready(function () {
  // 페이스북 SDK 초기화
  //실서버

  window.fbAsyncInit = function () {
    FB.init({
      appId: '960781064072218',
      xfbml: true,
      version: 'v2.10',
    });
    FB.AppEvents.logPageView();
  };

  (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');

  Kakao.init('257d367d5a0070f35e1b7ddf7b4907a4');
});
*/
/////////////////////////////////////////
///   카카오 로그인 관련 스크립트   ///
/////////////////////////////////////////
function fnLoginWithKakao() {
    // 로그인 창을 띄웁니다.
    // Kakao.Auth.login({
    //   success: function (authObj) {
    //     $.post(
    //       '/inc/incSnsKakao.php',
    //       { result: 'success' },
    //       function (response) {
    //         var epilogueID = $('#epilogueID').val();
    //         var isLoginPopup = $('#isLoginPopup').val();
    //         if (isLoginPopup == 'Y') {
    //           location.href = '/review/epilogueView.php?ID=' + epilogueID;
    //         } else {
    //           location.reload();
    //         }
    //       }
    //     );
    //   },
    //   fail: function (err) {
    //     alert('정상적으로 처리되지 않았습니다.\n다시 로그인해주세요.');
    //   },
    // });
}

/////////////////////////////////////////
///   페이스북 로그인 관련 스크립트   ///
/////////////////////////////////////////
function fnSnsFacebookLogin_New(kind) {
    //alert("Test");

    var epilogueID = $('#epilogueID').val();
    var isLoginPopup = $('#isLoginPopup').val();
    //페이스북 로그인 버튼을 눌렀을 때의 루틴.
    FB.login(
        function(response) {
            var accessToken = response.authResponse.accessToken;
            FB.api(
                '/me', { fields: 'id, name, email, gender, age_range' },
                function(user) {
                    $.post(
                        '/inc/incSnsFacebook.php', { username: user.name, useremail: user.email },
                        function(response) {
                            if (response == '0') {
                                alert('정상적으로 처리되지 않았습니다.\n다시 로그인해주세요.');
                                return;
                            } else {
                                //$("#frmForm").attr({action:$("#goPage").val(), method:"post"}).submit();
                                location.reload();
                            }
                        }
                    );
                }
            );
        }, { scope: 'public_profile, email' }
    );
}

//로그인 페이지
$.fnLoginChk = function() {
    //document.frmMemberLogin.action = '/membership/membershipLoginProc.php';
    //document.frmMemberLogin.submit();
    var formdata = $('#frmMemberLogin').serialize();
    var epilogueID = $('#epilogueID').val();
    var isLoginPopup = $('#isLoginPopup').val();
    $.post('/membership/membershipLoginProc.php', formdata, function(data) {
        if (data == 3 || data == 6) {
            //회원 로그인 성공
            //$('#frmForm').submit();
            if (isLoginPopup == 'Y') {
                location.href = '/review/epilogueView.php?ID=' + epilogueID;
            } else {
                if (
                    $(location).attr('pathname') == '/' ||
                    $(location).attr('pathname') == '/index.php'
                ) {
                    $('#isMove').val('Y');
                    $('#frmRealstoryForm').attr({ action: '/', method: 'post' }).submit();
                } else {
                    location.reload();
                }
            }
        } else {
            if (data == 1) {
                alert('아이디와 비밀번호를 입력하세요!!');
            } else if (data == 2) {
                alert('입력하신 아이디와 일치하는 회원정보가 없습니다!!');
            } else if (data == 4) {
                alert(
                    '고객님의 ID로 로그인 10번 시도 후 실패하였습니다.\n\n개인정보보호 정책에 따라 고객님의 ID는 삭제되었습니다. 신규가입으로 바노바기에서 제공하는 서비스를 이용바랍니다.'
                );
                location.href = '/membership/membershipJoinStep1.php';
            } else if (data == 7) {
                $('.p-notice, .p-notice-dim').addClass('is-active');
                scrollStop();
                alert('입력하신 비밀번호와 일치하는 회원정보가 없습니다!!');
            } else {
                alert('입력하신 비밀번호와 일치하는 회원정보가 없습니다!!');
            }
            return false;
        }
    });
};

//로그인 페이지
$.fnLoginChk2 = function() {
    //document.frmMemberLogin.action = '/membership/membershipLoginProc.php';
    //document.frmMemberLogin.submit();
    var formdata = $('#frmMemberLogin2').serialize();
    var isLoginPopup = $('#isLoginPopup').val();
    $.post('/membership/membershipLoginProc.php', formdata, function(data) {
        if (data == 3 || data == 6) {
            //회원 로그인 성공
            //$('#frmForm').submit();
            if (isLoginPopup == 'Y') {
                location.href = '/review/epilogueView.php?ID=' + epilogueID;
            } else {
                if (
                    $(location).attr('pathname') == '/' ||
                    $(location).attr('pathname') == '/index.php'
                ) {
                    $('#isMove').val('Y');
                    $('#frmRealstoryForm').attr({ action: '/', method: 'post' }).submit();
                } else {
                    location.reload();
                }
            }
        } else {
            if (data == 1) {
                alert('아이디와 비밀번호를 입력하세요!!');
            } else if (data == 2) {
                alert('입력하신 아이디와 일치하는 회원정보가 없습니다!!');
            } else if (data == 4) {
                alert(
                    '고객님의 ID로 로그인 10번 시도 후 실패하였습니다.\n\n개인정보보호 정책에 따라 고객님의 ID는 삭제되었습니다. 신규가입으로 바노바기에서 제공하는 서비스를 이용바랍니다.'
                );
                location.href = '/membership/membershipJoinStep1.php';
            } else if (data == 7) {
                $('.p-notice, .p-notice-dim').addClass('is-active');
                scrollStop();
                alert('입력하신 비밀번호와 일치하는 회원정보가 없습니다!!');
            } else {
                alert('입력하신 비밀번호와 일치하는 회원정보가 없습니다!!');
            }
            return false;
        }
    });
};

//아이디찾기
$.fnFindID = function() {
    var formdata = $('#frmFindID').serialize();

    $.ajax({
        type: 'POST',
        url: '/membership/membershipLoginProc.php',
        data: formdata,
        cache: false,
        success: function(html) {
            if (html == 1) {
                alert('일치하는 회원정보가 없습니다!!');
            } else {
                $('#findIDForm').removeClass('is-active');
                $('#findIDResult').empty();
                $('#findIDResult').append(html);
                $('#findIDResult').addClass('is-active');
            }
        },
    });

    return false;

    /* $.post('/membership/membershipLoginProc.php', formdata, function(data){
           if(data == 1)
           {
               alert('일치하는 회원정보가 없습니다!!');
           }else{
               alert('입력하신 비밀번호와 일치하는 회원정보가 없습니다!!');
           }
           return false;
       });  */
};

//비밀번호찾기
$.fnFindPW = function() {
    var formdata = $('#frmFindPW').serialize();

    $.ajax({
        type: 'POST',
        url: '/membership/membershipLoginProc.php',
        data: formdata,
        cache: false,
        success: function(html) {
            if (html == 1) {
                alert('일치하는 회원정보가 없습니다!!');
            } else if (html == 2) {
                alert('가입하신 메일로 임시비밀번호 전송하였습니다!!');
            } else {
                alert('메일전송에 실패하였습니다. 다시 시도해주세요!!');
            }
        },
    });

    return false;
};

//포토갤러리 해당 인물+카테고리로 이동
$.fnBAGallerySubmit = function(pid, category, gender) {
    $('#baCategory').val(category);
    $('#baIsCategorySearch').val('Y');
    $('#baSearchPID').val(pid);
    $('#baSearchGender').val(gender);

    $('#frmBeforeAfter')
        .attr({ action: '/review/photoGallery.php', method: 'post' })
        .submit();
};

//의료진 내용보기
$.fnMoveMedical = function(val1, val2) {
    $('#frmRealstoryForm #detailCategory').val(val1);
    $('#frmRealstoryForm #detailID').val(val2);
    $('#frmRealstoryForm')
        .attr({
            action: '/introduce/introduceMedical.php',
            target: 'popWin',
            method: 'post',
        })
        .submit();
};

//가슴검진 신청관련 js start

//가슴검진 팝업 시작
var chestElem = $('.chest-select');
$('.chest-select__tit').click(function(e) {
    e.preventDefault();
    if (chestElem.hasClass('is-active')) {
        chestElem.removeClass('is-active');
    } else {
        chestElem.addClass('is-active');
    }
});
$('.chest-select__item').on('click', function() {
    chestElem.removeClass('is-active');
    $('.chest-select__tit').addClass('is-select').text($(this).text());
    var idx = $(this).attr('id').split('_')[1];
    $('#surgeryImplant').val(idx).keyup(); //input form에 값 입력
});
var dbOpen = false;
$('.js-c-terms-close').on('click', function(e) {
    e.preventDefault();
    $('.chest-terms').removeClass('is-active');
});
$('.chest-db__terms').on('click', function(e) {
    e.preventDefault();
    $('.chest-terms').addClass('is-active');
});
$('.js-c-db-close').on('click', function(e) {
    e.preventDefault();
    $('.chest-db').removeClass('is-active');
    $('.chest-popup__close').trigger('click');
    dbOpen = false;
});
/*$('.chest-popup__btn').on('click',function(e){
	e.preventDefault();
	$('.chest-db').addClass('is-active');
	$('.chest-popup__over').removeClass('is-active');
	dbOpen = true;
});*/
$('.chest-popup__close').on('click', function(e) {
    e.preventDefault();
    $('.chest-popup').removeClass('is-active');
});
$('.chset-tag').on('click', function(e) {
    e.preventDefault();
    $('.chest-popup').addClass('is-active');
});

$('.chest-popup__btn')
    .on('mouseenter', function() {
        if (dbOpen == false) {
            $('.chest-popup__over').addClass('is-active');
        }
    })
    .on('mouseleave', function() {
        if (dbOpen == false) {
            $('.chest-popup__over').removeClass('is-active');
        }
    });
$('.js-mouse-over')
    .on('mouseenter', function() {
        $(this).addClass('is-active');
    })
    .on('mouseleave', function() {
        $(this).removeClass('is-active');
    });
//가슴검진 팝업 끝

$('[data-lity]').on('click', function(e) {
    e.preventDefault();
    const href = $(this).attr('href');

    lity(href);
});