import React, { useEffect, useState } from "react";
import './App.css'

const app = () => {
  const [task, setTask] = useState("");
  const [user, setUser] = useState();

  const createUser = async () => {
    await fetch("https://playground.4geeks.com/todo/users/CarlosPuga", {
      method: "POST",
    }).then((resp) => {
      if (resp.ok) {
        alert("Usuario creado correctamente");
        getUser();
      }
    });
  };

  const getUser = async () => {
    await fetch("https://playground.4geeks.com/todo/users/CarlosPuga")
      .then((resp) => {
        if (!resp.ok) {
          createUser();
        }
        return resp.json();
      })
      .then((user) => setUser(user));
  };

  useEffect(() => {
    getUser();
  }, []);

  const createTask = async () => {
    if (!task || !task.trim()) {
      alert("El valor de la tarea no puede estar vacío");
      return;
    }

    await fetch("https://playground.4geeks.com/todo/todos/CarlosPuga", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        label: task,
        is_done: false,
      }),
    })
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
      })
      .then((respJson) => {
        const newUser = {
          ...user,
          todos: [...user.todos, respJson],
        };
        setUser(newUser);
        setTask("");
      });
  };

  const deleteTask = async (taskId) => {
    const id = parseInt(taskId);
    await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE",
    })
      .then((resp) => {
        if (resp.ok) {
          const updatedUserTasks = user.todos.filter((item) => item.id !== id);
          const newUser = {
            ...user,
            todos: updatedUserTasks,
          };
          setUser(newUser);
        }
      })
      .catch((error) => {
        console.error("Error al eliminar la tarea:", error);
      });
  };

  return (
    <div className="container">
      <h1>ToDoS</h1>
      <div className="to_do">
        <input
          className="form-control"
          placeholder="Ingresa una nueva tarea?"
          onChange={(evt) => setTask(evt.target.value)}
          onKeyDown={(evt) => evt.key === "Enter" && createTask()}
          type="text"
          value={task}
        />
      </div>
      <div className="row">
          {user &&
            user.todos.map((item) => (
              <p key={item.id}>
                {item.label}
                <button
                  className="buttonDL"
                  onClick={() => deleteTask(item.id)}
                >X</button>
              </p>
            ))}
      </div>
      
        <p className="parrafo">
          {user && user.todos.length ? (
            <span> Debes realizar {user.todos.length} tareas  </span>
          ) : (
            <span>No tienes tareas pendientes</span>
          )}
        </p>
        <button className="butt" onClick={() => setUser(null)}>
          Eliminar Usuario
        </button>
    </div>
  );
};

export default app;
