
import { ADD_ITEM, TOGGLE_TODO } from 'shared/store/actions/todo';
import { TodoActionTypes, TodoState } from '../../types/todo';

export const TodoItemState: TodoState[] = [];

const todoItems = (state: TodoState[] = TodoItemState, action: TodoActionTypes): TodoState[] => {
    switch (action.type) {
        case ADD_ITEM:
            return [
                ...state,
                { id: action.nextId, text: action.value, completed: false }
            ]
        case TOGGLE_TODO:
            return state.map((todo: TodoState) =>
                todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
            );

        default:
            return state;
    }
}
export default todoItems;