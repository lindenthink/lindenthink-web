import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'

import './public/img/logo.png'
import './public/img/app-tool.jpg'
import './public/img/app-life.jpg'
import './public/img/app-enjoy.jpg'
import './public/img/app-fund.jpg'

import './app.css'

$('body').scroll(function () {
    console.info('scrolling...');
    if (document.body.scrollTop >= 100 && !$('nav').hasClass('fixed-top')) {
        $('nav').addClass('fixed-top');
    } else {
        if ($('nav').hasClass('fixed-top')) {
            $('nav').removeClass('fixed-top');
        }
    }
});