import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:3001";

function ToDo() {
  const [name, setName] = useState("");

  const [list, setList] = useState([]);

  useEffect(() => {
    async function fetchTodo() {
      // TODO: implement try-catch here to capture errors from server.
      const res = await fetch(BASE_URL + "/todos");
      const json = await res.json();
      setList(json);
    }
    fetchTodo();
  }, []);

  function handleChange(e) {
    setName(e.target.value);
  }

  async function handleAdd() {
    const newTodo = {
      task: name,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    // we are making post request to the server
    try {
      const res = await fetch(BASE_URL + "/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (res.status === 200) {
        const todoResp = await res.json();
        // it means server has recieved our request and saved the data we sent to it.
        // So, we can use the present data to save in the state memory.
        newTodo.id = todoResp.id;

        setList([newTodo, ...list]);
        setName("");
      }
    } catch (error) {
      console.error("Error occured while creating todo");
    }
  }

  async function handleDelete(id) {
    // TODO: implement try-catch here to capture errors from server.
    try {
      const res = await fetch(BASE_URL + "/todo/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        const newArr = list.filter((item) => item.id !== id);
        setList(newArr);
      }
    } catch (error) {
      console.log("Error occured while deleting todo");
    }
  }

  async function handleChecked(event, id) {
    try {
      const response = await fetch(BASE_URL + "/todo/" + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: event.target.checked,
        }),
      });
      if (response.status === 200) {
        setList(
          list.map((item) =>
            item.id === id ? { ...item, completed: !item.completed } : item
          )
        );
      }
    } catch (error) {
      console.log("Error occured while updating todo");
    }
  }

  return (
    <>
      <h2>TO DOs</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="name">Input</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleChange}
          required
        />
        <button onClick={handleAdd}>Add</button>
      </form>
      <ul>
        {list.map((item) => (
          <li
            key={item.id}
            style={{ textDecoration: item.completed ? "line-through" : "none" }}
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={(e) => handleChecked(e, item.id)}
            />
            <span id={item.id}>{item.task}</span>{" "}
            {new Date().toLocaleDateString()}
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}
export default ToDo;
