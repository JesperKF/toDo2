// Henter HTML elementerne fra DOM'en
const toDoForm = document.querySelector("form");
const toDoInput = document.getElementById('todo-input');
const toDoListUL = document.getElementById('todo-list');
const doneListUL = document.getElementById('done-list');

// Henter alle to-dos fra localStorage
let allToDos = getToDos();
// Opdaterer to-do listen med de hentede to-dos
updateToDoList();

// Tilføjer en event listener til formularen for at håndtere submit event
toDoForm.addEventListener('submit', function(e){
    // Sørger for at siden ikke reloader ved submit af task
    e.preventDefault();
    // Tilføjer en ny to-do
    addToDo();
});

// Funktion til at tilføje en ny to-do
function addToDo(){
    // Henter og trimmer input værdien
    const toDoText = toDoInput.value.trim();
    if(toDoText.length > 0){
        // Opretter et to-do objekt
        const toDoObject = {
            id: crypto.randomUUID(),
            text: toDoText,
            completed: false
        };
        // Tilføjer to-do objektet til listen af to-dos
        allToDos.push(toDoObject);
        // Opdaterer to-do listen
        updateToDoList();
        // Gemmer to-dos i localStorage
        saveToDos();
        // Tømmer input feltet
        toDoInput.value = '';
    }
}

// Funktion til at opdatere to-do listen
function updateToDoList(){
    // Tømmer ul elementerne
    toDoListUL.innerHTML = '';
    doneListUL.innerHTML = '';
    
    // Itererer over alle to-dos og opretter HTML elementer for hver
    allToDos.forEach((toDo, toDoIndex) => {
        const toDoItem = createToDoItem(toDo, toDoIndex);
        // Tilføjer to-do til korrekt liste (færdige eller ufærdige)
        if (toDo.completed) {
            doneListUL.appendChild(toDoItem);
        } else {
            toDoListUL.appendChild(toDoItem);
        }
    });
}

// Funktion til at oprette et to-do list item
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

    // Tilføjer event listener til slet knappen
    const deleteButton = toDoLI.querySelector('.delete-button');
    deleteButton.addEventListener('click', function(){
        deleteToDoItem(toDo.id);
    });

    // Tilføjer event listener til checkboxen
    const checkBox = toDoLI.querySelector('input');
    checkBox.addEventListener('change', ()=>{
        allToDos[toDoIndex].completed = checkBox.checked;
        saveToDos();
        // Opdaterer listen for at flytte afsluttede opgaver til DONE-listen
        updateToDoList();
    });
    // Sætter checkboxen til at være checked hvis to-do er completed
    checkBox.checked = toDo.completed;

    return toDoLI;
}

// Funktion til at slette et to-do item
function deleteToDoItem(toDoId){
    // Filtrerer to-do listen for at fjerne det valgte to-do item
    allToDos = allToDos.filter((toDo) => toDo.id !== toDoId);
    // Gemmer de opdaterede to-dos i localStorage
    saveToDos();
    // Opdaterer to-do listen
    updateToDoList();
}

// Funktion til at gemme to-dos i localStorage
function saveToDos(){
    const toDosJson = JSON.stringify(allToDos);
    localStorage.setItem("toDos", toDosJson);
}

// Funktion til at hente to-dos fra localStorage
function getToDos(){
    const toDos = localStorage.getItem("toDos");
    return toDos ? JSON.parse(toDos) : [];
}


