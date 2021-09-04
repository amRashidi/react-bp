
import { combineReducers } from 'redux';
import todoItems from './todoItemsReducer'
import visibiltyFilter from './filterReducer'
import { TodoState } from 'shared/store/types/todo';
const todoReducer = () => combineReducers({
    visibiltyFilter,
    todoItems
});
export interface todoState {
    visibilityFilter: string,
    todoItems: TodoState[]
}
export default todoReducer