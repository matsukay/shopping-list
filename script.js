const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList= document.getElementById('item-list');
const itemClear = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    // Validate input
    if (newItem === '') {
        alert('Please add an item')
        return;
    } 

    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItemExists(newItem)) {
            alert('That item already exists.');
            return;
        }
    }

    // Create item
    addItemToDOM(newItem);

    // Add item to local storage
    addItemToStorage(newItem);
    
    checkUI();
    itemInput.value = '';
}

function addItemToDOM(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    // Add li to the DOM
    itemList.appendChild(li);
}

function addItemToStorage(item) {
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage)); // Convert back to JSON
}

function createButton(classes) {
    button = document.createElement('button');
    button.className = classes;

    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);

    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function getItemsFromStorage() {
    let itemsFromStorage;
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items')); // Convert from a string to an array
    }

    localStorage.setItem('items', JSON.stringify(itemsFromStorage)); // Convert back to JSON
    return itemsFromStorage;
}

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => {
        addItemToDOM(item);
    });
    checkUI();
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

function removeItem(item) {
        if (confirm("Are you sure?")) {
            // Remove item from DOM
            item.remove();

            //Remove item from local storage
            removeItemFromStorage(item.textContent);

            checkUI();
        }

}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    // Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // Reset to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage)); // Convert back to JSON
}

function clearItems(e) {
    while(itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    // Clear from local storage
    localStorage.removeItem('items');

    checkUI();
}

function filterItems(e) {
    const items = itemList.querySelectorAll('li');  // Node List
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function checkUI() {
    itemInput.value = '';
    const items = itemList.querySelectorAll('li');  // Node List

    if (items.length === 0) {
        itemClear.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        itemClear.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

// Initialise app
function init() {
    // Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    itemClear.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();
}

init();

