let http = require('http')
let cheerio = require('cheerio')
let url = 'http://www.imooc.com/learn/348'

http.get(url, res => {
    var html = '';
    res.on('data', data => html += data);
    res.on('end', () => {
        var courseData = filterCourse(html);
        printCourse(courseData);
    });
}).on('error', function () {
    console.log('获取数据失败');
});

function filterCourse(html) {
    let $ = cheerio.load(html);
    let courseData = [];
    let chapters = $('.chapter');
    chapters.each((index, el) => {
        let item = $(el)
        let chapterData = {
            chapterTitle: '',
            videos: []
        }
        chapterData.chapterTitle = item.find('strong').text()
        let lis = item.find('.video').children('li')
        lis.each((index, el) => {
            let self = $(el)
            let video = {
                vTitle: '',
                id: 0
            }
            video.vTitle = self.find('.J-media-item').text()
            video.id = self.attr('data-media-id')
            chapterData.videos.push(video)
        })
        courseData.push(chapterData)
    })
    return courseData
}

function printCourse(courseData) {
    courseData.forEach((el) => {
        console.log(el.chapterTitle)
        el.videos.forEach((item) => {
            console.log(`【${item.id}】${item.vTitle}`)
        })
    })
}