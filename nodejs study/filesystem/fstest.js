let fs = require('fs');

let foo = fs.exists('./newdir', () => {
    return true;
});
console.log(foo);