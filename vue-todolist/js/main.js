var todoStorage = {
    // 常量keyName
    STORAGE_KEY: 'todolist-vue',
    // 获取localStorage数据
    fetch: function () {
        var data = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
        data.forEach(function (element, index) {
            element.id = index;
        });
        todoStorage.uid = data.length;
        return data;
    },
    // 存储数据
    save: function (data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
}


// 过滤方法
var filters = {
    all: function (todos) {
        return todos;
    },
    active: function (todos) {
        return todos.filter(function (element) {
            return !element.completed;
        })
    },
    completed: function (todos) {
        return todos.filter(function (element) {
            return element.completed;
        });
    }
}

var app = new Vue({
    el: '.todoapp',
    data: {
        todos: todoStorage.fetch(),
        newTodo: '',
        beforeEditCache: null,
        editedTodo: null,
        visibility: 'all'
    },
    methods: {
        // enter添加
        addTodo: function () {
            var value = this.newTodo && this.newTodo.trim();
            if (!value) {
                return
            }
            this.todos.push({
                id: todoStorage.uid++,
                title: value,
                completed: false
            })
            this.newTodo = '';
        },
        // 点击删除
        removeTodo: function (todo) {
            this.todos.splice(this.todos.indexOf(todo), 1);
        },
        // 双击编辑
        editTodo: function (todo) {
            this.beforeEditCache = todo.title;
            this.editedTodo = todo;
        },
        // 失焦及enter完成编辑
        doneEdit: function (todo) {
            if (!this.editedTodo) {
                return
            }
            todo.title = todo.title.trim();
            if (!todo.title) {
                this.removeTodo(todo);
            }
            this.editedTodo = null;

        },
        // esc退出编辑
        cancelEdit: function (todo) {
            todo.title = this.beforeEditCache;
            this.editedTodo = null;
        },
        removeCompleted: function () {
            this.todos = filters.active(this.todos);
        }
    },
    // 自定义指令
    directives: {
        // 自动focus
        focus: {
            update: function (el, binding) {
                if (binding.value) {
                    el.focus();
                }
            }
        }
    },
    // 缓存计算属性
    computed: {
        // 过滤后的todos
        filteredTodos: function () {
            return filters[this.visibility](this.todos);
        },
        // 剩下的任务数
        remaining: function () {
            return filters.active(this.todos).length;
        },
        // 选择所有
        allDone: {
            // 读取，默认
            get: function () {
                return false;
            },
            // 设值
            set: function (value) {
                this.todos.forEach(function (todo) {
                    todo.completed = value;
                });
            }
        }
    },
    watch: {
        // 监控todos,数据改变时save到loacalStorage
        todos: {
            handler: function (todos) {
                todoStorage.save(todos);
            },
            // 深度监控内部数据变化
            deep: true
        }
    }
})

// 网址路由
function onHashChange() {
    var visibility = window.location.hash.replace(/#?/, '');
    if (filters[visibility]) {
        app.visibility = visibility;
    } else {
        window.location.hash = '';
        app.visibility = 'all';
    }
}

window.addEventListener('hashchange', onHashChange);