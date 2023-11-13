export default class Animate {
    static entrada(el) {
        setTimeout(() => {
            document.querySelector(el).classList.add('animated')
            document.querySelector(el).classList.add('pulse')
        }, 10);
    }

    static entrada2(el) {
        setTimeout(() => {
            document.querySelector(el).classList.add('animated')
            document.querySelector(el).classList.add('rubberBand')
        }, 10);
    }

    static entrada3(el) {
        setTimeout(() => {
            document.querySelector(el).classList.add('animated')
            document.querySelector(el).classList.add('fadeInLeft')
        }, 10);
    }

    static entrada4(el) {
        setTimeout(() => {
            document.querySelector(el).classList.add('animated')
            document.querySelector(el).classList.add('slideInUp')
        }, 10);
    }
    
    static salida(el) {
        document.querySelector(el).classList.add('animated')
        document.querySelector(el).classList.add('zoomOutDown')
    }

    static salida2(el) {
        document.querySelector(el).classList.add('animated')
        document.querySelector(el).classList.add('rotateOut')
    }

    static salida3(el) {
        document.querySelector(el).classList.add('animated')
        document.querySelector(el).classList.add('zoomOut')
    }

    static salida4(el) {
        document.querySelector(el).classList.add('animated')
        document.querySelector(el).classList.add('rollOut')
    }
}