let b1 = document.querySelector('.b1');
let b2 = document.querySelector('.b2');
let b3 = document.querySelector('.b3');

// function animate(ball, goal, callback) {
//     let timer = setInterval(() => {
//         let ml = parseInt(window.getComputedStyle(ball).marginLeft)
//         if (ml < goal) {
//             ml++
//         } else if (ml > goal) {
//             ml--
//         } else {
//             clearInterval(timer);
//             callback && callback();
//         }
//         ball.style.marginLeft = ml + 'px';
//     }, 13)
// }

// animate(b1, 100, () => {
//     animate(b2, 200, () => {
//         animate(b3, 300, () => {
//             animate(b3, 150, () => {
//                 animate(b2, 150, () => {
//                     animate(b1, 150)
//                 })
//             })
//         })
//     })
// })


function promiseAnimate(ball, goal) {
    return new Promise((resolve, reject) => {
        (function _animate() {
            let timer = setInterval(() => {
                let ml = parseInt(window.getComputedStyle(ball).marginLeft)
                if (ml < goal) {
                    ml++
                } else if (ml > goal) {
                    ml--
                } else {
                    clearInterval(timer);
                    resolve()
                }
                ball.style.marginLeft = ml + 'px';
            }, 13)
        })();
    })
}

promiseAnimate(b1, 100)
    .then(() => {
        return promiseAnimate(b2, 200)
    })
    .then(() => {
        return promiseAnimate(b3, 300)
    })
    .then(() => {
        return promiseAnimate(b3, 150)
    })
    .then(() => {
        return promiseAnimate(b2, 150)
    })
    .then(() => {
        return promiseAnimate(b1, 150)
    })