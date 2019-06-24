// jQuery(document).ready(function ($) {

document.addEventListener('DOMContentLoaded', () => {

    $('.nav_menu-burger').on('click', function () {
        $(this).toggleClass('_expanded');
        if($('.nav1').hasClass('_active')){
            $('.nav1').css({
                display: 'flex'
            });
            $('.nav1').removeClass('_active');
        } else {
            $('.nav1').css({
                display: 'none'
            });
            $('.nav1').addClass('_active');
        }
    });

    $('._inner1').on('click', function () {
        if ($('._inner1').hasClass('_active')) {
            $('._inner1').removeClass('_active');
            $('._text1').css({
                display: 'none',
                'font-size': '0'
            });
            $('._first-not').css({
                width: '90px'
            });
        } else {
            $('._inner1').addClass('_active');
            $('._text1').css({
                display: 'block',
                'font-size': '16px'
            });
            $('._first-not').css({
                width: '350px'
            });
        }
    });

    $('._inner2').on('click', function () {
        if ($('._inner2').hasClass('_active')) {
            $('._inner2').removeClass('_active');
            $('._text2').css({
                display: 'none'
            });
            $('._last-not').css({
                width: '90px'
            });
        } else {
            $('._inner2').addClass('_active');
            $('._text2').css({
                display: 'block'
            });
            $('._last-not').css({
                width: '350px'
            });
        }
    });

    $('._review').slick({
        arrows: true,
        dots: true,
        autoplay: true,
        autoplaySpeed: 2000
    });

    $('._team').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
        dots: false,
        responsive: [
            {
                breakpoint: 960, // tablet breakpoint
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768, // mobile breakpoint
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    $("#_nav, #_nav1").on("click", "a", function (event) {
        event.preventDefault();
        let id = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({ scrollTop: top }, 990);
    });

    $(function () {
        $(document).scroll(function () {
            if (200 < $(this).scrollTop()){
                $("#_scrollup").fadeIn();
            } else{
                $("#_scrollup").fadeOut();
            } 
            if ($(".footer").offset().top > $(this).scrollTop() + $(window).height() - $("#_scrollup").height()) {
                $("#_scrollup").css({
                    bottom: "50px"
                });
            } else {
                $("#_scrollup").css({
                    bottom: $(this).scrollTop() + $(window).height() - $(".footer").offset().top + 30
                });
            } 
        });
        $("#_scrollup").click(function () { $('body,html').animate({ scrollTop: 0 }, 400); return false; });
    });
});