let http = require('http')
var url="http://www.imooc.com/learn/348";
http.get(url, (res) => {
    // const statusCode = res.statusCode;
    // const contentType = res.headers['content-type'];

    // let error;
    // if (statusCode !== 200) {
    //     error = new Error(`Request Failed.\n` +
    //         `Status Code: ${statusCode}`);
    // } else if (!/^application\/json/.test(contentType)) {
    //     error = new Error(`Invalid content-type.\n` +
    //         `Expected application/json but received ${contentType}`);
    // }
    // if (error) {
    //     console.log(error.message);
    //     // consume response data to free up memory
    //     res.resume();
    //     return;
    // }
    res.setEncoding('utf8')
    let rawData = '';
    res.on('data', (chunk) => rawData += String(chunk));
    res.on('end', () => {
        try {
            console.log(rawData)
        } catch (e) {
            console.log(e.message)
        }
    })
}).on('error', (e) => console.log(`http.get error:${e.message}`))