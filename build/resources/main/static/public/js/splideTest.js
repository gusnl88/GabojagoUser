document.addEventListener( 'DOMContentLoaded', function () {
    new Splide( '.splide', {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '1rem',
        autoplay: true,
        interval: 3000,
    } ).mount();
} );