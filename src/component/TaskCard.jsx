import moment from "moment";
import usePlanner from "../lib/task.lib";
import { useState } from "react";
import toast from "react-hot-toast";

const TaskCard = ({ taskCategory = "All" }) => {
    const { tasks, toggleStatus, deleteAllTask, deleteTask, updateTask } = usePlanner();

    const isHigh = taskCategory.toLowerCase().includes("high");
    const isMedium = taskCategory.toLowerCase().includes("medium");

    const [editingId, setEditingId] = useState(null);
    const [isAddModelOpen, setIsAddModelOpen] = useState(false);
    const [taskPriority, setTaskPriority] = useState("Medium");
    const [taskStatus, setTaskStatus] = useState("Pending");
    const [taskFormData, setTaskFormData] = useState({
        title: "",
        description: "",
    });

    const iconStyle = isHigh
        ? "bg-rose-50 text-rose-600"
        : isMedium ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600";

    const handleStatusUpdate = (id, status) => {

        if (status === "Pending") {
            status = "In Progress"
        } else if (status === "In Progress") {
            status = "Completed"
        } else if (status === "Completed") {
            status = "In Progress"
        } else {
            status = "Pending"
        }

        toggleStatus(id, status);
    };

    // DELETE ALL TASK
    const handleDeleteAll = () => {
        deleteAllTask();
    }

    // DELETE SPECIFIC TASK
    const handleDeleteTask = (id) => {
        deleteTask(id)
    }

    // EDIT/UPDATE TASK
    const handleEdit = (task) => {
        setIsAddModelOpen(true);
        setEditingId(task.id);
        setTaskPriority(task.priority);
        setTaskStatus(task.status);

        setTaskFormData({
            title: task.title,
            description: task.description,
        });
    }

    // HANDLE FORM INPUT
    const handleInput = (e) => {
        const { name, value } = e.target;

        setTaskFormData({
            ...taskFormData,
            [name]: value,
        });

    }

    // UPDATE TASK
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
        };

        try {

            updateTask(editingId, newTask);
            toast.success("Task updated successfully!");

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
            console.error("Updating Task Error:", err.message);
            toast.error("Failed To Update Task");
        }
    };

    return (
        <>
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">

                {/* HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5">

                    <div className="flex items-center gap-3">

                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconStyle}`}>
                            <i className="ri-task-line text-2xl" />
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900">
                                {taskCategory} Tasks
                            </h4>
                            <p className="mt-1 text-xs text-slate-500">
                                Organize and track your tasks
                            </p>
                        </div>
                    </div>

                    {tasks.length > 0 &&
                        <button
                            onClick={handleDeleteAll}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                        >
                            <i className="ri-delete-bin-line text-base" />
                            Delete All
                        </button>
                    }
                </div>

                {/* ALL TASK */}
                {taskCategory === "All" &&
                    tasks.length === 0 ? <EmptyTask /> :
                    taskCategory === "All" && tasks.map((item, idx) => (

                        <div className="space-y-3 p-4 sm:p-5 overflow-hidden" key={idx}>

                            <div
                                className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm"
                            >

                                <div className="flex items-start gap-3 overflow-hidden">

                                    <input
                                        type="checkbox"
                                        onChange={() => handleStatusUpdate(item.id, item.status)}
                                        checked={item.status === "Completed"}
                                        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-indigo-600"
                                    />

                                    <div className="min-w-0 flex-1">

                                        <div className="flex flex-wrap items-start justify-between gap-2">

                                            <h5 className={`w-full min-w-0 whitespace-normal break-words text-sm leading-6  
                                        ${item.status === "Completed"
                                                    ? "line-through font-medium text-gray-800"
                                                    : "font-bold text-slate-800"}`
                                            }>
                                                {item.title}
                                            </h5>

                                            <span
                                                className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold ring-1 ring-inset 
                                            ${item.priority === "High"
                                                        ? "bg-rose-50 text-rose-600 ring-rose-100"
                                                        : item.priority === "Medium"
                                                            ? "bg-amber-50 text-amber-600 ring-amber-100"
                                                            : "bg-emerald-50 text-emerald-600 ring-emerald-100"
                                                    }`
                                                }>
                                                {item.priority}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xs leading-5 text-slate-500">
                                            {item.description === "" ? "No Description" : item.description}
                                        </p>

                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium 
                                        ${item.status === "Pending"
                                                    ? "text-amber-700 bg-amber-50"
                                                    : item.status === "In Progress"
                                                        ? "text-blue-700 bg-blue-50"
                                                        : "text-green-700 bg-green-50"}`
                                            }>
                                                <i className="ri-time-line" />
                                                {item.status}
                                            </span>

                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                                                <i className="ri-calendar-line" />
                                                {moment(item.createdAt).fromNow()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            aria-label="Edit task"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <i className="ri-edit-line text-lg" />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteTask(item.id)}
                                            aria-label="Delete task"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                                        >
                                            <i className="ri-delete-bin-line text-lg" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                                        <i className="ri-fingerprint-line text-sm" />
                                        ID: {item.id}
                                    </span>

                                    <span className="text-[11px] text-slate-400">
                                        <i className="ri-calendar-check-line mr-1" />
                                        Created {moment(item.createdAt).format("DD MMM YYYY")}
                                    </span>
                                </div>
                            </div>

                        </div>
                    ))
                }

                {/* HIGH TASK */}
                {taskCategory === "High" &&
                    tasks.filter((item) => item.priority === "High").length === 0 ? <EmptyTask /> :
                    taskCategory === "High" && tasks.filter((item) => item.priority === "High").map((item, idx) => (

                        <div className="space-y-3 p-4 sm:p-5 overflow-hidden" key={idx}>

                            <div
                                className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm"
                            >

                                <div className="flex items-start gap-3 overflow-hidden">

                                    <input
                                        type="checkbox"
                                        onChange={() => handleStatusUpdate(item.id, item.status)}
                                        checked={item.status === "Completed"}
                                        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-indigo-600"
                                    />

                                    <div className="min-w-0 flex-1">

                                        <div className="flex flex-wrap items-start justify-between gap-2">

                                            <h5 className={`w-full min-w-0 whitespace-normal break-words text-sm leading-6  
                                        ${item.status === "Completed"
                                                    ? "line-through font-medium text-gray-800"
                                                    : "font-bold text-slate-800"}`
                                            }>
                                                {item.title}
                                            </h5>

                                            <span
                                                className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold ring-1 ring-inset 
                                            ${item.priority === "High"
                                                        ? "bg-rose-50 text-rose-600 ring-rose-100"
                                                        : item.priority === "Medium"
                                                            ? "bg-amber-50 text-amber-600 ring-amber-100"
                                                            : "bg-emerald-50 text-emerald-600 ring-emerald-100"
                                                    }`
                                                }>
                                                {item.priority}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xs leading-5 text-slate-500">
                                            {item.description === "" ? "No Description" : item.description}
                                        </p>

                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium 
                                        ${item.status === "Pending"
                                                    ? "text-amber-700 bg-amber-50"
                                                    : item.status === "In Progress"
                                                        ? "text-blue-700 bg-blue-50"
                                                        : "text-green-700 bg-green-50"}`
                                            }>
                                                <i className="ri-time-line" />
                                                {item.status}
                                            </span>

                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                                                <i className="ri-calendar-line" />
                                                {moment(item.createdAt).fromNow()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            aria-label="Edit task"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <i className="ri-edit-line text-lg" />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteTask(item.id)}
                                            aria-label="Delete task"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                                        >
                                            <i className="ri-delete-bin-line text-lg" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                                        <i className="ri-fingerprint-line text-sm" />
                                        ID: {item.id}
                                    </span>

                                    <span className="text-[11px] text-slate-400">
                                        <i className="ri-calendar-check-line mr-1" />
                                        Created {moment(item.createdAt).format("DD MMM YYYY")}
                                    </span>
                                </div>
                            </div>

                        </div>
                    ))
                }

                {/* MEDIUM TASK */}
                {taskCategory === "Medium" &&
                    tasks.filter((item) => item.priority === "Medium").length === 0 ? <EmptyTask /> :
                    taskCategory === "Medium" && tasks.filter((item) => item.priority === "Medium").map((item, idx) => (

                        <div className="space-y-3 p-4 sm:p-5 overflow-hidden" key={idx}>

                            <div
                                className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm"
                            >

                                <div className="flex items-start gap-3 overflow-hidden">

                                    <input
                                        type="checkbox"
                                        onChange={() => handleStatusUpdate(item.id, item.status)}
                                        checked={item.status === "Completed"}
                                        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-indigo-600"
                                    />

                                    <div className="min-w-0 flex-1">

                                        <div className="flex flex-wrap items-start justify-between gap-2">

                                            <h5 className={`w-full min-w-0 whitespace-normal break-words text-sm leading-6  
                                        ${item.status === "Completed"
                                                    ? "line-through font-medium text-gray-800"
                                                    : "font-bold text-slate-800"}`
                                            }>
                                                {item.title}
                                            </h5>

                                            <span
                                                className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold ring-1 ring-inset 
                                            ${item.priority === "High"
                                                        ? "bg-rose-50 text-rose-600 ring-rose-100"
                                                        : item.priority === "Medium"
                                                            ? "bg-amber-50 text-amber-600 ring-amber-100"
                                                            : "bg-emerald-50 text-emerald-600 ring-emerald-100"
                                                    }`
                                                }>
                                                {item.priority}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xs leading-5 text-slate-500">
                                            {item.description === "" ? "No Description" : item.description}
                                        </p>

                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium 
                                        ${item.status === "Pending"
                                                    ? "text-amber-700 bg-amber-50"
                                                    : item.status === "In Progress"
                                                        ? "text-blue-700 bg-blue-50"
                                                        : "text-green-700 bg-green-50"}`
                                            }>
                                                <i className="ri-time-line" />
                                                {item.status}
                                            </span>

                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                                                <i className="ri-calendar-line" />
                                                {moment(item.createdAt).fromNow()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            aria-label="Edit task"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <i className="ri-edit-line text-lg" />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteTask(item.id)}
                                            aria-label="Delete task"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                                        >
                                            <i className="ri-delete-bin-line text-lg" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                                        <i className="ri-fingerprint-line text-sm" />
                                        ID: {item.id}
                                    </span>

                                    <span className="text-[11px] text-slate-400">
                                        <i className="ri-calendar-check-line mr-1" />
                                        Created {moment(item.createdAt).format("DD MMM YYYY")}
                                    </span>
                                </div>
                            </div>

                        </div>
                    ))
                }

                {/* LOW TASK */}
                {taskCategory === "Low" &&
                    tasks.filter((item) => item.priority === "Low").length === 0 ? <EmptyTask /> :
                    taskCategory === "Low" && tasks.filter((item) => item.priority === "Low").map((item, idx) => (

                        <div className="space-y-3 p-4 sm:p-5 overflow-hidden" key={idx}>

                            <div
                                className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm"
                            >

                                <div className="flex items-start gap-3 overflow-hidden">

                                    <input
                                        type="checkbox"
                                        onChange={() => handleStatusUpdate(item.id, item.status)}
                                        checked={item.status === "Completed"}
                                        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-indigo-600"
                                    />

                                    <div className="min-w-0 flex-1">

                                        <div className="flex flex-wrap items-start justify-between gap-2">

                                            <h5 className={`w-full min-w-0 whitespace-normal break-words text-sm leading-6  
                                        ${item.status === "Completed"
                                                    ? "line-through font-medium text-gray-800"
                                                    : "font-bold text-slate-800"}`
                                            }>
                                                {item.title}
                                            </h5>

                                            <span
                                                className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold ring-1 ring-inset 
                                            ${item.priority === "High"
                                                        ? "bg-rose-50 text-rose-600 ring-rose-100"
                                                        : item.priority === "Medium"
                                                            ? "bg-amber-50 text-amber-600 ring-amber-100"
                                                            : "bg-emerald-50 text-emerald-600 ring-emerald-100"
                                                    }`
                                                }>
                                                {item.priority}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xs leading-5 text-slate-500">
                                            {item.description === "" ? "No Description" : item.description}
                                        </p>

                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium 
                                        ${item.status === "Pending"
                                                    ? "text-amber-700 bg-amber-50"
                                                    : item.status === "In Progress"
                                                        ? "text-blue-700 bg-blue-50"
                                                        : "text-green-700 bg-green-50"}`
                                            }>
                                                <i className="ri-time-line" />
                                                {item.status}
                                            </span>

                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                                                <i className="ri-calendar-line" />
                                                {moment(item.createdAt).fromNow()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            aria-label="Edit task"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <i className="ri-edit-line text-lg" />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteTask(item.id)}
                                            aria-label="Delete task"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                                        >
                                            <i className="ri-delete-bin-line text-lg" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                                        <i className="ri-fingerprint-line text-sm" />
                                        ID: {item.id}
                                    </span>

                                    <span className="text-[11px] text-slate-400">
                                        <i className="ri-calendar-check-line mr-1" />
                                        Created {moment(item.createdAt).format("DD MMM YYYY")}
                                    </span>
                                </div>
                            </div>

                        </div>
                    ))
                }

            </div>

            {/* EDIT TASK MODAL */}
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
                                    <i className="ri-edit-line text-2xl" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                                        Update Task
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Update a task and stay organized.
                                    </p>
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
                                            checked={taskPriority === "High"}
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
                                            checked={taskPriority === "Medium"}
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
                                            checked={taskPriority === "Low"}
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
                                        value={taskStatus}
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
                                <i className="ri-save-line text-lg" />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

const EmptyTask = () => {
    return (
        <div
            className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center transition hover:border-indigo-200 sm:px-10"
        >
            <div
                className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"
            >
                <i className="ri-inbox-archive-line text-3xl" />
            </div>

            <h3 className="text-lg font-bold tracking-tight text-slate-800">No Task Yet</h3>

            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                Looks like there's nothing here right now. Add a new task to get your day organized.
            </p>

        </div>
    );
};

export default TaskCard;