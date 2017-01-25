let http = require('http');
let cheerio = require('cheerio');
let url = "http://www.imooc.com/learn/348";

function printCourseInfo(courseData) {
    courseData.forEach(item => {
        console.log(item.chapterTitle);
        item.video.forEach(video => console.log("[" + video.id + "]" + video.title));
    });
}

function filterCourse(html) {
    let $ = cheerio.load(html);
    let courseData = [];

    let chapters = $('.chapter');
    chapters.each((item) => {
        let chapter = $(this);
        let chapterTitle = chapter.find('strong').text().replace(/\s*\r\n\s*/g, "");
        let chapterData = {
            chapterTitle: chapterTitle,
            video: []
        };
        let videos = chapter.find('.video').children('li');
        videos.each((item) => {
            let title = $(this).find('.J-media-item').text().replace(/\s*\r\n\s*/g, "");
            let id = $(this).find('.J-media-item').attr("href").split("video/")[1];
            chapterData.video.push({
                title: title,
                id: id
            });

        })
        courseData.push(chapterData);
    });

    return courseData;
}

http.get(url, res => {
    let html = '';
    res.on('data', data => html += data);
    res.on('end', () => {
        let courseData = filterCourse(html);
        printCourseInfo(courseData);
    });
}).on('error', function () {
    console.log('获取数据失败');
});