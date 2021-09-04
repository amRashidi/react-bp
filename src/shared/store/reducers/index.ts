import { combineReducers } from "redux";
import todoItems from "./todo/todoItemsReducer";
import visibilityFilter from "./todo/filterReducer";

export default combineReducers({
  todoItems,
  visibilityFilter,
});
