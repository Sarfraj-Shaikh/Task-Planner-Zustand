import 'remixicon/fonts/remixicon.css';
import { useState } from "react";
import TaskCard from "./component/TaskCard";
import { v4 as uuid } from "uuid";
import toast, { Toaster } from 'react-hot-toast';
import usePlanner from './lib/task.lib';

const filterList = ["All", "High", "Medium", "Low"];

const App = () => {
  const { tasks, addTask } = usePlanner();

  const [filter, setFilter] = useState("All");
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter((item) => item.status === "In Progress").length,
    complete: tasks.filter((item) => item.status === "Completed").length,
  }

  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskStatus, setTaskStatus] = useState("Pending");
  const [taskFormData, setTaskFormData] = useState({
    title: "",
    description: "",
  });

  // HANDLE FORM INPUT
  const handleInput = (e) => {
    const { name, value } = e.target;

    setTaskFormData({
      ...taskFormData,
      [name]: value,
    });

  }

  // SAVE NEW TASK
  const saveTask = () => {

    if (!taskFormData.title.trim()) {
      return toast.error("Title is required");
    }

    const newTask = {
      ...taskFormData,
      title: taskFormData.title.trim(),
      description: taskFormData.description.trim(),
      status: taskStatus,
      priority: taskPriority,
      id: uuid(),
      createdAt: new Date().toISOString(),
    };

    try {

      addTask(newTask);
      toast.success("Task added successfully!");

      // Reset form
      setTaskFormData({
        title: "",
        description: "",
      });

      setTaskPriority("Medium");
      setTaskStatus("Pending");

      // Close modal
      setIsAddModelOpen(false);

    } catch (err) {
      console.error("Adding Task Error:", err.message);
      toast.error("Failed To Add Task");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-800">

        {/* HEADER */}
        <nav className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">

          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                <i className="ri-task-line text-2xl" />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Task Planner</h1>
                <p className="hidden text-xs text-slate-500 sm:block">Organize your day, one task at a time.</p>
              </div>

            </div>

            <button
              onClick={() => setIsAddModelOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 sm:px-5 cursor-pointer"
            >
              <i className="ri-add-line text-lg" />
              <span>Add Task</span>
            </button>

          </div>
        </nav>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

          {/* WELCOME */}
          <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            
            <div>

              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 uppercase">
                <i className="ri-calendar-check-line" />
                WORKSPACE
              </span>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                My Tasks
              </h2>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Stay focused and make progress on what matters.
              </p>

            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <i className="ri-focus-3-line text-xl" />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">Daily focus</p>
                <p className="text-sm font-bold text-slate-800">One task at a time</p>
              </div>

            </div>

          </section>

          {/* OVERVIEW */}
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Total Tasks</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><i className="ri-list-check-3 text-xl" /></span>
              </div>

              <p className="mt-4 text-3xl font-bold text-slate-900">
                {taskStats.total}
              </p>

              <p className="mt-1 text-xs text-slate-400">Tasks in your workspace</p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <span className="text-sm font-medium text-slate-500">In Progress</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><i className="ri-time-line text-xl" /></span>
              </div>

              <p className="mt-4 text-3xl font-bold text-slate-900">
                {taskStats.pending}
              </p>
              <p className="mt-1 text-xs text-slate-400">Waiting to be completed</p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Completed</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><i className="ri-checkbox-circle-line text-xl" /></span>
              </div>

              <p className="mt-4 text-3xl font-bold text-slate-900">
                {taskStats.complete}
              </p>
              <p className="mt-1 text-xs text-slate-400">Tasks finished so far</p>

            </div>

          </section>

          {/* FILTER */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h3 className="font-bold text-slate-900 capitalize">Your task list</h3>
                <p className="mt-1 text-xs text-slate-500">Browse tasks by priority</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">

                {filterList.map((list) => (
                  <button
                    key={list}
                    onClick={() => setFilter(list)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition 
                    ${filter === list
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                      }`
                    }>

                    {list === "All"
                      ? <i className="ri-apps-2-line" />
                      : <i className="ri-filter-3-line" />
                    }
                    {list}
                  </button>
                ))}
              </div>

            </div>

          </section>

          {/* TASK */}
          <TaskCard taskCategory={filter} />

          <footer className="mt-10 border-t border-slate-200 py-6 text-center text-xs text-slate-400">
            Made for better focus <span className="mx-1 text-indigo-500">✦</span> Keep planning, keep growing.
          </footer>

        </main>

        {/* ADD TASK MODAL */}
        {isAddModelOpen &&
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm sm:p-6"
          >
            <div
              className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10"
            >

              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-7">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <i className="ri-add-circle-line text-2xl" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Add New Task</h2>
                    <p className="mt-1 text-xs text-slate-500">Create a task and stay organized.</p>
                  </div>

                </div>

                {/* MODAL CLOSE BUTTON */}
                <button
                  type="button"
                  onClick={() => setIsAddModelOpen(false)}
                  aria-label="Close dialog"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <i className="ri-close-line text-2xl" />
                </button>

              </div>

              {/* FORM */}
              <div className="space-y-5 px-5 py-6 sm:px-7">

                {/* TITLE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Task Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="task-title"
                    type="text"
                    name="title"
                    onChange={handleInput}
                    value={taskFormData.title}
                    placeholder="e.g. Build a responsive dashboard"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label htmlFor="task-description" className="mb-2 block text-sm font-semibold text-slate-700">
                    Description <span className="text-slate-400">(Optional)</span>
                  </label>
                  <textarea
                    id="task-description"
                    name="description"
                    onChange={handleInput}
                    value={taskFormData.description}
                    rows="3"
                    placeholder="Describe what needs to be done..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                {/* PRIORITY */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700">
                    Priority <span className="text-rose-500">*</span>
                  </label>

                  <div className="grid grid-cols-3 gap-3">

                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-2 py-3 text-sm font-semibold text-rose-600 transition hover:border-rose-400">
                      <input
                        type="radio"
                        name="priority"
                        value="High"
                        onChange={() => setTaskPriority("High")}
                        className="h-4 w-4 accent-rose-600"
                      />
                      <i className="ri-arrow-up-circle-line text-lg" />
                      High
                    </label>

                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-2 py-3 text-sm font-semibold text-amber-600 transition hover:border-amber-400">
                      <input
                        type="radio"
                        name="priority"
                        value="Medium"
                        defaultChecked
                        onChange={() => setTaskPriority("Medium")}
                        className="h-4 w-4 accent-amber-500"
                      />
                      <i className="ri-equal-circle-line text-lg" />
                      Medium
                    </label>

                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-2 py-3 text-sm font-semibold text-emerald-600 transition hover:border-emerald-400">
                      <input
                        type="radio"
                        name="priority"
                        value="Low"
                        onChange={() => setTaskPriority("Low")}
                        className="h-4 w-4 accent-emerald-600"
                      />
                      <i className="ri-arrow-down-circle-line text-lg" />
                      Low
                    </label>

                  </div>

                </div>

                {/* STATUS */}
                <div>
                  <label htmlFor="task-status" className="mb-2 block text-sm font-semibold text-slate-700">
                    Task Status
                  </label>

                  <div className="relative">

                    <select
                      id="task-status"
                      defaultValue="Pending"
                      name="status"
                      onChange={(e) => setTaskStatus(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <i className="ri-arrow-down-s-line pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
                  </div>

                </div>

              </div>

              {/* FOOTER */}
              <div
                className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-7"
              >
                <button
                  type="button"
                  onClick={() => setIsAddModelOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveTask}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700 cursor-pointer"
                >
                  <i className="ri-add-line text-lg" />
                  Add Task
                </button>
              </div>
            </div>
          </div>
        }

      </div>
      <Toaster />
    </>
  );
};

export default App;
