export function initUI() {
    // --- SWIPER ---
    if (typeof Swiper !== 'undefined') {
        new Swiper(".mySwiper", {
            loop: true,
            autoplay: {
                delay: 3000,
            },
            pagination: {
                el: ".swiper-pagination",
            },
        });

        // Configuração específica para as Reuniões com rolagem lateral contínua e lenta
        new Swiper(".reunioesSwiper", {
            loop: true,
            freeMode: true,
            speed: 5000, // Ajuste para mais ou menos lento
            slidesPerView: "auto",
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
        });
    } else {
        console.warn("Swiper não encontrado.");
    }

    // --- MENU MOBILE ---
    const mobileBtn = document.querySelector('.mobile-btn');
    const menu = document.querySelector('.menu');

    if (mobileBtn && menu) {
        mobileBtn.addEventListener('click', () => {
            if (menu.style.display === 'flex') {
                menu.style.display = 'none';
            } else {
                menu.style.display = 'flex';
                menu.style.flexDirection = 'column';
                menu.style.position = 'absolute';
                menu.style.top = '70px';
                menu.style.right = '20px';
                menu.style.background = '#062b1f';
                menu.style.padding = '20px';
                menu.style.borderRadius = '15px';
            }
        });
    }
}
