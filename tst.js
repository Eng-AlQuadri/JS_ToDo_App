

const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector('[data-new-list-form');
const newListInput = document.querySelector('[data-new-list-input');


const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";


let lists = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = window.localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);


listsContainer.addEventListener("click", e => {
    if (e.target.tagName.toLowerCase() === "li") {
        selectedListId = e.target.dataset.listId;
        savaAndRender();
    }
})

newListForm.addEventListener("submit", e => {
    e.preventDefault();
    const listName = newListInput.value;
    if (listName == null || listName === ' ' || listName === '')
        return;
    newListInput.value = null;

    const newElement = createElement(listName);
    lists.push(newElement);
    savaAndRender();
})

function createElement(Name) {
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

    clearElements(listsContainer);

    lists.forEach(list => {
        const listElement = document.createElement("li");
        if (list.id === selectedListId)
            listElement.classList.add("active-list");
        listElement.innerText = list.name;
        listElement.dataset.listId = list.id;

        listsContainer.appendChild(listElement);
    })
}

function clearElements(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render();