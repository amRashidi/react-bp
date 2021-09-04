import { TodoActionTypes } from "../types/todo"

export const ADD_ITEM = '@3click/ADD_ITEM'
export const TOGGLE_TODO = '@3click/TOGGLE_TODO'
export const FILTER_ALL = '@3click/FILTER_ALL'
export const SET_FILTER = '@3click/SET_FILTER'
export const FILTER_ACTIVE = "FILTER_ACTIVE";
export const FILTER_COMPLETE = "FILTER_COMPLETE";

let nextId: number = 0;



export const addItem = (value: string): TodoActionTypes => ({
    type: ADD_ITEM,
    nextId: nextId++,
    value,
});

export const toggleTodo = (id: number): TodoActionTypes => ({
    type: TOGGLE_TODO,
    id,
});

export const setFilter = (filter: string): TodoActionTypes => ({
    type: SET_FILTER,
    value: filter
})