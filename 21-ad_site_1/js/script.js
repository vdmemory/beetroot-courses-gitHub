const NAV_OPEN = 'header_nav__open';

document.addEventListener('DOMContentLoaded', () => {
    const NAV = document.querySelector('._nav');

    document.querySelector('._navButton').addEventListener('click', () => {
        NAV.classList.add(NAV_OPEN);
    });

    document.querySelector('._close').addEventListener('click', () => {
        NAV.classList.remove(NAV_OPEN);
    });

    $('._review').slick({
        arrows: false,
        dots: true
    });

});



