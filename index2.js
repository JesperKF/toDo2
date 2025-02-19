const toDoForm = document.querySelector("form");
const toDoInput = document.getElementById('todo-input');
const toDoListUL = document.getElementById('todo-list');
const doneListUL = document.getElementById('done-list');

let allToDos = getToDos();
updateToDoList();

toDoForm.addEventListener('submit', function(e){
    // sørger for at siden ikke reloader ved submit af task
    e.preventDefault();
    addToDo();
});

function addToDo(){
    const toDoText = toDoInput.value.trim();
    if(toDoText.length > 0){
        const toDoObject = {
            id: crypto.randomUUID(),
            text: toDoText,
            completed: false
        };
        allToDos.push(toDoObject);
        updateToDoList();
        saveToDos();
        toDoInput.value = '';
    }
}

function updateToDoList(){
    toDoListUL.innerHTML = '';
    doneListUL.innerHTML = '';
    
    allToDos.forEach((toDo, toDoIndex) => {
        const toDoItem = createToDoItem(toDo, toDoIndex);
        if (toDo.completed) {
            doneListUL.appendChild(toDoItem);
        } else {
            toDoListUL.appendChild(toDoItem);
        }
    });
}

function createToDoItem(toDo, toDoIndex){
    const toDoID = "todo-" + toDo.id;
    const toDoLI = document.createElement('li');
    const toDoText = toDo.text;
    toDoLI.className = "todo";
    toDoLI.innerHTML = `
        <input type="checkbox" id="${toDoID}" />
        <label class="custom-checkbox" for="${toDoID}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </svg>
        </label>
        <label for="${toDoID}" class="todo-text">${toDoText}</label>
        <button class="delete-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
            </svg>
        </button>
    `;

    const deleteButton = toDoLI.querySelector('.delete-button');
    deleteButton.addEventListener('click', function(){
        deleteToDoItem(toDo.id);
    });

    const checkBox = toDoLI.querySelector('input');
    checkBox.addEventListener('change', ()=>{
        allToDos[toDoIndex].completed = checkBox.checked;
        saveToDos();
        updateToDoList(); // Opdater listen for at flytte afsluttede opgaver til DONE-listen
    });
    checkBox.checked = toDo.completed;

    return toDoLI;
}

function deleteToDoItem(toDoId){
    allToDos = allToDos.filter((toDo) => toDo.id !== toDoId);
    saveToDos();
    updateToDoList();
}

function saveToDos(){
    const toDosJson = JSON.stringify(allToDos);
    localStorage.setItem("toDos", toDosJson);
}

function getToDos(){
    const toDos = localStorage.getItem("toDos");
    return toDos ? JSON.parse(toDos) : [];
}