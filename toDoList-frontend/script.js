
// ---- !!! --- CRUD - Create Read Update Delete

let keyboard = document.getElementById("todo_input");
let warning = document.querySelector("#warning");
let tasksLeft = document.querySelector("#tasksLeft");

keyboard.addEventListener("keyup", (e)=>{
  //console.log(e)
  const keyName = e.key;
  if(keyName === "Enter"){
    addItem()
  }
},false)

async function addItem () {
    
    const value = document.getElementById('todo_input').value;
    
    if(value) {
    
    const item = {title: document.getElementById('todo_input').value}
    
      const data = {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
          'Content-type': 'application/json'
        }
      }
    
      const response = await fetch('http://127.0.0.1:8080/api/todoitems/', data);
      const jsonResponse = await response.json();
      //console.log(response);
      listItem([jsonResponse]);
    } else {
      warning.innerHTML = "(Please, enter an item!)"
    }

}

async function getItems () {
    const response = await fetch('http://127.0.0.1:8080/api/todoitems/');
    const jsonResponse = await response.json();
    listItem(jsonResponse);
    //console.log(jsonResponse)
}

function listItem (todoItems) {
    const ulList = document.getElementById('todo_list');
    //console.log(todoItems);
    document.getElementById('todo_input').value = "";

    todoItems.forEach((item) => {
        // console.log(item.title)
        // ulList.innerHTML += `<li onclick="removeItem(this)"> ${item.title} </li>`
        //console.log(item)
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <input type="checkbox" class="mark-as-completed" ${item.completed && 'checked'}>  
          <input type="text" class="todo-item-input" value="${item.title}" style="outline:none">
          <a class="edit-item" href="">Edit</a>
          <span class="remove-item">Delete</span>
          <span class="date">updatedAt ${item.updatedAt}</span>
        `;
        listItem.id = item.id;
        //console.log(listItem)
        listItem.querySelector('.remove-item').addEventListener('click', removeItem);

        listItem.querySelector('.mark-as-completed').addEventListener('click', completeItem);

        listItem.querySelector('.todo-item-input').addEventListener('focusout', editItem);

        listItem.querySelector('.edit-item').addEventListener('click', chooseInput);

        listItem.querySelector('.todo-item-input').style.textDecoration = item.completed && 'line-through';
        // listItem.addEventListener('click', removeItem);
        ulList.appendChild(listItem);
      });

      tasks(todoItems);

}

async function removeItem(e) {
    
    // const xhr = new XMLHttpRequest();
    // const url = 'https://jsonplaceholder.typicode.com/todos/' + e.target.id;
    // xhr.responseType = 'json';
    // xhr.onreadystatechange = () => {
    //     if (xhr.readyState === XMLHttpRequest.DONE){
    //         e.target.remove();
    //     }
    // }
    // xhr.open('DELETE', url);
    // xhr.send();

    const data = {
        method: 'DELETE',
    }
    
    await fetch('http://127.0.0.1:8080/api/todoitems/' + e.target.parentElement.id, data);
    //await response.json();
    e.target.parentElement.remove();
    tasks();
}

async function completeItem(e){
  //console.log(e.target.parentElement.id);
  //console.log(e);
  const item = {
    completed:  e.target.checked
  }

  const data = {
    method: 'PUT',
    body: JSON.stringify(item),
    headers: {
      'Content-type': 'application/json'
    }
  }

  await fetch('http://127.0.0.1:8080/api/todoitems/'+ e.target.parentElement.id, data);
  //const jsonResponse = await response.json();
  //listItem([jsonResponse]);

  e.target.parentElement.querySelector('.todo-item-input').style.textDecoration = e.target.checked ? 'line-through' : 'none';

  tasks();

}

async function editItem(e){
  console.log(e);


  const item = {
    title:  e.target.value
  }

  const data = {
    method: 'PUT',
    body: JSON.stringify(item),
    headers: {
      'Content-type': 'application/json'
    }
  }

  await fetch('http://127.0.0.1:8080/api/todoitems/'+ e.target.parentElement.id, data);

  // const jsonResponse = await response.json();
  // listItem([jsonResponse]);

  
}

async function chooseInput(e){
  //console.log(e.target.previousElementSibling);
  const path = e.target.parentElement.id;
  console.log(path);
  const result = e.target.parentElement.id + `87`;
  e.target.previousElementSibling.id = result;
  e.target.href = `#${result}`;
  //console.log(e.target.href)
  
}

async function tasks(){

  const response = await fetch('http://127.0.0.1:8080/api/todoitems/');
  const jsonResponse = await response.json();
  //listItem(jsonResponse);
  //console.log(jsonResponse)

  count = 0;
  jsonResponse.forEach( element => { element.completed ? count++ : ""})
  tasksLeft.innerHTML = `You have <u><span style="font-size:24px;">${jsonResponse.length - count}</span></u> tasks left to complete!`;
}


getItems();





