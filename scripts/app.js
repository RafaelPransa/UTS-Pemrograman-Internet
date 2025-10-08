document.addEventListener('DOMContentLoaded', () => {
    
    const header = document.querySelector('.header-hero-content-wrapper header');
    const nav = document.querySelector('.header-hero-content-wrapper header nav');
    const wrapperHeader = document.querySelector('.header-hero-content-wrapper');
    const menuNavA = document.querySelectorAll('.header-hero-content-wrapper header nav .mid-nav ul li a');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            if (window.innerWidth > 992) {
                nav.classList.add('nav-transparent');
                nav.classList.add('nav-scroll');
                menuNavA.forEach(menus => {
                    menus.classList.add('color-a-scroll');
                });
            }
        } else {
            nav.classList.remove('nav-scroll');
            menuNavA.forEach(menus => {
                    menus.classList.remove('color-a-scroll');
                });
        }
    });
    
    function checkNavStatus() {
        const isNavScrolled = nav.classList.contains('nav-scroll');
        if (isNavScrolled) {
            if (window.innerWidth > 992) {
                wrapperHeader.style.paddingTop = '85px';
            }
        } else {
            wrapperHeader.style.paddingTop = '20px';
        }
    }
    window.addEventListener('scroll', checkNavStatus);
    checkNavStatus();

    
});
