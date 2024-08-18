

const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";

let lists = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedList = window.localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedList = e.target.dataset.listId;
        saveAndRender();
    }
})

newListForm.addEventListener('submit', e => {
    e.preventDefault();

    const elementText = newListInput.value;
    if (elementText == null || elementText === "" || elementText === " ")
        return;
    const newElement = createElement(elementText);
    newListInput.value = null;
    lists.push(newElement);
    saveAndRender();
})

function createElement(elementText) {
    return { id: Date.now().toString(), name: elementText, tasks: [] };
}

function saveAndRender() {
    save();
    render();
}

function save() {
    window.localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    window.localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedList);
}

function render() {

    clearElements();

    lists.forEach(list => {
        let listElement = document.createElement("li");
        listElement.innerText = list.name;
        listElement.dataset.listId = list.id;
        if (list.id === selectedList)
            listElement.classList.add("active-list");
        listsContainer.appendChild(listElement);
    })
}

function clearElements() {
    while (listsContainer.firstChild) {
        listsContainer.removeChild(listsContainer.firstChild);
    }
}

render();