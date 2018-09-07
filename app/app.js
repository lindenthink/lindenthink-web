import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'

import './public/img/logo.png'
import './public/img/app-tool.jpg'
import './public/img/app-life.jpg'
import './public/img/app-enjoy.jpg'
import './public/img/app-fund.jpg'

import './app.css'

window.addEventListener('scroll', function () {
    if (document.body.scrollTop >= 80 && !$('nav').hasClass('fixed-top')) {
        $('nav').addClass('fixed-top');
        return;
    }
    if (document.body.scrollTop < 80 && $('nav').hasClass('fixed-top')) {
        $('nav').removeClass('fixed-top');
    }
});

