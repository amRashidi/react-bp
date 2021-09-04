import { ADD_ITEM, SET_FILTER, TOGGLE_TODO } from "../actions/todo";
import rootReducer from 'shared/store/reducers/index'
export interface visibiltyFilterState {
    type: typeof ADD_ITEM;
    nextId: number;
    value: string;
}
export interface AddItemAction {
    type: typeof ADD_ITEM;
    nextId: number;
    value: string;
}
export interface ToggleAction {
    type: typeof TOGGLE_TODO;
    id: number;
}

export interface SetFilterAction {
    type: typeof SET_FILTER;
    value: string;
}

export interface TodoState {
    id: number;
    text: string;
    completed: boolean;
}
export type TodoActionTypes = AddItemAction | ToggleAction | SetFilterAction;
export type RootState = ReturnType<typeof rootReducer>;
