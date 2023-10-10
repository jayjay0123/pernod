$(function(){
  // 브라우저 해상도가 변경되면 미디어쿼리 적용하기
  // 또는 브라우저를 확대, 축소해도 홈페이지 비율 유지하기
  $.AdjustZoom = function(options) {
    let option = { zoomRatio : 100 };
    $.extend(option, options);
      // 브라우저 배율이 100% 가 아닌 경우 처리
      if(screen.logicalXDPI != screen.deviceXDPI) {
        try {
        //alert(screen.availWidth+", "+screen.logicalXDPI+", "+screen.deviceXDPI);
        let ratio = screen.logicalXDPI / screen.deviceXDPI;
        let ratio_reverse = screen.deviceXDPI / screen.logicalXDPI;
        $('body').css('zoom', ( ratio * option.zoomRatio)+'%');
        $('body').width(screen.availWidth * ratio_reverse );
        } catch(e){
          alert("브라우저 배율 보정 중 오류가 발생하였습니다. 창을 닫은 후 다시 열어 주시기 바랍니다.");
        }
      }
  };

  //내비게이션(GNB)
  //만약 윈도우의 가로길이가 1280이상이면 PC버전으로 메뉴가 나타나고, 윈도우의 가로길이가 1280미만이면 모바일 버전 메뉴가 나타남
  if($(window).width() >=1280){
    //PC 버전
    //주메뉴에서 마우스 오버하면 서브메뉴와 배경 나타남
    $('nav > ul > li').hover(function(){
      $('.sub').stop().slideDown(300);
      $('.sub_bg').addClass('active');
      $('header').addClass('minimize');
    });
    //header에서 마우스 아웃하면 서브메뉴와 배경 사라짐
    $('header').mouseleave(function(){
      $('.sub').stop().slideUp(300);
      $('.sub_bg').removeClass('active');
    });
  } else{

    //모바일 버전
    //주메뉴에 클릭이벤트 설정
    $('nav > ul > li > a').click(function(){
    //a태그의 다음 객체인 ul.sub가 slideToggle됨
      $(this).next().slideToggle();
      //클릭하지 않은 a객체의 ul.sub는 slideUp됨
      $('nav > ul > li > a').not(this).next().slideUp();
      //클릭한 주메뉴에 active클래스를 추가하거나 제거
      $(this).toggleClass('active');
      //클릭하지 않은 주메뉴는 active제거
      $('nav > ul > li > a').not(this).removeClass('active');
      return false;
    });
    //header의 메뉴 버튼을 클릭하면 내비게이션 나타나고, 다시 클릭하면 내비게이션 들어감
    let menu_sw=0;
    $('.menu_btn').click(function(e){
      e.preventDefault();
      if(menu_sw==0){
        menu_sw=1;
        $('nav').animate({'right':0});
        $('header').addClass('minimize');
        $('html, body').css('overflow','hidden'); //화면 고정
      } else{
        menu_sw=0;
        $('nav').animate({'right':'-100%'});
        $('html, body').css('overflow-y','scroll'); //화면 고정 해제
      }
    });
  }
  
  //header 애니메이션
  //스크롤 내리면 header사라지고, 스크롤 올리면 header 나타남
  function minimize_header() {
    //윈도우 객체를 $window변수에 저장
    let $window = $(window);
    //header 객체를 $header변수에 저장
    let $header = $('header');
    //dis_scroll변수를 선언하고 null(값 없음)으로 초기화
    let did_scroll = null;
    //현재 스크롤 이동값을 저장하는 변수를 선언하고 0으로 초기화
    let current_scroll = 0;
    //마지막 스크롤 이동값을 저장하는 변수를 선언하고 0으로 초기화
    let last_scroll = 0;
    //스크롤 이동값을 저장하는 변수를 선언하고 10으로 초기화
    let move_scroll = 10;
    //윈도우 객체에 스크롤 이벤트 설정
    $window.on('scroll', function(){
      //스크롤이벤트가 발생했으므로 did_scroll변수의 값을 true로 변경
      did_scroll = true;
      //만약 윈도우의 스크롤탑값이 header의 높이보다 크면
      if($window.scrollTop() > $header.height()){
        //header에 minimize클래스 추가
        $header.addClass('minimize');
        //그렇지 않으면
        } else{
        //header에서 minimize클래스 제거
          $header.removeClass('minimize');
        }
    });
    //만약 스크롤 이벤트가 발생했고(did_scroll=true)
    //body객체가 open-menu클래스를 가지고 있지 않다면
    //has_scrolled함수 호출하고, did_scroll값을 false로 변경
    setInterval(function(){
      if(did_scroll && !$('body').hasClass('open-menu')){
        has_scrolled();
        did_scroll = false;
      }
    }, 50);

    //has_scrolled함수 선언
    function has_scrolled() {
      //윈도우의 스크롤탑 값을 current_scroll변수에 저장
      current_scroll = $(this).scrollTop();
      //만약 마지막 스크롤이동값에서 현재 스크롤이동값을 뺀 양수값이 move_scroll값보다 작으면 함수 빠져나감(return)
      if (Math.abs(last_scroll - current_scroll) <= move_scroll) 
        return;
      //만약 현재 스크롤이동값이 마지막 스크롤이동값보다 크면(스크롤을 아래로 이동하면)
      if (current_scroll > last_scroll){
        //현재 스크롤이동값이 10 보다 크면 header 사라짐
        if (current_scroll > 10) {
            //$header.addClass("active");
            gsap.to($header, 0.4, {
                    autoAlpha: 0,
                    y: -$header.outerHeight(),
                    ease: Power3.easeOut
            });
        }
        //스크롤을 위로 이동하면 header 나타남
        } else{
          //$header.removeClass("active");
          gsap.to($header, 0.4, { autoAlpha: 1, y: 0, ease: Power3.easeOut });
        }
        //현재 스크롤 이동값을 last_scroll변수에 저장
        last_scroll = current_scroll;
    }
  }
  //함수 호출
  minimize_header();
    
  //메인 슬라이드(클래스 이름이 swiper인 객체)
  const swiper = new Swiper('.main', {
    autoplay: {
      delay:3000, //3초마다 자동실행
      disableOnInteraction: false,
    },
    // 무한루프
    loop: true,
    // 페이지네이션(동그란 버튼)
    pagination: {
      el: '.main .swiper-pagination',
    }
  });
  const swiper2 = new Swiper('.new', {
    slidesPerView:1.5,
    spaceBetween:20,
    autoplay:{
      delay:3000,
      disableOnInteraction: false,
    },
    //반응형 breakpoints
    breakpoints: {
      360: {
        slidesPerView: 1.5,
        spaceBetween: 20
      },
      480: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1280:{
        slidesPerView: 2,
        spaceBetween: 20
      },
    },
    loop: true,      
    // 페이지네이션(동그란 버튼)
    pagination: {
      el: '.new .swiper-pagination',
      type:'progressbar'
    },
    // prev, next 버튼
    navigation: {
      nextEl: ".sec3 .swiper-button-next",
      prevEl: ".sec3 .swiper-button-prev",
    },
  });
  const swiper3 = new Swiper('.save', {
    slidesPerView:1.5,
    spaceBetween:20,
    autoplay:{
      delay:3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      360: {
        slidesPerView: 1.5,
        spaceBetween: 20
      },
      480: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1280:{
        slidesPerView: 2,
        spaceBetween: 20
      },
    },
    loop: true,      
    pagination: {
      el: '.save .swiper-pagination',
      type:'progressbar'
    },
    navigation: {
      nextEl: ".sec4 .swiper-button-next",
      prevEl: ".sec4 .swiper-button-prev",
    },
  });

  //스크롤 내릴 때마다 section안의 자식 콘턴츠들이 서서히 나타나는 애니메이션
  $(window).scroll(function(){
    //윈도우의 scrollTop값을 winTop변수에 저장
    let winTop = $(this).scrollTop();
    //.scrollSet 영역 개수 만큼 반복하는 메서드(each())
    $('.scrollSet').each(function(){
    //$(this) : .scrollSet(인덱스 0~4)
    //offset().top : .section의 top값
      let secTop = $(this).offset().top-500;
      //section의 bottom값
      let secBottom = secTop+$(this).height();
      //만약 secTop이 winTop보다 작고, secBottom이 winTop보다 크면 section의 자식객체에 active추가
      if(secTop < winTop && secBottom > winTop){
        $(this).find('.ani').addClass('active');
      }
    });       
  });

  //sec5영역의 count animation
  function count(element, start, end, duration) {
    let current = start;
    const range = end - start;
    const increment = range / (duration / 10);
    const stepTime = 50; // 10ms 마다 증가하도록 설정
    let timer = setInterval(function() {
      current += increment;
        if (current >= end) {
          clearInterval(timer);
          current = end;
        }
      element.textContent = formatNumber(current, end);
    }, stepTime);
  }
  function formatNumber(number, end) {
    if (Number.isInteger(end)) {
      return number.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    } else{
      return number.toFixed(1);
    }
  };

  // 스크롤 이벤트 리스너
  window.addEventListener('scroll', function(){
    const countArea = document.getElementById('count-area');
    const countAreaPosition = countArea.getBoundingClientRect().top;
    const screenPosition = window.innerHeight;

    if (countAreaPosition < screenPosition / 2) { // 요소가 반이상 보였을 때 실행
      const count1 = document.getElementById('count-item1');
      count(count1, 0, 2, 300);
      const count2 = document.getElementById('count-item2');
      count(count2, 0, 75, 300);
      const count3 = document.getElementById('count-item3');
      count(count3, 0, 160, 300);
      const count4 = document.getElementById('count-item4');
      count(count4, 0, 18500, 300);
      // 이벤트 리스너 삭제
      window.removeEventListener('scroll', arguments.callee);
    }
  });

    //family_site
    // let sw=0; 
    //   $('.family_site > a').click(function(e){
    //     //a태그의 링크 기능을 막는 기능
    //     e.preventDefault();
    //     //만약 sw변수의 값이 0이면 .family_list 나타나고, sw변수의 값을 1로 변경
    //     if(sw==0){
    //       sw=1;
    //       $('.family_list').slideDown();
    //       $('.family_site > a').addClass('active');
    //     //sw변수의 값이 0이 아니면 .family_list 들어가고, sw변수의 값을 0으로 변경
    //     }else{
    //       sw=0;
    //       $('.family_list').slideUp();
    //       $('.family_site > a').removeClass('active');
    //     }
    //   });      
    
    // $('.family_site > a').on('click', function(e){
    //     e.preventDefault();
    //       if($('.family_site > a').hasClass('active')){
    //         $('.family_list').slideUp();
    //         $('.family_site > a').removeClass('active');
    //       }else {
    //         $('.family_list').slideDown();
    //         $('.family_site > a').addClass('active');
    //       }
    //   });

  $('.family_site > a').on('click', function(e){
    e.preventDefault();
    $('.family_list').slideToggle();
    $('.family_site > a').toggleClass('active');
  });

  //top버튼
  $('.top').click(function(){
    $('html, body').animate({scrollTop:0});
  });

});


