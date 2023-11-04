import { useEffect, useState } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [name, setName] = useState('Barbara');
  const [rename, setRename] = useState(false);

  useEffect(() => {
    getTodos();
  }, [todos]);

  useEffect(() => {
    if (localStorage.getItem('name')) setName(localStorage.getItem('name'));
  }, []);

  const getTodos = async () => {
    await fetch('http://localhost:3001/todos')
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.log('Error:', err));
  };

  const completeTodo = async (id) => {
    await fetch('http://localhost:3001/todo/complete/' + id).then((result) =>
      result.json()
    );
  };

  const deleteTodo = async (id) => {
    await fetch('http://localhost:3001/todo/delete/' + id, {
      method: 'DELETE',
    }).then((result) => result.json());
  };

  const addTodo = async () => {
    await fetch('http://localhost:3001/todo/new/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((result) => result.json());
    setPopupActive(false);
    setNewTodo('');
  };

  const changeName = () => {
    setRename(false);
    localStorage.setItem('name', name);
    setName(localStorage.getItem('name'));
  };
  return (
    <div className="App">
      <h1 className="nameContainer">
        <div> Welcome,</div>
        {rename ? (
          <div>
            <input
              type="text"
              className="input-name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <button className="buttonName" onClick={changeName}>
              ✔
            </button>
          </div>
        ) : (
          <div className="padding name" onClick={() => setRename(true)}>
            {localStorage.getItem('name') || name}
          </div>
        )}
      </h1>
      <h4>Your Tasks</h4>
      <div className="todos">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className={`todo ${todo.complete && 'is-complete'}`}
          >
            <div
              className="todo-complete-div"
              onClick={() => completeTodo(todo._id)}
            >
              <div className="checkbox"></div>
              <div className="text">{todo.text}</div>
            </div>
            <div onClick={() => deleteTodo(todo._id)} className="delete-todo">
              x
            </div>
          </div>
        ))}
      </div>
      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>
      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            x
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default App;
