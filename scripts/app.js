document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.header-hero-content-wrapper header nav');
    const wrapperHeader = document.querySelector('.header-hero-content-wrapper');
    const menuNavA = document.querySelectorAll('.header-hero-content-wrapper header nav .mid-nav ul li a');
    const hero = document.querySelector('.header-hero-content-wrapper #hero');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            nav.classList.add('nav-scroll');
            hero.classList.add('hero-scroll');
            menuNavA.forEach(menus => {
                menus.classList.add('color-a-scroll');
            });
        } else {
            nav.classList.remove('nav-scroll');
            hero.classList.remove('hero-scroll');
            menuNavA.forEach(menus => {
                    menus.classList.remove('color-a-scroll');
                });
        }
    });
    
    function checkNavStatus() {
        const isNavScrolled = nav.classList.contains('nav-scroll');
        if (isNavScrolled) {
            wrapperHeader.style.paddingTop = '100px';
        } else {
            wrapperHeader.style.paddingTop = '20px';
        }
    }
    window.addEventListener('scroll', checkNavStatus);
    checkNavStatus();
});
