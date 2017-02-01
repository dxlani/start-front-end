let fs = require('fs');

fs.mkdir('./newdir', (err) => {
    if (err) throw err;
    console.log('创建成功');
})
fs.writeFile('./newdir/novel.txt', 'cnm', (err) => {
    if (err) throw err;
    console.log('写进去了');
})
fs.readFile('./newdir/novel.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log(data);    
})