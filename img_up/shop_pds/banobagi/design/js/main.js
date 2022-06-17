//오시는길 문자보내기팝업
$('.js-sms-btn').on('click', function (e) {
  e.preventDefault();
  $('.main-form').addClass('is-active');
});
$('.js-sms-close').on('click', function (e) {
  e.preventDefault();
  $('.main-form').removeClass('is-active');
});
//디테일리스트 썸네일 오버효과
$('.detail-thumbnail__link')
  .on('mouseenter', function () {
    $(this).closest('.detail-thumbnail__item').addClass('is-hover');
  })
  .on('mouseleave', function () {
    $(this).closest('.detail-thumbnail__item').removeClass('is-hover');
  });

$('.js-list-slide').slick({
  infinite: true,
  speed: 300,
  slidesToShow: 1,
  adaptiveHeight: true,
  prevArrow: '.js-slider-prev',
  nextArrow: '.js-slider-next',
  cssEase: 'linear',
  initialSlide: parseInt($('#detailPartRndCase').val()) - 1,
  // autoplay: true,
  autoplaySpeed: 500,
  dots: true,
  accessibility: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        centerMode: true,
        centerPadding: '80px',
      },
    },
    {
      breakpoint: 680,
      settings: {
        centerMode: true,
        centerPadding: '35px',
      },
    },
  ],
});
function detailFocus() {
  $('.js-list-slide')
    .off('afterChange')
    .on('afterChange', function (event, slick, currentSlide, nextSlide) {
      if ($('body').attr('data-mobile') == 'true') {
        var dataSet = $('.detail-list').offset().top;
        $('html, body').animate(
          {
            scrollTop: dataSet,
          },
          500
        );
      }
    });
}

$('.js-list-slide').on(
  'beforeChange',
  function (event, slick, currentSlide, nextSlide) {
    var nowNum = nextSlide + 1;
    var thumbnailItem = $('.detail-thumbnail__item');
    var itemMax = thumbnailItem.length;
    if (nowNum == itemMax) {
      nowNum = 1;
    }
    thumbnailItem
      .eq(nowNum)
      .addClass('is-active')
      .siblings()
      .removeClass('is-active');
  }
);

$('.js-list-slide').on(
  'swipe',
  function (event, slick, currentSlide, nextSlide) {
    //detailFocus();
  }
);

$('.js-thumbnail-move').on('click', function (e) {
  e.preventDefault();
  var thumbnailItem = $(this).closest('.detail-thumbnail__item');
  var thumbnailNum = thumbnailItem.index() - 1;
  $('.js-list-slide').slick('slickGoTo', thumbnailNum);
  //detailFocus();
});

$('#frmMainSearch').on('submit', function () {
  $('#mainHiddenInputSearch').val($('#main_keyword').val());
  if ($('#mainHiddenInputSearch').val().length == 1) {
    alert('검색어는 최소 2자이상 입력하세요!');
    return false;
  }
});

$.fnSubmit = function (searchword) {
  $('#main_keyword').val(searchword);
  $('#frmMainSearch')
    .attr({ action: '/search/searchResult.php', method: 'post' })
    .submit();
};

// 모바일 전송
$('.mobileSend').click(function () {
  $('#mobileForm, .formClose').removeClass('hide');
});

// 모바일 전송창 닫기
$('.formClose').click(function () {
  $('#mobileSend').val('');
  $('#mobileForm, .formClose').addClass('hide');
});

$('#btnSmsSend').click(function () {
  gtag('event', '연락처전송', {
    event_category: '연락처전송',
    event_label: '연락처전송',
  });
  $.post(
    'locationSmsSend.php',
    { phone: $('#mobileSend').val() },
    function (data) {
      if ($.trim(data) == 'success') {
        //$.ajax({url:'/conversion/sms.php'});
        try {
          _PL('https://www.banobagi.com/conversion/sms.php');
        } catch (e) {}

        mobConv();

        if (typeof wcs != 'undefined') {
          if (!wcs_add) var wcs_add = {};
          wcs_add['wa'] = 's_4f45621f2c8e';
          var _nasa = {};
          _nasa['cnv'] = wcs.cnv('4', '1');
          wcs_do(_nasa);
        }
        alert(
          '전송이 완료되었습니다. \n\r 약도가 전송되지 않았다면 다시 시도해주세요.'
        );
        $('.formClose').trigger('click');
      } else {
        alert('전송에 실패하였습니다. \n\r 다시 시도해주세요');
        $('#mobileSend').val('');
      }
    }
  );
});

