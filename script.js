// SWIPER

const swiper = new Swiper(".mySwiper", {

    loop: true,

    autoplay: {

        delay: 3000,
    },

    pagination: {

        el: ".swiper-pagination",
    },
});

// MENU MOBILE

const mobileBtn =
    document.querySelector('.mobile-btn');

const menu =
    document.querySelector('.menu');

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