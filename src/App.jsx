import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  // Load tasks from MongoDB
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.log("Failed to load tasks:", error));
  }, []);

  async function addTask() {
    if (task.trim() === "") return;

    try {
      if (editId !== null) {
        const response = await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: task,
            priority: priority,
          }),
        });

        const updatedTask = await response.json();

        setTasks(
          tasks.map((item) =>
            item._id === editId ? updatedTask : item
          )
        );

        setEditId(null);
      } else {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: task,
            priority: priority,
          }),
        });

        const newTask = await response.json();

        setTasks([newTask, ...tasks]);
      }

      setTask("");
      setPriority("Medium");
    } catch (error) {
      console.log("Task operation failed:", error);
    }
  }

  async function deleteTask(id) {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      setTasks(tasks.filter((item) => item._id !== id));
    } catch (error) {
      console.log("Delete failed:", error);
    }
  }

  async function clearAllTasks() {
    try {
      await Promise.all(
        tasks.map((item) =>
          fetch(`${API_URL}/${item._id}`, {
            method: "DELETE",
          })
        )
      );

      setTasks([]);
    } catch (error) {
      console.log("Clear all failed:", error);
    }
  }

  async function completeTask(item) {
    try {
      const response = await fetch(`${API_URL}/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !item.completed,
        }),
      });

      const updatedTask = await response.json();

      setTasks(
        tasks.map((taskItem) =>
          taskItem._id === item._id ? updatedTask : taskItem
        )
      );
    } catch (error) {
      console.log("Complete task failed:", error);
    }
  }

  function editTask(item) {
    setTask(item.text);
    setPriority(item.priority);
    setEditId(item._id);
  }

  const filteredTasks = tasks.filter((item) => {
    const matchesSearch = item.text
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPriority =
      filter === "All" || item.priority === filter;

    return matchesSearch && matchesPriority;
  });

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (item) => item.completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="container">
      <h1>Task Management Dashboard</h1>

      <div className="stats">
        <div>
          <strong>{totalTasks}</strong>
          <span>Total Tasks</span>
        </div>

        <div>
          <strong>{completedTasks}</strong>
          <span>Completed</span>
        </div>

        <div>
          <strong>{pendingTasks}</strong>
          <span>Pending</span>
        </div>
      </div>

      <div className="progress-card">
        <div className="progress-header">
          <h2>Overall Progress</h2>
          <strong>{progress}%</strong>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter your task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button onClick={addTask}>
          {editId !== null ? "Update Task" : "Add Task"}
        </button>
      </div>

      <div className="filters">
        <input
          className="search-box"
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <button
        onClick={clearAllTasks}
        className="clear-btn"
      >
        Clear All Tasks
      </button>

      <ul>
        {filteredTasks.map((item) => (
          <li key={item._id}>
            <div>
              <span
                onClick={() => completeTask(item)}
                style={{
                  textDecoration: item.completed
                    ? "line-through"
                    : "none",
                  cursor: "pointer",
                }}
              >
                {item.text}
              </span>

              <small
                className={`priority ${item.priority.toLowerCase()}`}
              >
                {item.priority}
              </small>
            </div>

            <div>
              <button onClick={() => editTask(item)}>
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteTask(item._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;