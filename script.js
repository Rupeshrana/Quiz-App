
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedButton = document.getElementById('clearCompleted');

// State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Event Listeners
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
clearCompletedButton.addEventListener('click', clearCompleted);

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

// Functions
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        tasks.push(task);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;

        const checkbox = li.querySelector('.task-checkbox');
        const deleteBtn = li.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => toggleTask(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        taskList.appendChild(li);
    });
}

// Initial render

renderTasks(); 
