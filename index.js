const input = document.getElementById("input");
const addBtn = document.getElementById("add-btn");
const ul = document.querySelector("#ul");

let todoList = [];
const endPoint = "http://localhost:3000/todos";

const controller = new AbortController();

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const axiosInstance = axios.create({
  baseURL: endPoint,
  signal: controller.signal,
  cancelToken: source.token,
});

// axiosInstance.interceptors.request.use((config) => {
//   console.log(config);
// });

const token = "secure_token";
// add button
addBtn.addEventListener("click", async () => {
  console.log(input.value);
  const id = Math.floor(Math.random() * 99999);

  const value = input.value;

  const newTodo = {
    id,
    value,
  };

  // add new todo
  const response = await axios.post(endPoint, newTodo, {});
  const todo = response.data;

  // const response = await fetch(endPoint, {
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  //   method: "POST",
  //   body: JSON.stringify(newTodo),
  // });

  // const todo = await response.json();

  todoList = [...todoList, todo];

  renderItem(todoList);
});

const renderItem = (todos) => {
  ul.innerHTML = "";

  todos.map((todo) => {
    const li = document.createElement("li");

    li.style.margin = "16px auto";

    li.innerHTML += `
    ${todo.value}
    <button id='del-btn' targetId=${todo.id}> delete </button>
    <button id='edit-btn' targetId=${todo.id}> edit </button>
    `;

    ul.appendChild(li);
  });

  // delete todo
  document.querySelectorAll("#del-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = +e.target.getAttribute("targetId");

      axios.delete(`${endPoint}/${id}`);
      // fetch(`${endPoint}/${id}`, {
      //   method: "DELETE",
      // });

      const filteredTodos = todoList.filter((todo) => todo.id !== id);

      todoList = filteredTodos;

      renderItem(todoList);
    });
  });

  // edit todo
  document.querySelectorAll("#edit-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = +e.target.getAttribute("targetId");

      const todo = todoList.find((todo) => todo.id === id);

      const editedTodoValue = prompt("Edit todo", todo.value);

      if (editedTodoValue && editedTodoValue.trim() !== "") {
        // const response = await fetch(`${endPoint}/${id}`, {
        //   method: "PATCH",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ value: editedTodoValue }),
        // });

        // const updatedTodo = await response.json();

        const response = await axiosInstance.patch(`/${id}`, {
          value: editedTodoValue,
        });

        const updatedTodo = response.data;

        const newUpdatedTodoList = todoList.map((todo) =>
          todo.id === id ? updatedTodo : todo
        );

        console.log(newUpdatedTodoList);

        todoList = newUpdatedTodoList;

        renderItem(todoList);
      }
    });
  });
};

// get todo data from api
const getInitialData = async () => {
  try {
    // const response = await fetch(endPoint, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   method: "GET",
    // });

    // const todos = await response.json();

    const response = await axiosInstance.get();

    const todos = response.data;

    // console.log(todos);
    todoList = todos;

    renderItem(todoList);
  } catch (err) {
    console.log(err);
  }
};

getInitialData();

const func = (a, b) => {
  return a + b;
};

func("a", "b");
