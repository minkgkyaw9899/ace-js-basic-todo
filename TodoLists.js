const input = document.getElementById("input");
const ul = document.getElementById("todos");
const addBtn = document.querySelector("#add-btn");

let todosList = [];

// add button click handler
addBtn.addEventListener("click", async () => {
  const newTitle = input.value;
  const newId = Math.floor(Math.random() * 1000000);
  const newTodo = await fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: newId,
      title: newTitle,
    }),
  });

  const res = await newTodo.json();

  input.value = "";

  todosList = [...todosList, res];

  renderItem(todosList);
});

// render li list item
const renderItem = (todos) => {
  ul.innerHTML = "";
  todos.map((todo) => {
    const li = document.createElement("li");
    li.style.margin = "8px auto";
    li.classList = "test";
    li.innerHTML += `
      ${todo.title} 
      <button id="del-btn" targetId="${todo.id}"> delete </button>
      <button id="edit-btn" targetId="${todo.id}"> edit </button>
      `;
    ul.appendChild(li);
  });

  // delete button click handler
  document.querySelectorAll("#del-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("targetId");
      await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
      });
      const filteredTodos = todosList.filter((todo) => todo.id !== +id);
      todosList = filteredTodos;
      renderItem(todosList);
    });
  });

  // edit button click handler
  document.querySelectorAll("#edit-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = +e.target.getAttribute("targetId");
      const todoValue = todosList.find((todo) => todo.id === id);

      if (todoValue) {
        const editTodoValue = prompt("Update todo", todoValue.title);
        if (editTodoValue && editTodoValue.trim() !== "") {
          const updatedTodo = await fetch(`http://localhost:3000/todos/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id,
              title: editTodoValue,
            }),
          });

          const res = await updatedTodo.json();

          const newTodoList = todosList.map((todo) => {
            return todo.id === id ? { id, title: res.title } : todo;
          });

          todosList = newTodoList;

          renderItem(todosList);
        }
      }
    });
  });
};

// get initial todos data from api
const getInitialTodosData = async () => {
  try {
    const res = await fetch("http://localhost:3000/todos");
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getAllTodos = async () => {
  const todos = await getInitialTodosData();

  if (todos) {
    todosList = todos;
    renderItem(todosList);
  }
};

getAllTodos();

// const obj1 = {
//   name: "mgmg",
//   age: 23,
// };

// const obj2 = {
//   name: "mgmg",
//   age: 23,
// };

// console.log(obj1 == obj2);