//스크롤 모션 (real,location)
$(function () {
  $('.js-main-video').each(function () {
    var $this = $(this);
    var n = function () {
      if (
        $this.offset().top < $(window).scrollTop() + $(window).height() / 1.3 &&
        $this.offset().top > $(window).scrollTop() - $this.height()
      ) {
        $this.addClass('is-active');

        // 윈도우 스크롤 이벤트 함수 n 실행 종료
        // $(window).unbind("scroll", n)
      } else {
        // $this.removeClass('is-active');
      }
    };

    var b = function () {
      // $this 위치값 계산
      if (
        $this.offset().top < $(window).scrollTop() + $(window).height() / 1.3 &&
        $this.offset().top > $(window).scrollTop() - $this.height()
      ) {
        // 원본 이미지 교체
        $this.addClass('is-active');

        // 윈도우 스크롤 이벤트 함수 n 실행 종료
        // $(window).unbind("scroll", n)
      } else {
        $this.removeClass('is-active');
      }
    };
    // 윈도우 스크롤 이벤트로 함수 n 지속 실행
    $(window).on('scroll', n);
    // $this 위치값 계산
    $(window).on('load', b);
  });
});

//의료진 내용보기
$.fnMedicalView = function (val1, val2) {
  $('#frmDetailPart #category').val(val2);
  $('#frmDetailPart #ID').val(val1);
  $('#frmDetailPart')
    .attr({
      action: '/introduce/introduceMedical.php',
      target: 'popWin',
      method: 'post',
    })
    .submit();
};

// intro slider
var intro_slide = $('.js-intro-slide');
var intro_slider_bar = $('.intro-slide__bar');
var intro_slide_count = $('.intro-slide__counter');
var intro_slide_timer = 5;
var tick, percentTime;

intro_slide.on('init reInit', function (event, slick, currentSlide, nextSlide) {
  var slideNum = (currentSlide ? currentSlide : 0) + 1;
  intro_slide_count.text(slideNum + ' / ' + slick.slideCount);

  $('.intro-slide__item.slick-current')
    .find('.intro-slide__tit')
    .addClass('animated fadeInUp');
  $('.intro-slide__item.slick-current')
    .find('.intro-slide__txt')
    .addClass('animated fadeInUp delay-05s');
});
intro_slide.on(
  'beforeChange',
  function (event, slick, currentSlide, nextSlide) {
    startProgressbar();

    var slideNum = nextSlide + 1;
    +intro_slide_count.text(slideNum + ' / ' + slick.slideCount);

    $('.intro-slide__tit').removeClass('animated fadeInUp');
    $('.intro-slide__txt').removeClass('animated fadeInUp delay-05s');
  }
);
intro_slide.on('afterChange', function (event, slick, currentSlide) {
  $('.intro-slide__item.slick-current')
    .find('.intro-slide__tit')
    .addClass('animated fadeInUp');
  $('.intro-slide__item.slick-current')
    .find('.intro-slide__txt')
    .addClass('animated fadeInUp delay-05s');
});

intro_slide.slick({
  infinite: true,
  arrows: false,
  dots: false,
  autoplay: true,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplaySpeed: intro_slide_timer * 1000,
  fade: true,
});

startProgressbar();

function startProgressbar() {
  resetProgressbar();

  percentTime = 0;
  tick = setInterval(interval, 10);
}

function interval() {
  percentTime += 1 / (intro_slide_timer + 0.1);

  intro_slider_bar.css({
    height: percentTime + '%',
  });

  if (percentTime >= 100) {
    intro_slide.slick('slickNext');

    startProgressbar();
  }
}

function resetProgressbar() {
  intro_slider_bar.css({
    height: 0 + '%',
  });

  clearTimeout(tick);
}
