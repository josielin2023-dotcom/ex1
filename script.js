$(document).ready(function () {

    const $track = $('.track');
    const $cards = $track.find('.article');
    const $viewport = $('.viewport');
    const $prev = $('.prev');
    const $next = $('.next');
    const $dots = $('.dots');

    let perPage = 3;
    let pages = 1;
    let page = 0;

    // 依視窗寬度決定每頁幾張(要和 CSS 斷點一致)
   function getPerPage() {
    const w = window.innerWidth;
    if (w <= 767) return 1;     // 手機
    if (w <= 1024) return 2;    // 平板
    return 3;                   // 桌機
}

    // 重新計算頁數、重建小圓點
    function build() {
        perPage = getPerPage();
        pages = Math.ceil($cards.length / perPage);
        page = Math.min(page, pages - 1);   // 縮放後頁碼不要超出範圍

        document.documentElement.style.setProperty('--per-page', perPage);

        $dots.empty();
        for (let i = 0; i < pages; i++) {
            $('<span></span>')
                .on('click', function () {
                    page = i;
                    update();
                })
                .appendTo($dots);
        }
        update();
    }

    function update() {
        $track.css('transform', 'translateX(-' + (page * 100) + '%)');
        $prev.prop('disabled', page === 0);
        $next.prop('disabled', page === pages - 1);
        $dots.children().removeClass('active').eq(page).addClass('active');
    }

    $prev.on('click', function () {
        if (page > 0) {
            page--;
            update();
        }
    });

    $next.on('click', function () {
        if (page < pages - 1) {
            page++;
            update();
        }
    });

    // 手機左右滑動
    let startX = 0;
    $viewport.on('touchstart', function (e) {
        startX = e.originalEvent.touches[0].clientX;
    });
    $viewport.on('touchend', function (e) {
        const diff = e.originalEvent.changedTouches[0].clientX - startX;
        if (diff < -50 && page < pages - 1) {
            page++;
            update();
        } else if (diff > 50 && page > 0) {
            page--;
            update();
        }
    });

    // 視窗大小改變時,只在「每頁張數」變動時才重建
    $(window).on('resize', function () {
        if (getPerPage() !== perPage) {
            build();
        }
    });

    build();

});