let student = require('./student.js')
let teacher = require('./teacher.js')

module.exports = (teacherName, students) => {
    teacher.add(teacherName);
    students.forEach(el => student.add(el))
}