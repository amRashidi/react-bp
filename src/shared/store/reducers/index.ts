import { combineReducers } from 'redux';
import todoReducer, { todoState } from './todo'
const createRootReducer = () =>
    combineReducers({
        todo: todoReducer()
    });
export interface RootStates {
    todo: todoState
}
export default createRootReducer;
