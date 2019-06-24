(function ($) {
    $(document).ready(function () {
        $('.item').on('click', function (elem) {
            elem.preventDefault();

            $('.item').removeClass('_active');
            $(this).addClass('_active');

            $('.container').hide();
            $($(this).attr('href')).show();
        });
    });
})(jQuery);