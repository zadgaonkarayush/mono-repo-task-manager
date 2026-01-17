import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../styles/auth.css";

const TaskManager = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  const load = async () => {
    const { data } = await supabase.from("tasks").select("*");
    setTasks(data || []);
  };

  const add = async () => {
    if (!title) return;
    await supabase.from("tasks").insert({ title });
    setTitle("");
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h3>Task Manager</h3>

        <input
          placeholder="New Task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button onClick={add}>Add Task</button>

        <div className="tasks">
          <ul>
            {tasks.map((t) => (
              <li key={t.id}>{t.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
