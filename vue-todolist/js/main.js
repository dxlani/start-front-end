var app = new Vue({
    data: {
        todos: [],
        newTodo: '',
        uid: 0
    },
    methods: {
        addTodo: function () {
            console.log('heheh');
            var value = this.newTodo && this.newTodo.trim();
            if (!value) {
                return
            }
            this.todos.push({
                id: this.uid++,
                title: value,
                completed: false
            })
            this.newTodo = '';
        },
        removeTodo: function (todo) {
            // this.todos.splice(this.todos.indexOf(todo), 1)
            this.todos.splice(this.todos.indexOf(todo), 1);
        }

    },
    directives: {
        'todo-focus': function (el, value) {
            if (value) {
                el.focus()
            }
        }
    }
})

// mount
app.$mount('.todoapp');