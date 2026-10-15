
import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePlanner = create(persist((set) => ({
    tasks: [],

    addTask: (data) =>
        set((state) => ({
            tasks: [...state.tasks, data],
        })),

    toggleStatus: (id, status) => set((state) => ({
        tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status } : task
        ),
    })),

    deleteAllTask: (data) => set((state) => ({
        tasks: [],
    })),

    deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
    })),

    updateTask: (id, updatedData) => set((state) => ({
        tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updatedData } : task
        ),
    })),

}), { name: "myTask" }));

export default usePlanner;
