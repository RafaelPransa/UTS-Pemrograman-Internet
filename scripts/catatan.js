document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('#action-bar button');
    const targetParent = document.querySelector('#action-bar .btn-add-mobile');
    const container = document.querySelector('#action-bar .container')

    function repositionButton() {
        if (window.innerWidth <= 430) {
            if (button.parentNode === container) {
                 targetParent.appendChild(button); // Pindahkan elemen
            }
        } else {
                 container.appendChild(button); // Kembalikan elemen
            
        }
    }

    window.addEventListener('resize', repositionButton);
    repositionButton(); // Jalankan sekali saat dimuat
});