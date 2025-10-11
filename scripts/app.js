document.addEventListener('DOMContentLoaded', () => {
    
    const header = document.querySelector('.header-hero-content-wrapper header');
    const nav = document.querySelector('.header-hero-content-wrapper header nav');
    const wrapperHeader = document.querySelector('.header-hero-content-wrapper');
    const menuNavA = document.querySelectorAll('.header-hero-content-wrapper header nav .mid-nav ul li a');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            if (window.innerWidth > 430) {
                header.classList.add('nav-transparent');
                header.classList.add('nav-scroll');
                menuNavA.forEach(menus => {
                    menus.classList.add('color-a-scroll');
                });
            }
        } else {
            header.classList.remove('nav-scroll');
            menuNavA.forEach(menus => {
                    menus.classList.remove('color-a-scroll');
                });
        }
    });
    
    function checkNavStatus() {
        const isNavScrolled = nav.classList.contains('nav-scroll');
        if (isNavScrolled) {
            if (window.innerWidth > 430) {
                wrapperHeader.style.paddingTop = '85px';
            }
        } else {
            wrapperHeader.style.paddingTop = '20px';
        }
    }
    window.addEventListener('scroll', checkNavStatus);
    checkNavStatus();

    // GSAP
    gsap.fromTo('body header', {
        y: -200, opacity: 0
    }, { 
        y: 0, opacity: 1, duration: 1
    });
    
    gsap.fromTo('body .header-hero-content-wrapper #hero', {
        y: 200, opacity: 0
    }, {
        y: 0, opacity: 1, duration: 1
    });

    gsap.fromTo('body .header-hero-content-wrapper #hero .hero-content', {
        x: -200, opacity: 0
    }, {
        x: 0, opacity: 1, delay: 1
    });
    gsap.fromTo('body .header-hero-content-wrapper #hero .hero-illustration', {
        x: 200, opacity: 0
    }, {
        x: 0, opacity: 1, delay: 1
    });
});
