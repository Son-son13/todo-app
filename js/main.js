//Find elements on the page
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

console.log(tasksList);
let tasks = [];
if (localStorage['tasks']) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList()

//actions with tasks
form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask(event) {
    //Cancle sending of the form
    event.preventDefault();

    //take the text from the form
    const taskText = taskInput.value;
    console.log(taskText);

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    tasks.push(newTask);
    renderTask (newTask);

    //clear the form after adding info
    taskInput.value = "";
    taskInput.focus();

    //Check EmptyList
    checkEmptyList();

    //save to LS
    saveToLocalStorage();
}

function deleteTask(event){
    if (event.target.dataset.action !== 'delete') return;

    console.log('DELETE!!!');
    const parentNode = event.target.closest('.list-group-item');


    //find id and remove from the LS
    const id = parentNode.id;

    const index = tasks.findIndex((task) => task.id == id);

    //Let's delete it from array
    tasks.splice(index, 1);


    parentNode.remove();

    //check EmptyList
    checkEmptyList();

    //save to LS
    saveToLocalStorage();
}

function doneTask(event) {
    //check if the click was one the right button
    if (event.target.dataset.action !== 'done') return;

    const parentNode = event.target.closest('.list-group-item');
    const taskTitle = parentNode.querySelector('.task-title');
    
    /*taskTitle.classList.toggle('task-title--done');
    /*MINE*/
    parentNode.classList.toggle('card-done');
    /*MINE*/

    //change done
    const task = tasks.find((task) => task.id == parentNode.id);
    task.done = !task.done;

    //save to LS
    saveToLocalStorage();
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
        
    }
    if (tasks.length > 0) {
        const emptyListEL = document.querySelector('#emptyList');
        if (emptyListEL) {
            emptyListEL.remove();
        }
        
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask (task) {
    console.log(task.done, tasks);
    const cssClass = task.done ? 'task-title tasktitle-done' : 'task-title';
    const cssClassCard = task.done ? 'list-group-item d-flex justify-content-between task-item card-done' : 'list-group-item d-flex justify-content-between task-item';

    //add the html code for the form
    const taskHTML = `<li id="${task.id}" class="${cssClassCard}">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

    //Add the info on the page
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}