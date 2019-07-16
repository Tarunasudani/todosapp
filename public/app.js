$(document).ready(function(){
    $.getJSON("/api/todos")
    .then(addTodos)

    $('#todoInput').keypress(function(event){
        if(event.which == 13){
            createTodo();
        }
    });

    $('.list').on('click','li',function(){
        updateTodo($(this));
    })


    $('.list').on('click','span',function(e){
        var clickedId = $(this).parent().data('id');
        e.stopPropagation();
        $.ajax({
            method : 'DELETE',
            url : '/api/todos/' + clickedId
        })
        .then(function(data){
            $(this).parent().remove();
        });
    })
});

function addTodos(todos){
    todos.forEach(function(todo){
       addtodo(todo);
    });
}

function addtodo(todo){
    var newTodo = $('<li class="task">'+ todo.name + '<span>X</span></li>');
    newTodo.data('id', todo._id);
    newTodo.data('completed',todo.completed );
    if(todo.completed){
        newTodo.addClass("done");
    }
    $('.list').append(newTodo);
}

function createTodo(){
    var userinpt = $('#todoInput').val();
    $.post('/api/todos',{name: userinpt})
    .then(function(newtodo){
        $('#todoInput').val('');
        addtodo(newtodo);
    })
    .catch(function(err){
        console.log(err);
    })
}

function updateTodo(todo){
    var  isDone = !todo.data('completed');
    var updateData = {completed: isDone}
    $.ajax({
        method : 'PUT',
        url : '/api/todos/' + todo.data('id'),
        data : updateData
    })
    .then(function(updatetodo){
        todo.toggleClass("done");
        todo.data('completed',isDone);
    })
}