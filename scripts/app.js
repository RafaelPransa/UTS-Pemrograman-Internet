const header = document.getElementsByTagName('header');
const nav = document.querySelector('header nav');
const startNav = document.querySelector('header nav .start-nav');
const midNav = document.querySelector('header nav .mid-nav');
const endNav = document.querySelector('header nav .end-nav');
const mobileNav = document.querySelector('main .mobile-nav');

console.log('adad');

// Memindahkan ke parent yang lain
function moveNavElements () {
    if (window.innerWidth < 768) {
        midNav.style.display = 'none';
    } else {
        midNav.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', moveNavElements);
window.addEventListener('resize', moveNavElements);
