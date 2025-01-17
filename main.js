
const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector('[data-delete-list-button]');
const listDisplayContainer = document.querySelector('[data-list-display-container]');
const listTitleElement = document.querySelector('[data-list-title]');
const listCountElement = document.querySelector('[data-list-count]');
const listStringElement = document.querySelector('[data-list-string]');
const taskContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')

//namespace in local storage
const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";


let lists = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];

let selectedListId = window.localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);


clearCompleteTasksButton.addEventListener("click", e => {
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
    savaAndRender();
})

taskContainer.addEventListener("click", e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
        selectedTask.complete = e.target.checked;
        save();
        renderTaskCount(selectedList);
    }
})

newTaskForm.addEventListener("click", e => {
    e.preventDefault();
    const taskName = newTaskInput.value;
    if (taskName == null || taskName === '' || taskName === ' ')
        return;
    const task = createTask(taskName);
    newTaskInput.value = null;
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks.push(task);
    savaAndRender();
})

deleteListButton.addEventListener("click", e => {
    lists = lists.filter(list => list.id !== selectedListId);
    selectedListId = null;
    savaAndRender();
})

listsContainer.addEventListener("click", e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId;
        savaAndRender();
    }
})

newListForm.addEventListener("submit", e => {
    e.preventDefault();
    const listName = newListInput.value;
    if (listName == null || listName == '') // fix it later
        return;
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    savaAndRender();
})

function createTask(Name) {
    return { id: Date.now().toString(), name: Name, complete: false };
}

function createList(Name) {
    return { id: Date.now().toString(), name: Name, tasks: [] };
}

function savaAndRender() {
    save();
    render();
}

function save() {
    window.localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    window.localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
    clearElement(listsContainer);
    renderLists();

    const selectedList = lists.find(list => list.id === selectedListId);

    if (selectedListId == null) {
        listDisplayContainer.style.display = 'none';
    } else {
        listDisplayContainer.style.display = '';
        listTitleElement.innerText = selectedList.name;
        renderTaskCount(selectedList);
        clearElement(taskContainer);
        renderTasks(selectedList);
    }
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkbox = taskElement.querySelector("input");
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        const label = taskElement.querySelector("label");
        label.htmlFor = task.id;
        label.append(task.name);
        taskContainer.appendChild(taskElement);
    })
}

function renderTaskCount(selectedList) {
    const incompleteTasksCount = selectedList.tasks.filter(task => !task.complete).length;
    const taskString = incompleteTasksCount === 1 ? "Task" : "Tasks";
    listCountElement.innerText = incompleteTasksCount;
    listStringElement.innerText = `${taskString} Remaining`;
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement("li");
        //to identify which list is selected
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.innerText = list.name;
        if (list.id === selectedListId)
            listElement.classList.add("active-list");
        listsContainer.appendChild(listElement);
    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render();